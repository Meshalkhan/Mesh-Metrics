<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="['btn', `btn--${variant}`, `btn--${size}`, { 'btn--loading': loading, 'btn--icon': iconOnly }]"
    v-bind="$attrs"
  >
    <span v-if="loading" class="btn__spinner" aria-hidden="true" />
    <slot v-else name="leading" />
    <span v-if="$slots.default" class="btn__label"><slot /></span>
    <slot name="trailing" />
  </button>
</template>

<script setup>
defineOptions({ inheritAttrs: false });

defineProps({
  type: { type: String, default: "button" },
  variant: {
    type: String,
    default: "primary",
    validator: (v) => ["primary", "secondary", "ghost", "danger"].includes(v)
  },
  size: { type: String, default: "md", validator: (v) => ["sm", "md"].includes(v) },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  iconOnly: { type: Boolean, default: false }
});
</script>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: var(--radius-sm);
  font-weight: var(--font-weight-header);
  font-size: 14px;
  letter-spacing: -0.03em;
  transition: all var(--transition-base);
  white-space: nowrap;
  font-family: inherit;
}

.btn--md {
  padding: 12px 24px;
}

.btn--sm {
  padding: 7px 19px;
  font-size: 14px;
  font-weight: var(--font-weight-label);
}

.btn--icon {
  width: 44px;
  height: 44px;
  padding: 0;
  gap: 0;
}

.btn--icon .btn__label {
  display: none;
}

.btn--primary {
  background: #000;
  color: #ffffff;
  border-color: rgba(0, 0, 0, 0.5);
}

.btn--primary:hover:not(:disabled) {
  background: #1f2937;
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.btn--secondary {
  background: var(--color-surface);
  color: var(--color-text);
  border-color: var(--color-text-muted);
}

.btn--secondary:hover:not(:disabled) {
  background: #000;
  color: #ffffff;
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.btn--ghost {
  background: transparent;
  color: var(--color-text-muted);
  border-color: transparent;
}

.btn--ghost:hover:not(:disabled) {
  background: var(--color-bg-div);
  color: var(--color-text);
}

.btn--danger {
  background: var(--color-danger);
  color: #ffffff;
  border-color: var(--color-danger);
}

.btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.btn__spinner {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid currentColor;
  border-top-color: transparent;
  animation: btn-spin 0.7s linear infinite;
}

@keyframes btn-spin {
  to {
    transform: rotate(1turn);
  }
}
</style>
