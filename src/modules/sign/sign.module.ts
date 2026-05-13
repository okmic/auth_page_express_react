import { Express } from 'express';
import signRoutes from './sign.routes'

export default class SignModule {
    constructor(app: Express) {
        app.use(signRoutes);
    }
};
