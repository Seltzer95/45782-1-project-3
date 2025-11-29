import { Router } from 'express';
import { FollowController } from '../controllers/followController';
import { verifyToken, isAdmin } from '../middlewares/authMiddleware'; 

const router = Router();

router.post('/:vacationId', verifyToken, FollowController.toggleFollow);
router.get('/', verifyToken, FollowController.getUserFollows);
router.get('/stats', verifyToken, isAdmin, FollowController.getFollowStats);

export default router;