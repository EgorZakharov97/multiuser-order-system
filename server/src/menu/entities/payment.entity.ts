import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity('payment')
export class Payment {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'float', nullable: false })
  amount: number;

  @Column({ type: 'text', nullable: false })
  tableNumber: string;

  @ManyToOne(() => Order, (order) => order.id)
  order: Order | string;
}
