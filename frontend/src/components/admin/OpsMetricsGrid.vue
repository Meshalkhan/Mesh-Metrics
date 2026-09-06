<template>
  <div class="ops-metrics">
    <article v-for="card in cards" :key="card.metric" class="ops-metrics__card">
      <p class="ops-metrics__label">{{ metricTitle(card.metric) }}</p>
      <p class="ops-metrics__value">{{ card.value }}</p>
    </article>
  </div>
</template>

<script setup>
defineProps({
  cards: { type: Array, default: () => [] }
});

const labels = {
  activeUsers: "Active users",
  requests24h: "Requests (24h)",
  errorRate: "Error rate",
  apiKeys: "API keys"
};

function metricTitle(metric) {
  return labels[metric] || metric;
}
</script>

<style scoped>
.ops-metrics {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}

.ops-metrics__card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-6);
}

.ops-metrics__label {
  margin: 0 0 var(--space-2);
  font-size: 13px;
  color: var(--color-text-muted);
}

.ops-metrics__value {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: var(--color-text);
}

@media (max-width: 1180px) {
  .ops-metrics {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 600px) {
  .ops-metrics {
    grid-template-columns: 1fr;
  }
}
</style>
