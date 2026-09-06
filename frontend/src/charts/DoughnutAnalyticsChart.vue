<template>
  <BaseChart :chart-component="Doughnut" :data="data" :options="mergedOptions" />
</template>

<script setup>
import { computed } from "vue";
import { Doughnut } from "vue-chartjs";
import BaseChart from "./BaseChart.vue";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const props = defineProps({
  data: { type: Object, required: true },
  options: { type: Object, default: () => ({}) }
});

const mergedOptions = computed(() => ({
  ...props.options,
  cutout: "62%",
  scales: null,
  plugins: {
    ...(props.options.plugins || {}),
    legend: {
      position: "bottom",
      ...((props.options.plugins && props.options.plugins.legend) || {})
    }
  }
}));
</script>
