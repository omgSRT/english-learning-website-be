import path from 'path';
import dotenv from 'dotenv';

const envPath = path.resolve(__dirname, `.env.${process.env.NODE_ENV}`);
dotenv.config({ path: path.resolve(__dirname, '../.env') });
console.log(envPath);
