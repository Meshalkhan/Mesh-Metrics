import type { DashboardFilters } from './dashboard.schema';

export interface PeriodWindow {
  start: Date;
  end: Date;
  prevStart: Date;
  prevEnd: Date;
  days: number;
}

export function getPeriodWindow(period: DashboardFilters['period']): PeriodWindow {
  const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
  const end = new Date();
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - days);
  const prevEnd = new Date(start);
  const prevStart = new Date(prevEnd);
  prevStart.setUTCDate(prevStart.getUTCDate() - days);
  return { start, end, prevStart, prevEnd, days };
}

export function pctChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Number((((current - previous) / previous) * 100).toFixed(1));
}

export const REGION_LABELS: Record<string, string> = {
  'north-america': 'North America',
  emea: 'EMEA',
  apac: 'APAC',
  latam: 'LATAM'
};

export const SEGMENT_LABELS: Record<string, string> = {
  enterprise: 'Enterprise',
  'mid-market': 'Mid-Market',
  smb: 'SMB'
};

export const CHANNELS = ['Paid Search', 'Direct', 'Partners', 'Outbound', 'Email'] as const;
