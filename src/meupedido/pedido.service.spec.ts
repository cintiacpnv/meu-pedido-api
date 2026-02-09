import { Test, TestingModule } from '@nestjs/testing';
import { PedidoService } from './pedido.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Pedido } from './pedido.entity';
import { Repository } from 'typeorm';
import { FilaService } from '../fila/fila.service';
import { ConflictException } from '@nestjs/common';
import { StatusPedido } from './status-pedido.enum';

describe('PedidoService', () => {
  let service: PedidoService;
  let repository: Repository<Pedido>;
  let filaService: FilaService;

  const mockPedidoRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
  };

  const mockFilaService = {
    enfileirar: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PedidoService,
        {
          provide: getRepositoryToken(Pedido),
          useValue: mockPedidoRepository,
        },
        {
          provide: FilaService,
          useValue: mockFilaService,
        },
      ],
    }).compile();

    service = module.get<PedidoService>(PedidoService);
    repository = module.get<Repository<Pedido>>(getRepositoryToken(Pedido));
    filaService = module.get<FilaService>(FilaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ===============================
  // criarPedido
  // ===============================

  it('deve criar um pedido com status PENDING e enfileirar', async () => {
    mockPedidoRepository.findOne.mockResolvedValue(null);

    const pedidoSalvo = {
      id: '1',
      orderId: '123',
      status: StatusPedido.PENDING,
    };

    mockPedidoRepository.save.mockResolvedValue(pedidoSalvo);

    const result = await service.criarPedido({
      orderId: '123',
      total: 100,
      customer: 'Cliente Teste',
    });

    expect(repository.findOne).toHaveBeenCalledWith({
      where: { orderId: '123' },
    });

    expect(repository.save).toHaveBeenCalledWith({
      orderId: '123',
      total: 100,
      customer: 'Cliente Teste',
      status: StatusPedido.PENDING,
    });

    expect(filaService.enfileirar).toHaveBeenCalledWith('1');
    expect(result).toEqual(pedidoSalvo);
  });

  it('deve lançar ConflictException se o pedido já existir', async () => {
    mockPedidoRepository.findOne.mockResolvedValue({
      id: '1',
      orderId: '123',
    });

    await expect(
      service.criarPedido({
        orderId: '123',
        total: 100,
        customer: 'Cliente Teste',
      }),
    ).rejects.toThrow(ConflictException);

    expect(repository.save).not.toHaveBeenCalled();
    expect(filaService.enfileirar).not.toHaveBeenCalled();
  });

  // ===============================
  // listarPedidos
  // ===============================

  it('deve listar todos os pedidos', async () => {
    const pedidos = [
      { id: '1', orderId: '111' },
      { id: '2', orderId: '222' },
    ];

    mockPedidoRepository.find.mockResolvedValue(pedidos);

    const result = await service.listarPedidos();

    expect(repository.find).toHaveBeenCalled();
    expect(result).toEqual(pedidos);
  });

  // ===============================
  // updateStatus
  // ===============================

  it('deve atualizar o status do pedido para PROCESSED', async () => {
    mockPedidoRepository.update.mockResolvedValue(undefined);

    await service.updateStatus('1');

    expect(repository.update).toHaveBeenCalledWith('1', {
      status: StatusPedido.PROCESSED,
    });
  });
});