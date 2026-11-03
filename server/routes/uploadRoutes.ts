import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

const uploadDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const sanitized = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e6);
    cb(null, `${uniqueSuffix}-${sanitized}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
  fileFilter: (_req, file, cb) => {
    // Allow images and documents (PDF, DOC, DOCX, TXT)
    const allowed = /jpeg|jpg|png|webp|gif|pdf|doc|docx|txt/;
    const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
    if (allowed.test(ext) || allowed.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only images, PDFs, and document files are permitted.'));
    }
  },
});

router.post('/', authenticateToken, upload.single('file'), (req: Request, res: Response): void => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No file uploaded.' });
      return;
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    const fileSizeMB = (req.file.size / (1024 * 1024)).toFixed(2) + ' MB';

    res.json({
      success: true,
      message: 'File uploaded successfully!',
      data: {
        fileName: req.file.originalname,
        storedName: req.file.filename,
        fileUrl,
        fileSize: fileSizeMB,
        mimeType: req.file.mimetype,
      },
    });
  } catch (err: any) {
    console.error('Upload error:', err);
    res.status(500).json({ success: false, message: err.message || 'File upload failed.' });
  }
});

export default router;
