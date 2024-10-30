<template>
  <div class="poll-detail-container">
   
      <h1 style="color: teal;">Question Detail:</h1>
      <div class="poll-details" v-if="poll" style="display: flex; flex-flow: row; justify-content: space-around; gap:15px">
        <div>
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
          <span>{{ poll.qcode }}</span>
        </div>
        <div class="poll-detail-item">
          <span class="detail-label">Answer:</span>
          <span>{{ poll.answer }}</span>
        </div>
        <div class="poll-detail-item">
          <span class="detail-label">Schedule Start:</span>
          <span>{{ new Date(poll.schedule.start).toLocaleString() }}</span>
        </div>
        <div class="poll-detail-item">
          <span class="detail-label">Schedule End:</span>
          <span>{{ new Date(poll.schedule.end).toLocaleString() }}</span>
        </div>
        <div class="poll-detail-item">
          <span class="detail-label">Status:</span>
          <span v-if="pollStatus=='Active'" style="color:green">{{ pollStatus }}</span>
          <span v-else style="color:red">{{ pollStatus }}</span>

        </div>
      </div>
      <v-card class="pa-1" >
      <!-- <v-card-title class="text-h5">Time:</v-card-title> -->
          <v-card-text>
            <div class="text-center text-h3" style="font-weight:bolder;">{{ formattedTime }}</div>
          </v-card-text>
     </v-card>
      

    </div>
   
    <div v-else>
  Loading Question details...
</div>
    <div class="contestants">
      <!-- Search input for filtering -->
    <div style="color:teal; font-weight: bolder;">Search Answer:</div>
    <v-text-field
      v-model="search"
      label="Search"
      solo
      hide-details
      class="mx-4 mt-4"
    style="width:30%"></v-text-field>
      <h3 style="color:teal">Responses:</h3>
      <v-data-table
      :headers="[...headers, { text: 'Actions', value: 'actions' }]" 
      :items="contestants"
      :items-per-page="5"
      :sort-by="'score'"
      :sort-desc="true"
      :search="search" 
      class="elevation-1"
    >
<!-- Slot for search -->
<template v-slot:search="{ items, headers }">
      <tr>
      <td
        v-for="header in headers"
        :key="header.text"
      >
        <v-text-field
        :value="searchValue[header.value]"
          @input="updateSearch(header.value, $event.target.value)" 
          :label="header.text"
          class="mx-4 mt-4"
          solo
          hide-details
        ></v-text-field>
      </td>
    </tr>
  </template>
  <template v-slot:body="{ items }">
    <tbody>
      <tr v-for="(item, index) in items" :key="item.id">
        <td>{{ index + 1 }}</td> <!-- Display the rank -->
        <!-- <td>{{ item.name }}</td> -->
        <button @click="showDetails(item)">
          <td >{{ item.cid }}</td>
        </button>
       
        <td>{{ item.qid }}</td>
        <td v-if="item.correct" style="color:green; font-weight:bold;">{{ item.answer }}</td>
        <td v-else style="color:red">{{ item.answer }}</td>
        <td v-if="item.correct" style="color:green"><v-icon style="color:green"> check</v-icon></td>
        <td v-else style="color:red"><v-icon style="color:red"> close</v-icon></td>


        <td>{{ new Date(item.createdAt).toLocaleString()}}</td>
        <td> <!-- New column for actions -->

          <v-btn color="primary" @click="showDetails(item)">Show Details</v-btn>

        </td>
      </tr>
    </tbody>
  </template>
  
</v-data-table>
  
    </div>
     <!-- Dialog for showing contestant details -->
     <v-dialog v-model="ContestantDialog" max-width="600">
      <!-- <template v-slot:activator="{ on }"></template> -->
      <v-card>
        <v-card-title class="dialog-title">Client Details:</v-card-title>
        <v-col>
        <v-avatar size="60">
          <img :src="require(`@/assets/images.png`)" alt="Tigray TV">
        </v-avatar>
        </v-col>
        <v-col >
          <v-card-text>
          <div v-if="selectedContestant">
            <div style="font-weight: bolder;"><strong>Client Phone: </strong><u>{{ this.client.phone }}</u> </div>
            <div><strong>Question ID:</strong> {{ poll.summary }}</div>
            <div><strong>Answer:</strong> {{ selectedContestant.answer }}</div>
            <div><strong>Created At:</strong> {{ new Date(selectedContestant.createdAt).toLocaleString() }}</div>
            
          </div>
        </v-card-text>
        </v-col>
        
        <v-card-actions>
          <v-btn color="primary" @click="closeDialog">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>

</template>
<script>
import axios from'axios'
export default {
  data() {
    return {
      poll: null, // Initialize as null
      pid: '',
      client:null,
      contestants: [],
      modalOpen: false,
      selectedContestant: null,
      ContestantDialog: false,
      targetTime:null,
      currentTime:null,
      interval:null,
      search: '', // Add a search property
      searchValue: {}, // Initialize an object to hold search values for each column
      headers: [
        { text: 'Rank', value: 'index' },
        { text: 'CID', value: 'cid' },
        { text: 'QEUSTION ID', value: 'qid' },
        { text: 'Answer', value: 'answer' },
        { text: 'Remark' },

        { text: 'Created_At', value: 'createdAt' },
      ]
    };
  },
  async mounted() {
    const pollId = this.$route.params.id;
    this.pid = pollId;
    await this.fetchPoll(pollId);
    await this.fetchContestants(pollId);
    this.targetTime = new Date(this.poll.schedule.end).getTime()
    this.currentTime = new Date().getTime();

    console.log(this.targetTime)
    setInterval(() => {
    this.fetchContestants(pollId); // Call fetchContestants every 1 second

  }, 3000);
  setInterval(() => {
    
    this.currentTime = new Date().getTime();
    console.log(this.currentTime)

  }, 1000);
  console.log(this.currentTime)
  },
  computed: {

    remainingTime(){
      if(this.targetTime && this.currentTime){
        return Math.max(0, Math.floor((this.targetTime-this.currentTime)/1000))
      }
      return 0
    },

    formattedTime(){
      const time =this.remainingTime;
      const hours = Math.floor(time/3600)
      const minutes = Math.floor((time%3600)/60)
      const seconds = time%60
      return `${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`
    },
    // Filter contestants based on search query
  filteredContestants() {
    return this.contestants.filter(contestant => {
      return Object.values(contestant).some(val =>
        val.toString().toLowerCase().includes(this.search.toLowerCase())
      );
    });
  },
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
    // isScheduleStartPassed() {
    //   const currentDate = new Date();
    //   const startDate = new Date(this.poll.schedule.start);
    //   return currentDate > startDate;
    // },
    updateSearch(key, value) {
      // Update the corresponding search value
      this.searchValue[key] = value;
    },

    closeDialog() {
      this.ContestantDialog = false; // Close the dialog
    },
    async showDetails(item){
      const id = item.cid;
      const response = await axios.get(`http://192.168.7.5:3000/client/clients?id=${id}`);
      this.client = response.data[0];
      console.log(response.data)
      this.selectedContestant = item;
      //const phone = this.client.phone
      // console.log(this.client.phone)
      // this.selectedContestant.push(phone)
      this.ContestantDialog = true; // Open the dialog

    },
    async fetchPoll(pollId) {
      try {
        const response = await axios.get(`http://192.168.7.5:3000/question/questions?id=${pollId}`);
        this.poll = response.data.find(poll => poll.id == pollId);
      } catch (error) {
        console.error('Error fetching poll:', error);
      }
    },
    async fetchContestants(pollId) {
      try {
        const response = await axios.get(`http://192.168.7.5:3000/answer/answers?qid=${pollId}`);
        console.log('req')
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