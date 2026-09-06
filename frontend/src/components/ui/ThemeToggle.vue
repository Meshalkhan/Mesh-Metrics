<template>
  <button
    type="button"
    class="theme-toggle"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    :title="isDark ? 'Light mode' : 'Dark mode'"
    @click="toggleTheme"
  >
    <BaseIcon :name="isDark ? 'sun' : 'moon'" :size="18" />
  </button>
</template>

<script setup>
import BaseIcon from "./BaseIcon.vue";
import { useUi } from "../../composables/useUi.js";

const { isDark, toggleTheme } = useUi();
</script>

<style scoped>
.theme-toggle {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  background: var(--color-surface-elevated);
  border: 1px solid var(--color-border);
  color: var(--color-text-muted);
  display: grid;
  place-items: center;
  transition: all var(--transition-fast);
  flex-shrink: 0;
}

.theme-toggle:hover {
  background: var(--color-bg-div);
  color: var(--color-text);
}
</style>
