import { BaseRepository } from '../repositories/base.repository.js';
import { CrudService } from '../services/crud.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { writeAuditLog } from '../middlewares/audit.middleware.js';

export const createCrudController = ({ model, entityName, populate = [] }) => {
  const service = new CrudService(new BaseRepository(model), entityName);

  return {
    create: asyncHandler(async (req, res) => {
      const item = await service.create(req.body);
      await writeAuditLog({ req, action: `${entityName.toLowerCase()}.create`, entityType: entityName, entityId: item._id });
      res.status(201).json({ success: true, data: item });
    }),

    list: asyncHandler(async (req, res) => {
      const { page, limit, sort, search, ...filter } = req.query;
      const cleanFilter = Object.fromEntries(Object.entries(filter).filter(([, value]) => value !== undefined && value !== ''));

      if (search) {
        cleanFilter.name = { $regex: search, $options: 'i' };
      }

      const data = await service.list(cleanFilter, { page, limit, sort, populate });
      res.json({ success: true, data });
    }),

    get: asyncHandler(async (req, res) => {
      const item = await service.get(req.params.id, populate);
      res.json({ success: true, data: item });
    }),

    update: asyncHandler(async (req, res) => {
      const item = await service.update(req.params.id, req.body);
      await writeAuditLog({ req, action: `${entityName.toLowerCase()}.update`, entityType: entityName, entityId: item._id });
      res.json({ success: true, data: item });
    }),

    remove: asyncHandler(async (req, res) => {
      const item = await service.remove(req.params.id);
      await writeAuditLog({ req, action: `${entityName.toLowerCase()}.delete`, entityType: entityName, entityId: item._id });
      res.json({ success: true, data: item });
    })
  };
};
