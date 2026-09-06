import { Request, Response } from 'express';
import { asyncHandler } from '../../core/http/async-handler';
import { dashboardQuerySchema } from './dashboard.schema';
import { DashboardService } from './dashboard.service';

const dashboardService = new DashboardService();

export class DashboardController {
  get = asyncHandler(async (req: Request, res: Response) => {
    const filters = dashboardQuerySchema.parse(req.query);
    const snapshot = await dashboardService.getSnapshot(req.tenantId!, filters);
    res.json(snapshot);
  });
}

export const dashboardController = new DashboardController();
