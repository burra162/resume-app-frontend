<script setup>
import { onMounted, ref } from "vue";
import ProjectData from "../services/ProjectServices.js";

const projects = ref([]);
const loggedInuser = ref({});
const userId = ref(null);

onMounted(async () => {
  if (localStorage.getItem("user") !== null) {
    loggedInuser.value = JSON.parse(localStorage.getItem("user"));
    userId.value = loggedInuser.value.id;
    console.log("userId is", userId.value);
    try {
      const projects_rs = await ProjectData.getProjectByUserId(userId.value);
      projects.value = projects_rs.data;
      console.log("project Data is", projects.value);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  }
});

function formatDateToMonthYear_text(dateString) {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long' };
  return date.toLocaleDateString(undefined, options);
}

// Split the description by new lines
function formattedDescription(Description) {
  return Description.split('\n').filter(line => line.trim() !== '');
}
</script>

<template>
  <div v-if="templateId === 3">
    <v-card-title class="v-h1">Projects </v-card-title>
    <v-divider   />
    <v-card v-for="project in projects" :key="project.id" class="mb-4">
      <v-card-title class="header">
        <div class="institution">{{ project.organizationName }},  {{ project.city }}, {{ project.state }}</div>
        <div class="dates"> {{ project.projectTitle }}, {{ formatDateToMonthYear_text(project.startDate) }} - {{ formatDateToMonthYear_text(project.endDate) }}</div>
      </v-card-title>
      <v-card-text>
        <div class="pa-6">
          <ul>
            <li v-for="(line, index) in formattedDescription(project.description)" :key="index" class="pl-2">{{ line }}</li>
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
