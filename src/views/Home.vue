<template>
   <div>
     <DashBoard />
   </div>
</template>

<script>
  
import DashBoard from '../components/DashBoard.vue';
//import PopularMovies from '../components/PopularMovies.vue'
  export default {
    name: 'Home',
    components: {
   // PopularMovies,
   DashBoard
    }

    
  }
</script>
