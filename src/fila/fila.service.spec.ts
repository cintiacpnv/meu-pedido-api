import { Test, TestingModule } from '@nestjs/testing';
import { FilaService } from './fila.service';
import { PedidoService } from 'src/meupedido/pedido.service';

describe('FilaService', () => {
  let service: FilaService;
  let pedidoService: PedidoService;

  const mockPedidoService = {
    updateStatus: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilaService,
        {
          provide: PedidoService,
          useValue: mockPedidoService,
        },
      ],
    }).compile();

    service = module.get<FilaService>(FilaService);
    pedidoService = module.get<PedidoService>(PedidoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ===============================
  // enfileirar
  // ===============================

  it('deve enfileirar e chamar process', () => {
    const spyProcess = jest
        .spyOn(service, 'process')
        .mockResolvedValue(undefined);

    const immediateSpy = jest
        .spyOn(global, 'setImmediate')
        .mockImplementation((fn: any) => {
        fn();
        return {} as any;
        });

    service.enfileirar('123');

    expect(spyProcess).toHaveBeenCalledWith('123');

    immediateSpy.mockRestore();
  });


  // ===============================
  // process
  // ===============================

  it('deve processar o pedido após 2 segundos e atualizar o status', async () => {
    jest.useFakeTimers();

    const promise = service.process('123');

    // Avança o tempo em 2 segundos
    jest.advanceTimersByTime(2000);

    await promise;

    expect(pedidoService.updateStatus).toHaveBeenCalledWith('123');
  });

  it('deve registrar log após processar o pedido', async () => {
    jest.useFakeTimers();

    const loggerSpy = jest
      .spyOn(service['logger'], 'log')
      .mockImplementation();

    const promise = service.process('456');

    jest.advanceTimersByTime(2000);
    await promise;

    expect(loggerSpy).toHaveBeenCalledWith(
      'Pedido 456 processado com sucesso',
    );
  });
});