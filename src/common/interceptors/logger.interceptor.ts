import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { catchError, Observable, throwError } from 'rxjs';
import { SERVICE_NAME } from '../../app.environment';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private logger: Logger;

    constructor() {
        this.logger = new Logger(SERVICE_NAME);
    }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            catchError((err) => {
                this.logger.error(`${err?.status || 500} ${err?.response?.message || err?.response || err}`);
                return throwError(() => err);
            }),
        );
    }
}
