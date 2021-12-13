import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
import { Category } from './entities/category.entity';
import { Dish } from './entities/dish.entity';
import { Order } from './entities/order.entity';
import { Selection } from './entities/selection.entity';
import { Payment } from './entities/payment.entity';
import { Session } from './entities/session.entity';
import { DishStatus } from './enums/dishStatus.enum';

@Injectable()
export class OrderService {
  constructor(
    private connection: Connection,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Selection)
    private readonly selectionRepository: Repository<Selection>,
    @InjectRepository(Dish)
    private readonly dishRepository: Repository<Dish>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}

  private async getItemAndOrder(
    orderId: string,
    dishId: string,
  ): Promise<[Dish, Order]> {
    const dish = await this.dishRepository.findOne({ id: dishId });
    if (!dish)
      throw new NotFoundException(`Dish with id ${dishId} was not found`);

    const order = await this.orderRepository.findOne({ id: orderId });
    if (!order)
      throw new NotFoundException(`Order with id ${orderId} was not found`);

    return [dish, order];
  }

  async getSession(id: string): Promise<Session> {
    const session = await this.sessionRepository.findOne({
      where: { id },
      relations: ['order'],
    });
    if (!session) throw new NotFoundException('Could not find your session');
    else return session;
  }

  getOrderById(id: string): Promise<Order> {
    return this.orderRepository.findOne({
      where: {id},
      relations: ['selections'],
    })
  }

  getSelectionsByOrder(orderId: string) {
    return this.selectionRepository.find({ order: orderId });
  }

  async updateSession(sessionId: string, socketId?: string, table?: string) {
    const session = await this.sessionRepository.findOne({ id: sessionId });
    if (!session) throw new NotFoundException('Could not find session');
    session.socketId = session.socketId !== socketId ? socketId : session.socketId;
    session.table = session.table !== table ? table : session.table;
    return await this.sessionRepository.save(session);
  }

  createSession(socketId?: string, tableId?: string): Promise<Session> {
    if (!tableId) tableId = null;
    if (!socketId) socketId = null;
    const session = this.sessionRepository.create({
      socketId,
      table: tableId,
    });
    return this.sessionRepository.save(session);
  }

  async findOpenOrderByTable(session: Session): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: {
        table: session.table,
        isOpen: true,
      },
      relations: ['selections']
    });
    if (!order) throw new NotFoundException('No order was found');
    session.order = order;
    this.sessionRepository.save(session);
    return order;
  }

  getSelections(session: Session): Promise<Selection[]> {
    return this.selectionRepository.find({
      order: session.order,
    })
  }

  async createOrder(session: Session): Promise<Order> {
    const openOrders = await this.orderRepository.find({
      table: session.table,
      isOpen: true,
    });
    if (openOrders.length > 0)
      throw new BadRequestException(`Table ${session.table} has an open order`);

    const order = this.orderRepository.create({
      table: session.table,
      

    });
    session.order = order;
    this.sessionRepository.save(session);
    return this.orderRepository.save(order);
  }

  async closeOrder(orderId: string): Promise<Order> {
    const order = await this.orderRepository.findOne({ id: orderId });
    if (!order)
      throw new NotFoundException(`Order number ${orderId} was not found`);

    order.isOpen = false;
    return await this.orderRepository.save(order);
  }

  async removeSelection(order: Order, dishId: string, session: Session) {
    //@ts-ignore
    const existingSelection = await this.selectionRepository.findOne({
      //@ts-ignore
      order: order.id,
      dish: dishId,
      session,
      status: DishStatus.SELECTED,
    });

    if(!existingSelection) throw new NotFoundException('Could not find selection to delete');
    return await this.selectionRepository.remove(existingSelection);
  }

  async makeSelection(order: Order, dishId: string, session: Session) {
    const dish = await this.dishRepository.findOne({id: dishId});
    if (!dish) throw new NotFoundException(`Could not find dish with id ${dishId}`);

    //@ts-ignore
    const existingSelection = await this.selectionRepository.findOne({
      order: order.id,
      dish,
      session,
      status: DishStatus.SELECTED,
    });

    if(existingSelection) {
      existingSelection.quantity += 1;
      return await this.selectionRepository.save(existingSelection);
    } else {
      const newSelection = this.selectionRepository.create({
        order,
        dish,
        session,
      });
      return await this.selectionRepository.save(newSelection);
    }
  }

  async confirmOrder(orderId: string) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['selections'],
    });

    order.selections.map((item) => {
      item.status = DishStatus.ORDERED;
      this.selectionRepository.save(item);
    });
    return order.selections;
  }

  async changeDishStatus(selectionId: string, status: DishStatus) {
    const item = await this.selectionRepository.findOne({ id: selectionId });
    if (!item)
      throw new NotFoundException(`Could not find item with id ${selectionId}`);

    item.status = status;
    return await this.selectionRepository.save(item);
  }

  // async makePayment(
  //   orderId: string,
  //   paymentAmount: number,
  //   tableNumber: string,
  // ) {
  //   const order = await this.orderRepository.findOne({ id: orderId });
  //   if (!order)
  //     throw new NotFoundException(`Order number ${orderId} was not found`);

  //   const payment = this.paymentRepository.create({
  //     order: orderId,
  //     amount: paymentAmount,
  //     tableNumber,
  //   });

  //   const queryRunner = this.connection.createQueryRunner();
  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();

  //   try {
  //     order.total -= paymentAmount;
  //     if (order.total <= 0) order.isOpen = false;

  //     await this.orderRepository.save(order);
  //     await this.paymentRepository.save(payment);
  //   } catch {
  //     await queryRunner.rollbackTransaction();
  //   } finally {
  //     await queryRunner.release();
  //     return payment;
  //   }
  // }

  getDishes() {
    return this.dishRepository.find({ relations: ['category'] });
  }

  async getOrder(orderId: string) {
    const order = await this.orderRepository.findOne({ id: orderId });
    const items = await this.selectionRepository.find({
      where: { order: orderId },
      relations: ['dish'],
    });
    return {
      order: order,
      items: items,
    };
  }
}
