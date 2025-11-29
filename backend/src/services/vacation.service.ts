import { Vacation } from '../models/Vacation';
import { Sequelize } from 'sequelize-typescript';
import fs from 'fs/promises';
import path from 'path';

export const vacationService = {
    
    async getAll(currentUserId: string) {
        return await Vacation.findAll({
            attributes: {
                include: [
                    [
                        Sequelize.literal(`(
                            SELECT COUNT(*)
                            FROM follows AS f
                            WHERE f.vacationId = Vacation.uuid
                        )`),
                        'followersCount'
                    ],
                    [
                        Sequelize.literal(`(
                            SELECT COUNT(*)
                            FROM follows AS f
                            WHERE f.vacationId = Vacation.uuid
                            AND f.userId = "${currentUserId}"
                        )`),
                        'isFollowing'
                    ]
                ]
            },
            order: [['startDate', 'ASC']],
        });
    },

    async getById(uuid: string) {
        return await Vacation.findByPk(uuid);
    },

    async create(data: any) {
        return await Vacation.create(data);
    },

    async update(uuid: string, data: any) {
        const vacation = await Vacation.findByPk(uuid);
        if (!vacation) return null;
        return await vacation.update(data);
    },

    async delete(uuid: string) {
        const vacation = await Vacation.findByPk(uuid);
        if (!vacation) return null;

        if (vacation.pictureUrl) {
            const filePath = path.join(__dirname, '../../', vacation.pictureUrl);
            try {
                await fs.unlink(filePath);
            } catch (err) {
                console.warn("Could not delete file:", filePath);
            }
        }

        await vacation.destroy();
        return true;
    }
};