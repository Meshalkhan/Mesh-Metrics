<template>
  <BaseChart :chart-component="Line" :data="data" :options="options" />
</template>

<script setup>
import { Line } from "vue-chartjs";
import BaseChart from "./BaseChart.vue";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

defineProps({
  data: { type: Object, required: true },
  options: { type: Object, default: () => ({}) }
});
</script>
