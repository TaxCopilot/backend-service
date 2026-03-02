import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { prisma } from '../lib/prisma';

// ─── Config ───
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:8000/api/auth/google/callback';

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI);

// ─── Types ───
const USER_SELECT = {
  id: true,
  email: true,
  name: true,
  avatarUrl: true,
  role: true,
  provider: true,
  phone: true,
  registrationId: true,
  createdAt: true,
} as const;

// ─── Helpers ───
export function signToken(userId: string, email: string): string {
  return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as any });
}

export function verifyToken(token: string): { userId: string; email: string } {
  return jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
}

// ─── Service Methods ───
export const authService = {
  async register(email: string, name: string, password: string) {
    if (!email || !name || !password) throw { status: 400, message: 'Email, name, and password are required' };
    if (password.length < 6) throw { status: 400, message: 'Password must be at least 6 characters' };

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw { status: 409, message: 'User with this email already exists' };

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email, name, password: hashed, provider: 'EMAIL' },
      select: USER_SELECT,
    });

    const token = signToken(user.id, user.email);
    return { user, token };
  },

  async login(email: string, password: string) {
    if (!email || !password) throw { status: 400, message: 'Email and password are required' };

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) throw { status: 401, message: 'Invalid email or password' };

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw { status: 401, message: 'Invalid email or password' };

    const token = signToken(user.id, user.email);
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        role: user.role,
        provider: user.provider,
        phone: user.phone,
        registrationId: user.registrationId,
      },
    };
  },

  getGoogleAuthUrl() {
    return googleClient.generateAuthUrl({
      access_type: 'offline',
      scope: ['openid', 'email', 'profile'],
      prompt: 'consent',
    });
  },

  async handleGoogleCallback(code: string) {
    const { tokens } = await googleClient.getToken(code);
    if (!tokens.id_token) throw { status: 400, message: 'Failed to get ID token from Google' };

    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload?.email) throw { status: 400, message: 'Invalid Google token payload' };

    let user = await prisma.user.findUnique({ where: { email: payload.email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: payload.email,
          name: payload.name || payload.email.split('@')[0],
          googleId: payload.sub,
          provider: 'GOOGLE',
          avatarUrl: payload.picture || null,
        },
      });
    } else if (!user.googleId) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { googleId: payload.sub, avatarUrl: user.avatarUrl || payload.picture || null },
      });
    }

    return signToken(user.id, user.email);
  },

  async getMe(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: USER_SELECT });
    if (!user) throw { status: 404, message: 'User not found' };
    return user;
  },
};
