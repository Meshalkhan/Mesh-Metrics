<template>
  <BaseCard title="Top Accounts" subtitle="Highest revenue contributors in the selected window">
    <template #actions>
      <BaseButton
        variant="secondary"
        size="sm"
        :disabled="!sortedRows.length"
        @click="exportCsv"
      >
        <template #leading><BaseIcon name="download" :size="14" /></template>
        Export CSV
      </BaseButton>
    </template>

    <div class="table" :aria-busy="loading">
      <table>
        <caption class="sr-only">Top accounts by revenue for the current filters</caption>
        <thead>
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              scope="col"
              :class="[
                column.align && `align-${column.align}`,
                column.sortable && 'is-sortable'
              ]"
              @click="column.sortable && toggleSort(column.key)"
            >
              <span class="table__th">
                {{ column.label }}
                <BaseIcon
                  v-if="column.sortable && sortKey === column.key"
                  :name="sortDir === 'asc' ? 'arrowUp' : 'arrowDown'"
                  :size="12"
                />
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-if="loading && !rows.length">
            <tr v-for="n in 4" :key="`sk-${n}`" class="table__skeleton-row">
              <td v-for="col in columns" :key="col.key">
                <BaseSkeleton width="80%" height="14px" />
              </td>
            </tr>
          </template>
          <template v-else-if="sortedRows.length">
            <tr v-for="row in sortedRows" :key="row.id">
              <td>
                <div class="table__account">
                  <span class="table__avatar">{{ getInitials(row.account) }}</span>
                  <span>{{ row.account }}</span>
                </div>
              </td>
              <td>{{ row.region }}</td>
              <td class="align-right">{{ row.revenue }}</td>
              <td class="align-right">{{ row.conversionRate }}</td>
            </tr>
          </template>
          <tr v-else>
            <td :colspan="columns.length" class="table__empty">
              {{ emptyMessage }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </BaseCard>
</template>

<script setup>
import { computed, ref } from "vue";
import BaseCard from "../ui/BaseCard.vue";
import BaseButton from "../ui/BaseButton.vue";
import BaseIcon from "../ui/BaseIcon.vue";
import BaseSkeleton from "../ui/BaseSkeleton.vue";
import { downloadCsv } from "../../utils/csv.js";
import { useUi } from "../../composables/useUi.js";

const props = defineProps({
  rows: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  hasError: { type: Boolean, default: false }
});

const { showToast } = useUi();

const sortKey = ref("revenue");
const sortDir = ref("desc");

const columns = [
  { key: "account", label: "Account", sortable: true },
  { key: "region", label: "Region", sortable: true },
  { key: "revenue", label: "Revenue", align: "right", sortable: true },
  { key: "conversionRate", label: "Conversion", align: "right", sortable: true }
];

const emptyMessage = computed(() => {
  if (props.hasError) return "Accounts unavailable while the dashboard request failed.";
  return "No accounts match the current search or filters.";
});

function parseMetric(value) {
  if (typeof value === "number") return value;
  const cleaned = String(value).replace(/[^0-9.-]/g, "");
  const num = Number(cleaned);
  return Number.isFinite(num) ? num : String(value).toLowerCase();
}

const sortedRows = computed(() => {
  const rows = [...props.rows];
  rows.sort((a, b) => {
    const left = parseMetric(a[sortKey.value]);
    const right = parseMetric(b[sortKey.value]);
    if (left < right) return sortDir.value === "asc" ? -1 : 1;
    if (left > right) return sortDir.value === "asc" ? 1 : -1;
    return 0;
  });
  return rows;
});

function toggleSort(key) {
  if (sortKey.value === key) {
    sortDir.value = sortDir.value === "asc" ? "desc" : "asc";
  } else {
    sortKey.value = key;
    sortDir.value = key === "account" || key === "region" ? "asc" : "desc";
  }
}

function getInitials(name) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function exportCsv() {
  const stamp = new Date().toISOString().slice(0, 10);
  downloadCsv(`meshanalytics-top-accounts-${stamp}.csv`, columns, sortedRows.value);
  showToast("CSV export downloaded.", "success");
}
</script>

<style scoped>
.table {
  margin: 0 calc(var(--space-6) * -1) calc(var(--space-6) * -1);
  overflow-x: auto;
  border-top: 1px solid var(--color-border);
  -webkit-overflow-scrolling: touch;
}

table {
  width: 100%;
  min-width: 560px;
  border-collapse: separate;
  border-spacing: 0;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

thead th {
  text-align: left;
  font-size: 13px;
  font-weight: var(--font-weight-label);
  letter-spacing: 0;
  text-transform: none;
  color: var(--color-text-header);
  padding: 6px 12px;
  height: 49px;
  background: var(--color-bg-div);
  border-bottom: 1px solid var(--color-border);
  white-space: nowrap;
}

thead th.is-sortable {
  cursor: pointer;
  user-select: none;
}

thead th.is-sortable:hover {
  color: var(--color-text);
}

.table__th {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

tbody td {
  padding: 6px 12px;
  border-bottom: 0.6px solid #dadada;
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text);
  min-height: 45px;
}

tbody tr:last-child td {
  border-bottom: none;
}

tbody tr:hover td {
  background: var(--color-bg-div);
}

.align-right {
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.table__account {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: var(--font-weight-label);
  min-width: 0;
}

.table__avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--color-text);
  color: #ffffff;
  font-size: 11px;
  font-weight: var(--font-weight-header);
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.table__empty {
  text-align: center;
  color: var(--color-text-subtle);
  padding: 32px 20px;
  font-size: 14px;
}
</style>
