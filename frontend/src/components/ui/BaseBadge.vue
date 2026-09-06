<template>
  <span :class="['badge', `badge--${tone}`]">
    <slot />
  </span>
</template>

<script setup>
defineProps({
  tone: {
    type: String,
    default: "neutral",
    validator: (v) => ["neutral", "success", "danger", "info"].includes(v)
  }
});
</script>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 30px;
  padding: 6px 16px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0.015em;
  line-height: 1.47;
  white-space: nowrap;
}

.badge--neutral {
  background: #e2e2e2;
  color: #000000;
  border: none;
}

.badge--success {
  background: var(--color-success-soft);
  color: var(--color-success);
}

.badge--danger {
  background: var(--color-danger-soft);
  color: var(--color-danger);
}

.badge--info {
  background: var(--color-primary-soft);
  color: var(--color-primary);
}
</style>
