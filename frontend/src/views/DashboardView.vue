<template>
  <AppLayout :active-nav="activeNav">
    <template #topbar>
      <AppTopbar
        :breadcrumb="topbarMeta.breadcrumb"
        :title="topbarMeta.title"
        :subtitle="topbarMeta.subtitle"
      >
        <template #actions>
          <BaseButton
            v-if="activeNav !== 'dashboard' && !isAdminNav"
            variant="secondary"
            size="md"
            icon-only
            aria-label="Back to Dashboard"
            title="Back to Dashboard"
            @click="setActiveNav('dashboard')"
          >
            <template #leading><BaseIcon name="arrowLeft" :size="18" /></template>
          </BaseButton>
          <BaseButton
            v-else-if="isAdminNav"
            variant="secondary"
            size="md"
            :loading="adminLoading"
            @click="refreshAdmin"
          >
            <template #leading><BaseIcon name="refresh" :size="16" /></template>
            Refresh
          </BaseButton>
          <BaseButton
            v-else
            variant="secondary"
            size="md"
            :loading="isLoading"
            @click="refresh"
          >
            <template #leading><BaseIcon name="refresh" :size="16" /></template>
            Refresh
          </BaseButton>
        </template>
      </AppTopbar>
    </template>

    <AdminView
      v-if="isAdminNav"
      :section="activeNav"
      :refresh-key="adminRefreshKey"
    />

    <SectionView
      v-else-if="activeNav !== 'dashboard'"
      :section="activeNav"
    />

    <template v-else>
      <ErrorState
        v-if="error && !hasData"
        class="dashboard__error"
        :message="error"
        @retry="refresh"
      />

      <section class="dashboard" :aria-busy="isLoading">
        <FiltersPanel
          :filters="filters"
          :loading="isLoading"
          :last-updated="lastUpdated || ''"
          @apply="onApplyFilters"
          @reset="onResetFilters"
        />

        <div class="dashboard__content">
          <ErrorState
            v-if="error && hasData"
            class="dashboard__inline-error"
            title="Couldn’t refresh analytics"
            :message="error"
            @retry="refresh"
          />

          <KpiGrid :kpis="filteredKpis" :loading="isLoading && !hasData" />

          <div class="dashboard__charts">
            <ChartCard
              title="Revenue Trend"
              :subtitle="revenueSubtitle"
              :loading="isLoading && !hasData"
              :height="300"
            >
              <LineAnalyticsChart v-if="hasData" :data="charts.revenueTrend" />
              <p v-else-if="!isLoading" class="dashboard__empty">No trend data yet.</p>
            </ChartCard>

            <ChartCard
              title="Channel Performance"
              subtitle="Lead volume by acquisition source"
              :loading="isLoading && !hasData"
            >
              <BarAnalyticsChart v-if="hasData" :data="charts.channelPerformance" />
              <p v-else-if="!isLoading" class="dashboard__empty">No channel data yet.</p>
            </ChartCard>

            <ChartCard
              title="Segment Breakdown"
              subtitle="Revenue contribution by segment"
              :loading="isLoading && !hasData"
            >
              <DoughnutAnalyticsChart v-if="hasData" :data="charts.segmentBreakdown" />
              <p v-else-if="!isLoading" class="dashboard__empty">No segment data yet.</p>
            </ChartCard>
          </div>

          <AnalyticsTable
            :rows="filteredTable"
            :loading="isLoading && !hasData"
            :has-error="Boolean(error)"
          />
        </div>
      </section>
    </template>
  </AppLayout>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import AppLayout from "../components/layout/AppLayout.vue";
import AppTopbar from "../components/layout/AppTopbar.vue";
import BaseButton from "../components/ui/BaseButton.vue";
import BaseIcon from "../components/ui/BaseIcon.vue";
import KpiGrid from "../components/dashboard/KpiGrid.vue";
import FiltersPanel from "../components/dashboard/FiltersPanel.vue";
import ChartCard from "../components/dashboard/ChartCard.vue";
import AnalyticsTable from "../components/dashboard/AnalyticsTable.vue";
import ErrorState from "../components/feedback/ErrorState.vue";
import LineAnalyticsChart from "../charts/LineAnalyticsChart.vue";
import BarAnalyticsChart from "../charts/BarAnalyticsChart.vue";
import DoughnutAnalyticsChart from "../charts/DoughnutAnalyticsChart.vue";
import SectionView from "./SectionView.vue";
import AdminView from "./AdminView.vue";
import { useDashboard } from "../composables/useDashboard.js";
import { useUi } from "../composables/useUi.js";
import { useAdminStore } from "../stores/admin.store.js";
import { PERIOD_OPTIONS } from "../constants/filters.js";

const {
  filters,
  kpis,
  charts,
  table,
  error,
  lastUpdated,
  isLoading,
  hasData,
  loadDashboard,
  updateFilters,
  resetFilters
} = useDashboard();

const adminStore = useAdminStore();
const { isLoading: adminLoading } = storeToRefs(adminStore);
const adminRefreshKey = ref(0);

const { activeNav, searchQuery, setActiveNav, showToast } = useUi();

const ADMIN_NAV_IDS = new Set(["admin-overview", "admin-ops", "admin-users", "admin-api-keys"]);
const isAdminNav = computed(() => ADMIN_NAV_IDS.has(activeNav.value));

const topbarMeta = computed(() => {
  const map = {
    dashboard: {
      breadcrumb: "Workspace / Insights",
      title: "Revenue Performance",
      subtitle: "Track pipeline health, conversion velocity, and account growth across regions."
    },
    "admin-overview": {
      breadcrumb: "Workspace / Administration",
      title: "Admin overview",
      subtitle: "Platform metrics, tenant users, and API keys."
    },
    "admin-ops": {
      breadcrumb: "Workspace / Administration",
      title: "Platform metrics",
      subtitle: "Operational summary from MeshCore."
    },
    "admin-users": {
      breadcrumb: "Workspace / Administration",
      title: "Users",
      subtitle: "Members scoped to the active tenant."
    },
    "admin-api-keys": {
      breadcrumb: "Workspace / Administration",
      title: "API keys",
      subtitle: "Issued credentials for programmatic access."
    },
    reports: {
      breadcrumb: "Workspace / Insights",
      title: "Reports",
      subtitle: "Schedule packs and share analytics with your team."
    },
    customers: {
      breadcrumb: "Workspace / Insights",
      title: "Customers",
      subtitle: "Account health and expansion signals."
    },
    segments: {
      breadcrumb: "Workspace / Insights",
      title: "Segments",
      subtitle: "Cohort definitions that power dashboard KPIs."
    },
    settings: {
      breadcrumb: "Workspace / Admin",
      title: "Settings",
      subtitle: "Workspace preferences and defaults."
    }
  };
  return map[activeNav.value] || map.dashboard;
});

const revenueSubtitle = computed(() => {
  const period = PERIOD_OPTIONS.find((option) => option.value === filters.value.period);
  return `${period?.label || "Selected period"} performance vs pipeline`;
});

const query = computed(() => searchQuery.value.trim().toLowerCase());

const filteredKpis = computed(() => {
  if (!query.value) return kpis.value;
  return kpis.value.filter(
    (kpi) =>
      kpi.title.toLowerCase().includes(query.value) ||
      String(kpi.value).toLowerCase().includes(query.value) ||
      String(kpi.helper || "")
        .toLowerCase()
        .includes(query.value)
  );
});

const filteredTable = computed(() => {
  if (!query.value) return table.value;
  return table.value.filter(
    (row) =>
      row.account.toLowerCase().includes(query.value) ||
      row.region.toLowerCase().includes(query.value) ||
      String(row.revenue).toLowerCase().includes(query.value) ||
      String(row.conversionRate).toLowerCase().includes(query.value)
  );
});

async function refreshAdmin() {
  adminRefreshKey.value += 1;
}

async function refresh() {
  await loadDashboard();
  if (!error.value) showToast("Dashboard data refreshed.", "success");
  else showToast(error.value, "error");
}

async function onApplyFilters(next) {
  await updateFilters(next);
  if (!error.value) showToast("Filters applied.", "success");
  else showToast(error.value, "error");
}

async function onResetFilters() {
  await resetFilters();
  if (!error.value) showToast("Filters reset.", "info");
  else showToast(error.value, "error");
}

onMounted(loadDashboard);
</script>

<style scoped>
.dashboard {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  gap: 10px;
  align-items: start;
}

.dashboard__content {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  min-width: 0;
}

.dashboard__charts {
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-auto-rows: minmax(0, auto);
  gap: 10px;
}

.dashboard__charts > :first-child {
  grid-column: 1 / -1;
}

.dashboard__error,
.dashboard__inline-error {
  margin-bottom: 0;
}

.dashboard__empty {
  display: grid;
  place-items: center;
  height: 100%;
  color: var(--color-text-subtle);
  font-size: 13px;
}

@media (max-width: 1180px) {
  .dashboard {
    grid-template-columns: 1fr;
  }

  .dashboard__charts {
    grid-template-columns: 1fr;
  }

  .dashboard__charts > :first-child {
    grid-column: auto;
  }
}

@media (max-width: 600px) {
  .dashboard__content {
    gap: var(--space-4);
  }
}
</style>
