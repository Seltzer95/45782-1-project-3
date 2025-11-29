import { Router } from 'express';
import { verifyToken, isAdmin } from '../middlewares/authMiddleware';
import { upload } from '../middlewares/uploadMiddleware';
import * as vc from '../controllers/vacationController';
import { validate } from '../middlewares/validationMiddleware';
import { vacationCreateUpdateSchema } from '../schemas/validationSchemas';

const router = Router();
router.get('/', verifyToken, vc.getAllVacations);
router.get('/:id', verifyToken, vc.getVacationById);
router.post('/', verifyToken, isAdmin, upload.single('image'),validate(vacationCreateUpdateSchema), vc.createVacation);
router.put('/:id', verifyToken, isAdmin, upload.single('image'),validate(vacationCreateUpdateSchema), vc.updateVacation);
router.delete('/:id', verifyToken, isAdmin, vc.deleteVacation);
export default router;