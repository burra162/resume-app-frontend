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
    try {
      const professionalInfo = await ProfessionalSummaryService.getSummary(userId.value);
      console.log("userData is", professionalInfo.data);
      user.value = professionalInfo.data;
      console.log(user.value);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  }
});
</script>

<template>
  <v-text  v-if="templateId ==1"> 
    <v-card tile>
      <v-card-title class="v-h1 title-with-line">Professional Summary  </v-card-title>
      <v-card-text>{{ user.summary }}</v-card-text>
    </v-card>
  </v-text>
  <v-text  v-if="templateId ==2"> 
    <v-card tile>
      <v-card-title class="v-h1 ">Professional Summary </v-card-title>
      <v-card-text class="ml-2">{{ user.summary }}</v-card-text>
    </v-card>
  </v-text>

  <v-text  v-if="templateId ==3" class="mt-2"> 
    <v-card tile> 
      <v-card-text class="ml-2">{{ user.summary }}</v-card-text>
    </v-card>
  </v-text>
    
  </template>
  

<script>
    export default {
      props: {
        ProfessionalSummary: {
          type: Object,
          required: true
        },
        templateId: {
          type: Number,
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