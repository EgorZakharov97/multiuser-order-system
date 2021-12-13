import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { randomBytes } from 'crypto';
import { OrderService } from '../order.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly orderService: OrderService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const res: Response = context.switchToHttp().getResponse();
    const existingToken = req.header('Authorization');
    if (!existingToken) {
      return this.orderService.createSession().then((session) => {
        res.setHeader('Authorization', session.id);
        return true;
      });
    } else return true;
  }
}
