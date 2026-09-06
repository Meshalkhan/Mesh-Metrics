import { storeToRefs } from "pinia";
import { useUiStore } from "../stores/ui.store.js";

export function useUi() {
  const store = useUiStore();
  const refs = storeToRefs(store);

  return {
    ...refs,
    setActiveNav: store.setActiveNav,
    toggleSidebar: store.toggleSidebar,
    closeSidebar: store.closeSidebar,
    toggleSidebarCollapsed: store.toggleSidebarCollapsed,
    setSearchQuery: store.setSearchQuery,
    toggleNotifications: store.toggleNotifications,
    markNotificationRead: store.markNotificationRead,
    markAllNotificationsRead: store.markAllNotificationsRead,
    clearNotifications: store.clearNotifications,
    showToast: store.showToast,
    clearToast: store.clearToast,
    signOut: store.signOut
  };
}
