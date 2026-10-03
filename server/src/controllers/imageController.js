import mongoose from 'mongoose';
import sharp from 'sharp';
import { Readable } from 'node:stream';
function bucket() {
  return new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'images' });
}
export async function uploadImage(req, res) {
  if (!req.file)
    return res.status(400).json({ error: 'Choose a JPG, PNG or WebP image under 3 MB.' });
  let image;
  try {
    image = await sharp(req.file.buffer, { limitInputPixels: 25000000, animated: false })
      .rotate()
      .resize({ width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer();
  } catch {
    return res
      .status(400)
      .json({ error: 'The file is not a valid image or is too large to process.' });
  }
  const stream = bucket().openUploadStream('gym-photo.webp', {
    metadata: { contentType: 'image/webp' },
  });
  await new Promise((resolve, reject) => {
    stream.on('finish', resolve);
    stream.on('error', reject);
    Readable.from(image).pipe(stream);
  });
  res.status(201).json({ url: '/api/images/' + stream.id });
}
export async function getImage(req, res) {
  if (!/^[a-f0-9]{24}$/.test(req.params.id))
    return res.status(404).json({ error: 'Image not found.' });
  const id = new mongoose.Types.ObjectId(req.params.id);
  const store = bucket();
  const [file] = await store.find({ _id: id }).toArray();
  if (!file) return res.status(404).json({ error: 'Image not found.' });
  res.type('webp');
  res.set('Cache-Control', 'public, max-age=31536000, immutable');
  res.set('Content-Length', String(file.length));
  const stream = store.openDownloadStream(id);
  stream.on('error', () => {
    if (!res.headersSent) res.status(500).end();
    else res.destroy();
  });
  stream.pipe(res);
}
