<template>
  <v-footer
   dark
   padless
 >
   <v-card
     flat
     tile
     class="teal white--text text-center"
   >
     <v-card-text>
       <!-- <v-btn
         v-for="icon in icons"
         :key="icon"
         class="mx-4 white--text"
         icon
       >
         <v-icon size="34px">
           {{ icon }}
         </v-icon>
       </v-btn> -->
     </v-card-text>
     <v-card-text class="white--text pt-0">
      SMS polling question for a television program involves engaging viewers by
       allowing them to participate and provide feedback via text messages (SMS). 
      SMS polling questions for television programs are a popular way 
      to engage viewers, gather feedback, and create interactive
       experiences that increase audience participation and loyalty.    
      </v-card-text>
   <v-card class="v-col-md-3 v-col-12">
     
   </v-card>


     <v-divider></v-divider>

     <v-card-text class="white--text">
       {{ new Date().getFullYear() }} — <strong>Developed for: <a class="white--text" href="https://www.google.com/">Tigray Television</a> </strong>
     </v-card-text>
   </v-card>
 </v-footer>
</template>

<script>
export default {
   data: () =>({
       icons:[
           'mdi-facebook',
           'mdi-twitter',
           'mdi-linkedin',
           'mdi-instagram'
       ]
   })
}
</script>

<style>

</style>