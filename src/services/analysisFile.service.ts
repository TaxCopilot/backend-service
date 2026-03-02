import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import fs from 'fs';
import { prisma } from '../lib/prisma';

const s3Client = new S3Client({
  region: process.env.AWS_DEFAULT_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET = process.env.S3_BUCKET || 'taxcopilot-files';

export const analysisFileService = {
  async upload(userId: string, file: Express.Multer.File) {
    const s3Key = `uploads/${userId}/${Date.now()}-${file.originalname}`;
    const fileBuffer = fs.readFileSync(file.path);

    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: s3Key,
        Body: fileBuffer,
        ContentType: file.mimetype,
      })
    );

    try {
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
    } catch {}

    const s3Url = `https://${BUCKET}.s3.${process.env.AWS_DEFAULT_REGION || 'ap-south-1'}.amazonaws.com/${s3Key}`;

    const document = await prisma.document.create({
      data: {
        filename: file.originalname,
        mimeType: file.mimetype,
        sizeBytes: file.size,
        storagePath: s3Url,
        s3Bucket: BUCKET,
        s3Key,
        userId,
      },
    });

    return {
      id: document.id,
      filename: document.filename,
      mimeType: document.mimeType,
      sizeBytes: document.sizeBytes,
      s3Bucket: BUCKET,
      s3Key,
      storagePath: s3Url,
      createdAt: document.createdAt,
    };
  },

  async listByUser(userId: string) {
    return prisma.document.findMany({
      where: { userId, s3Key: { not: null } },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        filename: true,
        mimeType: true,
        sizeBytes: true,
        storagePath: true,
        s3Bucket: true,
        s3Key: true,
        createdAt: true,
      },
    });
  },

  async getById(userId: string, docId: string) {
    const doc = await prisma.document.findFirst({ where: { id: docId, userId } });
    if (!doc) throw { status: 404, message: 'Document not found' };
    return doc;
  },

  async getDownloadUrl(userId: string, docId: string) {
    const doc = await prisma.document.findFirst({
      where: { id: docId, userId, s3Key: { not: null } },
    });
    if (!doc || !doc.s3Bucket || !doc.s3Key) {
      throw { status: 404, message: 'Document not found' };
    }

    const command = new GetObjectCommand({ Bucket: doc.s3Bucket, Key: doc.s3Key });
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return { url, filename: doc.filename };
  },

  async remove(userId: string, docId: string) {
    const doc = await prisma.document.findFirst({ where: { id: docId, userId } });
    if (!doc) throw { status: 404, message: 'Document not found' };

    if (doc.s3Bucket && doc.s3Key) {
      try {
        await s3Client.send(new DeleteObjectCommand({ Bucket: doc.s3Bucket, Key: doc.s3Key }));
      } catch (err) {
        console.error('[analysisFile] S3 delete error:', err);
      }
    }

    await prisma.document.delete({ where: { id: doc.id } });
    return { message: 'Document deleted' };
  },
};
