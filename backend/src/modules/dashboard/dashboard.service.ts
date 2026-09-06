import { DashboardRepository } from './dashboard.repository';
import type { DashboardFilters } from './dashboard.schema';

const dashboardRepository = new DashboardRepository();

export class DashboardService {
  getSnapshot(tenantId: string, filters: DashboardFilters) {
    return dashboardRepository.getSnapshot(tenantId, filters);
  }
}
