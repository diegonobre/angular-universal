import { Schema } from 'mongoose';
import * as mongoose from 'mongoose';

const UserSchema: Schema = new Schema({
  code: { type: String, required: false },
  name: { type: String, required: true },
  email: { type: String, required: true },
  bio: { type: String, required: false },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', UserSchema);
