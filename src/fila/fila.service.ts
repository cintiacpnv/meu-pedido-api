import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { StatusPedido } from 'src/meupedido/status-pedido.enum';
import { PedidoService } from 'src/meupedido/pedido.service';

@Injectable()
export class FilaService {
  constructor(
    @Inject(forwardRef(() => PedidoService))
    private readonly pedidoService: PedidoService
  ) {}

  private readonly logger = new Logger(FilaService.name);

  enfileirar(orderId: string) {
    setImmediate(() => this.process(orderId));
  }

  async process(orderId: string) {
    await new Promise(resolve => setTimeout(resolve, 2000));

    await this.pedidoService.updateStatus(orderId);

    this.logger.log(`Pedido ${orderId} processado com sucesso`);
  
  }
  
}