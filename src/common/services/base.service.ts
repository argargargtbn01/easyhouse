import { DeleteResult, Repository } from 'typeorm';
import { EntityId } from 'typeorm/repository/EntityId';
import { IBaseService } from './base.service.interface';

export class BaseService<T, R extends Repository<T>> implements IBaseService<T> {
  protected readonly repository: R;

  constructor(repository: R) {
    this.repository = repository;
  }

  findAll(): Promise<T[]> {
    return this.repository.find();
  }

  findById(id: any): Promise<T> {
    return this.repository.findOne(id);
  }

  create(data: any): Promise<T> {
    return this.repository.save(data);
  }

  async update(id: EntityId, data: any): Promise<T> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  delete(id: EntityId): Promise<DeleteResult> {
    return this.repository.delete(id);
  }
}
