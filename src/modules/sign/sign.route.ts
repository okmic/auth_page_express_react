import { Router } from 'express';
import SignController from './Sign.controller';

const router = Router();

router.get('/api/signin', SignController.signin);
router.get('/api/signup', SignController.signup);

export default router;
