import { Follow } from '../models/Follow';
import { Vacation } from '../models/Vacation';
import { Sequelize } from 'sequelize-typescript';

export class FollowService {

    static async toggle(userId: string, vacationId: string): Promise<boolean> {
        const existing = await Follow.findOne({
            where: { userId, vacationId }
        });

        if (existing) {
            await existing.destroy();
            return false; // Unfollowed
        } else {
            await Follow.create({ userId, vacationId });
            return true; // Followed
        }
    }


    static async getByUser(userId: string): Promise<string[]> {
        const follows = await Follow.findAll({
            where: { userId },
            attributes: ['vacationId']
        });
        return follows.map(f => f.vacationId);
    }

    static async getStats() {
        return await Vacation.findAll({
            attributes: [
                'destination',
                [
                    Sequelize.fn('COUNT', Sequelize.col('followers.uuid')), 
                    'followersCount'
                ]
            ],
            include: [{
                model: Follow, 
                as: 'followEntries', 
                attributes: []
            }],
            group: ['Vacation.uuid'],
            order: [[Sequelize.literal('followersCount'), 'DESC']]
        });
    }
}