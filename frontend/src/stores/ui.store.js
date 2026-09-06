import { defineStore } from "pinia";
import { useAdminStore } from "./admin.store.js";
import { useAuthStore } from "./auth.store.js";

const initialNotifications = () => [
  {
    id: 1,
    title: "Revenue up 8.6%",
    body: "North America outperformed the previous period.",
    time: "2m ago",
    read: false
  },
  {
    id: 2,
    title: "Export ready",
    body: "Top accounts CSV can be downloaded from the table.",
    time: "1h ago",
    read: false
  },
  {
    id: 3,
    title: "Filter tip",
    body: "Combine region and segment to isolate pipeline risk.",
    time: "Yesterday",
    read: true
  }
];

export const useUiStore = defineStore("ui", {
  state: () => ({
    activeNav: "dashboard",
    sidebarOpen: false,
    sidebarCollapsed: false,
    searchQuery: "",
    notificationsOpen: false,
    notifications: initialNotifications(),
    toast: null
  }),
  getters: {
    unreadCount: (state) => state.notifications.filter((n) => !n.read).length,
    hasUnread: (state) => state.notifications.some((n) => !n.read)
  },
  actions: {
    setActiveNav(id) {
      this.activeNav = id;
      this.sidebarOpen = false;
      this.notificationsOpen = false;
    },
    toggleSidebar(force) {
      this.sidebarOpen = typeof force === "boolean" ? force : !this.sidebarOpen;
      if (this.sidebarOpen) this.notificationsOpen = false;
    },
    closeSidebar() {
      this.sidebarOpen = false;
    },
    toggleSidebarCollapsed(force) {
      this.sidebarCollapsed = typeof force === "boolean" ? force : !this.sidebarCollapsed;
    },
    setSearchQuery(value) {
      this.searchQuery = value;
    },
    toggleNotifications(force) {
      this.notificationsOpen = typeof force === "boolean" ? force : !this.notificationsOpen;
    },
    markNotificationRead(id) {
      const item = this.notifications.find((n) => n.id === id);
      if (item) item.read = true;
    },
    markAllNotificationsRead() {
      this.notifications.forEach((n) => {
        n.read = true;
      });
    },
    clearNotifications() {
      this.notifications = [];
      this.notificationsOpen = false;
    },
    showToast(message, tone = "info") {
      this.toast = { id: Date.now(), message, tone };
    },
    clearToast() {
      this.toast = null;
    },
    signOut() {
      const auth = useAuthStore();
      const admin = useAdminStore();
      auth.signOut();
      admin.reset();
      this.setActiveNav("dashboard");
      this.showToast("Signed out of Mesh Metrics workspace.", "info");
      this.sidebarOpen = false;
    }
  }
});
