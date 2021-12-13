import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Dish } from './entities/dish.entity';
import { Order } from './entities/order.entity';
import { Selection } from './entities/selection.entity';
import { Payment } from './entities/payment.entity';
import { OrderController } from './order.controller';
import { MenuGateway } from './order.gateway';
import { OrderService } from './order.service';
import { Session } from './entities/session.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      Payment,
      Selection,
      Dish,
      Category,
      Session,
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService, MenuGateway],
  exports: [],
})
export class OrderModule {}
