<template>
  <v-app>
    <NavBar />
    <v-main>
    
      <div>
        <router-view/>
      </div>
    </v-main>
    <Footer />
  </v-app>
</template>

<script>
import NavBar from './components/NavBar.vue';
import Footer from './components/Footer.vue';
export default {
  name: 'App',
  components: {
    NavBar,
    Footer
  },
  

  data: () => ({
    //
  }),
  created() {
    // Check authentication status when app is created
    // this.$store.dispatch('checkAuth');
  }
};
</script>
<style>
.authenticated {
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.authenticated p {
  font-size: 16px;
  color: #333;
  margin-bottom: 10px;
}

.logout-button {
  background-color: #ff5722;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
}

.logout-button:hover {
  background-color: #ff7043;
}

</style>