import { Request, Response, NextFunction } from 'express';

export const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { ip, method, originalUrl } = req;
  const userAgent = req.get('user-agent') || '';

  res.on('finish', () => {
    const { statusCode } = res;
    const contentLength = res.get('content-length');

    console.log(
      `${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip}`,
    );
  });

  next();
};
