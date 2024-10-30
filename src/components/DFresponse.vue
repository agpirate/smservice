<template>
  <div class="poll-detail-container">
    <h1 style="color: teal;">Default Feedback :</h1>
    <template>
      <v-container>
        <v-row>
          <v-col cols="3">
            <v-select
              v-model="selectedDay"
              :items="days"
              label="Day"
              outlined
              dense
              ></v-select>
          </v-col>
          <v-col cols="3">
            <v-select
              v-model="selectedMonth"
              :items="months"
              label="Month"
              outlined
              dense
              ></v-select>
          </v-col>
          <v-col cols="3">
            <v-select
              v-model="selectedYear"
              :items="years"
              label="Year"
              outlined
              dense
              ></v-select>
          </v-col>
          <v-col cols="3">
            <v-btn color="primary" @click="clearFilter">Clear</v-btn>

          </v-col>
        </v-row>
      </v-container>

    </template>
    <div v-if="contestants" class="contestants">
      <h3 style="color:teal">Responses:</h3>
      <v-data-table
  :headers="[...headers, { text: 'Actions', value: 'actions' }]" 
  :items="filteredItems"
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
            <td>{{ item.cid }}</td>
        <!-- <td>{{ item.fid }}</td> -->
        <td style="max-width: 30vw; overflow: hidden; text-overflow: ellipsis;">{{ item.content }}</td>
        <td>{{ new Date(item.createdAt).toLocaleString() }}</td>
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
            <div><strong>Answer:</strong> {{ selectedContestant.content }}</div>
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

      selectedDay:'',
      selectedMonth:'',
      selectedYear:'',
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
      ],
      days:Array.from({length:31}, (_, i) => (i+1).toString().padStart(2, '0')),
      months:Array.from({length:12}, (_, i) => (i+1).toString().padStart(2, '0')),
      years:Array.from({length:5}, (_, i) => (2024+i).toString())
    };
  },
  computed:{
    filteredItems(){
      return this.contestants.filter(item =>{
        const itemDate = new Date(item.createdAt);
        // const selectedDate = new Date(`${this.selectedYear}-${this.selectedMonth}-${this.selectedDay}`)

        if(this.selectedDay && itemDate.getDate()!==parseInt(this.selectedDay)) return false;
        if(this.selectedMonth && (itemDate.getMonth()+1)!==parseInt(this.selectedMonth)) return false;
        if(this.selectedYear && itemDate.getFullYear()!==parseInt(this.selectedYear)) return false;

        return true;

      })

    }
  },
  async mounted() {
   
     await this.fetchContestants();
    // setInterval(this.fetchContestants(pollId), 3000); // Call fetchPolls every 1 second
  },
 
  methods: {
    clearFilter(){
      this.selectedDay = '',
      this.selectedMonth = '',
      this.selectedYear = ''
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
 
    async fetchContestants() {
      try {
        const response = await axios.get(`http://192.168.7.5:3000/response/fresponse?fcode=default`);
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
.v-select {
  background-color: #ffffff;
}
</style>