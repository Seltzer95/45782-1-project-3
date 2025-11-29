import { User } from '../models/User';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AuthService {

    static async register(data: any) {
        const existing = await User.findOne({ where: { email: data.email } });
        if (existing) {
            throw new Error('Email already exists');
        }

        const newUser = await User.create(data);

        const token = this.generateToken(newUser);

        const userJson = newUser.toJSON();
        delete userJson.password;

        return { user: userJson, token };
    }

    static async login(credentials: any) {
        const { email, password } = credentials;

        const user = await User.findOne({ where: { email } });

        if (!user || !user.validPassword(password)) {
            throw new Error('Invalid email or password');
        }

        const token = this.generateToken(user);

        const userJson = user.toJSON();
        delete userJson.password;

        return { user: userJson, token };
    }

    private static generateToken(user: User) {
        const secret = process.env.JWT_SECRET || 'mysecretkey';
        return jwt.sign(
            { uuid: user.uuid, role: user.role }, 
            secret, 
            { expiresIn: '24h' }
        );
    }
}