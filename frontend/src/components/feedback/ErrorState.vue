<template>
  <div class="error-state" role="alert">
    <div class="error-state__icon">
      <BaseIcon name="alert" :size="22" />
    </div>
    <div class="error-state__copy">
      <h3>{{ title }}</h3>
      <p>{{ message }}</p>
    </div>
    <BaseButton variant="primary" size="sm" @click="$emit('retry')">
      <template #leading><BaseIcon name="refresh" :size="14" /></template>
      Retry
    </BaseButton>
  </div>
</template>

<script setup>
import BaseIcon from "../ui/BaseIcon.vue";
import BaseButton from "../ui/BaseButton.vue";

defineProps({
  title: { type: String, default: "We couldn't load your dashboard" },
  message: { type: String, default: "Please retry, or check that the analytics service is online." }
});

defineEmits(["retry"]);
</script>

<style scoped>
.error-state {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-5) var(--space-6);
  background: var(--color-danger-soft);
  border: 1px solid rgba(255, 0, 4, 0.2);
  border-radius: var(--radius-sm);
  color: var(--color-text);
}

.error-state__icon {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-sm);
  background: rgba(255, 0, 4, 0.12);
  color: var(--color-danger);
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.error-state__copy h3 {
  font-size: 14px;
  font-weight: var(--font-weight-header);
}

.error-state__copy p {
  font-size: 12px;
  color: var(--color-text-muted);
  margin-top: 2px;
}

.error-state__copy {
  flex: 1;
  min-width: 0;
}

@media (max-width: 640px) {
  .error-state {
    flex-wrap: wrap;
  }

  .error-state__copy {
    flex: 1 1 180px;
  }
}
</style>
