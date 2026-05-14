import { Router } from 'express';
import userController from './user.controller';

const router = Router();

router.get('/api/users/me', userController.getMe);
router.get('/api/users', userController.getList);
router.put('/api/users/status/:id', userController.updateStatus);

export default router;
