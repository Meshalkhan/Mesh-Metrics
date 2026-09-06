import { storeToRefs } from "pinia";
import { useDashboardStore } from "../stores/dashboard.store.js";

export function useDashboard() {
  const store = useDashboardStore();
  const refs = storeToRefs(store);

  return {
    ...refs,
    loadDashboard: store.loadDashboard,
    updateFilters: store.updateFilters,
    resetFilters: store.resetFilters
  };
}
