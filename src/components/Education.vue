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
    // try {
    //   const fetchedEduData = await eduData.getEducation(userId.value);
    //   educations.value = fetchedEduData.data;
    //   console.log("Edu Data is", educations.value);
    // } catch (error) {
    //   console.error('Error fetching educations:', error);
    // }
  }
});
function formatDateToMonthYear(dateString) {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long' };
  return date.toLocaleDateString(undefined, options);
}

</script>

<template>
  <div v-if="templateId === 1">  
    <v-card tile>
        <v-card-title class="v-h1 title-with-line">EDUCATION</v-card-title>
        </v-card>
 

 
  <v-card v-for="edu in educationDetails" :key="edu.id" >
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
</div>
<div v-if="templateId === 2" tile> 
    <v-card    class="mb-2">
        <v-card-title class="   ">EDUCATION</v-card-title> 
         <v-card v-for="edu in educationDetails" :key="edu.id" class="ml-6"  tile>
             <div tile>
               <span  class="   font-weight-bold"> {{ edu.school }}, {{ edu.address }} </span> <span>| {{ formatDateToMonthYear(edu.startDate) }} - {{ formatDateToMonthYear(edu.endDate) }}</span> 
            </div>
            <v-card-subtitle tile >
              <div class="font-weight-bold">{{ edu.degree }}  </div>
              <div>{{ edu.gpa ? `GPA: ${edu.gpa}` : '' }}</div> 
              <div v-if="edu.coursework">Coursework: {{ edu.coursework }}</div>
            </v-card-subtitle>
        </v-card>
    </v-card>
  </div>

  <div v-if="templateId === 3" tile> 
    <v-card    class="mb-2">
        <v-card-title class="   ">Education</v-card-title> 
        <v-divider   />
         <v-card v-for="edu in educationDetails" :key="edu.id" class="ml-6"  tile>
    <v-card-title class="header">
      <div class="institution">{{ edu.school }}, {{ edu.address }}</div>
      <div class="dates font-size-12 font-weight-normal">{{ formatDateToMonthYear(edu.startDate) }} - {{ formatDateToMonthYear(edu.endDate) }}</div>
    </v-card-title>
    <v-card-subtitle class="header">
      <div class="institution">{{ edu.degree }}  </div>
      <div class="dates">{{ edu.gpa ? `GPA: ${edu.gpa}` : '' }} <div v-if="edu.coursework">Coursework: {{ edu.coursework }}</div></div>
    </v-card-subtitle>
           
        </v-card>
    </v-card>
  </div>

  <div v-if="templateId === 4" tile> 
    <v-card    class="mb-2">
        <v-card-title class="   ">EDUCATION</v-card-title> 
         <v-card v-for="edu in educationDetails" :key="edu.id" class="ml-6"  tile>
    <div  >
      <div class=""><span class="font-weight-bold"> {{ edu.school }}</span>, {{ edu.address }} {{ formatDateToMonthYear(edu.startDate) }} - {{ formatDateToMonthYear(edu.endDate) }}</div>
      
    </div>
    <v-card-subtitle class=" ">
      <div class=" ">{{ edu.degree }} in {{ edu.fieldOfStudy }}</div>
      <div class=" ">{{ edu.gpa ? `GPA: ${edu.gpa}` : '' }}</div>
      <div class=" ">{{ edu.awards ? `Awards: ${edu.awards}` : '' }}</div>
    </v-card-subtitle>
           
        </v-card>
    </v-card>
  </div>


 
</template>

<script>
    export default {
      
        
        props: { 
            educationDetails:
            {
              type:Object,
              required:true
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