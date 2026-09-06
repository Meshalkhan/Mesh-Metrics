<template>
  <component :is="chartComponent" :data="data" :options="mergedOptions" />
</template>

<script setup>
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useUiStore } from "../stores/ui.store.js";

const props = defineProps({
  chartComponent: { type: Object, required: true },
  data: { type: Object, required: true },
  options: { type: Object, default: () => ({}) }
});

const ui = useUiStore();
const { theme } = storeToRefs(ui);

function cssVar(name) {
  if (typeof document === "undefined") return "";
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

const mergedOptions = computed(() => {
  theme.value;

  const fontFamily = "Inter, Helvetica Neue, Helvetica, Arial, sans-serif";
  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: 4 },
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: {
        align: "end",
        labels: {
          color: cssVar("--color-chart-text"),
          usePointStyle: true,
          boxWidth: 6,
          boxHeight: 6,
          padding: 16,
          font: { size: 12, family: fontFamily }
        }
      },
      tooltip: {
        backgroundColor: cssVar("--color-chart-tooltip-bg"),
        titleColor: cssVar("--color-chart-tooltip-text"),
        bodyColor: cssVar("--color-chart-tooltip-text"),
        padding: 10,
        cornerRadius: 15,
        displayColors: false
      }
    },
    scales: {
      x: {
        ticks: { color: cssVar("--color-chart-tick"), font: { size: 11, family: fontFamily } },
        grid: { display: false },
        border: { display: false }
      },
      y: {
        ticks: { color: cssVar("--color-chart-tick"), font: { size: 11, family: fontFamily } },
        grid: { color: cssVar("--color-chart-grid") },
        border: { display: false }
      }
    }
  };

  const overrides = props.options || {};
  return {
    ...baseOptions,
    ...overrides,
    plugins: {
      ...baseOptions.plugins,
      ...(overrides.plugins || {}),
      legend: { ...baseOptions.plugins.legend, ...(overrides.plugins?.legend || {}) },
      tooltip: { ...baseOptions.plugins.tooltip, ...(overrides.plugins?.tooltip || {}) }
    },
    scales:
      overrides.scales === undefined
        ? baseOptions.scales
        : overrides.scales === null
          ? {}
          : overrides.scales
  };
});
</script>
