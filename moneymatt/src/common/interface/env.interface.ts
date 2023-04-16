export interface Env {
    NODE_ENV: string;
    PORT: number;
    MONGO_URL: string;
    JWT_SECRET_KEY: string;
    FAST2SMS_AUTHORIZATION_KEY: string;
    TRANSACTION_CHARGES: number;
}