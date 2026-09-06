import { defineStore } from "pinia";
import { fetchApiKeys, fetchOpsSummary, fetchUsers } from "../services/admin.service.js";

let inflightController = null;

export const useAdminStore = defineStore("admin", {
  state: () => ({
    status: "idle",
    error: null,
    users: [],
    apiKeys: [],
    opsCards: []
  }),
  getters: {
    isLoading: (state) => state.status === "loading",
    hasData: (state) => state.users.length > 0 || state.apiKeys.length > 0 || state.opsCards.length > 0
  },
  actions: {
    async loadWorkspace() {
      if (inflightController) inflightController.abort();
      const controller = new AbortController();
      inflightController = controller;
      this.status = "loading";
      this.error = null;

      try {
        const [users, apiKeys, opsCards] = await Promise.all([
          fetchUsers({ signal: controller.signal }),
          fetchApiKeys({ signal: controller.signal }),
          fetchOpsSummary({ signal: controller.signal })
        ]);
        if (controller.signal.aborted) return;
        this.users = users;
        this.apiKeys = apiKeys;
        this.opsCards = opsCards;
        this.status = "success";
      } catch (err) {
        if (err.name === "CanceledError" || err.code === "ERR_CANCELED") return;
        this.error = err.message || "Unable to load admin workspace.";
        this.status = "error";
      } finally {
        if (inflightController === controller) inflightController = null;
      }
    },
    reset() {
      this.status = "idle";
      this.error = null;
      this.users = [];
      this.apiKeys = [];
      this.opsCards = [];
    }
  }
});
