<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import ResumeServices from "../services/ResumeService.js";  
import JobServices from "../services/JobsServices.js";   
import FavoriteServices from "../services/favoriteService.js";   

const router = useRouter();

const snackbar = ref({
  value: false,
  color: "",
  text: "", 
});
// Reactive reference to keep track of favorite status
 


const Jobs = ref([]);
const Resumes = ref([]);
const FavResumes = ref([]);

const Resume = ref({
  companyName: "",
  ResumeTitle: "",
  skillsRequired: "",
  description: ""
});

const dialog = ref(false);
const addDialog = ref(false);

const selectedResume = ref({});

const openEditDialog = async (Resume) => {
  console.log(Resume);
  selectedResume.value = Resume; 
  dialog.value = true; 
};

const user = ref({});
// Toggle favorite status
const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value;
};
onMounted(async () => {
  if (localStorage.getItem("user") !== null) {
    user.value = JSON.parse(localStorage.getItem("user"));
  } else {
    router.push({ name: "login" });
  }
  getResumes();
  getFavourites();
});
function getResumes() {
  if(user.value.type==="user")
    {
      getUserResumes();
    }
    else if(user.value.type==="admin")
    {
      getAdminResumes();
    }
}
function getUserResumes() {
    ResumeServices.getResumesByUserId(user.value.id)
    .then((response) => {
      Resumes.value = response.data;
    })
    .catch((e) => {
      console.log(e);
    });

      JobServices.getAlljobs()
    .then((response) => {
      Jobs.value = response.data;
    })
    .catch((e) => {
      console.log(e);
    });
}
function getAdminResumes() {
    ResumeServices.getAllResumes()
    .then((response) => {
      Resumes.value = response.data;
    })
    .catch((e) => {
      console.log(e);
    });

      JobServices.getAlljobs(user.value.id)
    .then((response) => {
      Jobs.value = response.data;
    })
    .catch((e) => {
      console.log(e);
    });
}
function viewResume(Resume) {
   console.log("User "+user.value.id);
   console.log(" Resume Id " +Resume.id); 
   console.log(" Template Id " +Resume.templateId); 
  router.push({ name: 'airesumetemplate', params: { resumeId: Resume.id,templateId:Resume.templateId } });
}
//
function editResume(Resume) {
    
   console.log(" Edit Resume with Id " +Resume.id); 
   console.log(" Template Id " +Resume.templateId); 
  router.push({ name: 'editresume', params: { resumeId: Resume.id,templateId:Resume.templateId } });
}

 
function onDeleteResume(Resume) {
  if (!confirm("Are you sure you want to delete this Resume?")) {
    return;
  }

  ResumeServices.deleteResume(Resume.id)
    .then((response) => {
      getResumes();
      snackbar.value.color = "green";
      snackbar.value.text = "Resume deleted successfully";
      snackbar.value.value = true;
    })
    .catch((e) => {
      snackbar.value.color = "red";
      snackbar.value.text = "Error deleting Resume";
      snackbar.value.value = true;
      console.log(e);
    });
}

function closeDialog() {
  dialog.value = false;
}

function closeAddDialog() {
  addDialog.value = false;
}

function closeSnackBar() {
  snackbar.value.value = false;
}

function openAddDialog() {
  addDialog.value = true;
}
function formatDate(date) {
  const d = new Date(date);

  // Extracting date components
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const year = d.getFullYear();

  // Extracting time components
  let hours = d.getHours();
  const minutes = d.getMinutes();
  const seconds = d.getSeconds();

  // Determine AM or PM
  const ampm = hours >= 12 ? 'PM' : 'AM';

  // Convert hours from 24-hour to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  // Format minutes and seconds to always have two digits
  const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
  const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;

  return `${month}/${day}/${year} ${hours}:${formattedMinutes}:${formattedSeconds} ${ampm}`;
}
function getJobById(jobId) {
  return Jobs.value.find(job => job.id === jobId) || {};
}
function getFavourites()
{
  FavoriteServices.getfavoritesByUserId(user.value.id)
    .then((response) => {
      FavResumes.value = response.data;
      console.log({favs: FavResumes.value})
    })
    .catch((e) => {
      console.log(e);
    });
}
function addFavorite(resume)
{
  const favData = {resumeId:resume.id,userId:user.value.id}
  FavoriteServices.createfavorite(favData)
    .then((response) => {
      getFavourites();
      console.log({favs: FavResumes.value});
      snackbar.value.color = "green";
      snackbar.value.text = "Resume added to favorite list successfully";
      snackbar.value.value = true;
    })
    .catch((e) => {
      console.log(e);
    });
}
// Function to check if a resume is a favorite
const isFavorite = (resumeId) => {
  // Find resume in favorite list
  console.log("Favs"+FavResumes.value)
  return FavResumes.value.some(resume => resume.resumeId === resumeId);
};
function deleteFavorite(resume)
{
   FavoriteServices.deletefavorite(resume.id)
    .then((response) => {
      getFavourites();
      console.log({favs: FavResumes.value});
      snackbar.value.color = "green";
      snackbar.value.text = "Resume removed from favorite list successfully";
      snackbar.value.value = true;
    })
    .catch((e) => {
      console.log(e);
    });
}
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-container>
          <v-card-title class="headline mb-2">AI Generated Resumes</v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
          
          </v-card-actions>
          <div v-if="Resumes.length === 0">
            <v-alert type="info" class="mb-2">
              No Resume records found. Please generate your Resumes.
            </v-alert>
          </div>
          <div v-for="(Resume, index) in Resumes" :key="Resume.id">
            <v-card class="mb-2 pa-4 stylish-card">
              <v-row>
                <v-col cols="10">
                  <div  >
                   Resumed generated for  <strong> {{ getJobById(Resume.jobsId)?getJobById(Resume.jobsId).jobTitle:'' }}</strong>, generated on <strong> {{ formatDate(Resume.createdAt) }}</strong>
                  </div>
                  <div class="Resume-skills">Template Id {{ Resume.templateId }}</div>
                  
                </v-col>
                
              </v-row>
              <v-row>
                <v-col>
                  <v-btn
                        @click="viewResume(Resume)"
                        color="primary" 
                      >
                        <v-icon left>mdi-file-document-outline</v-icon>
                        View Resume  
                 </v-btn>
                  </v-col>
              </v-row>
            </v-card>
          </div>
        </v-container>
      </v-col>
    </v-row>

  
    <v-snackbar v-model="snackbar.value" rounded="pill">
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn :color="snackbar.color" variant="text" @click="closeSnackBar">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
export default {
  name: 'AdminResumes',
}
</script>

<style>
.stylish-card {
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.stylish-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
.Resume-header {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}
.Resume-skills {
  font-size: 14px;
  color: #757575;
  margin-bottom: 8px;
}
.Resume-description {
  font-size: 14px;
  color: #424242;
}
 
.favorite-icon {
  color: brown;
}
.default-icon {
  color: inherit; /* or use a different color if needed */
}
</style>