<template>
  <div class="login">
    <ThemeToggle class="login__theme" />
    <div class="login__panel">
      <div class="login__brand">
        <div class="login__logo" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <path d="M3 12 12 3l9 9" />
            <path d="M5 10v10h14V10" />
          </svg>
        </div>
        <div>
          <h1 class="login__title">Mesh Metrics</h1>
          <p class="login__tagline">Sign in to your workspace</p>
        </div>
      </div>

      <BaseCard title="Account access" subtitle="Use your MeshCore credentials">
        <form class="login__form" @submit.prevent="submit">
          <label class="login__field">
            <span>Email</span>
            <input v-model="email" type="email" autocomplete="username" required />
          </label>
          <label class="login__field">
            <span>Password</span>
            <input v-model="password" type="password" autocomplete="current-password" required />
          </label>
          <label class="login__field">
            <span>Tenant ID</span>
            <input v-model="tenantId" type="text" autocomplete="off" required />
          </label>

          <p v-if="error" class="login__error">{{ error }}</p>

          <BaseButton type="submit" variant="primary" :loading="loading">
            Sign in
          </BaseButton>
        </form>
      </BaseCard>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import BaseButton from "../components/ui/BaseButton.vue";
import BaseCard from "../components/ui/BaseCard.vue";
import ThemeToggle from "../components/ui/ThemeToggle.vue";
import { useAuthStore } from "../stores/auth.store.js";

const auth = useAuthStore();

const email = ref("admin@meshcore.local");
const password = ref("password123");
const tenantId = ref("00000000-0000-0000-0000-000000000001");
const error = ref("");
const loading = ref(false);

const emit = defineEmits(["success"]);

async function submit() {
  error.value = "";
  loading.value = true;
  try {
    await auth.login({ email: email.value, password: password.value, tenantId: tenantId.value });
    emit("success");
  } catch (err) {
    error.value = err.message || "Sign in failed.";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.login {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: var(--space-6);
  background: var(--color-bg);
  position: relative;
}

.login__theme {
  position: absolute;
  top: var(--space-6);
  right: var(--space-6);
}

.login__panel {
  width: min(100%, 420px);
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.login__brand {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.login__logo {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-sm);
  background: var(--color-primary-soft);
  color: var(--color-primary-strong);
  display: grid;
  place-items: center;
}

.login__title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text);
}

.login__tagline {
  margin: 4px 0 0;
  color: var(--color-text-muted);
  font-size: 14px;
}

.login__form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.login__field {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  font-size: 13px;
  color: var(--color-text-muted);
}

.login__field input {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xs);
  padding: 10px 12px;
  font: inherit;
  color: var(--color-text);
  background: var(--color-surface);
}

.login__field input:focus {
  outline: 2px solid var(--color-primary-soft);
  border-color: var(--color-primary);
}

.login__error {
  margin: 0;
  padding: 10px 12px;
  border-radius: var(--radius-xs);
  background: var(--color-danger-soft);
  color: var(--color-danger);
  font-size: 13px;
}
</style>
