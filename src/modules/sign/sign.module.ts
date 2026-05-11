import { Express } from 'express';
import signRoutes from './sign.route'

export default class SignModule {
    constructor(app: Express) {
        app.use(signRoutes);
    }
};
