<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="questions"
      item-key="id"
      :search="search"
      :single-select="singleSelect"
      :loading="loading"
      class="elevation-1"
    >
    <template v-slot:item.summary="{ item }">
        <router-link :to="{ name: 'QuestionDetail', params: { id: item.id } }">
          {{ item.summary }}
        </router-link>
      </template>
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Questions</v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          ></v-divider>
          <v-spacer></v-spacer>
          <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
          <v-btn color="primary" @click="createQuestion">Create</v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon class="action-icon" @click="editQuestion(item)">mdi-pencil</v-icon>
        <v-icon color="primary" class="action-icon" @click="deleteQuestion(item)">mdi-delete</v-icon>
      </template>
    </v-data-table>
      
    <div>
      <QuestionDialog v-model="dialog" :question="selectedQuestion" @save="saveQuestion"></QuestionDialog>
    </div>
    <!-- Snackbar for showing messages -->
    <v-snackbar v-model="snackbar" :timeout="snackbarTimeout" color="success">
      {{ snackbarMessage }}
      <v-btn text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
import axios from 'axios';
import QuestionDialog from './QuestionDialog.vue';
//import QuestionDetails from './QuestionDetails.vue';


export default {
  name: 'Question',
  components: {
    QuestionDialog,
  },
  data() {
    return {
      headers: [
        { text: 'ID', align: 'left', value: 'id' },
        { text: 'Summary', align: 'left', value: 'summary' },
        { text: 'Creator ID', align: 'left', value: 'creator_id' },
        { text: 'Answer', align: 'left', value: 'answer' },
        { text: 'Program ID/Code', align: 'left', value: 'programIdcode' },
        { text: 'Schedule Start', align: 'left', value: 'schedule.start' },
        { text: 'Schedule End', align: 'left', value: 'schedule.end' },
        { text: 'Actions', align: 'left', sortable: false }
      ],
      questions: [],
      loading: false,
      dialog: false,
      selectedQuestion: null,
      search: '',
      snackbar: false,
      snackbarMessage: '', // Define snackbarMessage property
    snackbarTimeout: 3000, // Snackbar timeout in milliseconds
    snackbarColor: 'success' // Snackbar color

    };
  },
  computed: {
    singleSelect() {
      return this.selectedQuestion !== null;
    }
  },
  methods: {
    async fetchQuestions() {
      this.loading = true;
      try {
        let storedData = JSON.parse(localStorage.getItem('myData'));
    if (!storedData) {
      const response = await axios.get('/questions.json'); // Fetch data from JSON file
      storedData = response.data;
      localStorage.setItem('myData', JSON.stringify(storedData)); // Store data in localStorage
    }
    this.questions = storedData;

      } catch (error) {
        console.error('Error fetching questions:', error);
      } finally {
        this.loading = false;
      }
    },
    createQuestion() {
      this.selectedQuestion = null;
  this.selectedQuestion = {
    id: null,
    summary: '',
    creator_id: '',
    answer: '',
    programIdcode: '',
    schedule: { start: '', end: '' }
  };

  this.dialog = true;
},
    editQuestion(question) {
      this.selectedQuestion = { ...question };
      this.dialog = true;
    },
    async saveQuestion(question) {
      try {
        //console.log(question)
          // Retrieve existing data from localStorage
        let storedData = JSON.parse(localStorage.getItem('myData')) || [];
        if (question.id) {
          // Update existing question
          const index = storedData.findIndex(q => q.id === question.id);
          if (index !== -1) {
              storedData.splice(index, 1, question);
              this.questions.splice(index, 1, question);
              localStorage.setItem('myData', JSON.stringify(storedData));
          }
          //await axios.put(`/questions/${question.id}.json`, question);
          this.showSnackbar('Question updated successfully.', 'success');
        } else {
          // Add new question
          //const response = await axios.post('/questions.json', question);
          //this.questions.push(response.data);
          const newId = Date.now();
          const  newQuestion = {...question, id: newId};
           alert(newQuestion)
           console.log('Question Content:')
           console.log(newQuestion)
          this.questions.push(newQuestion);
          storedData.push(question);
          localStorage.setItem('myData', JSON.stringify(storedData));
          this.showSnackbar('Question created successfully.', 'success');
        }
      } catch (error) {
        console.error('Error saving question:', error);
        console.log(error)
        this.showSnackbar('Failed to save question.', 'error');
      } finally {
        this.dialog = false;
      }
    },
    async deleteQuestion(question) {
      const confirmed = confirm('Are you sure you want to delete this question?');
      if (confirmed) {
        try {
          //await axios.delete(`/questions/${question.id}.json`);
          
          this.questions = this.questions.filter(q => q.id !== question.id);
          // Update localStorage
          localStorage.setItem('myData', JSON.stringify(this.questions));
          this.showSnackbar('Question deleted successfully.', 'success');
        } catch (error) {
          console.error('Error deleting question:', error);
          this.showSnackbar('Failed to delete question.', 'error');
        }
      }
    },
    showSnackbar(message) {
      // Show snackbar with provided message
      this.snackbarMessage = message;
      this.snackbar = true;
  },
  getSummaryLink(item) {
      // Define your logic to generate the link based on the item's summary
      // For example, you can return a route path with the summary as a parameter
      return `/summary-page/${item.id}`;
    }
    
  },
  mounted() {
    this.fetchQuestions();
  }
};
</script>
<style scoped>
/* Custom style for action icons */
.action-icon {
  cursor: pointer;
  color: #1976d2; /* Adjust the color of the icons */
  font-size: 24px; /* Adjust the font size of the icons */
  margin: 0 8px; /* Adjust the margin around the icons */
}
</style>


