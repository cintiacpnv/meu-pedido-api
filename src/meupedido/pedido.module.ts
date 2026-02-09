import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pedido } from './pedido.entity';
import { PedidoController } from './pedido.controller';
import { PedidoService } from './pedido.service';
import { PedidoRepository } from './pedido.repository';
import { FilaModule } from '../fila/fila.module';

@Module({
  imports:[TypeOrmModule.forFeature([Pedido]), 
            forwardRef(() => FilaModule)
          ], 
  controllers: [PedidoController],
  providers: [PedidoService],
  exports: [PedidoService],
})
export class PedidoModule {}