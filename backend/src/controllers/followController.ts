import { Request, Response, NextFunction } from 'express';
import { FollowService } from '../services/followService';

interface AuthRequest extends Request {
    user?: { uuid: string; role: 'user' | 'admin' };
}

export class FollowController {

    static async toggleFollow(req: Request, res: Response, next: NextFunction) {
        const authReq = req as AuthRequest;
        try {
            const userId = authReq.user?.uuid;
            const { vacationId } = req.params;

            if (!userId) return res.status(401).json({ message: "Unauthorized" });

            const isFollowing = await FollowService.toggle(userId, vacationId);

            const io = req.app.get('io');
            if (io) {
                io.emit('vacationUpdated');
                console.log('📡 Emitted vacationUpdated event to all clients');
            } else {
                console.warn('⚠️ Socket.IO instance not found!');
            }

            res.json({ isFollowing, message: isFollowing ? "Followed" : "Unfollowed" });
        } catch (error) {
            next(error);
        }
    }

    static async getUserFollows(req: Request, res: Response, next: NextFunction) {
        const authReq = req as AuthRequest;
        try {
            const userId = authReq.user?.uuid;
            if (!userId) return res.status(401).json({ message: "Unauthorized" });

            const followedIds = await FollowService.getByUser(userId);
            res.json(followedIds);
        } catch (error) {
            next(error);
        }
    }

    static async getFollowStats(req: Request, res: Response, next: NextFunction) {
        try {
            const stats = await FollowService.getStats();
            res.json(stats);
        } catch (error) {
            next(error);
        }
    }
}