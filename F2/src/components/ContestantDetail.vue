<template>
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title>Contestant Details</v-card-title>
        <v-card-text>
          <!-- Display contestant details here -->
          <div v-if="contestant">Name: {{ contestant.name }}</div>
          <div v-if="contestant">Age: {{ contestant.age }}</div>
          <div v-if="contestant">Code: {{ contestant.code }}</div>
          <!-- Add more details as needed -->
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="closeDialog">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  export default {
    props: {
      contestant: Object // Pass the contestant object as a prop
    },
    data() {
      return {
        dialog: false
      };
    },
    methods: {
      closeDialog() {
        this.dialog = false; // Close the dialog
      }
    }
  };
  </script>
  