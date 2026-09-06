<template>
  <BaseCard title="API keys" subtitle="Issued credentials for this tenant">
    <div v-if="!keys.length" class="admin-table__empty">No API keys.</div>
    <div v-else class="admin-table__wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Prefix</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="key in keys" :key="key.id">
            <td>{{ key.name }}</td>
            <td><code class="admin-table__mono">{{ key.key_prefix }}</code></td>
          </tr>
        </tbody>
      </table>
    </div>
  </BaseCard>
</template>

<script setup>
import BaseCard from "../ui/BaseCard.vue";

defineProps({
  keys: { type: Array, default: () => [] }
});
</script>

<style scoped>
.admin-table__wrap {
  overflow-x: auto;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.admin-table th,
.admin-table td {
  padding: 12px 0;
  text-align: left;
  border-bottom: 1px solid var(--color-border);
}

.admin-table th {
  color: var(--color-text-subtle);
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.admin-table__mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 13px;
  background: var(--color-surface-muted);
  padding: 2px 6px;
  border-radius: 4px;
}

.admin-table__empty {
  color: var(--color-text-muted);
  font-size: 14px;
  padding: var(--space-2) 0;
}
</style>
