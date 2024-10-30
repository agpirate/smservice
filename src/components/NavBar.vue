<template>
  <nav>
    <v-system-bar app style="background-color: teal;"></v-system-bar>
    <v-app-bar app dark style="background-color: rgb(0, 70, 170)">
      <v-btn icon to="/">
        <v-avatar size="60">
          <img :src="require(`@/assets/images.png`)" alt="Tigray TV">
        </v-avatar>
      </v-btn>
      <div class="d-none d-md-flex">
        <v-btn text class="ml-4" v-if="isAuthenticated" to="/">SMS-Services</v-btn>
        <v-btn text class="ml-4" v-if="isAuthenticated" to="/feedbacks">Feedbacks</v-btn>
        <v-btn text class="ml-2" v-if="isAuthenticated && (isAdmin || currentRole=='official')" to="/dfeedbacks">Default Feedbacks</v-btn>

        <v-btn text class="ml-2" v-if="isAuthenticated" to="/questions">Questions</v-btn>
        <v-btn text class="ml-2" v-if="isAuthenticated" to="/polling">Polling</v-btn>
        <v-btn text class="ml-2" v-if="isAuthenticated && isAdmin" to="/participants">Participants</v-btn>
        <v-btn text class="ml-2" v-if="isAuthenticated && isAdmin" to="/staff">Staff</v-btn>

        <v-btn text class="ml-2" v-if="isAuthenticated && isAdmin" to="/users">User Management</v-btn>

      </div>
      <v-spacer></v-spacer>
      <div class="d-none d-md-flex">
        <v-menu bottom left v-if="isAuthenticated">
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on">
              <v-avatar size="40" style="background-color: teal;">
                <v-icon >person</v-icon>
                
                                <!-- <img :src="getAvatar()" alt="Contestant Photo"> -->
              </v-avatar>
            </v-btn>
          </template>
          <v-list class="profile-menu">
            <v-list-item>
              <v-list-item-avatar style="background-color: teal;">
                <!-- <v-img :src="getAvatar()" alt="Contestant Photo"></v-img> -->
                <v-icon >person</v-icon>

              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="profile-username subheading">{{ currentUser }}</v-list-item-title>
                <v-list-item-subtitle class="profile-username body-2 grey--text">{{ currentRole }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <!-- <v-list-item link to="/settings">
              <v-list-item-icon>
                <v-icon style="color: teal">mdi-account-circle</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Profile</v-list-item-title>
              </v-list-item-content>
            </v-list-item> -->
            <v-list-item link to="/settings/account">
              <v-list-item-icon>
                <v-icon style="color: teal">mdi-lock</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Account</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item @click="logoutAndCloseMenu">
              <v-list-item-icon>
                <v-icon style="color: teal">mdi-logout</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Logout</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
      <div class="d-flex d-md-none">
        <v-menu bottom left v-if="isAuthenticated">
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on">
              <v-icon>mdi-menu</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item link to="/">
              <v-list-item-title>SMS-Services</v-list-item-title>
            </v-list-item>
            <v-list-item link to="/feedbacks">
              <v-list-item-title>Feedbacks</v-list-item-title>
            </v-list-item>
            <v-list-item link to="/questions">
              <v-list-item-title>Questions</v-list-item-title>
            </v-list-item>
            <v-list-item link to="/polling">
              <v-list-item-title>Polling</v-list-item-title>
            </v-list-item>
            <v-list-item link to="/participants">
              <v-list-item-title>Participants</v-list-item-title>
            </v-list-item>
            <v-list-item link to="/users" v-if="isAdmin">
              <v-list-item-title>User Management</v-list-item-title>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item link to="/settings/profile">
              <v-list-item-title>Profile</v-list-item-title>
            </v-list-item>
            <v-list-item link to="/settings/account">
              <v-list-item-title>Account</v-list-item-title>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item @click="logoutAndCloseMenu">
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-app-bar>
  </nav>
</template>

<script>
import axios from 'axios'
export default {
  data: () => ({
    isAdmin: false,
    isOfficial:false,
  }),
  computed: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
    currentUser() {
      return this.$store.getters.currentUser;
    },
    currentRole() {
      const role = this.$store.getters.currentRole;
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.isAdmin = role === 'admin';
      return role;
    },
    token() {
      return this.$store.getters.token;
    },
  },
  mounted(){
    if(this.isAuthenticated){
      setInterval(async() => {
      
       try{

        const response = await axios.get('http://192.168.7.5:3000/question/questions'); 
      //  alert(response.status)
       console.log(response)
       console.log(response.status)
        if(response.status == 403){

            this.logout();
            this.$router.push('/login');
            }
       }catch(e){
        this.logout();
            this.$router.push('/login');
       }
     
     }, 3000);
    }
     

  },
  methods: {
    getAvatar() {
      switch (this.currentRole) {
        case 'admin':
          return require('@/assets/images.png');
        case 'head':
          return require('@/assets/images.png');
        case 'official':
          return require('@/assets/images.png');
        default:
          return require('@/assets/images.png');
      }
    },
    logoutAndCloseMenu() {
      this.logout();
    },
    logout() {
      this.$store.dispatch('signout')
        .then(() => {
          this.$router.push('/login');
        })
        .catch(error => {
          console.error('Logout error:', error);
        });
    },
  },
};
</script>

<style>
.profile-photo {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.v-list {
  /* padding: 20px 40px; */
  margin-top: 35%;

  /* width: 400px;
  height: 200px; */
}
.profile-menu { 
  margin-right: 10px;

  /* width: 300px; */
}
.profile-username {
  /* margin-left: 10px; */
}
</style>
