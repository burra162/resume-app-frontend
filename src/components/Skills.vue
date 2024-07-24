<script setup>
import { onMounted, ref } from "vue";
import SkillData from "../services/ResumeService.js";

const skills = ref([]);
const loggedInuser = ref({});
const userId = ref(null);

onMounted(async () => {
  console.log("Skills mounted");
  if (localStorage.getItem("user") !== null) {
    loggedInuser.value = JSON.parse(localStorage.getItem("user"));
    userId.value = loggedInuser.value.id;
    console.log("userId is", userId.value);
    try {
      const skillsData = await SkillData.getSkills(userId.value);
      console.log("Skills RAW Data is", skillsData.data);
      skills.value = [];
      skills.value = skillsData.data;
      console.log("Skills Data is", skills.value);
    } catch (error) {
      console.error('Error fetching skills:', error);
    }
  }
});
</script>

<template>
  <v-text v-if="templateId === 1">
    <v-title class="  ml-6 font-weight-bold mt-2 text-center">SKILLS | Leadership skills | activities | extracurricular activities</v-title>
    <v-divider></v-divider>
  
    <ul class="ml-8"> 
    <li v-for="skill in skills" :key="skill.id">{{ skill.skill}}</li>
  </ul>
</v-text>
 
 
  <v-text v-if="templateId === 3">
    
    
    <v-title class="font-weight-bold mt-2 text-center">SKILLS</v-title>
    <v-divider></v-divider>

    <div class="  text-center">
      
        <span v-for="(skill, index) in skills" :key="skill.id" class="display-inline-block">
          {{ skill.skill }}<span v-if="index < skills.length - 1"> | </span>
        </span>
     
    </div>
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
