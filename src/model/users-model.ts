import * as mongoose from 'mongoose';
import { Document, Schema } from 'mongoose';

export interface IUsersSchema extends Document {
  name: string,
  password: string,
}

const usersSchema = new Schema({
  name: { type: String, require: true, unique: true, lowercase: true },
  password: { type: String, require: true }
});

export default mongoose.model<IUsersSchema>('Users', usersSchema);
