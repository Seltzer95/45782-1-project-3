import { Request, Response, NextFunction } from 'express';
import { vacationService } from '../services/vacation.service';
import fs from 'fs/promises';
import path from 'path';

interface AuthRequest extends Request {
    user?: { uuid: string; role: 'user' | 'admin' };
}

export const getAllVacations = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as AuthRequest).user?.uuid || '';
        const isAdmin = (req as AuthRequest).user?.role === 'admin';

        const vacations = await vacationService.getAll(userId);

        const result = vacations.map(v => {
            const json = v.toJSON() as any;
            return {
                ...json,
                followersCount: json.followersCount,
                isFollowing: isAdmin ? undefined : (json.isFollowing === 1)
            };
        });

        res.json(result);
    } catch (error) {
        next(error);
    }
};

export const getVacationById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const vacation = await vacationService.getById(id);
        if (!vacation) return res.status(404).json({ message: 'Vacation not found' });
        res.json(vacation);
    } catch (error) {
        next(error);
    }
};

export const createVacation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { destination, description, startDate, endDate, price } = req.body;
        
        
        if (!req.file) {
            return res.status(400).json({ message: 'Image is required' });
        }

        const pictureUrl = req.file.path.replace(/\\/g, '/');

        const newVacation = await vacationService.create({
            destination,
            description,
            startDate,
            endDate,
            price: parseFloat(price),
            pictureUrl
        });

        const io = req.app.get('io');
        if (io) {
            io.emit('vacationUpdated');
            console.log('📡 Emitted vacationUpdated event (vacation created)');
        }
        res.status(201).json(newVacation);
    } catch (error) {
        next(error);
    }
};

export const updateVacation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const existing = await vacationService.getById(id);
        
        if (!existing) return res.status(404).json({ message: 'Vacation not found' });

        let pictureUrl = existing.pictureUrl;

        
        if (req.file) {
            if (existing.pictureUrl) {
                const oldPath = path.resolve(existing.pictureUrl);
                try { await fs.unlink(oldPath); } catch(e) {}
            }

            pictureUrl = req.file.path.replace(/\\/g, '/');
        }

        await vacationService.update(id, {
            ...req.body,
            pictureUrl,
            price: parseFloat(req.body.price)
        });

        const io = req.app.get('io');
        if (io) {
            io.emit('vacationUpdated');
            console.log('📡 Emitted vacationUpdated event (vacation updated)');
        }
        res.json({ message: 'Vacation updated successfully' });
    } catch (error) {
        next(error);
    }
};

export const deleteVacation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const success = await vacationService.delete(id);

        if (!success) return res.status(404).json({ message: 'Vacation not found' });

        const io = req.app.get('io');
        if (io) {
            io.emit('vacationUpdated');
            console.log('📡 Emitted vacationUpdated event (vacation deleted)');
        }
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};