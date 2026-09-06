<template>
  <LoginView v-if="!authenticated" @success="onLoginSuccess" />
  <DashboardView v-else />
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import DashboardView from "./views/DashboardView.vue";
import LoginView from "./views/LoginView.vue";
import { useAuthStore } from "./stores/auth.store.js";

const auth = useAuthStore();
const hydrated = ref(false);

onMounted(() => {
  auth.hydrate();
  hydrated.value = true;
});

const authenticated = computed(() => hydrated.value && auth.isAuthenticated);

function onLoginSuccess() {
  // auth store already updated by LoginView
}
</script>
