import * as express from 'express';

declare global {
    namespace Express {
        interface Request {
            user?: {
                uuid: string;
                role: 'user' | 'admin';
            }
        }
    }
}