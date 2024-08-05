<script setup>
import { onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas"; 
import ResumeServices from "../services/ResumeService.js";
import ChatServices from "../services/ChatService.js";
import UserInfo from '../components/UserInfo.vue';
import Education from '../components/Education.vue';
import Experience from '../components/Experience.vue';
import ProfessionalSummary from "../components/ProfessionalSummary.vue";  
import Projects from "../components/Projects.vue";  
import Skills from "../components/Skills.vue";  
import LeaderShips from "../components/Leaderships.vue";
import Awards from "../components/Awards.vue";  
import ChatService from "../services/ChatService.js";

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
const chats = ref([]); // Corrected to an array
const jobId = ref(''); 

// New ref for the message textarea
const newMessage = ref('');

// Loading state
const isLoading = ref(false);

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
  selectedResumeId.value = resumeId;
  console.log("Resume id: " + resumeId);

  const templateId = Number(route.params.templateId);
  selectedTemplateId.value = templateId;
  console.log("templateId id: " + templateId);

  await fetchallData();
}); 

function updateResumePreview(resumeResponse) {
  console.log("JSON RAW DATA in Update preview");
  console.log(resumeResponse.message);
  const previewJson =  ref([]); 
  try{
    previewJson.value = extractAndParseJson(resumeResponse.message);
  }catch(error)
  {
    snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = "Error: Parsing the response from cohere.";
  }
  console.log("JSON converted ");
  console.log(previewJson);
  if (previewJson.value === null) {
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = "Error: Parsing the response from cohere.";
      return;
    } else {
      // Assign fetched data to respective variables
      userDetails.value = previewJson.value.userDetails;
      professionalDetails.value =  previewJson.value.professionalSummary;
      educationDetails.value =  previewJson.value.education;
      experienceDetails.value = previewJson.value.experience;
      skillsDetails.value =  previewJson.value.skills;
      projectsDetails.value =  previewJson.value.projects;
      leadershipDetails.value =  previewJson.value.leaderships;
      awardsDetails.value =  previewJson.value.awards;

      console.log("assigned successfully.");
    }
  console.log({resume: previewJson.value});
}

async function fetchallData() {
  // Fetch resume details
  try {
    console.log("Getting Resume " + user.value.id);
    const resumeData = await ResumeServices.getResumeById(selectedResumeId.value);
   
    const json = extractAndParseJson(resumeData.data.resumeGeneratedContent);
    console.log({resume:json});
    jobId.value = resumeData.data.jobsId;

    const chatsList = await ChatServices.getchatsByJobId(jobId.value);
    chats.value = chatsList.data;
    console.log({chats:chats.value });

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
    }
  } catch (error) {
    console.error('Resume Data:--', error);
  }
}

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

function removeContentBetweenBraces(inputString) {
  // Regular expression to match everything between the first { and the last }, including the braces
  const regex = /\{[^]*\}/;

  // Replace the matched content and the braces with an empty string
  const result = inputString.replace(regex, '');

  return result;
}

// Function to submit the form
async function submitMessage() {
  if (newMessage.value.trim() === '') {
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = "Error: Message cannot be empty.";
    return;
  }

  // Start loading
  isLoading.value = true;

  const payload = {
    message: newMessage.value
  };

  chats.value.push({
    role: 'User',
    message: newMessage.value
  });

  try {
    const response = await ChatService.updateChat(jobId.value, payload);
    updateResumePreview(response.data);

    chats.value.push({
      role: 'Chatbot',
      message: removeContentBetweenBraces(response.data.message)
    });

    snackbar.value.color = "green";
    snackbar.value.text = "Chat updated successfully";
    snackbar.value.value = true;
  } catch (e) {
    snackbar.value.color = "red";
    snackbar.value.text = "Error updating chat";
    snackbar.value.value = true;
    console.log(e);
  } finally {
    // Stop loading
    isLoading.value = false;
  }

  // Clear the textarea after submitting
  newMessage.value = '';
}
async function publish(chat)
{
    //  publish chat resume
    try {
    const response = await ChatService.publishChat(jobId.value,{chatId:chat.id});
    fetchallData();

    chats.value.push({
      role: 'Chatbot',
      message: removeContentBetweenBraces(response.data.message)
    });

    snackbar.value.color = "green";
    snackbar.value.text = "Resume published successfully";
    snackbar.value.value = true;
  } catch (e) {
    snackbar.value.color = "red";
    snackbar.value.text = "Error publishing the resume.";
    snackbar.value.value = true;
    console.log(e);
  } finally {
    
  }
    
}
</script>

<template>
  <v-container>
    <h1>Edit Resume</h1>
    <h2>Chat History</h2>
    <v-row>
      <!-- First Column: Chat and Form -->
      <v-col cols="12" md="6">
        <div id="chat-section">
          <v-row v-for="(chat, index) in chats" :key="index">
            <v-col cols="12">
              <v-card :color="chat.role === 'User' ? 'secondary' : 'teal'">
                <v-card-title>{{ chat.role }}</v-card-title>
                <v-card-text>{{ removeContentBetweenBraces(chat.message) }}</v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn v-if="chat.role !== 'User'" color="primary" text @click="publish(chat)">
                    Publish this Resume
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </div>

        <!-- Form for adding a new message -->
        <div id="form-section" class="mt-5">
          <v-form @submit.prevent="submitMessage">
            <!-- Display progress bar while loading -->
            <v-progress-linear 
              v-if="isLoading" 
              indeterminate 
              color="primary" 
              class="mb-2"
            ></v-progress-linear>

            <v-textarea v-model="newMessage" label="Type your message" rows="4" outlined></v-textarea>
            <v-btn type="submit"  :disabled="isLoading" color="primary" class="mt-2">Submit</v-btn>
          </v-form>
        </div>
      </v-col>

      <!-- Second Column: Resume Preview -->
      <v-col cols="12" md="6">
        <div id="text-section">
          <h2>Resume Preview</h2>
          
          <div id="resume">
            <!-- Pass dynamic templateId to each component -->
            <UserInfo 
              :userData="userDetails" 
              :user="user"  
              v-if="user"  
              :templateId="selectedTemplateId"
            >
            </UserInfo>

            <ProfessionalSummary 
              :professionalDetails="professionalDetails"   
              v-if="user" 
              :templateId="selectedTemplateId"
            >
            </ProfessionalSummary>

            <Education 
              :educationDetails="educationDetails"   
              v-if="user" 
              :templateId="selectedTemplateId"
            >
            </Education>

            <LeaderShips 
              :leadershipDetails="leadershipDetails"  
              v-if="user" 
              :templateId="selectedTemplateId"
            >
            </LeaderShips>  

            <Experience  
              :experienceDetails="experienceDetails"   
              v-if="user" 
              :templateId="selectedTemplateId"
            >
            </Experience>

            <Awards  
              :awardsDetails="awardsDetails"  
              v-if="user" 
              :templateId="selectedTemplateId"
            >
            </Awards> 

            <Projects 
              :projectsDetails="projectsDetails"  
              v-if="user" 
              :templateId="selectedTemplateId"
            >
            </Projects>

            <Skills  
              :skillsDetails="skillsDetails"  
              v-if="user" 
              :templateId="selectedTemplateId"
            >
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
        </div>
      </v-col>
    </v-row>

    <!-- Snackbar for displaying messages -->
    <v-snackbar v-model="snackbar.value" rounded="pill">
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn :color="snackbar.color" variant="text" @click="closeSnackBar()">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<style scoped>
#chat-section {
  max-height: 400px;
  overflow-y: auto;
}

#resume {
 background-color: white;
 overflow-x: scroll;
}

v-card {
  margin-bottom: 10px;
}

#form-section {
  margin-top: 20px;
}

.v-progress-linear {
  margin-bottom: 10px;
}
</style>
