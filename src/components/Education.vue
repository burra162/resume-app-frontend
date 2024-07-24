<script setup>
import { onMounted, ref } from "vue";
import eduData from "../services/ResumeService.js";

const educations = ref([]);
const loggedInuser = ref({});
const userId = ref(null);

onMounted(async () => {
  if (localStorage.getItem("user") !== null) {
    loggedInuser.value = JSON.parse(localStorage.getItem("user"));
    userId.value = loggedInuser.value.id;
    console.log("userId is", userId.value);
    try {
      const fetchedEduData = await eduData.getEducation(userId.value);
      educations.value = fetchedEduData.data;
      console.log("Edu Data is", educations.value);
    } catch (error) {
      console.error('Error fetching educations:', error);
    }
  }
});
function formatDateToMonthYear(dateString) {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long' };
  return date.toLocaleDateString(undefined, options);
}

</script>

<template>
  <v-text v-if="templateId === 1"> 
    <v-card tile>
        <v-card-title class="v-h1 title-with-line">EDUCATION</v-card-title>
        </v-card>
 

 
  <v-card v-for="edu in educations" :key="edu.id" >
    <v-card-title class="header">
      <div class="institution">{{ edu.school }}, {{ edu.address }}</div>
      <div class="dates">{{ formatDateToMonthYear(edu.startDate) }} - {{ formatDateToMonthYear(edu.endDate) }}</div>
    </v-card-title>
    <v-card-subtitle>
      <div>{{ edu.degree }}  </div>
      <div>{{ edu.gpa ? `GPA: ${edu.gpa}` : '' }}</div> 
      <div v-if="edu.coursework">Coursework: {{ edu.coursework }}</div>
    </v-card-subtitle>
  </v-card>
</v-text>
<v-text v-if="templateId === 2" tile> 
    <v-card    class="mb-2">
        <v-card-title class="   ">EDUCATION</v-card-title> 
         <v-card v-for="edu in educations" :key="edu.id" class="ml-6"  tile>
             <v-text tile>
               <span  class="   font-weight-bold"> {{ edu.school }}, {{ edu.address }} </span> <span>| {{ formatDateToMonthYear(edu.startDate) }} - {{ formatDateToMonthYear(edu.endDate) }}</span> 
            </v-text>
            <v-card-subtitle tile >
              <v-text class="font-weight-bold">{{ edu.degree }}  </v-text>
              <div>{{ edu.gpa ? `GPA: ${edu.gpa}` : '' }}</div> 
              <div v-if="edu.coursework">Coursework: {{ edu.coursework }}</div>
            </v-card-subtitle>
        </v-card>
    </v-card>
  </v-text>
 
</template>

<script>
    export default {
      
        
        props: {
            education: {
                type: Array,
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
  
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.institution {
  font-weight: bold;
}
.dates {
  font-style: normal !important;
}
.mb-4 {
  margin-bottom: 1rem;
}
</style>