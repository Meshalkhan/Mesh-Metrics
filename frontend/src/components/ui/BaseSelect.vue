<template>
  <label class="select">
    <span v-if="label" class="select__label">{{ label }}</span>
    <span class="select__field">
      <select :value="modelValue" :disabled="disabled" @change="onChange">
        <option v-for="option in options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      <span class="select__chevron" aria-hidden="true">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </span>
    </span>
  </label>
</template>

<script setup>
defineProps({
  modelValue: { type: [String, Number], required: true },
  options: { type: Array, required: true },
  label: { type: String, default: "" },
  disabled: { type: Boolean, default: false }
});

const emit = defineEmits(["update:modelValue"]);

const onChange = (event) => emit("update:modelValue", event.target.value);
</script>

<style scoped>
.select {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  color: var(--color-text-muted);
}

.select__label {
  font-weight: var(--font-weight-label);
  color: var(--color-text-muted);
  font-size: 14px;
}

.select__field {
  position: relative;
  display: block;
}

.select__field select {
  appearance: none;
  width: 100%;
  padding: 10px 36px 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  font-family: inherit;
  font-size: 14px;
  color: var(--color-text);
  transition: all var(--transition-fast);
  height: 40px;
}

.select__field select:hover {
  border-color: var(--color-border-strong);
}

.select__field select:focus {
  border-color: var(--color-text);
  box-shadow: none;
  outline: none;
}

.select__field select:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: var(--color-bg-div);
}

.select__chevron {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-subtle);
  pointer-events: none;
  display: inline-flex;
}
</style>
