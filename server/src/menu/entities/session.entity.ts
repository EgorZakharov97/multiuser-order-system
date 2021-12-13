import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';
import { Selection } from './selection.entity';

@Entity('session')
export class Session {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'text', nullable: true })
  socketId: string;

  @Column({ type: 'text', nullable: true })
  table: string;

  @ManyToOne(() => Order, (order) => order.session)
  order: Order;

  @OneToMany(() => Selection, (selection) => selection.session)
  selections: Selection[];
}
