<template>
  <div class="polls-container">
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
        <h2>{{ index + 1 }}. {{ poll.name }}</h2>
        <p>Status: {{ poll.status }}</p>
        <p>Max Choices: {{ poll.max_choice }}</p>
        <p>Created At: {{ formatDate(poll.created_at) }}</p>
        <h2 style="color: rgb(0, 123, 255);">Polling Result:</h2>
        <!-- Add a conditional rendering to check if results is defined -->
        <div v-if="results && results[poll.id] && results[poll.id].length">
          <div v-for="result in results[poll.id]" :key="result.id" class="result-item" :class="{ 'highest-score': isHighestScore(result, poll) }">
            <p>{{ result.name }}: {{ result.count }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      polls: [],
      results: {},
      loading: false // Flag to track loading state
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        this.loading = true; // Set loading to true before making the request
        const [pollsResponse, resultsResponse] = await Promise.all([
          axios.get('https://trhb.gov.et/trhb/public/api/polls'),
          axios.get('https://trhb.gov.et/trhb/public/api/poll-options')
        ]);
        this.polls = pollsResponse.data.mydata;
        this.results = this.groupResultsByPollId(resultsResponse.data.mydata);
        console.log("result data", this.results);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        this.loading = false; // Set loading to false after request completes (whether successful or not)
      }
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
      const formattedDate = new Date(dateString).toLocaleDateString('en-US', options);
      return formattedDate;
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
    isHighestScore(result, poll) {
      // Find the maximum count within the poll's results
      const maxCount = Math.max(...this.results[poll.id].map(choice => choice.count));
      // Check if the current result has the highest count
      return result.count === maxCount;
    },
  },
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

.result-item {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
  margin-top: 10px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.highest-score {
  background-color: #16d7de; /* You can change this color as needed */
}
</style>
