<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import ResumeServices from "../services/ResumeService.js";  
import JobServices from "../services/JobsServices.js";  

const router = useRouter();

const snackbar = ref({
  value: false,
  color: "",
  text: "", 
});

const Jobs = ref([]);
const Resumes = ref([]);

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

onMounted(async () => {
  if (localStorage.getItem("user") !== null) {
    user.value = JSON.parse(localStorage.getItem("user"));
  } else {
    router.push({ name: "login" });
  }
  getResumes();
});

function getResumes() {
    ResumeServices.getResumesByUserId(user.value.id)
    .then((response) => {
      Resumes.value = response.data;
    })
    .catch((e) => {
      console.log(e);
    });

      JobServices.getJobsByUserId(user.value.id)
    .then((response) => {
      Jobs.value = response.data;
    })
    .catch((e) => {
      console.log(e);
    });
}
function generateResume(ResumeId) {
   console.log("User "+user.value.id);
   console.log(" Resume Id " +ResumeId); 
  router.push({ name: 'newresume', params: { ResumeId: ResumeId } });
}


function createResume() {
  if (
    Resume.value.companyName === "" ||
    Resume.value.ResumeTitle === "" ||
    Resume.value.skillsRequired === "" ||
    Resume.value.description === ""  
  ) {
    snackbar.value.color = "red";
    snackbar.value.text = "Please fill all fields";
    snackbar.value.value = true;
    return;
  }
  Resume.value.userId = user.value.id;

  ResumeServices.createResume(Resume.value)
    .then((response) => {
      getResumes();
      snackbar.value.color = "green";
      snackbar.value.text = "Resume created successfully";
      snackbar.value.value = true;

      Resume.value = {
        companyName: "",
        ResumeTitle: "",
        skillsRequired: "",
        description: "" 
      };

      addDialog.value = false;
    })
    .catch((e) => {
      snackbar.value.color = "red";
      snackbar.value.text = "Error creating Resume";
      snackbar.value.value = true;
      console.log(e);
    });
}

function updateResume() {
  if (
    selectedResume.value.companyName === "" ||
    selectedResume.value.ResumeTitle === "" ||
    selectedResume.value.skillsRequired === "" ||
    selectedResume.value.description === ""  
  ) {
    snackbar.value.color = "red";
    snackbar.value.text = "Please fill all fields";
    snackbar.value.value = true;
    return;
  }

  ResumeServices.updateResume(selectedResume.value.id, selectedResume.value)
    .then((response) => {
      getResumes();
      snackbar.value.color = "green";
      snackbar.value.text = "Resume updated successfully";
      snackbar.value.value = true;

      selectedResume.value = {};
      dialog.value = false;
    })
    .catch((e) => {
      snackbar.value.color = "red";
      snackbar.value.text = "Error updating Resume";
      snackbar.value.value = true;
      console.log(e);
    });
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
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}
function getJobById(jobId) {
  return Jobs.value.find(job => job.id === jobId) || {};
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
                <v-col cols="2" class="text-right">
                 
                    
                 
                 
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-btn
                        @click="generateResume(Resume.id)"
                        color="primary"
                        :loading="loading"
                        :disabled="loading"
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
</style>
