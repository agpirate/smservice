<template>
    <div class="question-detail">
      <h1>Question Detail</h1>
      <table class="question-table">
        <tr>
          <td><strong>ID:</strong></td>
          <td>{{ question.id }}</td>
        </tr>
        <tr>
          <td><strong>Summary:</strong></td>
          <td>{{ question.summary }}</td>
        </tr>
        <tr>
          <td><strong>Creator ID:</strong></td>
          <td>{{ question.creator_id }}</td>
        </tr>
        <tr>
          <td><strong>Answer:</strong></td>
          <td>{{ question.answer }}</td>
        </tr>
        <tr>
          <td><strong>Program ID/Code:</strong></td>
          <td>{{ question.programIdcode }}</td>
        </tr>
        <tr>
          <td><strong>Schedule Start:</strong></td>
          <td>{{ question.schedule.start }}</td>
        </tr>
        <tr>
          <td><strong>Schedule End:</strong></td>
          <td>{{ question.schedule.end }}</td>
        </tr>
      </table>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      questionId: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        question: {}
      };
    },
    created() {
      // Fetch question details based on this.questionId
      this.questionId = this.$route.params.id;

      this.fetchQuestion();
    },
    mounted(){
      setInterval(this.fetchQuestion(), 1000); // Call fetchPolls every 1 second
    },
    methods: {
      fetchQuestion() {
        // Retrieve stored data from local storage
        let storedData = JSON.parse(localStorage.getItem('myData')) || [];
        // Find the question with the matching ID
        const foundQuestion = storedData.find(question => question.id == this.questionId);
        // If the question is found, assign it to the 'question' data property
        if (foundQuestion) {
          this.question = foundQuestion;
        } else {
          // Handle case where question is not found
          console.error(`Question with ID ${this.questionId} not found.`);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  /* Custom styles */
  .question-detail {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #f9f9f9;
  }
  
  .question-table {
    width: 100%;
  }
  
  .question-table td {
    padding: 8px;
    border-bottom: 1px solid #ddd;
  }
  
  .question-table td:first-child {
    font-weight: bold;
  }
  
  .question-table tr:last-child td {
    border-bottom: none;
  }
  </style>
  