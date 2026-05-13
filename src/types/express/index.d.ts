import { IUser } from '../../models/user.model';

declare global {
  namespace Express {
    export interface Request {
      userId: string
      user?: {
        id: string;
        role: IUser["role"];
      };
    }
  }
}
