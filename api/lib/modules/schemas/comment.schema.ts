import { Schema, model } from 'mongoose';
import { CommData } from "../models/comment.model";

export const DataSchema: Schema = new Schema({
    text: { type: String, required: true },
    postId: { type: Schema.Types.ObjectId, ref: 'Post-DF', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
});

export default model<CommData>('comments', DataSchema);