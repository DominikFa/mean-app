import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import AuthService from '../modules/services/auth.service';

const authService = new AuthService();

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    let tokenHeader = (req.headers['x-auth-token'] as string) || req.headers.authorization;
    let token;

    if (!tokenHeader) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    if (tokenHeader.startsWith('Bearer ')) {
        token = tokenHeader.split(' ')[1];
    } else {
        token = tokenHeader;
    }

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const isRevoked = await authService.isTokenRevoked(token);
        if (isRevoked) {
            return res.status(401).json({ error: 'Token has been revoked.' });
        }

        const decoded = jwt.verify(token, config.jwtSecret);
        (req as any).user = decoded;

        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token.' });
    }
};