import { ConflictException, forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { StatusPedido } from './status-pedido.enum';
import { FilaService } from '../fila/fila.service';
import { PedidoDto } from './dto/pedidoDto.dto';
import { PedidoRepository } from './pedido.repository';
import { Pedido } from './pedido.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PedidoService {
  constructor(
    @InjectRepository(Pedido)
    private readonly pedidoRepository: Repository<Pedido>,

    @Inject(forwardRef(() => FilaService))
    private readonly filaService: FilaService,
  ) {}

  private readonly logger = new Logger(PedidoService.name);

  async criarPedido(dto: PedidoDto) {
    const exists = await this.pedidoRepository.findOne({
    where: { orderId: dto.orderId },
    });

    if (exists) {
      throw new ConflictException('Pedido já existente');
    }

    const pedido = await this.pedidoRepository.save({...dto, status: StatusPedido.PENDING});

    this.logger.log(`Pedido ${pedido.id} pendente de processamento`);
   
    this.filaService.enfileirar(pedido.id);

    return pedido;
  }

  listarPedidos() {
    this.logger.log(`Listando pedidos`);
    return this.pedidoRepository.find();
  }

  async updateStatus(id: string): Promise<void> {
    await this.pedidoRepository.update(id, { status : StatusPedido.PROCESSED });
  }
}