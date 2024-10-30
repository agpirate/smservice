<template>
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title>{{ isNew ? 'New Question' : 'Edit Question' }}</v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="question.summary" label="Summary"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="question.creator_id" label="Creator ID"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="question.answer" label="Answer"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="question.programIdcode" label="Program ID/Code"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-menu
                  v-model="startDatePicker"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="question.schedule.start"
                      label="Start Date"
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="question.schedule.start" @input="startDatePicker = false"></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12">
                <v-menu
                  v-model="endDatePicker"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="question.schedule.end"
                      label="End Date"
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="question.schedule.end" @input="endDatePicker = false"></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDialog">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  export default {
    props: {
      value: Boolean,
      question: Object
    },
    data() {
      return {
        dialog: this.value,
        isNew: true,
        startDatePicker: false,
        endDatePicker: false,
        questionData: {
          id: null,
          summary: '',
          creator_id: '',
          answer: '',
          programIdcode: '',
          schedule: { start: '', end: '' }
        }
      };
    },
    watch: {
      value(newValue) {
        this.dialog = newValue;
        this.isNew = true;
        console.log(...this.question)
        this.questionData = { ...this.questionData, ...this.question };
      }
    },
    methods: {
      closeDialog() {
        this.$emit('input', false);
      },
      save() {
        console.log('saving question:')
        console.log(this.question)
        this.$emit('save', this.question);
        this.closeDialog();
      }
    }
  };
  </script>
  