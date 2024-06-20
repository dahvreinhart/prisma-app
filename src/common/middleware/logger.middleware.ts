import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { SERVICE_NAME } from '../../app.environment';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    private logger: Logger;

    constructor() {
        this.logger = new Logger(SERVICE_NAME);
    }

    use(req: Request, res: Response, next: NextFunction) {
        this.logger.log(`[REQUEST: ${req.method} ${req.originalUrl}] [QUERY: ${JSON.stringify(req.query)}] [BODY: ${JSON.stringify(req.body)}]`);
        next();
    }
}
