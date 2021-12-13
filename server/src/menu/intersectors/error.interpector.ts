import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Socket } from 'dgram';
import { EMPTY, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { SocketResponse } from '../interfaces/socketResponse';

@Injectable()
export class ErrorHandlerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (!error.status) throw error;
        const res: SocketResponse = {
          status: error.status,
          response: {
            statusCode: error.status,
            message: error.message,
          },
        };
        const client: Socket = context.switchToWs().getClient();
        client.emit('error', res);
        return EMPTY;
      }),
    );
  }
}
