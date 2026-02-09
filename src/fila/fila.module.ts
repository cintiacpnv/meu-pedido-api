import { forwardRef, Module } from '@nestjs/common';
import { FilaService } from './fila.service';
import { PedidoModule } from 'src/meupedido/pedido.module';

@Module({
  imports: [forwardRef(() => PedidoModule)],
  providers: [FilaService],
  exports: [FilaService], 
})
export class FilaModule {}