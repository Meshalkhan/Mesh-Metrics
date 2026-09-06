import { Router } from 'express';
import { authorize } from '../../core/middleware/rbac';
import { tenantGuard } from '../../core/middleware/tenant-guard';
import { dashboardController } from './dashboard.controller';

export const dashboardRouter = Router();

dashboardRouter.get(
  '/',
  authorize(['platform_admin', 'tenant_admin', 'manager', 'viewer']),
  tenantGuard,
  dashboardController.get
);
