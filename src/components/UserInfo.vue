<script setup>
import { onMounted, ref } from "vue";
import UserInfo from "../services/ResumeService.js";

const user = ref({});
const loggedInuser = ref({});
const userId = ref(null);

onMounted(async () => {
  if (localStorage.getItem("user") !== null) {
    loggedInuser.value = JSON.parse(localStorage.getItem("user"));
    userId.value = loggedInuser.value.id;
    console.log("userId is", userId.value);  
  }
});
</script>

<template>
 
    
      <v-card class="text-center"  v-if="templateId === 1"  tile>
        <v-card-title  >
          <h1><span  >  {{ userData.firstName }} {{ userData.lastName }}</span></h1>
        </v-card-title>
        <v-card-subtitle>
          {{ userData.address }} | {{ userData.number }} | {{ userData.email }} | {{ userData.link1 }}
        </v-card-subtitle>
      </v-card>
    
    
      <v-card  v-if="templateId === 2"   tile>
        <v-card-title class="header">
          <h1><span  >  {{ userData.firstName }} {{ userData.lastName }}</span></h1>
        </v-card-title>
        <v-card-subtitle>
          {{ userData.address }}  | {{ userData.number }} | {{ userData.email }} | {{ userData.link1 }}
        </v-card-subtitle>
      </v-card>
   
     
      <v-card class="text-center"  v-if="templateId === 3"  tile>
        <v-card-title  >
          <h1><span  >  {{ userData.firstName }} {{ userData.lastName }}</span></h1>
        </v-card-title>
        <v-card-subtitle class="title-with-line">
          {{ userData.address }}  | {{ userData.number }} | {{ userData.email }} | {{ userData.link1 }}
        </v-card-subtitle>
       <v-divider   />
      </v-card>
   
 
     
      <v-card class="text-center"  v-if="templateId === 4"  tile>
        <v-card-title  >
          <h1><span  >  {{ userData.firstName }} {{ userData.lastName }}</span></h1>
        </v-card-title>
        <v-card-subtitle >
          {{ userData.address }}  ♦ {{ userData.number }} ♦ {{ userData.email }} ♦ {{ userData.link1 }}
        </v-card-subtitle>
      </v-card>
   
</template>


<script>
export default {
  props: {
    user: {
      type: Object,
      required: true
    },
    userData:{
      type: Object,
      required: true
    },
    templateId: {
          type: Number,
          required: true
        },
  }
};
 
</script>
