<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

import UserInfo from '../components/UserInfo.vue';
import Education from '../components/Education.vue';
import Experience from '../components/Experience.vue';
import ProfessionalSummary from "../components/ProfessionalSummary.vue";  
import Projects from "../components/Projects.vue";  
import Skills from "../components/Skills.vue";   
import TemplateSwitch from "../components/TemplateSwitch.vue";  

const router = useRouter();
const user = ref({});

onMounted(async () => {
  if (localStorage.getItem("user") !== null) {
    user.value = JSON.parse(localStorage.getItem("user"));
  } else {
    router.push({ name: "login" });
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

  pdf.save("resume-3.pdf");
};
</script>

<template>
  <v-app>
    <v-container>
      <v-row><v-col>
        <TemplateSwitch />
      </v-col></v-row>
      <h1>Resume Template 3</h1>
      
      <v-row justify="end">
       
        <v-btn @click="downloadPDF" justify="end"><v-icon left>mdi-download</v-icon> Download</v-btn>
     
      </v-row>
     <div class="mt-5"></div>
     <div id="resume"> 
      
      <user-info :user="user" v-if="user"  :templateId="3"></user-info>
      <ProfessionalSummary   v-if="user" :templateId="3"></ProfessionalSummary>
      <education   v-if="user" :templateId="3"></education> 
      <experience   v-if="user" :template-id="3"></experience>
      <Projects   v-if="user" :template-id="3"></Projects>
      <skills   v-if="user" :templateId="3"></skills>
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
