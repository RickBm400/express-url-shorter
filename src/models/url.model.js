import mongoose from 'mongoose';
import { nanoid } from 'nanoid/non-secure';

const urlSchema = new mongoose.Schema({
  longUrl: { type: String, required: true },
  shortCode: { type: String, required: true, default: () => nanoid(6) },
  createdAt: { type: Date, default: Date.now }
});

export default  mongoose.model('urls', urlSchema);