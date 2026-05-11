import dotenv from 'dotenv';
dotenv.config();

const valueOrError = (key: string): string => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
};

export default {
    PORT: 5555,
    mongoUri: valueOrError('MONGODB_URI'),
    mongoDBName: valueOrError('MONGODB_DATABASE'),
    mode: process.env.NODE_ENV || 'development',
    jwtSecret: valueOrError('JWT_SECRET'),
};
