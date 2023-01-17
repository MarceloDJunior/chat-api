import { config as dotenvConfig } from 'dotenv';
dotenvConfig();

export const config = {
  database: {
    host: process.env.DATABASE_HOST as string,
    port: parseInt(process.env.DATABASE_PORT ?? ''),
    username: process.env.DATABASE_USER as string,
    password: process.env.DATABASE_PASSWORD as string,
    name: 'chat-api',
  },
  aws: {
    region: process.env.AWS_REGION as string,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    bucketName: process.env.AWS_BUCKET_NAME as string,
  },
};
