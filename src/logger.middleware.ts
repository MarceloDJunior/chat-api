import { Request, Response, NextFunction } from 'express';

export const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { ip, method, originalUrl, params } = req;
  const userAgent = req.get('user-agent') || '';

  let body = '';
  const oldSend = res.send;

  res.send = function (data: any): Response {
    res.emit('send', data);
    return oldSend.apply(res, [data]);
  };

  res.on('send', (data: any) => {
    body = data;
  });

  res.on('finish', () => {
    console.log(`${method} ${originalUrl}`, {
      status: res.statusCode,
      userAgent,
      ip,
      params,
      responseBody: body,
    });
  });

  next();
};
