import express from 'express';
import cors from 'cors';
import appConfig from '../libs/config/appConfig';
import errorMiddleware from "../libs/middlewares/error.middleware";
import CheckHealthModule from "../modules/сheckhealth/checkhealth.module";
import { setupGlobalErrorHandlers } from '../utils/error.handler';
import { logger } from '../modules/logger/logger.service';
import authMiddleware from '../libs/middlewares/auth.middleware';
import { loggingMiddleware } from '../libs/middlewares/logging.middleware';
import { initializeDatabase } from '../modules/database/database.init';

(async () => {
    try {
        setupGlobalErrorHandlers()
        await initializeDatabase()
        const app = express();
        app.use(loggingMiddleware)
        app.use(cors());
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(authMiddleware);
        new CheckHealthModule(app);
        app.use(errorMiddleware);

        app.listen(appConfig.PORT, (error) => {
            if (error) console.log(error);
            console.log(`
                ═══════════ ════════════════════════════════════════════
                Server is running on http://localhost:${appConfig.PORT}
                ───────────────────────────────────────────────────────
                Health Module: http://localhost:${appConfig.PORT}/api/checkhealth
                ═══════════════════════════════════════════════════════
            `)
        })
    } catch (error) {
        logger.error("Failed to start", {
            errorModule: "CORE_STARTUP",
            at: new Date(),
            error
        })
        process.exit(1)
    }
})()
