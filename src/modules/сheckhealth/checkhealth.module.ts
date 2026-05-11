import { Express } from 'express';
import checkhealthRoutes from './checkhealth.routes';

export default class CheckHealthModule {
    constructor(app: Express) {
        app.use(checkhealthRoutes);
    }
};

