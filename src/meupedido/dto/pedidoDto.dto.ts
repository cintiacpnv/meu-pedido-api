import { ApiProperty } from "@nestjs/swagger";

export class PedidoDto {
  @ApiProperty({
    description: 'Código do pedido',
    example: '123456', 
  })
  orderId: string;

  @ApiProperty({
    description: 'Nome do cliente',
    example: 'Paulo', 
  })
  customer: string;

  @ApiProperty({
    description: 'Valor do pedido',
    example: '199.90', 
  })
  total: number;
}