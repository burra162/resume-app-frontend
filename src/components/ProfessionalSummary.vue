<script setup>
import { onMounted, ref } from "vue";
import ProfessionalSummaryService from "../services/ResumeService.js";

const user = ref({});
const loggedInuser = ref({});
const userId = ref(null);

onMounted(async () => {
    console.log("mounted on professional summary" );
  if (localStorage.getItem("user") !== null) {
    loggedInuser.value = JSON.parse(localStorage.getItem("user"));
    userId.value = loggedInuser.value.id;
    console.log("userId is", userId.value); 
  }
});
</script>

<template>
  <!-- <div >Template Id: {{ templateId }}</div> 
  <div >professionalDetails Id: {{ professionalDetails }}</div>  -->
 <div   v-if="templateId ==1">  
    <v-card tile>
      <v-card-title class="v-h1 title-with-line">Professional Summary  </v-card-title>
      <v-card-text>{{ professionalDetails.summary }}</v-card-text>
    </v-card>
  </div>
 <div   v-if="templateId ==2"> 
    <v-card tile>
      <v-card-title class="v-h1 ">Professional Summary </v-card-title>
      <v-card-text class="ml-2">{{ professionalDetails.summary }}</v-card-text>
    </v-card>
  </div>

 <div   v-if="templateId ==3" class="mt-2"> 
    <v-card tile> 
      <v-card-text class="ml-2">{{ professionalDetails.summary }}</v-card-text>
    </v-card>
  </div>
 <div   v-if="templateId ==4" class="mt-2"> 
    <v-card tile> 
      <v-card-title class="v-h1 ">Objective </v-card-title>
      <v-card-text class="ml-2">{{ professionalDetails.summary }}</v-card-text>
    </v-card>
  </div>

  </template>
  

<script>
    export default {
      props: {
        
        templateId: {
          type: Number,
          required: true
        },
        professionalDetails: {
          type: Object,
          required: true
        } 
      }
      
    
    };
</script>
<style scoped>
  .title-with-line {
    position: relative;
    padding-bottom: 10px;
    margin-bottom: 20px;
  }
  
  .title-with-line::after {
    content: "";
    display: block;
    width: 100%;
    height: 2px;
    background-color: #000; /* or any color of your choice */
    position: absolute;
    bottom: 0;
    left: 0;
  }
  </style>