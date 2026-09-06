<template>
  <BaseChart :chart-component="Bar" :data="data" :options="options" />
</template>

<script setup>
import { Bar } from "vue-chartjs";
import BaseChart from "./BaseChart.vue";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

defineProps({
  data: { type: Object, required: true },
  options: { type: Object, default: () => ({}) }
});
</script>
