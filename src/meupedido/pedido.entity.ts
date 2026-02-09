import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { StatusPedido } from './status-pedido.enum';

@Entity('pedido')
export class Pedido {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  orderId: string;

  @Column()
  customer: string;

  @Column('decimal')
  total: number;

  @Column({type: 'text', default: StatusPedido.PENDING })
  status: StatusPedido;

  @CreateDateColumn()
  createdAt: Date;
}