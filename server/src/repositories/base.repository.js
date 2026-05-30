export class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  create(data) {
    return this.model.create(data);
  }

  findAll(filter = {}, options = {}) {
    const page = Number(options.page || 1);
    const limit = Math.min(Number(options.limit || 20), 100);
    const skip = (page - 1) * limit;
    return this.model
      .find(filter)
      .sort(options.sort || '-createdAt')
      .skip(skip)
      .limit(limit)
      .populate(options.populate || []);
  }

  count(filter = {}) {
    return this.model.countDocuments(filter);
  }

  findById(id, populate = []) {
    return this.model.findById(id).populate(populate);
  }

  updateById(id, data) {
    return this.model.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  deleteById(id) {
    return this.model.findByIdAndDelete(id);
  }
}
