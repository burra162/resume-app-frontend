<script setup>
import { onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import UserInfo from '../components/UserInfo.vue';
import Education from '../components/Education.vue';
import Experience from '../components/Experience.vue';
import ProfessionalSummary from "../components/ProfessionalSummary.vue";  
import Projects from "../components/Projects.vue";  
import Skills from "../components/Skills.vue";  
import LeaderShips from "../components/Leaderships.vue";
import Awards from "../components/Awards.vue";  

import ResumeServices from "../services/ResumeService.js";
 
// Reactive references for various details
const userDetails = ref({});
const professionalDetails = ref({});
const educationDetails = ref({}); 
const experienceDetails = ref({});
const skillsDetails = ref({});
const projectsDetails = ref({}); 
const leadershipDetails = ref({});
const awardsDetails = ref({});
const user = ref({});
const selectedResumeId = ref(''); // Use an empty string for consistency
const selectedTemplateId = ref(''); 

// Vue Router and Route
const route = useRoute();
const router = useRouter();


// Snackbar configuration
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

onMounted(async () => {
  // Check for user in local storage
  if (localStorage.getItem("user") !== null) {
    user.value = JSON.parse(localStorage.getItem("user"));
  } else {
    router.push({ name: "login" });
  }

  // Set resumeId and templateId from route parameters
  const resumeId = route.params.resumeId;
  selectedResumeId.value = resumeId; // Fixed typo: selctedResumeId to selectedResumeId
  console.log("Resume id: " + resumeId);

  const templateId = Number(route.params.templateId);
  selectedTemplateId.value = templateId;
  console.log("templateId id: " + templateId);

  // Fetch resume details
  try {
    console.log("Getting Resume " + user.value.id);
    const resumeData = await ResumeServices.getResumeById(resumeId);
    const json = extractAndParseJson(resumeData.data.resumeGeneratedContent);

    if (json === null) {
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = "Error: Parsing the response from cohere.";
      return;
    } else {
      // Assign fetched data to respective variables
      userDetails.value = json.userDetails;
      professionalDetails.value = json.professionalSummary;
      educationDetails.value = json.education;
      experienceDetails.value = json.experience;
      skillsDetails.value = json.skills;
      projectsDetails.value = json.projects;
      leadershipDetails.value = json.leaderships;
      awardsDetails.value = json.awards;

      console.log("JSON RAW DATA ");
      console.log(json);

      console.log({ "JSON GRABBED after parse -skills ": json.skills });
    }
  } catch (error) {
    console.error('Resume Data:--', error);
  }
});

// Function to extract and parse JSON
function extractAndParseJson(text) {
  // Find the starting and ending indices of the JSON part
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');

  // Extract the JSON string
  const jsonString = text.substring(start, end + 1);

  // Parse the JSON
  try {
    const jsonData = JSON.parse(jsonString);
    return jsonData;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return null;
  }
}

function closeSnackBar() {
  snackbar.value.value = false;
}
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

  pdf.save("resume-template-1.pdf");
};
</script>

<template>
  <v-container>
    <!-- Pass dynamic resumeId to AiTemplateSwitch -->
    <!-- <AiTemplateSwitch :resumeId="selectedResumeId" /> -->
   
    <h1>AI Resume Template {{ selectedTemplateId }} </h1>
    <v-row justify="end">
       
       <v-btn @click="downloadPDF" justify="end"><v-icon left>mdi-download</v-icon> Download</v-btn>
    
     </v-row>
    <v-row justify="end">
      <!-- Download button here -->
    </v-row>

    <div class="mt-5"></div>
    <div id="resume"> 
      <!-- Pass dynamic templateId to each component -->
      <UserInfo 
        :userData="userDetails" 
        :user="user"  
        v-if="user"  
        :templateId="selectedTemplateId">
      </UserInfo>

      <ProfessionalSummary 
        :professionalDetails="professionalDetails"   
        v-if="user" 
        :templateId="selectedTemplateId">
      </ProfessionalSummary>

      <Education 
        :educationDetails="educationDetails"   
        v-if="user" 
        :templateId="selectedTemplateId">
      </Education>

      <LeaderShips 
        :leadershipDetails="leadershipDetails"  
        v-if="user" 
        :templateId="selectedTemplateId">
      </LeaderShips>  

      <Experience  
        :experienceDetails="experienceDetails"   
        v-if="user" 
        :templateId="selectedTemplateId">
      </Experience>

      <Awards  
        :awardsDetails="awardsDetails"  
        v-if="user" 
        :templateId="selectedTemplateId">
      </Awards> 

      <Projects 
        :projectsDetails="projectsDetails"  
        v-if="user" 
        :templateId="selectedTemplateId">
      </Projects>

      <Skills  
        :skillsDetails="skillsDetails"  
        v-if="user" 
        :templateId="selectedTemplateId">
      </Skills>

      <!-- Snackbar for displaying messages -->
      <v-snackbar v-model="snackbar.value" rounded="pill">
        {{ snackbar.text }}
        <template v-slot:actions>
          <v-btn :color="snackbar.color" variant="text" @click="closeSnackBar()">
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </div>
  </v-container>
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
