import { Router } from 'express';
import SignController from './sign.controller';
import signAdminController from './admin/sign.admin.controller';

const router = Router();

router.post('/api/signin', SignController.signin);
router.post('/api/signup', SignController.signup);
router.post('/api/signup/admin', signAdminController.signup)

export default router;
