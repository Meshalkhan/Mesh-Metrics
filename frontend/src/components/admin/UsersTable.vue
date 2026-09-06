<template>
  <BaseCard title="Users" subtitle="Tenant members">
    <div v-if="!users.length" class="admin-table__empty">No users in this tenant.</div>
    <div v-else class="admin-table__wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.email }}</td>
            <td><BaseBadge tone="info">{{ user.role }}</BaseBadge></td>
          </tr>
        </tbody>
      </table>
    </div>
  </BaseCard>
</template>

<script setup>
import BaseBadge from "../ui/BaseBadge.vue";
import BaseCard from "../ui/BaseCard.vue";

defineProps({
  users: { type: Array, default: () => [] }
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

.admin-table__empty {
  color: var(--color-text-muted);
  font-size: 14px;
  padding: var(--space-2) 0;
}
</style>
