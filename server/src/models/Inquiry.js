import mongoose from 'mongoose';
const schema = new mongoose.Schema(
  {
    name: { type: String, required: true, maxLength: 100 },
    email: { type: String, maxLength: 150 },
    phone: { type: String, required: true, maxLength: 30 },
    message: { type: String, required: true, maxLength: 2000 },
    branch: { type: String, maxLength: 650, default: '' },
  },
  { timestamps: true },
);
export default mongoose.models.Inquiry || mongoose.model('Inquiry', schema);
