<template>
  <v-container>
    <v-layout row justify-center style="margin-top: 8%; ">
      <v-card sm="12" md="8" style="margin-top: 0%; margin-right:10%" size="300">
        <v-btn icon to="/"  >
        <!-- <v-avatar size="300%" > -->
          <img :src="require(`@/assets/images.png`)" alt="Tigray TV" style="margin-top: 0%; margin-right:5%" size="300">
        <!-- </v-avatar> -->
        </v-btn>
      </v-card>
      <v-flex xs12 sm8 md4>
        <v-card style="background-color: whitesmoke;">
          <v-card-title style="color:teal">{{ formTitle }}</v-card-title>
          <v-card-text>
            <v-form ref="form" @submit.prevent="handleSubmit">
              <template v-if="!isLoginForm">
                <v-text-field v-model="firstname" label="First Name" outlined></v-text-field>
                <v-text-field v-model="lastname" label="Last Name" outlined></v-text-field>
                <v-text-field v-model="department" label="Department" outlined></v-text-field>

              </template>
              <v-text-field v-model="username" label="Username" outlined></v-text-field>
              <v-text-field v-model="password" label="Password" outlined type="password"></v-text-field>
             
              <v-btn color="primary" type="submit">{{ submitButtonText }}</v-btn>
            </v-form>
            <v-alert v-if="errorMessage" type="error" class="mt-4">{{ errorMessage }}</v-alert>
            <v-alert v-if="successMessage" type="success" class="mt-4">{{ successMessage }}</v-alert>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <div>
              <span v-if="isLoginForm">Don't have an account?</span>
              <span v-else>Already have an account?</span>
              <v-btn style="color:teal" text @click="toggleForm">{{ toggleButtonText }}</v-btn>
            </div>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-card sm="12" md="8" style="margin-top: 0%; margin-left:10%" size="300">
        <v-btn icon to="/"  >
        <!-- <v-avatar size="300%" > -->
          <img :src="require(`@/assets/images.png`)" alt="Tigray TV" style="margin-top: 0%; margin-right:5%" size="300">
        <!-- </v-avatar> -->
        </v-btn>
      </v-card>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  data() {
    return {
      firstname: '',
      lastname: '',
      username: '',
      password: '',
      department: '',
      error: '',
      errorMessage: '',
      successMessage: '',
      isLoginForm: true, // Flag to toggle between login and signup forms
    };
  },
  computed: {
    formTitle() {
      return this.isLoginForm ? 'Login' : 'Sign Up';
    },
    submitButtonText() {
      return this.isLoginForm ? 'Login' : 'Sign Up';
    },
    toggleButtonText() {
      return this.isLoginForm ? 'Sign Up' : 'Login';
    },
  },
  methods: {
    async handleSubmit() {
      if (this.isLoginForm) {
        // Login form submission
        await this.login();
      } else {
        // Sign-up form submission
        await this.signup();
      }
    },
    async login() {
      try {
        const user = await this.$store.dispatch('signin', {
          username: this.username,
          password: this.password
        });
        // Redirect to dashboard or handle success
        console.log(user)
        if(user){
          this.successMessage = 'Login successful!';
           this.errorMessage = '';
          setTimeout(() => {
            this.$router.push('/');
           }, 500);
        }else{
          this.errorMessage = 'Incorect Username or Password';
          setTimeout(() => {
          this.errorMessage = '';

           }, 2000);
        }
        
      } catch (error) {
        // Handle signin error
        console.error(error.message);
        this.errorMessage = 'Incorect Username or Password';

        setTimeout(() => {
          this.errorMessage = '';

           }, 2000);

      }
    
      // //Implement your login logic here
      // const response = await this.$axios.post('/api/auth/signin', {
      //     username: this.username,
      //     password: this.password
      //   });
      // const token = response.data.token;
      // // Store token in local storage
      // localStorage.setItem('token', token);
      //   // Redirect to home page or dashboard
      //   this.$router.push('/');

      //token from response
      // this.$store.dispatch('login', { username: this.username, password: this.password })
      //   .then(() => {
      //     this.successMessage = 'Login successful!';
      //     this.errorMessage = '';
      //     setTimeout(() => {
      //       this.$router.push('/');
      //     }, 500);
      //   })
      //   .catch(error => {
      //     console.error('Error logging in:', error);
      //     this.errorMessage = 'Failed to login. Please try again.';
      //   });
    },
    async signup() {

      try {
        const user = await this.$store.dispatch('signup', {
          firstname:this.firstname,
          lastname:this.lastname,
          username: this.username,
          password: this.password,
          department: this.department,
        });
        if(user){
          this.successMessage = 'Sign up successful!';
           this.errorMessage = '';
           setTimeout(() => {
             this.$router.push('/');
           }, 500);
        }
        // Redirect to dashboard or handle success
      } catch (error) {
        // Handle signup error
        console.error(error.message);
      }
    
      // // Implement your sign-up logic here
      // // Example:
      // await this.$axios.post('/api/auth/signup', {
      //     username: this.username,
      //     password: this.password,
      //     role: this.role
      //   });
      //   // Redirect to sign-in page after successful sign-up
      //   this.$router.push('/signin');
      // this.$store.dispatch('signup', { username: this.username, password: this.password })
      //   .then(() => {
      //     this.successMessage = 'Sign up successful!';
      //     this.errorMessage = '';
      //     setTimeout(() => {
      //       this.$router.push('/');
      //     }, 500);
      //   })
      //   .catch(error => {
      //     console.error('Error signing up:', error);
      //     this.errorMessage = 'Failed to sign up. Please try again.';
      //   });
    },
    toggleForm() {
      this.isLoginForm = !this.isLoginForm;
      this.resetForm();
    },
    resetForm() {
      this.username = '';
      this.password = '';
      this.errorMessage = '';
      this.successMessage = '';
    },
  },
};
</script>

<style scoped>
.v-form {
  margin-bottom: 20px;
}
</style>
