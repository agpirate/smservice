<template>
    <v-container>
      <h2>Profile Update and Password Reset</h2>
      <div class="container">
        <div class="buttons">
          <!-- Navigation Links -->
          <v-btn block @click="mode = 'passwordReset'" style="background-color: teal;">Password Reset</v-btn>
          <br>
          <v-btn block @click="mode = 'profileUpdate'" style="background-color: teal;">Profile Update</v-btn>
        </div>
        <div class="form">
          <!-- Password Reset Form -->
          <v-form v-if="mode === 'passwordReset'" @submit.prevent="resetPassword">
            <v-text-field v-model="currentPassword" label="Current Password" type="password" required></v-text-field>
            <v-text-field v-model="newPassword" label="New Password" type="password" required></v-text-field>
            <v-btn type="submit" block style="background-color: teal;">Change Password</v-btn>
          </v-form>
          <!-- Profile Update Form -->
          <v-form v-else @submit.prevent="updateProfile">
            <v-text-field v-model="firstName" label="First Name" required></v-text-field>
            <v-text-field v-model="lastName" label="Last Name" required></v-text-field>
            <v-text-field v-model="username" label="Last Name" required></v-text-field>

            <!-- Add more fields for profile update -->
            <v-btn type="submit" block style="background-color: teal;">Update Profile</v-btn>
          </v-form>
        </div>
      </div>
    </v-container>
  </template>
  
  
  <script>
  import axios from 'axios'
  export default {
    data() {
      return {
        mode: 'passwordReset', // Initial mode is password reset
        currentPassword: '',
        newPassword: '',
        firstName: '',
        lastName: '',
        username: '',
        // Add more profile fields as needed
      };
    },
    methods: {
      async resetPassword() {
        // Implement logic to reset password (API call, validation, etc.)
        console.log('Resetting password...');
        const data ={
            oldpasswd:this.currentPassword,
            newpasswd:this.newPassword, 
            token:this.token,
        }
        const response = await axios.post('http://localhost:8000/auth/passwd', data);
        if(response){
            console.log(response)
        }
      },
      async updateProfile() {
        // Implement logic to update profile (API call, validation, etc.)
        console.log('Updating profile...');
        const data = {
            firstname:this.firstname,
            lastname:this.lastname,
            username:this.username,
            token:this.token,
        }
        const response = await axios.post('http://localhost:8000/auth/profile', data);
        if(response){
            console.log(response)
        }
      }
    }
  };
  </script>
  
  <style scoped>
.container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.buttons {
  width: 200px; /* Adjust width as needed */
}

.form {
  width: calc(100% - 220px); /* Adjust width as needed */
}

.buttons > v-btn {
  margin-bottom: 10px; /* Add margin between buttons */
}

.form > v-text-field {
  margin-bottom: 10px; /* Add margin between form fields */
}

@media (max-width: 600px) {
  .container {
    flex-direction: column;
  }

  .buttons, .form {
    width: 100%;
  }
}
</style>
