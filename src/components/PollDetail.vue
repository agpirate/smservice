<template>
  <div class="poll-detail-container">
    <h1 style="color: teal;">Poll Detail</h1>
    <div class="poll-details">
      <div class="poll-detail-item">
        <span class="detail-label">Summary:</span>
        <span>{{ poll.summary }}</span>
      </div>
      <div class="poll-detail-item">
        <span class="detail-label">Creator ID:</span>
        <span>{{ poll.creator_id }}</span>
      </div>
      <div class="poll-detail-item">
        <span class="detail-label">Program ID/Code:</span>
        <span>{{ poll.programId }}</span>
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
      <span class="detail-label">Poll Status:</span>
        <span :class="{ 'active-status': pollStatus === 'Active', 'closed-status': pollStatus === 'Closed' }">{{ pollStatus }}</span>
      </div>
    </div>
    <!-- Create Contestant button -->
    <v-btn color="teal" @click="openModal" :disabled="isScheduleStartPassed">Create Contestant</v-btn>
    <!-- <v-btn color="teal" @click="openModal">show Poll Detail in Graph</v-btn>
    <v-btn color="teal" @click="openModal">Pending Option</v-btn>
    <v-btn color="teal" @click="openModal">Other Option</v-btn> -->

    <div class="contestants">
      <h3 style="color:teal">Contestants</h3>
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
            <td>{{ item.name }}</td>
        </router-link>
        <td>
          <v-avatar size="40">
            <!-- <img :src="'http://192.168.7.5:8000/uploads/' + item.photo" alt="Contestant Photo"> -->

            <img :src="'http://192.168.7.5:3000/photos/' + item.photo" alt="Contestant Photo">
          </v-avatar>
        </td>
        <td>{{ item.age }}</td>
        <td>{{ item.code }}</td>
        <td>{{ item.score }}</td>
        <td> <!-- New column for actions -->
          <v-btn color="primary" @click="openEditModal(item)" :disabled="isScheduleStartPassed">Edit</v-btn> <!-- Edit button -->

          <v-btn color="primary" @click="showDetails(item)">Show Details</v-btn>

        </td>
      </tr>
    </tbody>
  </template>
</v-data-table>

    </div>


   <!-- Modal for editing contestant details -->
   <v-dialog v-model="editModalOpen" max-width="500">
    <v-card>
      <v-card-title style="color: teal">Edit Contestant</v-card-title>
      <v-card-text>
        <!-- Form for editing contestant details -->
        <v-form @submit.prevent="submitEditedContestant">
          <v-text-field v-model="editedContestant.name" label="Name"></v-text-field>
          <v-text-field v-model="editedContestant.age" label="Age"></v-text-field>
          <v-text-field v-model="editedContestant.code" label="Code"></v-text-field>

          <v-btn color="teal" type="submit" style="margin-left: 10px;">Save</v-btn>
          <v-btn color="teal" @click="cancelEdit" style="margin-left: 10px;">Cancel</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
 <!-- Dialog for contestant details -->
 <v-dialog v-model="ContestantDialog" max-width="700">
    <v-card class="contestant-dialog">
      <v-card-title class="dialog-title">Contestant Details:</v-card-title>
      <v-card-text>
        <!-- Display contestant details here -->
        <div v-if="selectedContestant" class="contestant-details">
          <div class="avatar-container">
            <v-avatar size="200">
              <!-- <img :src="'http://192.168.7.5:8000/uploads/' + selectedContestant.photo" alt="Contestant Photo"> -->

              <img :src="'http://192.168.7.5:3000/photos/' + selectedContestant.photo" alt="Contestant Photo">
            </v-avatar>
          </div>
          <div class="detail-container">
            <div class="detail-item"><strong>Name:</strong> {{ selectedContestant.name }}</div>
            <div class="detail-item"><strong>Age:</strong> {{ selectedContestant.age }}</div>
            <div class="detail-item"><strong>Code:</strong> {{ selectedContestant.code }}</div>
            <div class="detail-item"><strong>Score:</strong> {{ selectedContestant.score }}</div>
            <!-- Add other contestant details as needed -->
          </div>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn color="teal" @click="ContestantDialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
     <!-- Modal for entering contestant details -->
     <v-dialog v-model="modalOpen" max-width="500">
      <v-card>
        <v-card-title style="color:teal">Create Contestant</v-card-title>
        <v-card-text>
          <!-- Form for entering contestant details -->
          <v-form @submit.prevent="submitContestant">
            <v-text-field v-model="contestant.name" label="Name"></v-text-field>
            <v-file-input
              v-model="contestant.photo"
              label="Photo"
              accept="image/*" 
              prepend-icon="mdi-camera"
              placeholder="Select or drop an image"
            ></v-file-input>
            <v-text-field v-model="contestant.age" label="Age"></v-text-field>
            <v-text-field v-model="contestant.code" label="Code"></v-text-field>

            <v-btn color="teal" type="submit" style="margin-left: 10px;">Submit</v-btn>
            <!-- <v-btn color="teal" type="submit">Cancel</v-btn> -->
            <v-btn color="teal" @click="cancelSubmission" style="margin-left: 10px;">Cancel</v-btn>


          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      poll: {},
      pid:'',
      contestants: [],
      modalOpen: false,
      selectedContestant: null,
      ContestantDialog: false, // Control the visibility of the dialog
      contestant: {
        name: '',
        age: '',
        code: '',
        score: 0
      },
      // New data properties for editing contestants
      editModalOpen: false,
      editedContestant: {
        id: null,
        name: '',
        age: '',
        code: ''
      },
      headers: [
        { text: 'Rank', value: 'index' },
        { text: 'Name', value: 'name' },
        { text: 'Photo', value: 'photo' },
        { text: 'Age', value: 'age' },
        { text: 'Code', value: 'code' },
        {text:'Score',value: 'score'}
      ]
    };
  },

  beforeMount(){
    this.fetchContestants(this.$route.params.id)
  },

  mounted(){
    
    this.fetchContestants(this.$route.params.id)
    setInterval(() => {
    this.fetchContestants(this.$route.params.id); // Call fetchContestants every 1 second
  }, 1000);
  },
  computed: {


    isScheduleStartPassed() {
      const currentDate = new Date();
      const startDate = new Date(this.poll.schedule.start);
      return currentDate > startDate;
    },
    pollStatus() {
      const currentDate = new Date();
      const endDate = new Date(this.poll.schedule.end);
      return currentDate > endDate ? 'Closed' : 'Active';
    }
  },
  async created() {
    const pollId = this.$route.params.id;
    this.pid = pollId;
    await this.fetchPoll(pollId);
    await this.fetchContestants(pollId);
  },
  methods: {
    // Method to open edit modal
    openEditModal(contestant) {
      // Set the edited contestant data
      this.editedContestant = {
        id: contestant.id,
        name: contestant.name,
        age: contestant.age,
        code: contestant.code
      };
      // Open the edit modal
      this.editModalOpen = true;
    },
    // Method to cancel edit and close modal
    cancelEdit() {
      this.editModalOpen = false;
      // Reset edited contestant data
      this.editedContestant = {
        id: null,
        name: '',
        age: '',
        code: ''
      };
    },
    // Method to submit edited contestant details
    async submitEditedContestant() {
      try {
        // Send edited contestant data to the server
        // const response = await axios.put(`/poll_contestants/${this.editedContestant.id}.json`, this.editedContestant);

        const response = await axios.put(`http://192.168.7.5:3000/contestant/contestants?id=${this.editedContestant.id}`, this.editedContestant);
        // Log success message or handle response
        console.log('Contestant edited successfully:', response.data);
        // Close the edit modal
        this.editModalOpen = false;
        // Refresh contestant list
        await this.fetchContestants(this.poll.id);
      } catch (error) {
        console.error('Error editing contestant:', error);
      }
    },

    showDetails(contestant) {
      this.selectedContestant = contestant;
      this.ContestantDialog = true; // Open the dialog
    },

    cancelSubmission() {
      // Reset the contestant data and close the modal
      this.contestant = {
        name: '',
        age: '',
        code: '',
        photo: null // Reset the photo field
      };
      this.modalOpen = false;
    },
    openModal() {
      this.modalOpen = true;
    },
    async submitContestant() {
      try {
        console.log('here in contestant form1')

        // Send contestant data to the server
        // Create a FormData object
        const formData = new FormData();
        // Append contestant details to the FormData object
        formData.append('name', this.contestant.name);
        formData.append('age', this.contestant.age);
        formData.append('code', this.contestant.code);
        formData.append('pid', this.pid);

           // Append the selected file to the FormData object
        formData.append('photo', this.contestant.photo);
        console.log('here in contestant form')
        // Send contestant data to the server using Axios
        // let response = await axios.get('http://192.168.7.5/pollcontestant/pll')
          // console.log(response)
          try {
            // let response = await axios.post('http://192.168.7.5:8000/pollcontestant/pll', formData, {

            let response = await axios.post('http://192.168.7.5:3000/contestant/contestants', formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            });
            console.log(response.data); // Handle the response data here
            if(response.data){
              this.contestants.push(response.data);

            }
          } catch (error) {
            alert('ERROR:')
            console.log("Upload error:")
            console.log(error)

            // console.error('Error:', error); // Handle any errors
          }
        // console.log('response from pollApi')
        //   console.log(response)
        // await axios.post(`/poll_contestants.json?pid=${this.poll.id}`, formData, {
        //   headers: {
        //     'Content-Type': 'multipart/form-data' // Set content type to multipart/form-data
        //   }
        // });
          // Refresh contestant list
        //await this.fetchContestants(this.poll.id);

        // // Reset contestant data
        // this.contestant = {
        //   name: '',
        //   age: '',
        //   code: '',
        //   photo: null // Reset the photo field
        // };
        //await axios.post(`/poll_contestants.json?pid=${this.poll.id}`, this.contestant);
        
        // Close the modal
        this.modalOpen = false;

        // Refresh contestant list
        await this.fetchContestants(this.poll.id);

        // Reset contestant data
        this.contestant = {
          name: '',
          age: '',
          code: ''
        };
      } catch (error) {
        console.log('error:'+error)
        console.error('Error creating contestant:', error);
      }
    },
    async fetchPoll(pollId) {
    

      try {
        // const response = await axios.get('http://192.168.1.6:9100/pollApi/plls'); // Fetch data from JSON file

        // const response = await axios.get('/polls.json');
        const token =localStorage.getItem('token');
        // Set up headers
        const headers = {
          'Content-Type': 'application/json',
        };

        // Add token to headers if it exists
        if (token) {
          headers['Authorization'] = `${token}`;
        }

        // Add username to headers if it exists
        const response = await axios.get(`http://192.168.7.5:3000/pollprogram/pollprograms/?id=${this.$route.params.id}`, {

                                headers: headers
                                  });

        //  const response = await axios.get('http://192.168.7.5:8000/poll');
        const poll = response.data.find(poll => poll.id == pollId);
        this.poll = poll;
      } catch (error) {
        console.error('Error fetching poll:', error);
      }
    },
    // calculateScore(code, response){
    // let score=0;
    //  response.forEach(res => {
    //  console.log(res)
    //   if(res.c_code == code){
    //        score++;
    //       }
         
    //  })
    //  return score || 0;
    // },
    async fetchContestants(pollId) {
      try {
        //const response = await axios.get(`/poll_contestants.json?pid=${pollId}`);
        // const response = await axios.get(`http://192.168.7.5:8000/pollcontestant/pll?pid=${pollId}`)

        const response = await axios.get(`http://192.168.7.5:3000/contestant/contestants?pid=${pollId}`)
        // const response_score = await axios.get(`http://192.168.7.5:8000/panswer?pid=${pollId}`)
        console.log(response.data)
        if(response.data){
          this.contestants = response.data;
        }
        // response_score = await axios.get(`http://192.168.7.5:8000/panswer?pid=${pollId}`)
        //console.log("Response of contestants from Server:")
        //console.log(response)
        // const panswers = response_score.data.filter(res => res.pid ==pollId)
        // console.log(response_score)
        // let contestants = response.data;
        // this.contestants = contestants.filter(cont => cont.pid ==pollId)
        // // Add a score property to each contestant object
        // this.contestants.forEach(contestant =>{
        //     contestant.score = this.calculateScore(contestant.code,panswers) || 0;
        // })
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