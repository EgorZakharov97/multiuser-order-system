import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('category')
export class Category {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'text', nullable: false })
  name: string;
}
