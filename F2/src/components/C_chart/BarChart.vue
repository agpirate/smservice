<template>
    <div>
      <canvas ref="barChart"></canvas>
    </div>
  </template>
  
  <script>
  
  import { Bar } from 'vue-chartjs';
  
  export default {
    extends: Bar,
    props: ['data', 'options'],
    mounted() {
      this.renderChart(this.data, this.options);
    }
  };
  </script>
  