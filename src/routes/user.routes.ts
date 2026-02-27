import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { userController } from '../controllers/user.controller';

const userRoutes = Router();

const AVATAR_DIR = path.join(process.cwd(), 'uploads', 'avatars');
if (!fs.existsSync(AVATAR_DIR)) {
  fs.mkdirSync(AVATAR_DIR, { recursive: true });
}

const avatarUpload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, AVATAR_DIR),
    filename: (_req, file, cb) => {
      const uniqueName = `avatar-${Date.now()}${path.extname(file.originalname)}`;
      cb(null, uniqueName);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, allowed.includes(ext));
  },
});

// ─── Routes ───
userRoutes.get('/me', userController.getProfile);
userRoutes.put('/me', userController.updateProfile);
userRoutes.post('/me/avatar', avatarUpload.single('avatar'), userController.uploadAvatar);

export { userRoutes };
