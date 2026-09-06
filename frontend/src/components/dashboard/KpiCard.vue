<template>
  <article class="kpi" :class="{ 'kpi--loading': loading }">
    <header class="kpi__header">
      <p class="kpi__title">{{ title }}</p>
      <BaseBadge v-if="!loading" :tone="trend >= 0 ? 'success' : 'danger'">
        <BaseIcon :name="trend >= 0 ? 'arrowUp' : 'arrowDown'" :size="12" />
        {{ Math.abs(trend).toFixed(1) }}%
      </BaseBadge>
      <BaseSkeleton v-else width="56px" height="20px" rounded />
    </header>

    <div v-if="!loading" class="kpi__value">{{ value }}</div>
    <BaseSkeleton v-else width="60%" height="28px" />

    <p v-if="!loading && helper" class="kpi__helper">{{ helper }}</p>
    <BaseSkeleton v-else-if="loading" width="40%" height="12px" />
  </article>
</template>

<script setup>
import BaseBadge from "../ui/BaseBadge.vue";
import BaseIcon from "../ui/BaseIcon.vue";
import BaseSkeleton from "../ui/BaseSkeleton.vue";

defineProps({
  title: { type: String, default: "" },
  value: { type: String, default: "" },
  trend: { type: Number, default: 0 },
  helper: { type: String, default: "" },
  loading: { type: Boolean, default: false }
});
</script>

<style scoped>
.kpi {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-6);
  box-shadow: none;
  display: flex;
  flex-direction: column;
  gap: 0;
  min-height: 134px;
  position: relative;
  transition: all var(--transition-base);
  flex: 1;
}

.kpi:hover {
  background: var(--color-text);
  box-shadow: var(--shadow-lg);
}

.kpi:hover .kpi__title,
.kpi:hover .kpi__value,
.kpi:hover .kpi__helper {
  color: #ffffff;
}

.kpi__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-3);
}

.kpi__title {
  font-size: 14px;
  color: var(--color-text-muted);
  font-weight: var(--font-weight-label);
  line-height: 1.2;
  letter-spacing: 0.01em;
  transition: color var(--transition-base);
}

.kpi__value {
  font-size: clamp(1.4rem, 3vw, 1.875rem);
  font-weight: var(--font-weight-header);
  color: var(--color-text);
  letter-spacing: -0.05em;
  line-height: 1.2;
  margin-top: auto;
  padding-top: var(--space-8);
  transition: color var(--transition-base);
}

.kpi__helper {
  font-size: 12px;
  color: var(--color-text-subtle);
  margin-top: var(--space-2);
  transition: color var(--transition-base);
}

.kpi--loading {
  pointer-events: none;
}
</style>
