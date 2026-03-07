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

import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: process.env.AWS_DEFAULT_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET = process.env.S3_BUCKET || 'taxcopilot-files';

// ─── Service ───
export const userService = {
  /** Get user profile */
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: USER_SELECT });
    if (!user) throw { status: 404, message: 'User not found' };
    return this.processUser(user);
  },

  /** Sign S3 URLs if needed */
  async signAvatarUrl(avatarUrl: string | null): Promise<string | null> {
    if (!avatarUrl || !avatarUrl.includes('.amazonaws.com/')) return avatarUrl;
    try {
      const urlObj = new URL(avatarUrl);
      let key = urlObj.pathname;
      if (key.startsWith('/')) key = key.substring(1);
      
      const command = new GetObjectCommand({ Bucket: BUCKET, Key: key });
      return await getSignedUrl(s3Client, command, { expiresIn: 86400 }); // 24 hours
    } catch (err) {
      console.error('[userService] signAvatarUrl error:', err);
      return avatarUrl;
    }
  },

  /** Process user object to sign URLs */
  async processUser(user: any) {
    if (user && user.avatarUrl) {
      user.avatarUrl = await this.signAvatarUrl(user.avatarUrl);
    }
    return user;
  },

  /** Update user profile fields */
  async updateProfile(userId: string, data: { name?: string; phone?: string; registrationId?: string }) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.registrationId !== undefined && { registrationId: data.registrationId }),
      },
      select: USER_SELECT,
    });
    return this.processUser(user);
  },

  /** Upload avatar: save file to S3, update DB, delete old file */
  async uploadAvatar(userId: string, file: Express.Multer.File) {
    const s3Key = `uploads/avatars/${userId}/${Date.now()}-${file.originalname}`;
    const fileBuffer = fs.readFileSync(file.path);

    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: s3Key,
        Body: fileBuffer,
        ContentType: file.mimetype,
      })
    );

    // Always delete local temp file
    try {
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
    } catch {}

    const avatarUrl = `https://${BUCKET}.s3.${process.env.AWS_DEFAULT_REGION || 'ap-south-1'}.amazonaws.com/${s3Key}`;

    const current = await prisma.user.findUnique({ where: { id: userId } });

    if (current?.avatarUrl) {
      if (current.avatarUrl.startsWith('/uploads/avatars/')) {
        // Delete old local avatar
        const oldPath = path.join(process.cwd(), current.avatarUrl);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      } else if (current.avatarUrl.includes('.amazonaws.com/')) {
        // Delete old S3 avatar
        try {
          const urlObj = new URL(current.avatarUrl);
          // Key is the pathname without the leading slash
          let oldKey = urlObj.pathname;
          if (oldKey.startsWith('/')) oldKey = oldKey.substring(1);
          
          if (oldKey && (oldKey.includes('avatars/') || oldKey.includes('uploads/'))) {
            await s3Client.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: oldKey }));
          }
        } catch (err) {
          console.error('[userService] S3 delete old avatar error:', err);
        }
      }
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { avatarUrl },
      select: USER_SELECT,
    });

    return this.processUser(user);
  },
};
