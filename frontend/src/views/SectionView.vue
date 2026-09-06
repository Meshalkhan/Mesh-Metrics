<template>
  <section class="section-view">
    <BaseCard :title="meta.title" :subtitle="meta.subtitle">
      <div class="section-view__body">
        <p>{{ meta.description }}</p>

        <div v-if="section === 'settings'" class="section-view__theme">
          <div>
            <p class="section-view__theme-label">Appearance</p>
            <p class="section-view__theme-hint">Choose light or dark mode for the workspace.</p>
          </div>
          <div class="section-view__theme-options" role="group" aria-label="Theme">
            <button
              v-for="option in themeOptions"
              :key="option.value"
              type="button"
              class="section-view__theme-btn"
              :class="{ 'is-active': theme === option.value }"
              @click="setTheme(option.value)"
            >
              {{ option.label }}
            </button>
          </div>
        </div>

        <ul>
          <li v-for="item in meta.bullets" :key="item">{{ item }}</li>
        </ul>
      </div>
    </BaseCard>
  </section>
</template>

<script setup>
import { computed } from "vue";
import BaseCard from "../components/ui/BaseCard.vue";
import { useUi } from "../composables/useUi.js";

const props = defineProps({
  section: { type: String, required: true }
});

const { theme, setTheme } = useUi();

const themeOptions = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" }
];

const CONTENT = {
  reports: {
    title: "Reports",
    subtitle: "Scheduled and on-demand analytics packs",
    description: "Build recurring exports for leadership reviews and share pipeline snapshots with stakeholders.",
    bullets: [
      "Weekly revenue packs with region breakdowns",
      "Conversion funnel snapshots by segment",
      "CSV and PDF delivery to your workspace"
    ]
  },
  customers: {
    title: "Customers",
    subtitle: "Account health and expansion signals",
    description: "Monitor active accounts, renewal risk, and expansion opportunities across your book of business.",
    bullets: [
      "Account scoring based on conversion velocity",
      "Region and segment concentration views",
      "Jump back to dashboard filters for deeper analysis"
    ]
  },
  segments: {
    title: "Segments",
    subtitle: "Cohort definitions used by the dashboard",
    description: "Enterprise, Mid-Market, and SMB segments drive KPI scaling and chart contribution on the main dashboard.",
    bullets: [
      "Enterprise: strategic accounts and larger deal sizes",
      "Mid-Market: balanced volume and ACV",
      "SMB: high-volume, faster conversion cycles"
    ]
  },
  settings: {
    title: "Settings",
    subtitle: "Workspace preferences",
    description: "Manage display defaults for period, region, segment filters, and appearance.",
    bullets: [
      "Default filters applied on first load",
      "Notification preferences for KPI alerts",
      "Export filename conventions for CSV downloads"
    ]
  }
};

const meta = computed(() => CONTENT[props.section] || CONTENT.settings);
</script>

<style scoped>
.section-view {
  width: 100%;
  min-width: 0;
}

.section-view__body {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  color: var(--color-text-muted);
  font-size: 14px;
  line-height: 1.5;
}

.section-view__theme {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-5);
  padding: var(--space-5);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface-muted);
}

.section-view__theme-label {
  margin: 0;
  font-weight: var(--font-weight-header);
  color: var(--color-text);
}

.section-view__theme-hint {
  margin: 4px 0 0;
  font-size: 13px;
  color: var(--color-text-subtle);
}

.section-view__theme-options {
  display: flex;
  gap: var(--space-2);
  flex-shrink: 0;
}

.section-view__theme-btn {
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text-muted);
  border-radius: var(--radius-sm);
  padding: 8px 16px;
  font-size: 13px;
  font-family: inherit;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.section-view__theme-btn:hover {
  color: var(--color-text);
  border-color: var(--color-border-strong);
}

.section-view__theme-btn.is-active {
  background: var(--color-btn-primary-bg);
  color: var(--color-btn-primary-text);
  border-color: var(--color-btn-primary-bg);
}

.section-view__body ul {
  margin: 0;
  padding-left: 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.section-view__body li {
  color: var(--color-text);
}

@media (max-width: 640px) {
  .section-view__theme {
    flex-direction: column;
    align-items: stretch;
  }

  .section-view__theme-options {
    width: 100%;
  }

  .section-view__theme-btn {
    flex: 1;
  }
}
</style>
