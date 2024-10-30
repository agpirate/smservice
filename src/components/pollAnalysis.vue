<template>
  <div class="polls-container">
    <RouterLink to="/pollanalysis"> Poll Analysis</RouterLink>
    <h1 style="color: rgb(0, 123, 255);">List of Polls</h1>
    <v-progress-circular
      v-if="loading"
      indeterminate
      color="primary"
      size="150"
      class="mx-auto my-10"
      style="max-width: 150px"
    ></v-progress-circular>
    <div v-else>
      <div v-for="(poll, index) in polls" :key="poll.id" class="poll-card">
        <router-link :to="`/poll/${poll.id}`">
          <h2>{{ index + 1 }}. {{ poll.name }}</h2>
        </router-link>
        <p>Status: {{ poll.status }}</p>
        <p>Max Choices: {{ poll.max_choice }}</p>
        <p>Created At: {{ formatDate(poll.created_at) }}</p>
        <h2 style="color: rgb(0, 123, 255);">Polling Result:</h2>
        <!-- Add chart display -->
        <canvas :id="'chart-' + poll.id" width="400" height="400"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { RouterLink } from 'vue-router';
import { Chart, ArcElement, PieController, Title, Tooltip, Legend, CategoryScale } from 'chart.js';
Chart.register(ArcElement, PieController, Title, Tooltip, Legend, CategoryScale);

export default {
  components: {
    RouterLink
  },
  data() {
    return {
      polls: [],
      results: {},
      loading: false, // Flag to track loading state
      chartsRendered: false // Flag to track whether charts have been rendered

    };
  },
  async mounted() {
    console.log('Component mounted');
    await this.fetchData();
    console.log('Data fetched, rendering charts...');
    this.$nextTick(() => {
      console.log('Next tick');
      this.renderCharts(); // Render charts after data is loaded and DOM is updated
    });
  },
  methods: {
    async fetchData() {
      try {
        this.loading = true;
        const [pollsResponse, resultsResponse] = await Promise.all([
          axios.get('https://trhb.gov.et/trhb/public/api/polls'),
          axios.get('https://trhb.gov.et/trhb/public/api/poll-options')
        ]);
        this.polls = pollsResponse.data.mydata;
        this.results = this.groupResultsByPollId(resultsResponse.data.mydata);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        this.loading = false;
      }
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    },
    groupResultsByPollId(results) {
      return results.reduce((acc, result) => {
        if (!acc[result.poll_id]) {
          acc[result.poll_id] = [];
        }
        acc[result.poll_id].push(result);
        return acc;
      }, {});
    },
    renderCharts() {
      if (!this.chartsRendered) {
    this.chartsRendered = true; // Set flag to true to prevent further rendering

    console.log('Rendering charts...');

    // Loop through each poll and render the corresponding chart
    this.polls.forEach(poll => {
      console.log('Processing poll:', poll);

      const results = this.results[poll.id] || [];
      console.log('Results for poll', poll.id, ':', results);

      const labels = results.map(result => result.name);
      console.log('Labels:', labels);

      const counts = results.map(result => result.count);
      console.log('Counts:', counts);

      const canvas = document.getElementById(`chart-${poll.id}`);
      if (canvas) {
        console.log('Canvas found for poll:', poll.id);
        const ctx = canvas.getContext('2d');
        new Chart(ctx, {
          type: 'pie',
          data: {
            labels: labels,
            datasets: [{
              label: 'Poll Results',
              data: counts,
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#7FFF00', '#8A2BE2'],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false
          }
        });
      } else {
        console.warn(`Canvas not found for poll id ${poll.id}`);
      }
    });
  }}
}
};
</script>

<style scoped>
.polls-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.poll-card {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
