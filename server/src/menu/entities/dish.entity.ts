import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from './category.entity';

@Entity('dish')
export class Dish {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'float' })
  price: number;

  @Column({ type: 'text' })
  description: string;

  @ManyToOne(() => Category, (category) => category.id)
  category: Category | string;
}
