<template>
    <div>
      <canvas ref="pieChart"></canvas>
    </div>
  </template>
  
  <script>
  import { Pie } from 'vue-chartjs';
  
  export default {
    extends: Pie,
    props: ['data', 'options'],
    mounted() {
      this.renderChart(this.data, this.options);
    }
  };
  </script>
  