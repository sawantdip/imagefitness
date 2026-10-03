import { z } from 'zod';
const text = (max = 2000) => z.string().trim().max(max);
const required = (max = 2000) => text(max).min(1);
const image = text(2048).refine(
  (value) => !value || /^\/api\/images\/[a-f0-9]{24}$/.test(value) || /^https:\/\//.test(value),
  'Use an HTTPS image URL or upload a photo.',
);
const website = text(2048).refine(
  (value) => !value || /^https:\/\//.test(value),
  'Use an HTTPS URL.',
);
const list = (schema) => z.array(schema).max(50);
export const branchSchema = z.object({
  name: required(100),
  address: required(500),
  phone: text(30),
  hours: text(200),
  sunday: text(200),
  description: text(),
  mapUrl: website,
  image,
});
export const contentSchema = z.object({
  name: required(100),
  eyebrow: text(150),
  headline: required(200),
  tagline: text(),
  about: text(),
  description: text(),
  address: required(500),
  phone: required(30),
  email: z.string().email().max(150),
  hours: text(200),
  sunday: text(200),
  instagram: website,
  heroImage: image,
  branches: list(branchSchema).default([]),
  stats: list(z.object({ value: required(30), label: required(100) })),
  services: list(z.object({ title: required(100), description: text() })),
  trainers: list(z.object({ name: required(100), role: text(150), experience: text(100), image })),
  equipment: list(z.object({ name: required(100), description: text(), image })),
  reviews: list(
    z.object({ name: required(100), text: required(), rating: z.number().int().min(1).max(5) }),
  ),
});
export const inquirySchema = z.object({
  name: required(100),
  email: z
    .union([z.string().email().max(150), z.literal('')])
    .optional()
    .default(''),
  phone: required(30).regex(/^[+\d\s().-]{7,30}$/, 'Enter a valid phone number.'),
  message: required(),
  branch: text(650).optional().default(''),
});
export const loginSchema = z.object({
  email: z.string().email().max(150),
  password: z.string().min(1).max(200),
});
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success)
    return res.status(400).json({
      error: result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; '),
    });
  req.body = result.data;
  next();
};
