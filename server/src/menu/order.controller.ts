import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { Request, Response } from 'express';
import { AuthGuard } from './guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('/')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  getDishes() {
    return this.orderService.getDishes();
  }

  @Get('/authorize')
  authenticate(@Res({ passthrough: true }) res: Response) {
    return res.getHeader('Authorization');
  }
}
