<script setup>
import { onMounted, ref } from "vue";
import ExpData from "../services/ResumeService.js";

const experiences = ref([]);
const loggedInuser = ref({});
const userId = ref(null);

onMounted(async () => {
  if (localStorage.getItem("user") !== null) {
    loggedInuser.value = JSON.parse(localStorage.getItem("user"));
    userId.value = loggedInuser.value.id;
    console.log("userId is", userId.value);
    try {
      const expData = await ExpData.getExperience(userId.value);
      experiences.value = expData.data;
      console.log("Exp Data is", experiences.value);
    } catch (error) {
      console.error('Error fetching experiences:', error);
    }
  }
});

function formatDateToMonthYear_text(dateString) {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long' };
  return date.toLocaleDateString(undefined, options);
}
 //    split the description by new lines
 function  formattedDescription(Description) {
  return  Description.split('\n').filter(line => line.trim() !== '');
}
</script>

<template>
   
  <div  v-if="templateId === 1" >
    
    <v-card-title class="v-h1 title-with-line">PROFESSIONAL EXPERIENCE </v-card-title>
    
  <v-card v-for="exp in experiences" :key="exp.id">

    <v-card-title class="header">
      <div class="institution">{{ exp.employer }}, {{ exp.jobTitle }},{{ exp.address }} </div>
      <div class="dates">{{ formatDateToMonthYear_text(exp.startDate) }} - {{ exp.endDate?formatDateToMonthYear_text(exp.endDate):'Present' }}</div>
    </v-card-title>
    
    <v-card-text> 
        <div class="pa-6">
                  <ul>
                    <li v-for="(line, index) in formattedDescription(exp.description)" :key="index" class="pl-2">{{ line }}</li>
              </ul>
              </div>
            </v-card-text>  
  </v-card>
</div>

<div v-if="templateId===2">
  <v-card-title class="v-h1">Experience </v-card-title>
  <v-divider   />
  <v-card v-for="exp in experiences" :key="exp.id" class="mb-4">
    <v-card-title class="header">
      <div class="institution">{{ exp.employer }}, {{ exp.jobTitle }},{{ exp.address }} </div>
      <div class="dates">{{ formatDateToMonthYear_text(exp.startDate) }} - {{ exp.endDate?formatDateToMonthYear_text(exp.endDate):'Present' }}</div>
    </v-card-title>
    <v-card-text>
      <div class="pa-6">
        <ul>
          <li v-for="(line, index) in formattedDescription(exp.description)" :key="index" class="pl-2">{{ line }}</li>
        </ul>
      </div>
    </v-card-text>
  </v-card>
  </div>
  <v-text v-if="templateId===3">
  <v-card-title class="v-h1">Experience </v-card-title>
  <v-divider   />
  <v-card v-for="exp in experiences" :key="exp.id" class="mb-4">
    <v-card-title class="header">
      <div class="institution">{{ exp.employer }}, {{ exp.jobTitle }},{{ exp.address }} </div>
      <div class="dates">{{ formatDateToMonthYear_text(exp.startDate) }} - {{ formatDateToMonthYear_text(exp.endDate) }}</div>
    </v-card-title>
    <v-card-text>
      <div class="pa-6">
        <ul>
          <li v-for="(line, index) in formattedDescription(exp.description)" :key="index" class="pl-2">{{ line }}</li>
        </ul>
      </div>
    </v-card-text>
  </v-card>
</v-text>
<v-text v-if="templateId===4">
  <v-card-title class="v-h1">WORK EXPERIENCE (or LEADERSHIP, ACTIVITIES, VOLUNTEER WORK) </v-card-title>
  <v-card v-for="exp in experiences" :key="exp.id" class="mb-4">
    <v-card-title class="header">
      <div class="institution">{{ exp.employer }}, {{ exp.jobTitle }},{{ exp.address }} </div>
      <div class="dates">{{ formatDateToMonthYear_text(exp.startDate) }} - {{ exp.endDate?formatDateToMonthYear_text(exp.endDate):'Present' }}</div>
    </v-card-title>
    <v-card-text>
      <div class="pa-6">
        <ul>
          <li v-for="(line, index) in formattedDescription(exp.description)" :key="index" class="pl-2">{{ line }}</li>
        </ul>
      </div>
    </v-card-text>
  </v-card>
</v-text>

</template>

<script>
    export default { 
        props: { 
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
  font-style: bold;
}
.mb-4 {
  margin-bottom: 1rem;
}
</style>