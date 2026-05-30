import { ApiError } from '../utils/apiError.js';

export class CrudService {
  constructor(repository, entityName) {
    this.repository = repository;
    this.entityName = entityName;
  }

  async create(data) {
    return this.repository.create(data);
  }

  async list(filter, options) {
    const [items, total] = await Promise.all([
      this.repository.findAll(filter, options),
      this.repository.count(filter)
    ]);

    return {
      items,
      pagination: {
        page: Number(options.page || 1),
        limit: Number(options.limit || 20),
        total
      }
    };
  }

  async get(id, populate) {
    const item = await this.repository.findById(id, populate);
    if (!item) throw new ApiError(404, `${this.entityName} not found`);
    return item;
  }

  async update(id, data) {
    const item = await this.repository.updateById(id, data);
    if (!item) throw new ApiError(404, `${this.entityName} not found`);
    return item;
  }

  async remove(id) {
    const item = await this.repository.deleteById(id);
    if (!item) throw new ApiError(404, `${this.entityName} not found`);
    return item;
  }
}
