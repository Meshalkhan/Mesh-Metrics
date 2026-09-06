<template>
  <section :class="['card', { 'card--padded': padded }]">
    <header v-if="$slots.header || $slots.title || title" class="card__header">
      <div class="card__heading">
        <slot name="title">
          <h3 v-if="title" class="card__title">{{ title }}</h3>
          <p v-if="subtitle" class="card__subtitle">{{ subtitle }}</p>
        </slot>
        <slot name="header" />
      </div>
      <div v-if="$slots.actions" class="card__actions">
        <slot name="actions" />
      </div>
    </header>
    <div class="card__body">
      <slot />
    </div>
  </section>
</template>

<script setup>
defineProps({
  title: { type: String, default: "" },
  subtitle: { type: String, default: "" },
  padded: { type: Boolean, default: true }
});
</script>

<style scoped>
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  box-shadow: none;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.card--padded .card__body {
  padding: var(--space-6);
}

.card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  padding: var(--space-6) var(--space-6) 0;
}

.card--padded .card__header + .card__body {
  padding-top: var(--space-4);
}

.card__heading {
  min-width: 0;
  flex: 1;
}

.card__title {
  font-size: clamp(1rem, 2vw, 1.5625rem);
  font-weight: var(--font-weight-header);
  color: var(--color-text);
  line-height: 1.2;
}

.card__subtitle {
  font-size: 14px;
  color: var(--color-text-muted);
  margin-top: 4px;
  letter-spacing: -0.03em;
}

.card__actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
</style>
