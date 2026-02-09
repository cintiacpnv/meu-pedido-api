import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PedidoModule } from './meupedido/pedido.module';
import { Pedido } from './meupedido/pedido.entity';
import { FilaModule } from './fila/fila.module';

@Module({
  imports: [TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [Pedido],
      synchronize: true,
    }),
    PedidoModule, FilaModule,
  ],
})
export class AppModule {}
