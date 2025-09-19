import {Service} from 'typedi';
import Counter from '../database/models/counter';
import CounterRepository from '../database/repositories/counter';
import {CreateCounterDto} from '../database/models/dtos/counterDto';

@Service()
export class CounterService {
  private readonly counterRepository: CounterRepository;

  constructor() {
    this.counterRepository = new CounterRepository();
  }

  async create(payload: CreateCounterDto): Promise<Counter> {
    const counter = await this.counterRepository.create({
      ip: payload.ip ?? '0.0.0.0',
      os: payload.os ?? null,
      browser: payload.browser ?? null,
      device: payload.device ?? null,
    } as Counter);

    return this.counterRepository.getModel().findByPk(counter.id);
  }
}

export default CounterService;
