import { User } from '../models/User';
import { Vacation } from '../models/Vacation';
import { Follow } from '../models/Follow';

export const ensureInitialData = async () => {
    try {
        const DEFAULT_PASSWORD = process.env.DEFAULT_USER_PASSWORD || 'ChangeMe123!';

        const adminExists = await User.findOne({ where: { email: 'admin@vacation.com' } });

        if (!adminExists) {
            console.log('⚠️ Admin not found. Creating default Admin...');
            await User.create({
                firstName: 'Admin',
                lastName: 'User',
                email: 'admin@vacation.com',
                password: DEFAULT_PASSWORD,
                role: 'admin'
            });
            console.log('✅ Admin created: admin@vacation.com');
        } else {
            console.log('✅ Admin exists.');
        }

        const userExists = await User.findOne({ where: { email: 'user@vacation.com' } });

        if (!userExists) {
            console.log('⚠️ Regular user not found. Creating default User...');
            await User.create({
                firstName: 'John',
                lastName: 'Doe',
                email: 'user@vacation.com',
                password: DEFAULT_PASSWORD,
                role: 'user'
            });
            console.log('✅ User created: user@vacation.com');
        } else {
            console.log('✅ Regular user exists.');
        }

    } catch (error) {
        console.error('❌ Error ensuring initial data:', error);
    }
};