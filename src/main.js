import Vue from 'vue'
import App from './App.vue'
import store from './store'
import vuetify from './plugins/vuetify'
import router from './router'
import axios from 'axios';
// import store from './store'; // Import your Vuex store instance


// import Home from './views/Home.vue'
// import Login from './components/auth.vue'

Vue.config.productionTip = false

// Vue.use(Vuex)
// Vue.use(VueRouter);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
  computed:{
    token(){
      return this.$store.getters.token;
    }
  },
  mounted() {
    // Access the token after the Vue instance is mounted
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.token;
  }
}).$mount('#app')


