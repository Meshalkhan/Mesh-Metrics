import { defineStore } from "pinia";
import { login as loginRequest } from "../services/auth.service.js";
import { clearSession, getSession, setSession } from "../lib/session.js";

const ADMIN_ROLES = new Set(["platform_admin", "tenant_admin", "manager"]);

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: null,
    tenantId: null,
    user: null,
    status: "idle"
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.token),
    canAccessAdmin: (state) => ADMIN_ROLES.has(state.user?.role),
    displayName: (state) => state.user?.email?.split("@")[0] || "User",
    initials: (state) => {
      const name = state.user?.email?.split("@")[0] || "U";
      return name.slice(0, 2).toUpperCase();
    },
    roleLabel: (state) => state.user?.role?.replace(/_/g, " ") || "Member"
  },
  actions: {
    hydrate() {
      const session = getSession();
      if (!session?.token) return;
      this.token = session.token;
      this.tenantId = session.tenantId;
      this.user = session.user ?? null;
    },
    async login({ email, password, tenantId }) {
      this.status = "loading";
      try {
        const result = await loginRequest({ email, password });
        const resolvedTenantId = tenantId || result.user.tenantId;
        const session = {
          token: result.accessToken,
          tenantId: resolvedTenantId,
          user: result.user
        };
        setSession(session);
        this.token = session.token;
        this.tenantId = session.tenantId;
        this.user = session.user;
        this.status = "success";
        return session;
      } catch (err) {
        this.status = "error";
        throw err;
      }
    },
    signOut() {
      clearSession();
      this.token = null;
      this.tenantId = null;
      this.user = null;
      this.status = "idle";
    }
  }
});
