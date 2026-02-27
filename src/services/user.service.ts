import path from 'path';
import fs from 'fs';
import { prisma } from '../lib/prisma';

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

// ─── Service ───
export const userService = {
  /** Get user profile */
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: USER_SELECT });
    if (!user) throw { status: 404, message: 'User not found' };
    return user;
  },

  /** Update user profile fields */
  async updateProfile(userId: string, data: { name?: string; phone?: string; registrationId?: string }) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.registrationId !== undefined && { registrationId: data.registrationId }),
      },
      select: USER_SELECT,
    });
  },

  /** Upload avatar: save file, update DB, delete old file */
  async uploadAvatar(userId: string, file: Express.Multer.File) {
    const avatarUrl = `/uploads/avatars/${file.filename}`;

    // Delete old avatar if it's a local file
    const current = await prisma.user.findUnique({ where: { id: userId } });
    if (current?.avatarUrl?.startsWith('/uploads/avatars/')) {
      const oldPath = path.join(process.cwd(), current.avatarUrl);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    return prisma.user.update({
      where: { id: userId },
      data: { avatarUrl },
      select: USER_SELECT,
    });
  },
};
