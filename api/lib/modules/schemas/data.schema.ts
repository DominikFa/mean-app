import { Schema, model } from 'mongoose';
import { IData } from "../models/data.model";

export const DataSchema: Schema = new Schema({
    title: { type: String, required: true },
    text: { type: String, required: true },
    image: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    likes: { type: [Schema.Types.ObjectId], ref: 'User', default: [] },
    views: { type: Number, default: 0 },
});

export default model<IData>('Post-DF', DataSchema);