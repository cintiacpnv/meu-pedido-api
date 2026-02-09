import { Body, Controller, Get, Post } from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { PedidoDto } from './dto/pedidoDto.dto';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('Orders')
@Controller('orders')
export class PedidoController {
  constructor(private readonly pedidoService: PedidoService) {}

  
  @Post()
  @ApiResponse({ status: 201, description: 'Pedido criado com sucesso' })
  @ApiResponse({ status: 409, description: 'Pedido duplicado' })
  create(@Body() dto: PedidoDto) {
    return this.pedidoService.criarPedido(dto);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Lista de pedidos' })
  findAll() {
    return this.pedidoService.listarPedidos();
  }
}