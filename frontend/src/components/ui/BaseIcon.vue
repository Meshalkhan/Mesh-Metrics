<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path v-for="(d, i) in paths" :key="i" :d="d" />
  </svg>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  name: { type: String, required: true },
  size: { type: [Number, String], default: 18 }
});

const ICONS = {
  dashboard: ["M3 12 12 3l9 9", "M5 10v10h14V10"],
  reports: ["M4 4h12l4 4v12H4z", "M16 4v4h4", "M8 13h8", "M8 17h6"],
  customers: [
    "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",
    "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
    "M22 21v-2a4 4 0 0 0-3-3.87",
    "M16 3.13a4 4 0 0 1 0 7.75"
  ],
  segments: ["M4 6h16", "M4 12h10", "M4 18h6"],
  settings: [
    "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
    "M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.1A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 9 1.7 1.7 0 0 0 4.26 7.13l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6h0A1.7 1.7 0 0 0 10 3.05V3a2 2 0 1 1 4 0v.1A1.7 1.7 0 0 0 15 4.6a1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9v0a1.7 1.7 0 0 0 1.55 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"
  ],
  refresh: ["M21 12a9 9 0 1 1-3-6.7", "M21 4v5h-5"],
  search: ["M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16z", "M21 21l-4.3-4.3"],
  bell: [
    "M18 16v-5a6 6 0 1 0-12 0v5l-2 3h16l-2-3z",
    "M10 21a2 2 0 0 0 4 0"
  ],
  download: ["M12 3v12", "M7 10l5 5 5-5", "M5 21h14"],
  arrowUp: ["M12 19V5", "M5 12l7-7 7 7"],
  arrowDown: ["M12 5v14", "M19 12l-7 7-7-7"],
  arrowLeft: ["M19 12H5", "M12 19l-7-7 7-7"],
  alert: ["M12 9v4", "M12 17h.01", "M10.3 3.86l-8.18 14A2 2 0 0 0 3.84 21h16.32a2 2 0 0 0 1.72-3.14l-8.18-14a2 2 0 0 0-3.4 0z"],
  spark: ["M12 2v4", "M12 18v4", "M2 12h4", "M18 12h4", "M4.93 4.93l2.83 2.83", "M16.24 16.24l2.83 2.83", "M4.93 19.07l2.83-2.83", "M16.24 7.76l2.83-2.83"],
  logout: ["M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", "M16 17l5-5-5-5", "M21 12H9"],
  menu: ["M4 6h16", "M4 12h16", "M4 18h16"],
  close: ["M6 6l12 12", "M18 6 6 18"],
  chevronDown: ["M6 9l6 6 6-6"],
  chevronLeft: ["M15 18l-6-6 6-6"],
  chevronRight: ["M9 18l6-6-6-6"],
  sort: ["M8 6v12", "M5 9l3-3 3 3", "M16 18V6", "M13 15l3 3 3-3"]
};

const paths = computed(() => ICONS[props.name] || []);
</script>
