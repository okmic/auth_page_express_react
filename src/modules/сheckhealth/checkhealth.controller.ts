import { Request, Response } from 'express';
import {sendSuccess} from "../../utils/response";

class CheckHealthController {
    async getFullHealth(req: Request, res: Response) {
        return sendSuccess(res, "health")
    }
}

export default new CheckHealthController();
