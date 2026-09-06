<template>
  <section class="admin-view">
    <ErrorState
      v-if="error && !hasData"
      :message="error"
      @retry="refresh"
    />

    <div v-else class="admin-view__stack" :aria-busy="isLoading">
      <ErrorState
        v-if="error && hasData"
        title="Couldn't refresh admin data"
        :message="error"
        @retry="refresh"
      />

      <template v-if="section === 'admin-overview'">
        <OpsMetricsGrid :cards="opsCards" />
        <UsersTable :users="users" />
        <ApiKeysTable :keys="apiKeys" />
      </template>

      <template v-else-if="section === 'admin-ops'">
        <OpsMetricsGrid :cards="opsCards" />
      </template>

      <template v-else-if="section === 'admin-users'">
        <UsersTable :users="users" />
      </template>

      <template v-else-if="section === 'admin-api-keys'">
        <ApiKeysTable :keys="apiKeys" />
      </template>
    </div>
  </section>
</template>

<script setup>
import { onMounted, watch } from "vue";
import ApiKeysTable from "../components/admin/ApiKeysTable.vue";
import OpsMetricsGrid from "../components/admin/OpsMetricsGrid.vue";
import UsersTable from "../components/admin/UsersTable.vue";
import ErrorState from "../components/feedback/ErrorState.vue";
import { useAdminStore } from "../stores/admin.store.js";
import { storeToRefs } from "pinia";

const props = defineProps({
  section: { type: String, required: true },
  refreshKey: { type: Number, default: 0 }
});

const adminStore = useAdminStore();
const { users, apiKeys, opsCards, error, isLoading, hasData } = storeToRefs(adminStore);

async function refresh() {
  await adminStore.loadWorkspace();
}

onMounted(refresh);

watch(
  () => props.refreshKey,
  () => {
    refresh();
  }
);

watch(
  () => props.section,
  () => {
    if (!hasData.value && !isLoading.value) refresh();
  }
);
</script>

<style scoped>
.admin-view {
  width: 100%;
  min-width: 0;
}

.admin-view__stack {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}
</style>
