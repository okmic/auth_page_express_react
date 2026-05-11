import { Router } from 'express';
import checkhealthController from './checkhealth.controller';

const router = Router();

router.get('/api/checkhealth', checkhealthController.getFullHealth);

export default router;
