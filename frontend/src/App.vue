<template>
  <LoginView v-if="!authenticated" @success="onLoginSuccess" />
  <DashboardView v-else />
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import DashboardView from "./views/DashboardView.vue";
import LoginView from "./views/LoginView.vue";
import { useAuthStore } from "./stores/auth.store.js";
import { useUiStore } from "./stores/ui.store.js";
import { getStoredTheme } from "./lib/theme.js";

const auth = useAuthStore();
const ui = useUiStore();
const hydrated = ref(false);
let removeSystemThemeListener = null;

onMounted(() => {
  auth.hydrate();
  ui.initTheme();
  hydrated.value = true;

  if (!getStoredTheme()) {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemChange = (event) => {
      if (!getStoredTheme()) {
        ui.setTheme(event.matches ? "dark" : "light", { persist: false });
      }
    };
    media.addEventListener("change", onSystemChange);
    removeSystemThemeListener = () => media.removeEventListener("change", onSystemChange);
  }
});

onUnmounted(() => {
  removeSystemThemeListener?.();
});

const authenticated = computed(() => hydrated.value && auth.isAuthenticated);

function onLoginSuccess() {
  // auth store already updated by LoginView
}
</script>
