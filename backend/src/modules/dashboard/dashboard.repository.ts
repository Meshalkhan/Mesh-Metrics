import { pool } from '../../infrastructure/db/pool';
import { formatCurrency, formatNumber, formatPercent } from '../../core/utils/formatters';
import type { DashboardFilters } from './dashboard.schema';
import {
  CHANNELS,
  REGION_LABELS,
  SEGMENT_LABELS,
  getPeriodWindow,
  pctChange
} from './dashboard.utils';

const PALETTE = {
  primary: '#95BF1F',
  primarySoft: 'rgba(149, 191, 31, 0.18)',
  accent: '#000000',
  accentSoft: 'rgba(0, 0, 0, 0.08)',
  series: ['#95BF1F', '#000000', '#04C373', '#5D7E00', '#A8A8A8']
};

function buildDimensionFilters(filters: DashboardFilters, paramStart: number) {
  const parts: string[] = [];
  const params: unknown[] = [];
  let index = paramStart;

  if (filters.region !== 'all') {
    parts.push(`region = $${index++}`);
    params.push(filters.region);
  }
  if (filters.segment !== 'all') {
    parts.push(`segment = $${index++}`);
    params.push(filters.segment);
  }

  return {
    sql: parts.length ? ` AND ${parts.join(' AND ')}` : '',
    params
  };
}

function accountDimensionFilters(filters: DashboardFilters, paramStart: number) {
  const dim = buildDimensionFilters(filters, paramStart);
  return {
    sql: dim.sql.replace(/\bregion\b/g, 'a.region').replace(/\bsegment\b/g, 'a.segment'),
    params: dim.params
  };
}

export class DashboardRepository {
  async getSnapshot(tenantId: string, filters: DashboardFilters) {
    const window = getPeriodWindow(filters.period);
    const [kpis, charts, table] = await Promise.all([
      this.fetchKpis(tenantId, filters, window),
      this.fetchCharts(tenantId, filters, window),
      this.fetchTopAccounts(tenantId, filters, window)
    ]);

    return {
      filters,
      generatedAt: new Date().toISOString(),
      kpis,
      charts,
      table
    };
  }

  private async fetchKpis(
    tenantId: string,
    filters: DashboardFilters,
    window: ReturnType<typeof getPeriodWindow>
  ) {
    const revenueCurrent = await this.sumRevenue(tenantId, window.start, window.end, filters);
    const revenuePrevious = await this.sumRevenue(tenantId, window.prevStart, window.prevEnd, filters);
    const accountsCurrent = await this.countActiveAccounts(tenantId, filters);
    const accountsPrevious = await this.countActiveAccountsBefore(tenantId, filters, window.prevEnd);
    const dealCurrent = await this.avgDealSize(tenantId, window.start, window.end, filters);
    const dealPrevious = await this.avgDealSize(tenantId, window.prevStart, window.prevEnd, filters);
    const conversionCurrent = await this.conversionRate(tenantId, window.start, window.end, filters);
    const conversionPrevious = await this.conversionRate(
      tenantId,
      window.prevStart,
      window.prevEnd,
      filters
    );

    return [
      {
        id: 'revenue',
        title: 'Total Revenue',
        value: formatCurrency(revenueCurrent / 100),
        trend: pctChange(revenueCurrent, revenuePrevious),
        helper: 'vs previous period'
      },
      {
        id: 'accounts',
        title: 'Active Accounts',
        value: formatNumber(accountsCurrent),
        trend: pctChange(accountsCurrent, accountsPrevious),
        helper: 'paying customers'
      },
      {
        id: 'deal-size',
        title: 'Avg. Deal Size',
        value: formatCurrency(dealCurrent / 100),
        trend: pctChange(dealCurrent, dealPrevious),
        helper: 'rolling period average'
      },
      {
        id: 'conversion',
        title: 'Conversion Rate',
        value: formatPercent(conversionCurrent),
        trend: pctChange(conversionCurrent, conversionPrevious),
        helper: 'lead to opportunity'
      }
    ];
  }

  private async sumRevenue(tenantId: string, start: Date, end: Date, filters: DashboardFilters) {
    const needsJoin = filters.region !== 'all' || filters.segment !== 'all';
    const dim = accountDimensionFilters(filters, 4);
    const join = needsJoin ? ' INNER JOIN accounts a ON a.id = re.account_id AND a.tenant_id = re.tenant_id' : '';

    const result = await pool.query(
      `
      SELECT COALESCE(SUM(re.amount_cents), 0)::bigint AS total
      FROM revenue_events re
      ${join}
      WHERE re.tenant_id = $1
        AND re.occurred_at >= $2
        AND re.occurred_at < $3
        ${needsJoin ? dim.sql : buildDimensionFilters(filters, 4).sql.replace(/\bregion\b/g, 're.region').replace(/\bsegment\b/g, 're.segment')}
      `,
      [tenantId, start, end, ...dim.params]
    );
    return Number(result.rows[0]?.total ?? 0);
  }

  private async countActiveAccounts(tenantId: string, filters: DashboardFilters) {
    const dim = buildDimensionFilters(filters, 2);
    const result = await pool.query(
      `
      SELECT COUNT(*)::int AS total
      FROM accounts
      WHERE tenant_id = $1
        AND status = 'active'
        ${dim.sql}
      `,
      [tenantId, ...dim.params]
    );
    return Number(result.rows[0]?.total ?? 0);
  }

  private async countActiveAccountsBefore(tenantId: string, filters: DashboardFilters, asOf: Date) {
    const dim = buildDimensionFilters(filters, 3);
    const result = await pool.query(
      `
      SELECT COUNT(*)::int AS total
      FROM accounts
      WHERE tenant_id = $1
        AND status = 'active'
        AND created_at <= $2
        ${dim.sql}
      `,
      [tenantId, asOf, ...dim.params]
    );
    return Number(result.rows[0]?.total ?? 0);
  }

  private async avgDealSize(tenantId: string, start: Date, end: Date, filters: DashboardFilters) {
    const needsJoin = filters.region !== 'all' || filters.segment !== 'all';
    const dim = accountDimensionFilters(filters, 4);
    const join = needsJoin ? ' INNER JOIN accounts a ON a.id = re.account_id AND a.tenant_id = re.tenant_id' : '';

    const result = await pool.query(
      `
      SELECT COALESCE(AVG(re.amount_cents), 0)::float AS avg_cents
      FROM revenue_events re
      ${join}
      WHERE re.tenant_id = $1
        AND re.occurred_at >= $2
        AND re.occurred_at < $3
        ${needsJoin ? dim.sql : ''}
      `,
      [tenantId, start, end, ...dim.params]
    );
    return Number(result.rows[0]?.avg_cents ?? 0);
  }

  private async conversionRate(tenantId: string, start: Date, end: Date, filters: DashboardFilters) {
    const dim = buildDimensionFilters(filters, 4);
    const result = await pool.query(
      `
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE converted_at IS NOT NULL)::int AS converted
      FROM leads
      WHERE tenant_id = $1
        AND created_at >= $2
        AND created_at < $3
        ${dim.sql}
      `,
      [tenantId, start, end, ...dim.params]
    );
    const total = Number(result.rows[0]?.total ?? 0);
    const converted = Number(result.rows[0]?.converted ?? 0);
    return total === 0 ? 0 : (converted / total) * 100;
  }

  private async fetchCharts(
    tenantId: string,
    filters: DashboardFilters,
    window: ReturnType<typeof getPeriodWindow>
  ) {
    const needsJoin = filters.region !== 'all' || filters.segment !== 'all';
    const dim = accountDimensionFilters(filters, 4);
    const join = needsJoin ? ' INNER JOIN accounts a ON a.id = re.account_id AND a.tenant_id = re.tenant_id' : '';
    const bucketUnit = filters.period === '7d' ? 'day' : filters.period === '30d' ? 'week' : 'month';

    const trendResult = await pool.query(
      `
      SELECT
        date_trunc('${bucketUnit}', re.occurred_at AT TIME ZONE 'UTC') AS bucket,
        COALESCE(SUM(re.amount_cents), 0)::bigint AS revenue,
        COALESCE(SUM(re.pipeline_amount_cents), 0)::bigint AS pipeline
      FROM revenue_events re
      ${join}
      WHERE re.tenant_id = $1
        AND re.occurred_at >= $2
        AND re.occurred_at < $3
        ${needsJoin ? dim.sql : ''}
      GROUP BY 1
      ORDER BY 1
      `,
      [tenantId, window.start, window.end, ...dim.params]
    );

    const labels = trendResult.rows.map((row) => this.formatBucketLabel(row.bucket, filters.period));
    const revenueSeries = trendResult.rows.map((row) => Math.max(1, Math.round(Number(row.revenue) / 100_000)));
    const pipelineSeries = trendResult.rows.map((row) => Math.max(1, Math.round(Number(row.pipeline) / 100_000)));

    const leadDim = buildDimensionFilters(filters, 4);
    const channelResult = await pool.query(
      `
      SELECT channel, COUNT(*)::int AS total
      FROM leads
      WHERE tenant_id = $1
        AND created_at >= $2
        AND created_at < $3
        ${leadDim.sql}
      GROUP BY channel
      `,
      [tenantId, window.start, window.end, ...leadDim.params]
    );

    const channelMap = new Map(channelResult.rows.map((row) => [row.channel, Number(row.total)]));
    const channelData = CHANNELS.map((channel) => channelMap.get(channel) ?? 0);

    const segmentResult = await pool.query(
      `
      SELECT a.segment, COALESCE(SUM(re.amount_cents), 0)::bigint AS revenue
      FROM revenue_events re
      INNER JOIN accounts a ON a.id = re.account_id AND a.tenant_id = re.tenant_id
      WHERE re.tenant_id = $1
        AND re.occurred_at >= $2
        AND re.occurred_at < $3
        ${dim.sql}
      GROUP BY a.segment
      ORDER BY revenue DESC
      `,
      [tenantId, window.start, window.end, ...dim.params]
    );

    const segmentLabels = segmentResult.rows.map((row) => SEGMENT_LABELS[row.segment] ?? row.segment);
    const segmentValues = segmentResult.rows.map((row) => Math.max(5, Math.round(Number(row.revenue) / 10_000)));

    return {
      revenueTrend: {
        labels,
        datasets: [
          {
            label: 'Revenue (k)',
            data: revenueSeries,
            borderColor: PALETTE.primary,
            backgroundColor: PALETTE.primarySoft,
            tension: 0.4,
            fill: true,
            pointBackgroundColor: PALETTE.primary,
            pointBorderColor: '#ffffff',
            pointRadius: 3,
            pointHoverRadius: 5
          },
          {
            label: 'Pipeline (k)',
            data: pipelineSeries,
            borderColor: PALETTE.accent,
            backgroundColor: PALETTE.accentSoft,
            tension: 0.4,
            fill: true,
            pointBackgroundColor: PALETTE.accent,
            pointBorderColor: '#ffffff',
            pointRadius: 3,
            pointHoverRadius: 5
          }
        ]
      },
      channelPerformance: {
        labels: [...CHANNELS],
        datasets: [
          {
            label: 'Leads',
            data: channelData,
            backgroundColor: PALETTE.series,
            borderRadius: 8,
            borderSkipped: false,
            maxBarThickness: 36
          }
        ]
      },
      segmentBreakdown: {
        labels: segmentLabels.length ? segmentLabels : ['Enterprise', 'Mid-Market', 'SMB'],
        datasets: [
          {
            data: segmentValues.length ? segmentValues : [0, 0, 0],
            backgroundColor: PALETTE.series.slice(0, 3),
            borderColor: '#ffffff',
            borderWidth: 4,
            hoverOffset: 6
          }
        ]
      }
    };
  }

  private formatBucketLabel(bucket: Date, period: DashboardFilters['period']) {
    const date = new Date(bucket);
    if (period === '7d') {
      return date.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' });
    }
    if (period === '30d') {
      return `Week ${Math.min(4, Math.ceil(date.getUTCDate() / 7))}`;
    }
    return date.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' });
  }

  private async fetchTopAccounts(
    tenantId: string,
    filters: DashboardFilters,
    window: ReturnType<typeof getPeriodWindow>
  ) {
    const dim = buildDimensionFilters(filters, 4);

    const result = await pool.query(
      `
      SELECT
        a.id,
        a.name,
        a.region,
        a.segment,
        COALESCE(SUM(re.amount_cents), 0)::bigint AS revenue_cents
      FROM accounts a
      LEFT JOIN revenue_events re
        ON re.account_id = a.id
        AND re.tenant_id = a.tenant_id
        AND re.occurred_at >= $2
        AND re.occurred_at < $3
      WHERE a.tenant_id = $1
        AND a.status = 'active'
        ${dim.sql.replace(/\bregion\b/g, 'a.region').replace(/\bsegment\b/g, 'a.segment')}
      GROUP BY a.id, a.name, a.region, a.segment
      ORDER BY revenue_cents DESC
      LIMIT 5
      `,
      [tenantId, window.start, window.end, ...dim.params]
    );

    const rows = await Promise.all(
      result.rows.map(async (row, index) => {
        const leadDim = buildDimensionFilters(filters, 5);
        const leadStats = await pool.query(
          `
          SELECT
            COUNT(*)::int AS total,
            COUNT(*) FILTER (WHERE converted_at IS NOT NULL)::int AS converted
          FROM leads
          WHERE tenant_id = $1
            AND region = $2
            AND segment = $3
            AND created_at >= $4
            AND created_at < $5
            ${leadDim.sql}
          `,
          [tenantId, row.region, row.segment, window.start, window.end, ...leadDim.params]
        );
        const leads = Number(leadStats.rows[0]?.total ?? 0);
        const converted = Number(leadStats.rows[0]?.converted ?? 0);
        const conversion = leads === 0 ? 0 : (converted / leads) * 100;

        return {
          id: index + 1,
          account: row.name,
          region: REGION_LABELS[row.region] ?? row.region,
          revenue: formatCurrency(Number(row.revenue_cents) / 100),
          conversionRate: formatPercent(conversion)
        };
      })
    );

    return rows;
  }
}
