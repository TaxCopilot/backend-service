import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { analysisFileController } from '../controllers/analysisFile.controller';

const router = Router();

const TEMP_DIR = path.join(process.cwd(), 'uploads', 'temp');
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, TEMP_DIR),
  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['.pdf', '.docx', '.doc', '.jpg', '.jpeg', '.png'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${ext} not allowed`));
    }
  },
});

router.get('/', analysisFileController.list);
router.post('/upload', upload.single('file'), analysisFileController.upload);
router.get('/:id', analysisFileController.getById);
router.get('/:id/download', analysisFileController.getDownloadUrl);
router.delete('/:id', analysisFileController.remove);

export { router as analysisFileRoutes };
