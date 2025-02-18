<template>
  <div>
    <h3>{{ cryptoName }} ({{ cryptoSymbol }})</h3>
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<script>
import { defineComponent, computed } from "vue";
import { Line } from "vue-chartjs";
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from "chart.js";

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

export default defineComponent({
  components: { Line },
  props: {
    cryptoName: String,
    cryptoSymbol: String,
    historicalData: Array
  },
  setup(props) {
    const chartData = computed(() => ({
      labels: props.historicalData.map(entry => new Date(entry.timestamp).toLocaleTimeString()),
      datasets: [
        {
          label: `Precio de ${props.cryptoSymbol}`,
          data: props.historicalData.map(entry => entry.price),
          borderColor: "blue",
          backgroundColor: "rgba(0, 0, 255, 0.2)",
          tension: 0.4
        }
      ]
    }));

    const chartOptions = {
      responsive: true,
      plugins: {
        legend: { display: true }
      }
    };

    return { chartData, chartOptions };
  }
});
</script>
