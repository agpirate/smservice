<template>
  <div class="poll-detail-container">
    <h1 style="color: teal;">Feedback Detail:</h1>
    <div class="poll-details" v-if="poll">
      <div class="poll-detail-item">
        <span class="detail-label">Summary:</span>
        <span>{{poll.summary }}</span>
      </div>
      <div class="poll-detail-item">
        <span class="detail-label">Creator ID:</span>
        <span>{{ poll.creator_id }}</span>
      </div>
      <div class="poll-detail-item">
        <span class="detail-label">Question Code/qcode:</span>
        <span>{{ poll.fcode }}</span>
      </div>
      
      <div class="poll-detail-item">
        <span class="detail-label">Schedule Start:</span>
        <span>{{ formatDate(poll.schedule.start) }}</span>
      </div>
      <div class="poll-detail-item">
        <span class="detail-label">Schedule End:</span>
        <span>{{ formatDate(poll.schedule.end) }}</span>
      </div>

      <div class="poll-detail-item">
        <span class="detail-label">Status:</span>
        <span v-if="pollStatus=='Active'" style="color:green">{{ pollStatus }}</span>
        <span v-else style="color:red">{{ pollStatus }}</span>

      </div>
      
    </div>
   
    <div v-else>
  Loading Feedback details...
</div>
    <div class="contestants">
      <h3 style="color:teal">Responses:</h3>
      <v-data-table
  :headers="[...headers, { text: 'Actions', value: 'actions' }]" 
  :items="contestants"
  :items-per-page="5"
  :sort-by="'score'"
  :sort-desc="true"
  class="elevation-1"
>
  <template v-slot:body="{ items }">
    <tbody>
      <tr v-for="(item, index) in items" :key="item.id">
        <td>{{ index + 1 }}</td> <!-- Display the rank -->
        <!-- <td>{{ item.name }}</td> -->
        <router-link :to="`/contestant/${item.id}`">
            <td>{{ item.cid }}</td>
        </router-link>
        <!-- <td>{{ item.fid }}</td> -->
        <td>{{ item.content }}</td>
        <td>{{ new Date(item.createdAt).toLocaleString() }}</td>
        <td> <!-- New column for actions -->

          <v-btn color="primary" @click="showDetails(item)">Show Details</v-btn>

        </td>
      </tr>
    </tbody>
  </template>
</v-data-table>

    </div>
  
  </div>
</template>
<script>
import axios from'axios'
export default {
  data() {
    return {
      poll: null, // Initialize as null
      pid: '',
      contestants: [],
      modalOpen: false,
      selectedContestant: null,
      ContestantDialog: false,
      headers: [
        { text: 'Rank', value: 'index' },
        { text: 'CID', value: 'cid' },
        { text: 'Content', value: 'content' },
        { text: 'Created_At', value: 'createdAt' },
      ]
    };
  },
  async mounted() {
    const pollId = this.$route.params.id;
    this.pid = pollId;
    await this.fetchPoll(pollId);
     await this.fetchContestants(pollId);
    // setInterval(this.fetchContestants(pollId), 3000); // Call fetchPolls every 1 second
  },
  computed: {
    isScheduleStartPassed() {
      const currentDate = new Date();
      const startDate = this.poll ? new Date(this.poll.schedule.start) : new Date();
      return currentDate > startDate;
    },
    pollStatus() {
      const currentDate = new Date();
      const endDate = this.poll ? new Date(this.poll.schedule.end) : new Date();
      return currentDate > endDate ? 'Closed' : 'Active';
    }
  },
  methods: {
    async fetchPoll(pollId) {
      try {
        const response = await axios.get(`http://192.168.7.5:3000/feedback/feedbacks?id=${pollId}`);
        this.poll = response.data.find(poll => poll.id == pollId);
      } catch (error) {
        console.error('Error fetching poll:', error);
      }
    },
    async fetchContestants(pollId) {
      try {
        const response = await axios.get(`http://192.168.7.5:3000/response/fresponse?fid=${pollId}`);
        console.log(response.data)
        this.contestants = response.data;
      } catch (error) {
        console.error('Error fetching contestants:', error);
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    }
  }
};
</script>

<style scoped>
.contestant-dialog {
  border-radius: 10px;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.2);
}

.dialog-title {
  background-color: teal;
  color: #ffffff;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  padding: 15px 20px;
}

.contestant-details {
  padding: 20px;
  display: flex;
  justify-content: center;
}

.avatar-container {
  margin-right: 20px;
}

.detail-container {
  border-left: 2px solid teal;
  padding-left: 20px;
}

.detail-item {
  margin-top: 15px;
}

.v-btn {
  margin-right: 10px;
}
.poll-detail-container {
  margin-top: 20px;
}

.poll-details {
  margin-bottom: 20px;
}

.poll-detail-item {
  margin-bottom: 10px;
}

.detail-label {
  font-weight: bold;
  color: teal;
}

.contestants {
  margin-top: 20px;
}

/* Additional CSS for the table */
.v-data-table th {
  background-color: #f5f5f5; /* Background color of table headers */
  color: #333; /* Text color of table headers */
  font-weight: bold; /* Font weight of table headers */
}

.v-data-table td {
  padding: 12px; /* Padding of table cells */
}

.v-data-table tbody tr:hover {
  background-color: #f0f0f0; /* Background color of table rows on hover */
}

.v-pagination {
  margin-top: 20px; /* Margin of table pagination */
}

/* Additional CSS for Poll Information */
.poll-info {
  background-color: #f9f9f9; /* Background color of poll information container */
  padding: 15px; /* Padding of poll information container */
  border-radius: 5px; /* Border radius of poll information container */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Box shadow of poll information container */
}

.poll-info h3 {
  margin-bottom: 10px; /* Margin bottom for poll information titles */
}

/* Additional CSS for Poll Detail classes */
.poll-detail-container {
  background-color: #ffffff; /* Background color of poll detail container */
  border: 1px solid #e0e0e0; /* Border of poll detail container */
  border-radius: 5px; /* Border radius of poll detail container */
  padding: 20px; /* Padding of poll detail container */
}

.poll-details h3 {
  color: #333; /* Text color of poll detail section titles */
  margin-bottom: 15px; /* Margin bottom for poll detail section titles */
}

.poll-detail-item {
  display: flex; /* Use flexbox layout for poll detail items */
  align-items: center; /* Align items vertically */
}

.detail-label {
  width: 150px; /* Set width for detail label */
  font-weight: bold; /* Font weight of detail label */
}

.detail-value {
  flex: 1; /* Fill remaining space */
}

.contestants {
  margin-top: 30px; /* Margin top for contestants section */
}

/* Responsive styles */
@media screen and (max-width: 768px) {
  .poll-detail-item {
    flex-direction: column; /* Stack items vertically on small screens */
    align-items: flex-start; /* Align items to start on small screens */
  }

  .detail-label {
    margin-bottom: 5px; /* Reduce margin bottom for detail label on small screens */
    width: auto; /* Set width to auto for small screens */
  }

  .detail-value {
    width: 100%; /* Set width to 100% for small screens */
  }
}
.active-status {
  color: green;
}
</style>