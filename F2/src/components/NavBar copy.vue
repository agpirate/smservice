<template>
    <nav>
      <v-system-bar app style="background-color: teal;">
        <!-- <v-spacer></v-spacer>
        <v-icon>mdi-minus</v-icon>
        <v-icon>mdi-checkbox-blank-outline</v-icon>
        <v-icon>mdi-close</v-icon> -->
      </v-system-bar>
      <v-app-bar app dark>
        <v-icon class="mr-2" color="teal">fas fa-frog</v-icon>
        <v-btn text class="ml-4" v-if="isAuthenticated" to="/">SMS-Services</v-btn>
        <v-btn text class="ml-4"  v-if="isAuthenticated" to="/feedback">Feedback</v-btn>
        <v-btn text class="ml-2" v-if="isAuthenticated" to="/questions">Questions</v-btn>
        <v-btn text class="ml-2" v-if="isAuthenticated" to="/polling">Polling</v-btn>
        <v-btn text class="ml-2" to="/about">About</v-btn>
        <v-btn text class="ml-2">Contact</v-btn>
        <v-btn text class="ml-4" v-if="!isAuthenticated" to="/login">Login</v-btn>
        <v-menu ref="menu" offset-y v-if="isAuthenticated">
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" dark>{{ currentUser.username }}</v-btn>
          </template>
          <v-list>
            <v-list-item @click="logoutAndCloseMenu">
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-spacer></v-spacer>
        <v-autocomplete
          clearable
          hide-no-data
          hide-selected
          color="white"
          label="search"
          prepend-inner-icon="search"
          flat
          :items="movies"
          item-text="title"
          item-value="id"
          id="search"
        >
          <template v-slot:item="{item}">
            <v-btn text :to="`/movie/${item.id}`">{{item.title}}</v-btn>
          </template>
        </v-autocomplete>
        <v-btn icon>
          <v-badge color="green" content="2" overlap>
            <v-icon>far fa-bell</v-icon>
          </v-badge>
        </v-btn>
      </v-app-bar>
    </nav>
  </template>
  
  <script>
  export default {
    data: () => ({
      movies: [],
    }),
    computed: {
      isAuthenticated() {
        return this.$store.getters.isAuthenticated;
      },
      currentUser() {
        return this.$store.getters.currentUser;
      },
    },
    methods: {
      logoutAndCloseMenu() {
        this.logout();
        // Close the menu
        this.$refs.menu.isActive = false;
      },
      logout() {
        this.$store.dispatch('logout')
          .then(() => {
            // Redirect or show success message
            this.$router.push('/login');
          })
          .catch(error => {
            // Handle logout error
            console.log(error);
          });
      },
      loadMovies: async function () {
        try {
          const response = await this.$http.get("/movie/popular");
          this.movies = response.data.results;
        } catch (error) {
          console.log(error);
        }
      }
    },
    mounted() {
      this.loadMovies();
    }
  };
  </script>
  
  <style>
  /* Add your custom styles here */
  </style>
  