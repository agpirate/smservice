<template>
  <div>
    <h2 class="table-title">Polls</h2>
    <button @click="openCreateDialog" class="create-button">Create New Poll</button>

    <div class="filters">
      <input v-model="filterTitle" class="filter-input" placeholder="Search Title">
      <input v-model="filterCreatorId" class="filter-input" placeholder="Search Creator ID">
      <input v-model="filterProgramIdCode" class="filter-input" placeholder="Search Program ID/Code">
      <input v-model="filterScheduleStart" class="filter-input" placeholder="Search Schedule Start">
      <input v-model="filterScheduleEnd" class="filter-input" placeholder="Search Schedule End">

    </div>
    <table class="poll-table">
      <thead>
        <tr>
          <th v-for="column in columns" :key="column" @click="sortByColumn(column)" :class="{ 'sorted-column': sortedColumn === column }">
            {{ column }}
            <span v-if="sortedColumn === column" :class="sortDirection === 'asc' ? 'arrow-up' : 'arrow-down'"></span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(poll, index) in paginatedPolls" :key="poll.id">
          <td>{{ index + 1 }}</td>
          <router-link :to="`/polls/${poll.id}`">
            <td>{{ poll.summary }}</td>
          </router-link>
          <td>{{ poll.creator_id }}</td>
          <td>{{ poll.programId }}</td>
          <td>{{ formatDate(poll.schedule.start) }}</td>
          <td>{{ formatDate(poll.schedule.end) }}</td>
          <!-- <td>{{ formatDate(poll.schedule.start) }}</td>
          <td>{{ formatDate(poll.schedule.end) }}</td> -->
          <td>
            <v-btn icon @click="editPoll(poll)" color="teal" small :disabled="shouldDisableEditButton(poll)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon @click="deletePoll(poll.id)" color="red" small :disabled="shouldDisableEditButton(poll)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="pagination">
      <button color="primary"><router-link :to="{ path: $route.path, query: { ...$route.query, page: Math.max(1, currentPage - 1) } }" class="prev" :class="{ disabled: currentPage === 1 }">Prev</router-link></button>
      <span v-for="n in totalPages" :key="n">
        <router-link :to="{ path: $route.path, query: { ...$route.query, page: n } }" :class="{ active: n === currentPage }">{{ n }}</router-link>
      </span>
      <button color="primary"><router-link :to="{ path: $route.path, query: { ...$route.query, page: Math.min(totalPages, currentPage + 1) } }" class="next" :class="{ disabled: currentPage === totalPages }">Next</router-link></button>
    </div>


<!-- Confirmation Dialog -->
<dialog ref="confirmationDialog" class="modal">
      <h3>Are you sure you want to delete this poll?</h3>
      <div class="button-group">
        <button @click="confirmDeletePoll" style="margin: 10px;" >Yes</button>
        <button @click="cancelDeletePoll">No</button>
      </div>
    </dialog>

<!-- Edit Modal -->
<dialog ref="editDialog" class="modal">
      <h3>Edit Poll</h3>
      <form @submit.prevent="updatePoll">
        <!-- Form inputs for editing a poll -->
        <v-textarea v-model="editedPoll.summary" @input="validateSummary" label="Summary" class="custom-textarea"></v-textarea>
          <span v-if="summaryError" class="error-message">{{ summaryError }}</span>        <input v-model="editedPoll.programIdcode" @input="validateProgramId" class="filter-input" placeholder="Program ID/Code">
        <span v-if="programIdError" class="error-message">{{ programIdError }}</span>        <div>
          <label for="editStartDate">Schedule Start:</label>
          <input id="editStartDate" v-model="editedPoll.schedule.start" type="datetime-local">
          
          <label for="editEndDate">Schedule End:</label>
          <input id="editEndDate" v-model="editedPoll.schedule.end" type="datetime-local">
        </div>
        <div class="button-group">
          <button type="submit"  style="margin: 10px;">Submit</button>
          <button type="button" @click="cancelEditPoll">Cancel</button>
       </div>
      </form>
    </dialog>


    <dialog ref="createDialog" class="modal">
  <h3>Create New Poll</h3>
  <form @submit.prevent="createPoll">
    <!-- Form inputs for creating a new poll -->
    <v-textarea v-model="newPoll.summary" @input="validateSummary" label="Summary" class="custom-textarea"></v-textarea>
  <span v-if="summaryError" class="error-message">{{ summaryError }}</span>    <!-- <input label="creator_id" v-model="newPoll.creator_id" :placeholder="newPoll.creator_id" readonly> -->
    <input v-model="newPoll.programIdcode" @input="validateProgramId" class="filter-input" placeholder="Program ID/Code"> 
    <span v-if="programIdError" class="error-message">{{ programIdError }}</span>      
    <div>
   
      <label for="startDate">Schedule Start:</label>
      <input id="startDate" v-model="newPoll.schedule.start" type="datetime-local">
      
      <label for="endDate">Schedule End:</label>
      <input id="endDate" v-model="newPoll.schedule.end" type="datetime-local">
    </div>
    <div class="button-group">
      <button type="submit"  style="margin: 10px;">Submit</button>
      <button type="button" @click="cancelCreatePoll">Cancel</button>

    </div>
  </form>
</dialog>


  </div>
</template>

<script>
import axios from 'axios';
//import Paginate from 'vuejs-paginate';

export default {
  components: {
    //Paginate
  },
  data() {
    return {
      programIdError: '', // New data property to store the validation error message
      pollToDelete: null,
      summaryError: '', // New data property to store the validation error message for summary

      editedPoll: {
        id: '', // Add an id property to track the edited poll
        summary: '',
        creator_id:'',
        programId: '',
        schedule: {
          start: '',
          end: ''
        }
      },
      
      createDialogVisible: false,
      newPoll: {
        summary: '',
        creator_id:localStorage.getItem('id'),
        programIdcode: '',
        schedule: {
          start: '',
          end: ''
        }
      },
      polls: [],
      currentPage: 1,
      
      pageSize: 10, // Number of items per page
      sortedColumn: null,
      sortDirection: 'asc', // Default sorting direction
      filterTitle: '',
      filterCreatorId: '',
      filterProgramIdCode: '',
      filterScheduleStart: '',
      filterScheduleEnd: '',
    };
  },
  async mounted() {
    await this.fetchPolls();
    setInterval(() => {
    this.fetchPolls(); // Call fetchContestants every 1 second
  }, 1000);
  
  },
  watch: {
    '$route.query.page'(newValue) {
      this.currentPage = parseInt(newValue) || 1;
      this.fetchPolls();
    }
  },
  methods: {
    validateSummary() {
      if (!this.newPoll.summary.trim()) {
        this.summaryError = "Summary cannot be empty";
      } else {
        this.summaryError = ''; // Reset the error message if validation passes
      }
    },
    validateProgramId() {
      if (this.newPoll.programIdcode.length !== 2 || this.newPoll.programIdcode[0] !== 'p') {
        // Display an error message or take appropriate action
        console.log("Program ID/Code should have 2 characters and start with 'p'");
      }
    },
    shouldDisableEditButton(poll) {
    // Check if the current user is not an admin and if the poll's creator_id is different from the current user's ID
    // Also check if the poll's start schedule has passed
    // if (!this.isAdmin && poll.creator_id !== localStorage.getItem('id') && new Date(poll.schedule.start) < new Date()) {

    if (!this.isAdmin && poll.creator_id !== localStorage.getItem('id') && new Date(poll.schedule.end) < new Date()) {
      return true;
    }
    return false;
  },
    deletePoll(pollId) {
      // Store the poll ID to be deleted
      this.pollToDelete = pollId;
     
      // Show the confirmation dialog
      this.$refs.confirmationDialog.showModal();
    },
    async confirmDeletePoll() {
  // Remove the poll from local storage
  let polls = JSON.parse(localStorage.getItem('myPollData')) || [];
  const index = polls.findIndex(poll => poll.id === this.pollToDelete);
  if (index !== -1) {
    polls.splice(index, 1);
    localStorage.setItem('myPollData', JSON.stringify(polls));
  }
  
  const pid = this.pollToDelete;
  if (pid) {
    try {
      //await axios.delete(`http://localhost:8000/poll/${pid}`);
      const response = await axios.delete('http://localhost:3000/pollprogram/pollprograms?id='+pid); 
      console.log(response.data);
      // Remove the poll from the component data
    } catch (error) {
      console.error('Error deleting poll:', error);
      // Handle error
    }
  }
  this.polls = this.polls.filter(poll => poll.id !== this.pollToDelete);


  // Reset the pollToDelete variable
  this.pollToDelete = null;

  // Close the confirmation dialog
  this.$refs.confirmationDialog.close();
},
    cancelDeletePoll() {
      // Reset the pollToDelete variable
      this.pollToDelete = null;
      
      // Close the confirmation dialog
      this.$refs.confirmationDialog.close();
    },
  
    // Method to open edit dialog
    editPoll(poll) {
      this.editedPoll = { ...poll }; // Copy the poll object to editedPoll
      this.$refs.editDialog.showModal(); // Show the edit dialog
    },
     // Method to update poll
     async updatePoll() {
      // Perform validation before creating a new poll
      if (this.editedPoll.programIdcode.length !== 2 || this.editedPoll.programIdcode[0] !== 'p') {
        this.programIdError = "Program ID/Code should have 2 characters and start with 'p'";
        return; // Exit the method if validation fails
      }
      // Update the poll in local storage
      // let polls = JSON.parse(localStorage.getItem('myPollData')) || [];
      // const index = polls.findIndex(p => p.id === this.editedPoll.id);
      // if (index !== -1) {
      //   polls[index] = { ...this.editedPoll };
      //   // Update the polls data in the component
      //   this.$set(this.polls, index, { ...this.editedPoll });  
      //   localStorage.setItem('myPollData', JSON.stringify(polls));
      // }
      // let polls = JSON.parse(localStorage.getItem('myPollData')) || [];
      // console.log(this.newPoll)
      // polls.push(this.newPoll);
      let poll=this.editedPoll;
    //  const response = await axios.post('http://localhost:8000/poll',poll); // Fetch data from JSON file
     const response = await axios.put('http://localhost:3000/pollprogram/pollprograms',poll); // Fetch data from JSON file
     const index = this.polls.findIndex(p => p.id === this.editedPoll.id);
     console.log(response.data)
     if (index !== -1) {
          this.polls[index] = { ...this.editedPoll };
          this.$set(this.polls, index, { ...this.editedPoll });
            // Close the edit dialog
            this.$refs.editDialog.close();
         }      // Close the edit dialog
      this.$refs.editDialog.close();
    },
     // Method to cancel edit
     cancelEditPoll() {
      this.$refs.editDialog.close();
    },
    cancelCreatePoll() {
    // Reset the newPoll object and close the dialog
    this.newPoll = {
      summary: '',
      creator_id: '',
      programIdcode: '',
      schedule: {
        start: '',
        end: ''
      }
    };
    this.$refs.createDialog.close();
  },
    openCreateDialog() {
      console.log("Opening create dialog...");

      this.$refs.createDialog.showModal(); // Show the dialog
    },
    async createPoll() {
      // Perform validation before creating a new poll
      if (this.newPoll.programIdcode.length !== 2 || this.newPoll.programIdcode[0] !== 'p') {
        this.programIdError = "Program ID/Code should have 2 characters and start with 'p'";
        return; // Exit the method if validation fails
      }
      // Save the new poll to local storage
      let polls = JSON.parse(localStorage.getItem('myPollData')) || [];
      console.log(this.newPoll)
      polls.shift(this.newPoll);
      let poll={
          creator_id:localStorage.getItem('id'),
          summary:this.newPoll.summary,
          programId:this.newPoll.programIdcode,
          schedule:{
            start:this.newPoll.schedule.start,
            end:this.newPoll.schedule.end,
          }
      }
      console.log('creator:')
      console.log(poll.creator_id)
    //  const response = await axios.post('http://localhost:8000/poll',poll); // Fetch data from JSON file
     const response = await axios.post('http://localhost:3000/pollprogram/pollprograms',poll); // Fetch data from JSON file
 
     console.log('post response:')
      console.log(response.data)
      this.polls.shift(response.data)
      localStorage.setItem('myPollData', JSON.stringify(polls));
     // this.polls.push(this.newPoll);

       // Close the dialog and reset the newPoll object
       this.$refs.createDialog.close(); // Close the dialog
       this.newPoll= {
        summary: '',
        creator_id: '',
        programIdcode: '',
        schedule: {
          start: '',
          end: ''
        }
      }
    },
    async fetchPolls() {
      try {
        console.log('poll:'+this.polls.length)

        if(this.polls.length==0) {
          // axios.defaults.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
          // axios.defaults.headers['Content-type'] = 'application/json';
          // axios.defaults.headers['Content-type'] = 'multipart/form-data';
          // const response = await axios.get('/polls.json'); // Fetch data from JSON file
           
              // Retrieve the token and username from Vuex store
        const token =this.$store.getters.token;
        const username = this.$store.getters.currentUser;
        console.log(token)

        // Set up headers
        const headers = {
          'Content-Type': 'application/json',
        };

        // Add token to headers if it exists
        if (token) {
          headers['Authorization'] = `${token}`;
        }

        // Add username to headers if it exists
        if (username) {
          headers['X-Username'] = username;
        }

        // Make the request with Axios
           
        // const response = await axios.get('http://localhost:8000/poll', {
          const response = await axios.get('http://localhost:3000/pollprogram/pollprograms', {

          headers: headers
            }); // Fetch data from JSON file
          console.log('response from pollApi')
          console.log(response.data)
          localStorage.setItem('myPollData', JSON.stringify(response.data));
          this.polls = response.data;
        }else{
          // const response = await axios.get('http://localhost:8000/poll'); // Fetch data from JSON file
          // this.polls = '';
         // this.polls = JSON.parse(localStorage.getItem('myPollData')) || [];

        }
        
      } catch (error) {
        console.log(error);
      }
    },
    toggleSortDirection() {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    },
    sortByColumn(column) {
      if (this.sortedColumn === column) {
        this.toggleSortDirection();
      } else {
        this.sortedColumn = column;
        this.sortDirection = 'asc';
      }

      this.filteredPollList.sort((a, b) => {
        let aValue = this.getColumnValue(a, column.toLowerCase());
        let bValue = this.getColumnValue(b, column.toLowerCase());

        if (column.toLowerCase() === 'schedule start' || column.toLowerCase() === 'schedule end') {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }

        if (this.sortDirection === 'asc') {
          if (aValue < bValue) return -1;
          if (aValue > bValue) return 1;
          return 0;
        } else {
          if (aValue > bValue) return -1;
          if (aValue < bValue) return 1;
          return 0;
        }
      });
    },
    getColumnValue(poll, column) {
      switch (column) {
        case 'summary':
          return poll.summary.toLowerCase();
        case 'creator_id':
          return poll.creator_id.toLowerCase();
        case 'programidcode':
          return poll.programidcode.toLowerCase();
        case 'schedule start':
          return poll.schedule.start;
        case 'schedule end':
          return poll.schedule.end;
        default:
          return '';
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    },
    handlePageChange(pageNumber) {
      this.currentPage = pageNumber;
    },
    customClickHandler(pageNumber) {
      this.currentPage = pageNumber;
    }
  },
  computed: {
    columns() {
      return ['Number', 'Summary', 'Creator ID', 'Program ID/Code', 'Schedule Start', 'Schedule End','Action'];
    },
    filteredPollList() {
      let filteredPolls = [...this.polls];

      if (this.filterTitle) {
        filteredPolls = filteredPolls.filter(poll => poll.summary.toLowerCase().includes(this.filterTitle.toLowerCase()));
      }

      if (this.filterCreatorId) {
        filteredPolls = filteredPolls.filter(poll => poll.creator_id.toLowerCase().includes(this.filterCreatorId.toLowerCase()));
      }

      if (this.filterProgramIdCode) {
        filteredPolls = filteredPolls.filter(poll => poll.programidcode.toLowerCase().includes(this.filterProgramIdCode.toLowerCase()));
      }

      if (this.filterScheduleStart) {
        filteredPolls = filteredPolls.filter(poll => poll.schedule.start.includes(this.filterScheduleStart));
      }

      if (this.filterScheduleEnd) {
        filteredPolls = filteredPolls.filter(poll => poll.schedule.end.includes(this.filterScheduleEnd));
      }

      return filteredPolls;
    },
    paginatedPolls() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return this.filteredPollList.slice(startIndex, endIndex);
    },
    totalPages() {
      return Math.ceil(this.filteredPollList.length / this.pageSize);
    }
  }
};
</script>


<style scoped>
.error-message {
  color: red;
  font-size: 12px;
  margin-top: 5px;
}
.button-group {
  /* padding:70px 70px; */
  margin-left: 40%;
}
/* Styles for the button */
.create-button {
  padding: 10px 20px;
  margin: 10px 20px;
  background-color: teal; /* Green */
  border: none;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.create-button:hover {
  background-color: #1d1c20; /* Darker green */
}
/* Styles for the dialog */
.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px teal;
  width: 800px; /* Adjust the max-width as needed */

}

.modal h3 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 24px;
  color: teal;
}

.modal form {
  display: flex;
  flex-direction: column;
}

.modal input {
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.modal button {
  padding: 10px 20px;
  background-color: teal;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.modal button:hover {
  background-color: teal;
}
.custom-textarea {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 5px;
  font-size: 14px;
  /* Add any other custom styles you want */
}
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination .prev, .pagination .next {
  margin-right: 10px;
}

.pagination .disabled {
  color: #999;
}



.sorted-column {
  color: #ff2277; /* Change to desired color */
}
.table-title {
  color: teal;
  font-size: 54px;
  margin-bottom: 20px;
  text-align: center;
}

.filter-input {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px 15px;
  margin-right: 15px;
  background-color: #f5f5f5;
  transition: border-color 0.3s;
}

.filter-input:hover,
.filter-input:focus {
  border-color: #25a0e3;
}

.filters {
  margin: 20px 20px;
}

.poll-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ddd;
  background-color: #f9f9f9;
}

.poll-table th,
.poll-table td {
  padding: 10px;
  border-bottom: 1px solid #ddd;
  text-align: left;
}

.poll-table th {
  cursor: pointer;
  position: relative;
  background-color: teal;
  color: #fff;
}

.poll-table th:hover {
  background-color: #343035;
}

.poll-table th .arrow-up::before,
.poll-table th .arrow-down::before {
  content: '';
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 5px;
}

.poll-table th .arrow-up::before {
  border-bottom: 5px solid #fff;
}

.poll-table th .arrow-down::before {
  border-top: 5px solid #fff;
}

.poll-table tbody tr:nth-child(even) {
  background-color: #f2f2f2;
}

.poll-table tbody tr:hover {
  background-color: #ddd;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.page-item {
  list-style: none;
  margin: 0 5px;
  cursor: pointer;
  border-radius: 3px;
  display: inline-block;
}

.page-item:hover {
  background-color: #f0f0f0;
}

.page-link {
  color: #333;
  text-decoration: none;
  padding: 6px 12px;
  border: 1px solid #ddd;
  background-color: #fff;
  transition: background-color 0.3s;
}

.page-link:hover {
  background-color: #e0e0e0;
}
</style>
