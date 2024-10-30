<template>
  <div class="stats-container">
    <div class="summary-container">
      <div class="summary-box">{{ totalPolls }} Polls</div>
      <div class="summary-box">{{ totalClients }} Participants</div>
      <div class="summary-box">{{ totalFeedbacks }} Feedbacks</div>

      <div class="summary-box">{{ totalSmsSent }} SMSs</div>
      <div class="summary-box">{{ totalQuestions }} QAs</div>
    </div>

    <div class="graphs-container">
      <div class="bar-stats">
        <h2>SMS SERVICE STATISTICS:</h2>
        <p>Total Number of programs: {{ this.totalFeedbacks+this.totalPolls+this.totalQuestions }}</p>
        <div class="chart-container">
          <canvas id="myChart"></canvas>
        </div>
      </div>
      <div class="pie-stats">
        <h2>SMS SERVICE STATISTICS:</h2>
        <p>Total Audience Participation: {{ this.totalp.pcount + this.totalp.qcount+this.totalp.fcount }}</p>
        <div class="chart-container">
          <canvas id="myPieChart"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Chart from 'chart.js/auto';

export default {
  data() {
    return {
      countNumberOfIdeas: 0,
      countNumberOfUsers: 0,
      memberShipCount: null,
      stagesCount: null,
      datas: null,
      polls: [],
      clients: [],
      questions: [],
      feedbacks:[],
      totalp:null,
    };
  },
  async mounted() {
    await this.fetchData();

     this.initializeSampleData();
     this.drawBarChart();
     this.drawPieChart();
  },
  computed: {
    totalPolls() {
      return this.polls.length;
    },
    totalClients() {
      return this.clients.length;
    },
    totalFeedbacks() {
      return this.feedbacks.length;
    },
    totalSmsSent() {
      return this.clients.reduce((total, client) => total + client.count, 0);
    },
    totalQuestions() {
      return this.questions.length;
    }
  },
  methods: {
    async fetchData() {
      const response = await axios.get('http://localhost:3000/pollprogram/pollprograms');
      const response1 = await axios.get('http://localhost:3000/client/clients');
      const response2 = await axios.get('http://localhost:3000/question/questions');
      const response3 = await axios.get('http://localhost:3000/feedback/feedbacks');
      const response4 = await axios.get('http://localhost:3000/pie/analysis')

      this.polls = response.data;
      this.clients = response1.data;
      console.log(this.clients)
      this.questions = response2.data;
      this.feedbacks = response3.data;
      this.totalp = response4.data;
      },
    initializeSampleData() {
      this.countNumberOfIdeas = this.totalFeedbacks+ this.totalPolls+this.totalQuestions;
      this.stagesCount = {
        'Polls': this.totalPolls,
        'Feedbacks': this.totalFeedbacks,
        'QAs': this.totalQuestions,
      };
      this.countNumberOfUsers = 10000;
      this.memberShipCount = {
        'Polls': this.totalp.pcount,
        'Feedbacks': this.totalp.fcount,
        'QAs': this.totalp.qcount,
    
      };
    },
    drawBarChart() {
      try {
        const ctx = document.getElementById('myChart');
        const labels = Object.keys(this.stagesCount);
        const data = Object.values(this.stagesCount);
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [{
              label: '# of programs by category',
              data: data,
              backgroundColor: ['#084328', '#0900e0', 'teal'],

              borderWidth: 1,
            }],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      } catch (error) {
        console.error(error);
      }
    },
    drawPieChart() {
      try {
        const ctx = document.getElementById('myPieChart');
        const labels = Object.keys(this.memberShipCount);
        const data = Object.values(this.memberShipCount);
        new Chart(ctx, {
          type: 'pie',
          data: {
            labels: labels,
            datasets: [{
              label: '# of Audience Participation by category',
              data: data,
              backgroundColor: ['#084328', '#0900e0', 'teal', ],
            }],
          },
        });
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style scoped>
.stats-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: Arial, sans-serif;
  color: #333;
  padding: 20px;
}

.summary-container {
  display: flex;
  width: 100%;
  justify-content: space-around;
  margin-bottom: 20px;
}

.summary-box {
  flex: 1;
  margin: 0 10px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #f9f9f9;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  font-weight: bold;
}

.graphs-container {
  display: flex;
  justify-content: space-around;
  width: 100%;
}

.bar-stats, .pie-stats {
  width: 45%;
  margin: 20px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #f9f9f9;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

h2 {
  margin-bottom: 10px;
  color: #333;
  text-align: center;
}

p {
  margin: 0 0 20px;
  text-align: center;
}

.chart-container {
  position: relative;
  width: 100%;
  height: 400px;
}

@media (max-width: 768px) {
  .summary-container {
    flex-direction: column;
    align-items: center;
  }

  .summary-box {
    width: 100%;
    margin: 10px 0;
  }

  .graphs-container {
    flex-direction: column;
    align-items: center;
  }

  .bar-stats, .pie-stats {
    width: 90%;
    margin: 10px 0;
  }
}
</style>
