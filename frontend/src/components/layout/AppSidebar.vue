<template>
  <aside
    class="sidebar"
    :class="{
      'sidebar--open': open,
      'sidebar--collapsed': collapsed
    }"
    aria-label="Primary"
  >
    <div class="sidebar__brand">
      <div class="sidebar__logo">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
          <path d="M3 12 12 3l9 9" />
          <path d="M5 10v10h14V10" />
        </svg>
      </div>
      <div class="sidebar__brand-text">
        <span class="sidebar__brand-name">Mesh Metrics</span>
        <span class="sidebar__brand-meta">Workspace · Mesh Inc.</span>
      </div>
      <button
        type="button"
        class="sidebar__close"
        aria-label="Close navigation"
        @click="closeSidebar"
      >
        <BaseIcon name="close" :size="18" />
      </button>
    </div>

    <nav class="sidebar__nav">
      <p class="sidebar__section">Insights</p>
      <button
        v-for="item in primary"
        :key="item.id"
        type="button"
        :title="item.label"
        :aria-label="item.label"
        :class="['sidebar__link', { 'sidebar__link--active': item.id === active }]"
        @click="onNavigate(item.id)"
      >
        <BaseIcon :name="item.icon" :size="18" />
        <span class="sidebar__link-label">{{ item.label }}</span>
        <BaseBadge v-if="item.badge" tone="info" class="sidebar__badge">{{ item.badge }}</BaseBadge>
      </button>

      <p v-if="adminNav.length" class="sidebar__section">Administration</p>
      <button
        v-for="item in adminNav"
        :key="item.id"
        type="button"
        :title="item.label"
        :aria-label="item.label"
        :class="['sidebar__link', { 'sidebar__link--active': item.id === active }]"
        @click="onNavigate(item.id)"
      >
        <BaseIcon :name="item.icon" :size="18" />
        <span class="sidebar__link-label">{{ item.label }}</span>
      </button>

      <p class="sidebar__section">Workspace</p>
      <button
        v-for="item in secondary"
        :key="item.id"
        type="button"
        :title="item.label"
        :aria-label="item.label"
        :class="['sidebar__link', { 'sidebar__link--active': item.id === active }]"
        @click="onNavigate(item.id)"
      >
        <BaseIcon :name="item.icon" :size="18" />
        <span class="sidebar__link-label">{{ item.label }}</span>
      </button>
    </nav>

    <div class="sidebar__footer">
      <div class="sidebar__user">
        <div class="sidebar__avatar">{{ initials }}</div>
        <div class="sidebar__user-meta">
          <span class="sidebar__user-name">{{ displayName }}</span>
          <span class="sidebar__user-role">{{ roleLabel }}</span>
        </div>
      </div>
      <button type="button" class="sidebar__icon-btn" aria-label="Sign out" @click="onSignOut">
        <BaseIcon name="logout" :size="16" />
      </button>
    </div>

    <button
      type="button"
      class="sidebar__collapse"
      :aria-label="collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
      :title="collapsed ? 'Expand' : 'Collapse'"
      @click="toggleSidebarCollapsed()"
    >
      <BaseIcon :name="collapsed ? 'chevronRight' : 'chevronLeft'" :size="14" />
    </button>
  </aside>
</template>

<script setup>
import BaseIcon from "../ui/BaseIcon.vue";
import BaseBadge from "../ui/BaseBadge.vue";
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useUi } from "../../composables/useUi.js";
import { useAuthStore } from "../../stores/auth.store.js";

defineProps({
  active: { type: String, default: "dashboard" },
  open: { type: Boolean, default: false }
});

const {
  sidebarCollapsed: collapsed,
  setActiveNav,
  closeSidebar,
  toggleSidebarCollapsed,
  signOut,
  showToast
} = useUi();

const auth = useAuthStore();
const { displayName, initials, roleLabel, canAccessAdmin } = storeToRefs(auth);

const primary = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard" },
  { id: "reports", label: "Reports", icon: "reports", badge: "New" },
  { id: "customers", label: "Customers", icon: "customers" },
  { id: "segments", label: "Segments", icon: "segments" }
];

const adminNav = computed(() =>
  canAccessAdmin.value
    ? [
        { id: "admin-overview", label: "Admin overview", icon: "dashboard" },
        { id: "admin-ops", label: "Platform metrics", icon: "spark" },
        { id: "admin-users", label: "Users", icon: "customers" },
        { id: "admin-api-keys", label: "API keys", icon: "settings" }
      ]
    : []
);

const secondary = [{ id: "settings", label: "Settings", icon: "settings" }];

const ADMIN_NAV_IDS = new Set(["admin-overview", "admin-ops", "admin-users", "admin-api-keys"]);

function onNavigate(id) {
  setActiveNav(id);
  if (id !== "dashboard" && !ADMIN_NAV_IDS.has(id)) {
    showToast(`Opened ${id.charAt(0).toUpperCase() + id.slice(1)}.`, "info");
  }
}

function onSignOut() {
  signOut();
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  background: var(--color-sidebar);
  color: var(--color-sidebar-text);
  display: flex;
  flex-direction: column;
  padding: var(--space-4) 0 var(--space-6);
  width: var(--sidebar-width);
  flex-shrink: 0;
  border-right: 1px solid var(--color-sidebar-border);
  z-index: 100;
  box-sizing: border-box;
  transition: width var(--transition-base);
}

.sidebar__brand {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: 12px;
  margin-bottom: var(--space-6);
  position: relative;
}

.sidebar__logo {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-sm);
  background: var(--color-primary);
  display: grid;
  place-items: center;
  color: #ffffff;
  flex-shrink: 0;
}

.sidebar__brand-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
  overflow: hidden;
}

.sidebar__brand-name {
  font-weight: var(--font-weight-header);
  font-size: 14px;
  color: var(--color-text);
  letter-spacing: 0.5px;
  line-height: 1.2;
  white-space: nowrap;
}

.sidebar__brand-meta {
  font-size: 12px;
  color: var(--color-text-muted);
  letter-spacing: 0.3px;
  line-height: 1.2;
  white-space: nowrap;
}

.sidebar__close {
  display: none;
  width: 36px;
  height: 36px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  color: var(--color-text-muted);
  place-items: center;
}

.sidebar__nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0 10px;
}

.sidebar__section {
  font-size: 12px;
  font-weight: var(--font-weight-label);
  letter-spacing: 0.3px;
  color: var(--color-sidebar-muted);
  margin: var(--space-5) 10px var(--space-2);
  white-space: nowrap;
}

.sidebar__section:first-child {
  margin-top: 0;
}

.sidebar__link {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: 10px 20px;
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--color-sidebar-text);
  font-size: 14px;
  font-weight: 400;
  font-family: inherit;
  text-align: left;
  transition: all var(--transition-fast);
  width: 100%;
  box-sizing: border-box;
  cursor: pointer;
}

.sidebar__link-label {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar__link:hover {
  background: var(--color-sidebar-hover);
  color: var(--color-text);
  font-weight: var(--font-weight-label);
}

.sidebar__link--active {
  background: var(--color-sidebar-active);
  color: var(--color-sidebar-active-text);
}

.sidebar__link--active:hover {
  background: var(--color-sidebar-active);
  color: var(--color-sidebar-active-text);
}

.sidebar__footer {
  margin-top: auto;
  padding: var(--space-6) var(--space-6) 0;
  border-top: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.sidebar__user {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex: 1;
  min-width: 0;
}

.sidebar__avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--color-text);
  display: grid;
  place-items: center;
  font-size: var(--text-sm);
  font-weight: var(--font-weight-header);
  color: #ffffff;
  flex-shrink: 0;
}

.sidebar__user-meta {
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
}

.sidebar__user-name {
  color: var(--color-text);
  font-size: 14px;
  font-weight: var(--font-weight-header);
  white-space: nowrap;
}

.sidebar__user-role {
  color: var(--color-text-muted);
  font-size: 12px;
  white-space: nowrap;
}

.sidebar__icon-btn {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text-muted);
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  transition: all var(--transition-fast);
  flex-shrink: 0;
}

.sidebar__icon-btn:hover {
  background: var(--color-bg-div);
  color: var(--color-text);
}

.sidebar__collapse {
  position: absolute;
  top: 24px;
  right: -12px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  display: grid;
  place-items: center;
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  z-index: 2;
  padding: 0;
}

.sidebar__collapse:hover {
  background: var(--color-bg-div);
}

.sidebar--collapsed {
  width: var(--sidebar-collapsed-width);
}

.sidebar--collapsed .sidebar__brand {
  justify-content: center;
  padding: var(--space-6) var(--space-3);
}

.sidebar--collapsed .sidebar__brand-text,
.sidebar--collapsed .sidebar__link-label,
.sidebar--collapsed .sidebar__badge,
.sidebar--collapsed .sidebar__section,
.sidebar--collapsed .sidebar__user-meta,
.sidebar--collapsed .sidebar__icon-btn {
  display: none;
}

.sidebar--collapsed .sidebar__logo {
  width: 40px;
  height: 40px;
}

.sidebar--collapsed .sidebar__nav {
  padding: 0 8px;
  align-items: center;
}

.sidebar--collapsed .sidebar__link {
  justify-content: center;
  padding: 10px;
  width: 48px;
}

.sidebar--collapsed .sidebar__footer {
  justify-content: center;
  padding: var(--space-6) 0 0;
}

.sidebar--collapsed .sidebar__user {
  justify-content: center;
}

@media (max-width: 1024px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    height: 100%;
    height: 100dvh;
    width: min(300px, 88vw);
    max-width: 100%;
    padding-bottom: max(var(--space-6), env(safe-area-inset-bottom));
    transform: translateX(-105%);
    transition: transform 0.22s ease;
    box-shadow: var(--shadow-lg);
    z-index: 110;
  }

  .sidebar--collapsed {
    width: min(300px, 88vw);
  }

  .sidebar--open {
    transform: translateX(0);
  }

  .sidebar__close {
    display: grid;
  }

  .sidebar__collapse {
    display: none;
  }

  .sidebar--collapsed .sidebar__brand-text,
  .sidebar--collapsed .sidebar__link-label,
  .sidebar--collapsed .sidebar__badge,
  .sidebar--collapsed .sidebar__section,
  .sidebar--collapsed .sidebar__user-meta,
  .sidebar--collapsed .sidebar__icon-btn {
    display: initial;
  }

  .sidebar--collapsed .sidebar__user-meta {
    display: flex;
  }

  .sidebar--collapsed .sidebar__link {
    justify-content: flex-start;
    padding: 10px 20px;
    width: 100%;
  }

  .sidebar--collapsed .sidebar__nav {
    padding: 0 10px;
    align-items: stretch;
  }

  .sidebar__brand {
    margin-bottom: var(--space-4);
  }

  .sidebar__nav {
    -webkit-overflow-scrolling: touch;
  }

  .sidebar__footer {
    padding-bottom: var(--space-2);
  }
}

@media (max-width: 600px) {
  .sidebar,
  .sidebar--collapsed {
    width: min(320px, 92vw);
  }

  .sidebar__link {
    min-height: 44px;
    padding: 12px 16px;
  }
}
</style>
