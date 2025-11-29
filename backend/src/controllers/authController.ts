import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';

export class AuthController {

    static async register(req: Request, res: Response, next: NextFunction) {
        try {
            console.log('📝 Register Request:', req.body);
            const { firstName, lastName, email, password } = req.body;
            
            if (!firstName || !lastName || !email || !password) {
                return res.status(400).json({ message: 'All fields are required' });
            }

            const result = await AuthService.register({ firstName, lastName, email, password });
            console.log('✅ Registration success for:', email);
            res.status(201).json(result);
        } catch (error: any) {
            console.error('❌ Registration Error:', error.message);
            if (error.message === 'Email already exists') {
                return res.status(400).json({ message: error.message });
            }
            next(error);
        }
    }

    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            console.log('🔑 Login Request for:', req.body.email);
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: 'Email and password are required' });
            }

            const result = await AuthService.login({ email, password });
            console.log('✅ Login success for:', email);
            
            res.json(result);
        } catch (error: any) {
            console.error('❌ Login Failed:', error.message);
            if (error.message === 'Invalid email or password') {
                return res.status(401).json({ message: 'Invalid email or password' });
            }
            next(error);
        }
    }
}