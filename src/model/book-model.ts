import * as mongoose from 'mongoose';
import { Document, Schema } from 'mongoose';

export interface IBookSchema extends Document {
  title: string,
  genre: string,
  author: string,
  read: boolean
}

const bookSchema = new Schema({
  title: { type: String },
  genre: { type: String },
  author: { type: String },
  read: { type: Boolean, default: false },
});

export default mongoose.model<IBookSchema>('Book', bookSchema);
