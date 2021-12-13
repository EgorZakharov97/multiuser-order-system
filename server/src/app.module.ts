import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MenuGateway } from './menu/order.gateway';
import { OrderModule } from './menu/order.module';

@Module({
  imports: [
    OrderModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '127.0.0.1',
      port: 5433,
      username: 'postgres',
      password: '9309',
      database: 'menu',
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
