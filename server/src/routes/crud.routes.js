import { Router } from 'express';
import { authorize, organizationScope, protect } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { mongoIdParam } from '../validators/domain.validator.js';

export const buildCrudRouter = ({ controller, roles = ['super_admin', 'admin'], createRules = [] }) => {
  const router = Router();

  router.use(protect, organizationScope);
  router.get('/', controller.list);
  router.get('/:id', mongoIdParam, validate, controller.get);
  router.post('/', authorize(...roles), createRules, validate, controller.create);
  router.put('/:id', authorize(...roles), mongoIdParam, validate, controller.update);
  router.delete('/:id', authorize(...roles), mongoIdParam, validate, controller.remove);

  return router;
};
