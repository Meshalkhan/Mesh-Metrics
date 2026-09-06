<template>
  <Transition name="toast">
    <div v-if="toast" class="toast" :class="`toast--${toast.tone}`" role="status">
      <span class="toast__dot" aria-hidden="true" />
      <p>{{ toast.message }}</p>
      <button type="button" class="toast__close" aria-label="Dismiss" @click="clearToast">×</button>
    </div>
  </Transition>
</template>

<script setup>
import { watch } from "vue";
import { useUi } from "../../composables/useUi.js";

const { toast, clearToast } = useUi();

let timer;

watch(
  toast,
  (next) => {
    if (timer) clearTimeout(timer);
    if (!next) return;
    timer = setTimeout(() => clearToast(), 3200);
  },
  { deep: true }
);
</script>

<style scoped>
.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1200;
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: min(360px, calc(100vw - 32px));
  padding: 12px 14px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  box-shadow: var(--shadow-md);
  font-size: 13px;
  font-weight: 500;
  line-height: 1.4;
}

.toast__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  background: var(--color-text-subtle);
}

.toast p {
  flex: 1;
  margin: 0;
}

.toast--success {
  background: var(--color-success-soft);
  border-color: rgba(4, 195, 115, 0.25);
  color: #047857;
}

.toast--success .toast__dot {
  background: var(--color-success);
}

.toast--info {
  background: var(--color-primary-soft);
  border-color: rgba(149, 191, 31, 0.35);
  color: #5d7e00;
}

.toast--info .toast__dot {
  background: var(--color-primary);
}

.toast--error,
.toast--danger {
  background: var(--color-danger-soft);
  border-color: rgba(255, 0, 4, 0.25);
  color: var(--color-danger);
}

.toast--error .toast__dot,
.toast--danger .toast__dot {
  background: var(--color-danger);
}

.toast__close {
  border: none;
  background: transparent;
  color: inherit;
  font-size: 18px;
  line-height: 1;
  padding: 0 2px;
  cursor: pointer;
  opacity: 0.7;
}

.toast__close:hover {
  opacity: 1;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.2s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@media (max-width: 600px) {
  .toast {
    left: 16px;
    right: 16px;
    top: 16px;
    max-width: none;
  }
}
</style>
