export const config = {
  database: {
    host: process.env.DATABASE_HOST as string,
    port: parseInt(process.env.DATABASE_PORT ?? ''),
    username: process.env.DATABASE_USER as string,
    password: process.env.DATABASE_PASSWORD as string,
    name: 'chat-api',
  },
};
