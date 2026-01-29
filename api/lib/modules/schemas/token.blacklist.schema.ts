import { Schema, model } from 'mongoose';

const TokenBlacklistSchema = new Schema({
    token: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now, expires: 86400 }
});

export default model('TokenBlacklist', TokenBlacklistSchema);