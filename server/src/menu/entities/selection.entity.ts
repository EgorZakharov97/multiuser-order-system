import { Session } from './session.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DishStatus } from '../enums/dishStatus.enum';
import { Dish } from './dish.entity';
import { Order } from './order.entity';

@Entity('selection')
export class Selection {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'int', default: DishStatus.SELECTED })
  status: DishStatus;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @ManyToOne(() => Dish, (dish) => dish.id, { eager: true })
  dish: Dish;

  @ManyToOne(() => Order, (order) => order.selections)
  order: Order | string;

  @ManyToOne(() => Session, (session) => session.selections, { onDelete: 'CASCADE' })
  session: Session;
}
