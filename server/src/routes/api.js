import { Router } from 'express';
import multer from 'multer';
import { requireAdmin, protectOrigin } from '../middleware/auth.js';
import { limit } from '../middleware/rateLimit.js';
import { validate, contentSchema, inquirySchema, loginSchema } from '../validation/schemas.js';
import { getContent, updateContent } from '../controllers/contentController.js';
import { getInquiries, createInquiry } from '../controllers/inquiryController.js';
import { authController } from '../controllers/authController.js';
import { getImage, uploadImage } from '../controllers/imageController.js';
export function apiRoutes(config) {
  const router = Router();
  const auth = requireAdmin(config);
  const controller = authController(config);
  router.use(protectOrigin(config));
  router.get('/health', (req, res) => res.json({ ok: true }));
  router.get('/content', getContent);
  router.put('/content', auth, validate(contentSchema), updateContent);
  router.post(
    '/login',
    limit('login', 10, 15 * 60 * 1000),
    validate(loginSchema),
    controller.login,
  );
  router.post('/logout', controller.logout);
  router.get('/auth/session', auth, controller.session);
  router.post('/inquiries', limit('inquiry', 5, 60 * 1000), validate(inquirySchema), createInquiry);
  router.get('/inquiries', auth, getInquiries);
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 3 * 1024 * 1024, files: 1, fields: 0 },
    fileFilter: (req, file, cb) =>
      cb(null, ['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)),
  });
  router.post('/upload', auth, upload.single('image'), uploadImage);
  router.get('/images/:id', getImage);
  router.use((req, res) => res.status(404).json({ error: 'API endpoint not found.' }));
  return router;
}
