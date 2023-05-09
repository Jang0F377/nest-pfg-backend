import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    const method = req.method;
    const url = req.originalUrl;
    const httpVersion = req.httpVersion;
    const contentLength = req.hostname;
    const userAgent = req.headers['user-agent'];
    const ip = req.ip;

    try {
      Logger.log(
        `[${method} | ${res.statusCode}] ${url} HTTP/${httpVersion} ${userAgent} ${ip} ${contentLength}`,
      );
    } catch (err) {
      Logger.error(err);
    }
    next();
  }
}
