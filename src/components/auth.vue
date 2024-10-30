<template>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" sm="8" md="6">
          <v-card>
            <v-card-title>
              <h2>{{ showSignup ? 'Sign Up' : 'Sign In' }}</h2>
            </v-card-title>
            <v-card-text>
              <v-form v-if="!showSignup" @submit.prevent="signin">
                <v-text-field v-model="signinForm.email" label="Email" required></v-text-field>
                <v-text-field v-model="signinForm.password" label="Password" type="password" required></v-text-field>
                <v-btn color="primary" type="submit">Sign In</v-btn>
              </v-form>
              <v-form v-if="showSignup" @submit.prevent="signup">
                <v-text-field v-model="signupForm.email" label="Email" required></v-text-field>
                <v-text-field v-model="signupForm.password" label="Password" type="password" required></v-text-field>
                <v-btn color="primary" type="submit">Sign Up</v-btn>
              </v-form>
              <v-row align="center">
                <v-col>
                  <span>{{ showSignup ? 'Already have an account?' : 'Don\'t have an account?' }}</span>
                </v-col>
                <v-col>
                  <v-btn text @click="toggleForm">{{ showSignup ? 'Sign In' : 'Sign Up' }}</v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
  
          <v-alert v-if="errorMessage" type="error" class="mt-4">{{ errorMessage }}</v-alert>
          <v-alert v-if="successMessage" type="success" class="mt-4">{{ successMessage }}</v-alert>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  export default {
    data() {
      return {
        defaultEmail:'werkea2@gmail.com',
        defaultPassword:'12345',
        showSignup: false,
        signupForm: {
          email: '',
          password: ''
        },
        signinForm: {
          email: '',
          password: ''
        },
        errorMessage: '',
        successMessage: ''
      };
    },
    methods: {
      async signup() {
        try {
          // Here you would typically make a POST request to your backend API to create a new user
          // For simplicity, we'll just log the signupForm data to the console
          console.log('Signing up:', this.signupForm);
          if(this.signinForm.email===this.defaultEmail && this.signinForm.password===this.defaultPassword){
            this.successMessage = 'Sign up successful!';
            this.errorMessage = '';
          }
          else{
            this.errorMessage = 'Failed to sign up. Please try again.';

          }
        } catch (error) {
          console.error('Error signing up:', error);
          this.errorMessage = 'Failed to sign up. Please try again.';
          this.successMessage = '';
        }
      },
      async signin() {
        try {
          // Here you would typically make a POST request to your backend API to authenticate the user
          // For simplicity, we'll just log the signinForm data to the console
          console.log('Signing in:', this.signinForm);
          if(this.signinForm.password==this.defaultPassword){
            this.successMessage = 'Sign in successful!';

          setTimeout(() => {
                // Redirect to the desired route
                 this.$router.push('/');
            }, 500); // Adjust the delay time as needed          
            this.errorMessage = '';
          }  
          else{
            this.errorMessage = 'Failed to sign in. Please check your credentials and try again.'+this.signinForm.email+this.signinForm.password+this.defaultEmail+this.defaultPassword;
            setTimeout(() => {
                // Redirect to the desired route
                 this.errorMessage = ''
            }, 1000); // Adjust the delay time as needed    
        } 
        } catch (error) {
          console.error('Error signing in:', error);
          this.errorMessage = 'Failed to sign in. Please check your credentials and try again.';
          this.successMessage = '';
        }
      },
      toggleForm() {
        this.showSignup = !this.showSignup;
        this.errorMessage = '';
        this.successMessage = '';
      }
    }
  };
  </script>
  
  <style scoped>
  /* Add your styles here */
  </style>
  