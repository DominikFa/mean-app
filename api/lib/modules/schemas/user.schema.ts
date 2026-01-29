import { Schema, model } from 'mongoose';
import { UserData } from "../models/user.model";

export const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
});

export default model<UserData>('User', UserSchema);