<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

import UserInfo from '../components/UserInfo.vue';
import Education from '../components/Education.vue';
import Experience from '../components/Experience.vue';
import ProfessionalSummary from "../components/ProfessionalSummary.vue";  
import Skills from "../components/Skills.vue";  
import TemplateSwitch from "../components/TemplateSwitch.vue";  
import ResumeServices from "../services/ResumeService.js"; 
 

const router = useRouter(); 
const userDetails = ref({});
const professionalDetails= ref({});
const educationDetails= ref({}); 
const experienceDetails= ref({});
const skillsDetails= ref({});
const user = ref({});

onMounted(async () => {
  if (localStorage.getItem("user") !== null) {
    user.value = JSON.parse(localStorage.getItem("user"));
  } else {
    router.push({ name: "login" });
  }
    //user details 
    try {
    console.log("Getting userDetails   "+user.value.id);
      const userData = await ResumeServices.getUserDetails(user.value.id);
      userDetails.value =  userData.data;
      console.log("userData is-----", userData.data);
      userDetails.value = userData.data;
      console.log(userDetails.value);
    } catch (error) {
      console.error('Error fetching userDetails:--', error);
    }
    //Professional summary
    try {
      const professionalInfo = await ResumeServices.getSummary(user.value.id);
      
      professionalDetails.value = professionalInfo.data;
      console.log("professionalInfo is", professionalDetails.value);
    } catch (error) {
      console.error('Error fetching professionalDetails:--', error);
    }
    //education details
    try {
      const fetchedEduData = await ResumeServices.getEducation(user.value.id);
      educationDetails.value = fetchedEduData.data;
      console.log("Edu Data is----", educationDetails.value);
    } catch (error) {
      console.error('Error fetching educations:--', error);
    }
    //Experience
    try {
      const expData = await ResumeServices.getExperience(user.value.id);
      experienceDetails.value = expData.data;
      console.log("Exp Data is", experienceDetails.value);
    } catch (error) {
      console.error('Error fetching experiences:--', error);
    }
    //Skills
    try {
      const skillsData = await ResumeServices.getSkills(user.value.id);
      console.log("Skills  is--", skillsData.data); 
      skillsDetails.value = skillsData.data;
      console.log("Skills Data is", skillsDetails.value);
    } catch (error) {
      console.error('Error fetching skills:', error);
    }
});

const downloadPDF = async () => {
  const resume = document.getElementById("resume");
  const canvas = await html2canvas(resume);
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");
  const imgWidth = 210; 
  const pageHeight = 295;  
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  let heightLeft = imgHeight;

  let position = 0;

  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft >= 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save("resume-template-2.pdf");
};
</script>

<template>
  <v-app>
    <v-container>
      <v-row><v-col>
        <TemplateSwitch />
      </v-col></v-row>
      <h1>Resume Template 2</h1>
      
      <v-row justify="end">
       
        <v-btn @click="downloadPDF" justify="end"><v-icon left>mdi-download</v-icon> Download</v-btn>
     
      </v-row>
     <div class="mt-5"></div>
     <div id="resume">  
      <user-info :userData="userDetails" :user="user"  v-if="user"  :templateId="2"></user-info>
      <ProfessionalSummary :professionalDetails="professionalDetails"  v-if="user" :templateId="2"></ProfessionalSummary>
      <education :educationDetails="educationDetails"   v-if="user" :templateId="2"></education>
      <experience :experienceDetails="experienceDetails"  v-if="user" :template-id="2"></experience> 
    </div>
    </v-container>
  </v-app>
</template>

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
  background-color: #000;
  position: absolute;
  bottom: 0;
  left: 0;
}

#resume {
  background: white;
  padding: 20px;
}
/* Use deep selector to ensure specificity */
::v-deep .v-card--variant-elevated {
  box-shadow: none !important;
}
</style>
