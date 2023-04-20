import { config as dotenvConfig } from 'dotenv';
dotenvConfig();

export const config = {
  database: {
    host: process.env.DATABASE_HOST as string,
    port: parseInt(process.env.DATABASE_PORT ?? ''),
    username: process.env.DATABASE_USER as string,
    password: process.env.DATABASE_PASSWORD as string,
    name: process.env.DATABASE_NAME as string,
  },
  aws: {
    region: process.env.AWS_REGION as string,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    bucketName: process.env.AWS_BUCKET_NAME as string,
  },
  auth0: {
    audience: process.env.AUTH0_AUDIENCE as string,
    issuerUrl: process.env.AUTH0_ISSUER_URL as string,
  },
  jwt: {
    secret: process.env.JWT_SECRET as string,
  },
  isDev: process.env.ENV === 'development',
};
