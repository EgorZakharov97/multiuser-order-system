import { Session } from './session.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Selection } from './selection.entity';

@Entity('order')
export class Order {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'text', nullable: false })
  table: string;

  @Column({ type: 'boolean', default: true })
  isOpen: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: string;

  @OneToMany(() => Session, (session) => session.order)
  @JoinColumn()
  session: Session;

  @OneToMany(() => Selection, (selection) => selection.order)
  selections: Selection[];
}
