<template>
  <div style="padding: 20px">
    <a-button>按钮</a-button>
    <div style="width: 100%; height: 400px; border: 1px solid #000; margin-top: 20px">
      <Chart :option="chartOptions" :loading="loading"></Chart>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import Chart from "@develop-plugins/chart";

const loading = ref(true);
const chartOptions = {
  title: {
    text: "ECharts 入门示例",
  },
  tooltip: {},
  xAxis: {
    data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
  },
  yAxis: {},
  series: [
    {
      name: "销量",
      type: "bar",
      data: [5, 20, 36, 10, 10, 20],
    },
  ],
};

setTimeout(() => {
  chartOptions.series[0].data = [50, 200, 360, 100, 10, 20];
  loading.value = false;
}, 3000);
</script>
<style>
html,
body {
  margin: 0;
  padding: 0;
}
</style>
