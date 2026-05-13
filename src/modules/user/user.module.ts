import { Express } from 'express';
import userRoutes from './user.routes'

export default class UserModule {
    constructor(app: Express) {
        app.use(userRoutes);
    }
};
