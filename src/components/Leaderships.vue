<script setup>
import { onMounted, ref } from "vue";
import LeaderShipService from "../services/LeadershipServices.js";

const leaderships = ref([]);
const loggedInuser = ref({});
const userId = ref(null);

onMounted(async () => {
  console.log("Mounted in Leadership component" );
  if (localStorage.getItem("user") !== null) {
    loggedInuser.value = JSON.parse(localStorage.getItem("user"));
    userId.value = loggedInuser.value.id;
    console.log("userId is", userId.value);
    // try {
    //   const LeaderShipData = await LeaderShipService.getleadershipByUserId(userId.value);
    //   leaderships.value = LeaderShipData.data;
    //   console.log("Leadership Data is", LeaderShipData.data);
    // } catch (error) {
    //   console.error('Error fetching leaderships:', error);
    // }
  }
});

function formatDateToMonthYear_text(dateString) {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long' };
  return date.toLocaleDateString(undefined, options);
}

function formattedDescription(description) {
  return description.split('\n').filter(line => line.trim() !== '');
}
</script>

<template>
  <div v-if="templateId === 4">
    <v-card-title class="v-h1">LEADERSHIP (or WORK EXPERIENCE, ACTIVITIES, VOLUNTEER WORK) </v-card-title>
    <v-card v-for="leaderships_list in leadershipDetails" :key="leaderships_list.id" class="mb-4 ml-2">
     
         
        <v-card-title class="v-h2">{{ leaderships_list.organizationName }}</v-card-title>
        
          
          <div class="ml-6">  <strong>{{ leaderships_list.positionTitle }} </strong> ({{ formatDateToMonthYear_text(leaderships_list.startDate) }} - 
            {{ leaderships_list.endDate ? formatDateToMonthYear_text(leaderships_list.endDate) : 'Present' }})</div>
         
       
      <v-card-text>
        <div class="ml-8">
          <ul>
            <li v-for="(line, index) in formattedDescription(leaderships_list.description)" :key="index" class="pl-2">{{ line }}</li>
          </ul>
        </div>
      </v-card-text>
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
    leadershipDetails:
  {
    type:Object,
    required:true
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
