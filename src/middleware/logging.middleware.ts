import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    const method = req.method;
    const url = req.url;
    const httpVersion = req.httpVersion;
    const contentLength = req.headers['content-length'];
    const userAgent = req.headers['user-agent'];
    const ip = req.ip;

    try {
      Logger.log(
        `[${method}] [${url}] HTTP/${httpVersion} ${userAgent} ${ip} ${
          method === 'GET' ? '' : contentLength
        }`,
      );
    } catch (err) {
      Logger.error(err);
    }
    next();
  }
}
