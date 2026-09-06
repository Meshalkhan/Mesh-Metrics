<template>
  <component :is="chartComponent" :data="data" :options="mergedOptions" />
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  chartComponent: { type: Object, required: true },
  data: { type: Object, required: true },
  options: { type: Object, default: () => ({}) }
});

const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  layout: { padding: 4 },
  interaction: { mode: "index", intersect: false },
  plugins: {
    legend: {
      align: "end",
      labels: {
        color: "#4D4D4D",
        usePointStyle: true,
        boxWidth: 6,
        boxHeight: 6,
        padding: 16,
        font: { size: 12, family: "Inter, Helvetica Neue, Helvetica, Arial, sans-serif" }
      }
    },
    tooltip: {
      backgroundColor: "#000000",
      titleColor: "#ffffff",
      bodyColor: "#ffffff",
      padding: 10,
      cornerRadius: 15,
      displayColors: false
    }
  },
  scales: {
    x: {
      ticks: { color: "#7E7E7E", font: { size: 11, family: "Inter, Helvetica Neue, Helvetica, Arial, sans-serif" } },
      grid: { display: false },
      border: { display: false }
    },
    y: {
      ticks: { color: "#7E7E7E", font: { size: 11, family: "Inter, Helvetica Neue, Helvetica, Arial, sans-serif" } },
      grid: { color: "rgba(0, 0, 0, 0.06)" },
      border: { display: false }
    }
  }
};

const mergedOptions = computed(() => {
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
