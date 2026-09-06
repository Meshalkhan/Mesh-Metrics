<template>
  <header class="topbar">
    <div class="topbar__heading">
      <div class="topbar__title-row">
        <button
          type="button"
          class="topbar__menu"
          aria-label="Open navigation"
          @click="toggleSidebar(true)"
        >
          <BaseIcon name="menu" :size="18" />
        </button>
        <div>
          <p class="topbar__breadcrumb">{{ breadcrumb }}</p>
          <h1 class="topbar__title">{{ title }}</h1>
          <p v-if="subtitle" class="topbar__subtitle">{{ subtitle }}</p>
        </div>
      </div>
    </div>

    <div class="topbar__actions">
      <div class="topbar__search" role="search">
        <BaseIcon name="search" :size="16" />
        <input
          ref="searchInput"
          type="search"
          :value="searchQuery"
          placeholder="Search accounts, KPIs, segments..."
          aria-label="Search accounts"
          @input="onSearch"
        />
        <span class="topbar__hotkey">{{ hotkeyLabel }}</span>
      </div>

      <div class="topbar__notify" v-click-outside="closeNotifications">
        <button
          type="button"
          class="topbar__icon-btn"
          aria-label="Notifications"
          :aria-expanded="notificationsOpen"
          @click="toggleNotifications()"
        >
          <BaseIcon name="bell" :size="18" />
          <span v-if="hasUnread" class="topbar__indicator" />
        </button>

        <div v-if="notificationsOpen" class="topbar__dropdown" role="menu">
          <div class="topbar__dropdown-head">
            <strong>Notifications</strong>
            <button type="button" class="topbar__link-btn" @click="markAllNotificationsRead">
              Mark all read
            </button>
          </div>
          <ul v-if="notifications.length" class="topbar__dropdown-list">
            <li
              v-for="item in notifications"
              :key="item.id"
              :class="{ 'is-unread': !item.read }"
              @click="markNotificationRead(item.id)"
            >
              <p class="topbar__note-title">{{ item.title }}</p>
              <p class="topbar__note-body">{{ item.body }}</p>
              <span class="topbar__note-time">{{ item.time }}</span>
            </li>
          </ul>
          <p v-else class="topbar__dropdown-empty">You're all caught up.</p>
          <button
            v-if="notifications.length"
            type="button"
            class="topbar__dropdown-clear"
            @click="clearNotifications"
          >
            Clear all
          </button>
        </div>
      </div>

      <slot name="actions" />
    </div>
  </header>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import BaseIcon from "../ui/BaseIcon.vue";
import { useUi } from "../../composables/useUi.js";

defineProps({
  breadcrumb: { type: String, default: "Workspace / Insights" },
  title: { type: String, required: true },
  subtitle: { type: String, default: "" }
});

const {
  searchQuery,
  notifications,
  notificationsOpen,
  hasUnread,
  setSearchQuery,
  toggleSidebar,
  toggleNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  clearNotifications
} = useUi();

const searchInput = ref(null);
const isMac = computed(() =>
  typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform)
);
const hotkeyLabel = computed(() => (isMac.value ? "⌘K" : "Ctrl K"));

function onSearch(event) {
  setSearchQuery(event.target.value);
}

function closeNotifications() {
  if (notificationsOpen.value) toggleNotifications(false);
}

function onKeydown(event) {
  const meta = event.metaKey || event.ctrlKey;
  if (meta && event.key.toLowerCase() === "k") {
    event.preventDefault();
    searchInput.value?.focus();
  }
  if (event.key === "Escape") {
    closeNotifications();
  }
}

const vClickOutside = {
  mounted(el, binding) {
    el.__clickOutside = (event) => {
      if (!el.contains(event.target)) binding.value(event);
    };
    document.addEventListener("click", el.__clickOutside);
  },
  unmounted(el) {
    document.removeEventListener("click", el.__clickOutside);
  }
};

onMounted(() => window.addEventListener("keydown", onKeydown));
onUnmounted(() => window.removeEventListener("keydown", onKeydown));
</script>

<style scoped>
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-5);
  padding: var(--space-6);
  margin: var(--space-6) var(--space-6) 0;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.topbar__title-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.topbar__menu {
  display: none;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  background: #fafafa;
  border: 1px solid var(--color-border);
  color: var(--color-text-muted);
  place-items: center;
  flex-shrink: 0;
}

.topbar__breadcrumb {
  font-size: 12px;
  color: var(--color-text-subtle);
  letter-spacing: -0.03em;
}

.topbar__title {
  font-size: clamp(1.15rem, 2.4vw, 1.5625rem);
  font-weight: var(--font-weight-header);
  color: var(--color-text);
  margin-top: 4px;
  line-height: 1.2;
}

.topbar__subtitle {
  font-size: 14px;
  color: var(--color-text-muted);
  margin-top: 4px;
  line-height: 1.47;
  letter-spacing: -0.03em;
  max-width: 52ch;
}

.topbar__actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.topbar__search {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  background: #fafafa;
  border: 1px solid var(--color-border);
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  color: var(--color-text-subtle);
  width: min(320px, 100%);
  transition: all var(--transition-fast);
}

.topbar__search:focus-within {
  border-color: var(--color-text);
  background: var(--color-surface);
}

.topbar__search input {
  border: none;
  outline: none;
  background: transparent;
  flex: 1;
  min-width: 0;
  font-family: inherit;
  font-size: 14px;
  color: var(--color-text);
}

.topbar__hotkey {
  font-size: 12px;
  font-family: var(--font-mono);
  padding: 2px 6px;
  border-radius: 8px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-text-subtle);
  white-space: nowrap;
}

.topbar__notify {
  position: relative;
}

.topbar__icon-btn {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  background: #fafafa;
  border: none;
  color: var(--color-text-muted);
  display: grid;
  place-items: center;
  transition: all var(--transition-fast);
}

.topbar__icon-btn:hover {
  background: var(--color-bg-div);
  color: var(--color-text);
}

.topbar__indicator {
  position: absolute;
  top: 8px;
  right: 9px;
  width: 8px;
  height: 8px;
  background: var(--color-primary);
  border-radius: 50%;
  border: 2px solid var(--color-surface);
}

.topbar__dropdown {
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  width: min(320px, calc(100vw - 32px));
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-md);
  z-index: 50;
  overflow: hidden;
}

.topbar__dropdown-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  border-bottom: 1px solid var(--color-border);
  font-size: 13px;
}

.topbar__link-btn,
.topbar__dropdown-clear {
  border: none;
  background: transparent;
  color: var(--color-text-muted);
  font-size: 12px;
  font-family: inherit;
  cursor: pointer;
}

.topbar__link-btn:hover,
.topbar__dropdown-clear:hover {
  color: var(--color-text);
}

.topbar__dropdown-list {
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 280px;
  overflow-y: auto;
}

.topbar__dropdown-list li {
  padding: 12px 14px;
  border-bottom: 1px solid var(--color-border);
  cursor: pointer;
}

.topbar__dropdown-list li:hover {
  background: var(--color-bg-div);
}

.topbar__dropdown-list li.is-unread {
  background: var(--color-primary-soft);
}

.topbar__note-title {
  font-size: 13px;
  font-weight: var(--font-weight-header);
  color: var(--color-text);
}

.topbar__note-body {
  font-size: 12px;
  color: var(--color-text-muted);
  margin-top: 2px;
}

.topbar__note-time {
  display: block;
  margin-top: 6px;
  font-size: 11px;
  color: var(--color-text-subtle);
}

.topbar__dropdown-empty {
  padding: 20px 14px;
  text-align: center;
  color: var(--color-text-subtle);
  font-size: 13px;
}

.topbar__dropdown-clear {
  width: 100%;
  padding: 12px;
  border-top: 1px solid var(--color-border);
}

@media (max-width: 1024px) {
  .topbar__menu {
    display: grid;
  }
}

@media (max-width: 880px) {
  .topbar {
    flex-direction: column;
    align-items: stretch;
    margin: var(--space-4);
    padding: var(--space-4);
  }

  .topbar__search {
    width: 100%;
  }

  .topbar__actions {
    width: 100%;
    justify-content: stretch;
  }

  .topbar__actions :deep(.btn) {
    flex: 1;
    min-width: 0;
  }

  .topbar__subtitle {
    max-width: none;
  }
}

@media (max-width: 600px) {
  .topbar {
    margin: var(--space-3);
  }

  .topbar__hotkey {
    display: none;
  }

  .topbar__actions {
    flex-direction: column;
    align-items: stretch;
  }

  .topbar__actions :deep(.btn) {
    width: 100%;
  }
}
</style>
