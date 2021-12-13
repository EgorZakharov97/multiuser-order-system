import { BadRequestException, UnauthorizedException, UseGuards, UseInterceptors } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import io, { Socket, Server } from 'socket.io';
import { Session } from './entities/session.entity';
import { SocketGuard } from './guards/socket.guard';
import { ErrorHandlerInterceptor } from './intersectors/error.interpector';
import { OrderService } from './order.service';

@UseInterceptors(ErrorHandlerInterceptor)
@UseGuards(SocketGuard)
@WebSocketGateway({ namespace: 'menu', cors: true })
export class MenuGateway {
  @WebSocketServer()
  private server: Server;

  constructor(private readonly orderService: OrderService) {}

  @SubscribeMessage('joinTable')
  public async joinTable(
    @ConnectedSocket() client: Socket,
    @MessageBody() tableId: string,
  ) {
    const sessionId = client.handshake.headers['authorization'] as string;
    let session = await this.orderService.getSession(sessionId);
    session = await this.orderService.updateSession(session.id, client.id, tableId);
    let order = {};
    try {
      order = await this.orderService.findOpenOrderByTable(session);
    } catch(e) {
      order = await this.orderService.createOrder(session);
    }
    client.join(String(tableId));
    client.emit('joinTable', {order});
  }

  @SubscribeMessage('makeSelection')
  public async makeSelection(@ConnectedSocket() client: Socket, @MessageBody('id') dishId: string, @MessageBody('quantity') quantity: number) {
    const sessionId = client.handshake.headers['authorization'] as string;
    const session = await this.orderService.getSession(sessionId);
    const order = await this.orderService.getOrderById(session.order.id);

    if(quantity <= 0) {
      await this.orderService.removeSelection(order, dishId, session);
    } else {
      await this.orderService.makeSelection(order, dishId, session);
    }
    const selections = await this.orderService.getSelectionsByOrder(order.id);
    this.server.to(`${session.table}`).emit('makeSelection', selections);
  }

  @SubscribeMessage('confirmOrder')
  public async confirmOrder(@ConnectedSocket() client: Socket) {
    const sessionId = client.handshake.headers['authorization'] as string;
    const session = await this.orderService.getSession(sessionId);
    const selections = await this.orderService.confirmOrder(session.order.id);
    this.server.to(session.table).emit('confirmOrder', selections);
  }

  @SubscribeMessage('leaveTable')
  public async leaveTable(@ConnectedSocket() client: Socket) {
    const sessionId = client.handshake.headers['authorization'] as string;
    let session = await this.orderService.getSession(sessionId);
    client.leave(session.table);
    this.server.to(session.table).emit('leaveTable', session.id);
  }

  @SubscribeMessage('enterRestaurant')
  public async connect(@ConnectedSocket() client: Socket) {
    const sessionId = client.handshake.headers['authorization'] as string;
    if (!sessionId)
      throw new BadRequestException('You need to get authorized first');
    this.orderService.updateSession(sessionId, client.id);
    client.emit('enterRestaurant', true);
  }
}
