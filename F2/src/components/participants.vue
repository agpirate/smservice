<template>
  <div class="poll-detail-container">
    <h1 style="color: teal;">Clients Information:</h1>
    
    <div class="contestants">
      <h3 style="color:teal">Clients:</h3>
      <div class="search-and-buttons"> <!-- Flex container for search field and buttons -->
        <div class="buttons">
          <v-btn color="primary" @click="selectAll()">Select All</v-btn>
          <v-btn color="primary" @click="clearSelection()">Clear Selection</v-btn>
          <v-btn color="primary" @click="openDialog()">Send Message</v-btn>
        </div>
        <v-text-field v-model="search" label="Search by Phone Number"></v-text-field>

        </div>
      <v-data-table
      :headers="[selectHeader, ...headers, { text: 'Actions', value: 'actions' }]" 
      :items="filteredClients" 
      :items-per-page="5"
      :sort-by="'count'"
      :sort-desc="true"
      class="elevation-1"
    >
  <template v-slot:body="{ items }">
    <tbody>
      <tr v-for="(item, index) in items" :key="item.id">
        <td><input type="checkbox" v-model="selectedClients" :value="item.phone"></td> <!-- Checkbox -->
        <td>{{ index + 1 }}</td> <!-- Display the rank -->
        <!-- <td>{{ item.name }}</td> -->
            <td>{{ item.id }}</td>
        <td>{{ item.phone }}</td>
        <td>{{ item.count }}</td>
        <td>{{ new Date(item.createdAt).toDateString() }}</td>
        <td> <!-- New column for actions -->

          <v-btn color="primary" @click="showDetails(item)">Show Details</v-btn>

        </td>
      </tr>
    </tbody>
  </template>
</v-data-table>

    </div>
    <!-- Dialog for composing and sending message -->
    <v-dialog v-model="dialogOpen" max-width="500px">
      <v-card>
        <v-card-title>Compose Message</v-card-title>
        <v-card-text>
          <v-textarea v-model="message" label="Message" :error-messages="messageError"></v-textarea>
                    <!-- Input field for adding new phone numbers -->
          <v-text-field v-model="newPhone" label="Add New Phone Number"></v-text-field>
          <!-- Button to add new phone number to selectedClients -->
          <v-btn color="primary" @click="addNewPhone()">Add Phone</v-btn>
          <!-- Display newly added phone numbers at the bottom -->
          <div v-if="addedPhones.length > 0" class="added-phones">{{ addedPhones.join(', ') }}</div>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="sendMessage()">Send</v-btn>
          <v-btn color="primary" @click="dialogOpen = false">Cancel</v-btn>
        </v-card-actions>
         <!-- Snackbar message inside dialog -->
    <template v-if="snackbarOpen">
      <v-snackbar v-model="snackbarOpen" :timeout="snackbarTimeout" :color="snackbarColor">
        {{ snackbarMessage }}
      </v-snackbar>
    </template>
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
      clients: [],
      modalOpen: false,
      selectedContestant: null,
      ContestantDialog: false,
      newPhone:'',
      headers: [
        { text: '#', value: 'index' },
        { text: 'CID', value: 'id' },
        { text: 'Phone Number', value: 'phone' },
        { text: 'Participation Count', value: 'count' },
        { text: 'Created_At', value: 'createdAt' },
      ],
      selectedClients: [],
      dialogOpen: false,
      message: '',
      search: '', // Add search property
      addedPhones: [], // Array to store added phone numbers
      // Existing data properties omitted for brevity
      snackbarOpen: false, // Control snackbar visibility
      snackbarMessage: '', // Snackbar message
      snackbarColor: '', // Snackbar color
      snackbarTimeout: 3000 // Snackbar timeout in milliseconds

    };
  },
  async mounted() {
    await this.fetchClients();
  },
  computed: {
    selectHeader() {
      return {
        text: '',
        align: 'center',
        sortable: false,
        value: 'selectAll',
        width: '50px'
      };
    },
    messageError() {
      const messageLength = this.message.length;
      if (messageLength === 0) {
        return "Message is required.";
      } else if (messageLength < 3) {
        return "Message must be at least 3 characters long.";
      } else if (messageLength > 100) {
        return "Message must be less than 100 characters long.";
      } else {
        return ""; // No error message
      }
    },
    filteredClients() {
      // Filter clients based on search query
      return this.clients.filter(client => client.phone.includes(this.search));
    }
  },
  methods: {
    async fetchClients() {
      try {
        const response = await axios.get(`http://localhost:3000/client/clients`);
        this.clients = response.data;
        console.log(this.clients)
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    },
    
    formatDate(dateString) {
      const date = new Date(dateString);
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    },

    selectAll() {
      this.selectedClients = this.clients.map(client => client.phone);
    },
    clearSelection() {
      this.selectedClients = [];
    },
    openDialog() {
      this.dialogOpen = true;
    },
    addNewPhone() {
      // Add new phone number to selectedClients array
      if (this.newPhone.trim() !== '') {
        this.selectedClients.push(this.newPhone.trim());
        this.addedPhones.push(this.newPhone.trim()); // Add new phone number to array
        console.log('dfhghsdgf')
        this.newPhone = ''; // Clear input field after adding
      }
    },
    async sendMessage() {
      // Send selected phone numbers and message to API
      console.log("Selected Phone Numbers:", this.selectedClients);
      console.log("Message:", this.message);
      // Call your API endpoint to send the message
      // Reset dialog state after sending message
      let sms = {}
      sms.phones = this.selectedClients;
      sms.msg = this.message;
      // console.log(sms)
      if(sms.phones){
        const response = await axios.post(`http://localhost:3000/send/sms`,sms);
        console.log(response.data)
        // Show snackbar with success message
        this.snackbarMessage = 'Message sent successfully!';
        this.snackbarColor = 'success';
        this.snackbarOpen = true;
      } else {
        // Show snackbar with error message
        this.snackbarMessage = 'Error sending message. Please try again later.';
        this.snackbarColor = 'error';
        this.snackbarOpen = true;
      }
      // this.dialogOpen = false;
      // Close dialog after a delay
    this.closeDialog();
      this.selectedClients = [];
      this.message = '';
    }
  },
  closeDialog() {
    // Add a delay before closing the dialog
    setTimeout(() => {
      this.dialogOpen = false;
    }, 2000); // Adjust the delay time (in milliseconds) as needed
  },
};
</script>

<style scoped>
.search-and-buttons {
  display: flex;
  align-items: center;
  margin-bottom: 10px; /* Adjust margin as needed */
}
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