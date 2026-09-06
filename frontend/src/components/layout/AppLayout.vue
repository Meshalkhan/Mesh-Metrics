<template>
  <div class="app-shell" :class="{ 'app-shell--collapsed': sidebarCollapsed }">
    <div
      v-if="sidebarOpen"
      class="app-shell__overlay"
      aria-hidden="true"
      @click="closeSidebar"
    />
    <AppSidebar :active="activeNav" :open="sidebarOpen" />
    <div class="app-shell__main">
      <slot name="topbar" />
      <main class="app-shell__content" id="main-content">
        <slot />
      </main>
    </div>
    <ToastBanner />
  </div>
</template>

<script setup>
import { watch } from "vue";
import AppSidebar from "./AppSidebar.vue";
import ToastBanner from "../feedback/ToastBanner.vue";
import { useUi } from "../../composables/useUi.js";

defineProps({
  activeNav: { type: String, default: "dashboard" }
});

const { sidebarOpen, sidebarCollapsed, closeSidebar } = useUi();

watch(sidebarOpen, (open) => {
  document.body.style.overflow = open ? "hidden" : "";
});
</script>

<style scoped>
.app-shell {
  display: flex;
  min-height: 100vh;
  background: var(--color-bg);
}

.app-shell__overlay {
  display: none;
}

.app-shell__main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  margin-left: var(--sidebar-width);
  transition: margin-left var(--transition-base);
}

.app-shell--collapsed .app-shell__main {
  margin-left: var(--sidebar-collapsed-width);
}

.app-shell__content {
  flex: 1;
  padding: var(--space-6);
  overflow-x: hidden;
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

@media (max-width: 1024px) {
  .app-shell {
    flex-direction: column;
  }

  .app-shell__main,
  .app-shell--collapsed .app-shell__main {
    margin-left: 0;
  }

  .app-shell__overlay {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.35);
    z-index: 90;
  }

  .app-shell__content {
    padding: var(--space-4);
    margin-top: 0;
    gap: var(--space-4);
  }
}

@media (max-width: 600px) {
  .app-shell__content {
    padding: var(--space-3);
  }
}
</style>
