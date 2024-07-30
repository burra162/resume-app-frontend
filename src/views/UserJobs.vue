<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import JobServices from "../services/JobsServices.js"; 
import ResumeServices from "../services/ResumeService.js"; 

const router = useRouter();

const snackbar = ref({
  value: false,
  color: "",
  text: "", 
});

const Jobs = ref([]);

const Job = ref({
  companyName: "",
  jobTitle: "",
  skillsRequired: "",
  description: ""
});

const dialog = ref(false);
const addDialog = ref(false);

const selectedJob = ref({});

const openEditDialog = async (job) => {
  console.log(job);
  selectedJob.value = job; 
  dialog.value = true; 
};

const user = ref({});

onMounted(async () => {
  if (localStorage.getItem("user") !== null) {
    user.value = JSON.parse(localStorage.getItem("user"));
  } else {
    router.push({ name: "login" });
  }
  getJobs();
});

function getJobs() {
  JobServices.getJobsByUserId(user.value.id)
    .then((response) => {
      Jobs.value = response.data;
    })
    .catch((e) => {
      console.log(e);
    });
}
function generateResume(jobId) {
   console.log("User "+user.value.id);
   console.log(" Job Id " +jobId);
  //  const resumeData = {
  //         userId: user.value.id,
  //         jobId: jobId
  //       };
  //     ResumeServices.generateResume(resumeData).then((response) => {
      
  //     console.log("Response :" + response)
  //   })
  //   .catch((e) => {
  //     snackbar.value.color = "red";
  //     snackbar.value.text = "Error creating Resume";
  //     snackbar.value.value = true;
  //     console.log(e);
  //   });
  router.push({ name: 'newresume', params: { jobId: jobId } });
}


function createJob() {
  if (
    Job.value.companyName === "" ||
    Job.value.jobTitle === "" ||
    Job.value.skillsRequired === "" ||
    Job.value.description === ""  
  ) {
    snackbar.value.color = "red";
    snackbar.value.text = "Please fill all fields";
    snackbar.value.value = true;
    return;
  }
  Job.value.userId = user.value.id;

  JobServices.createJob(Job.value)
    .then((response) => {
      getJobs();
      snackbar.value.color = "green";
      snackbar.value.text = "Job created successfully";
      snackbar.value.value = true;

      Job.value = {
        companyName: "",
        jobTitle: "",
        skillsRequired: "",
        description: "" 
      };

      addDialog.value = false;
    })
    .catch((e) => {
      snackbar.value.color = "red";
      snackbar.value.text = "Error creating Job";
      snackbar.value.value = true;
      console.log(e);
    });
}

function updateJob() {
  if (
    selectedJob.value.companyName === "" ||
    selectedJob.value.jobTitle === "" ||
    selectedJob.value.skillsRequired === "" ||
    selectedJob.value.description === ""  
  ) {
    snackbar.value.color = "red";
    snackbar.value.text = "Please fill all fields";
    snackbar.value.value = true;
    return;
  }

  JobServices.updateJob(selectedJob.value.id, selectedJob.value)
    .then((response) => {
      getJobs();
      snackbar.value.color = "green";
      snackbar.value.text = "Job updated successfully";
      snackbar.value.value = true;

      selectedJob.value = {};
      dialog.value = false;
    })
    .catch((e) => {
      snackbar.value.color = "red";
      snackbar.value.text = "Error updating Job";
      snackbar.value.value = true;
      console.log(e);
    });
}

function onDeleteJob(job) {
  if (!confirm("Are you sure you want to delete this Job?")) {
    return;
  }

  JobServices.deleteJob(job.id)
    .then((response) => {
      getJobs();
      snackbar.value.color = "green";
      snackbar.value.text = "Job deleted successfully";
      snackbar.value.value = true;
    })
    .catch((e) => {
      snackbar.value.color = "red";
      snackbar.value.text = "Error deleting Job";
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
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-container>
          <v-card-title class="headline mb-2">Job Applications</v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" variant="flat" @click="openAddDialog">Add Job</v-btn>
          </v-card-actions>
          <div v-if="Jobs.length === 0">
            <v-alert type="info" class="mb-2">
              No Job records found. Please add your Job details.
            </v-alert>
          </div>
          <div v-for="(job, index) in Jobs" :key="job.id">
            <v-card class="mb-2 pa-4 stylish-card">
              <v-row>
                <v-col cols="10">
                  <div class="job-header">
                    <strong>{{ job.companyName }}</strong>, {{ job.jobTitle }}
                  </div>
                  <div class="job-skills">Skills Required: {{ job.skillsRequired }}</div>
                  <div class="job-description">{{ job.description }}</div>
                </v-col>
                <v-col cols="2" class="text-right">
                 
                    
                  <v-btn icon class="mx-2" @click="openEditDialog(job)">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn icon @click="onDeleteJob(job)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-btn
                        @click="generateResume(job.id)"
                        color="primary"
                        :loading="loading"
                        :disabled="loading"
                      >
                        <v-icon left>mdi-file-document-outline</v-icon>
                        Generate Resume 
                 </v-btn>
                  </v-col>
              </v-row>
            </v-card>
          </div>
        </v-container>
      </v-col>
    </v-row>

    <v-dialog v-model="addDialog" max-width="600px">
      <v-card>
        <v-card-title class="headline">Add Job</v-card-title>
        <v-card-text>
          <v-text-field v-model="Job.companyName" label="Company Name" required></v-text-field>
          <v-text-field v-model="Job.jobTitle" label="Job Title" required></v-text-field>
          <v-textarea v-model="Job.skillsRequired" label="Skills Required" required></v-textarea>
          <v-textarea v-model="Job.description" label="Description" required></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          
          <v-btn variant="flat" @click="closeAddDialog">Cancel</v-btn>
          <v-btn variant="flat" color="primary" @click="createJob">Create Job</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title class="headline">Edit Job</v-card-title>
        <v-card-text>
          <v-text-field v-model="selectedJob.companyName" label="Company Name" required></v-text-field>
          <v-text-field v-model="selectedJob.jobTitle" label="Job Title" required></v-text-field>
          <v-textarea v-model="selectedJob.skillsRequired" label="Skills Required" required></v-textarea>
          <v-textarea v-model="selectedJob.description" label="Description" required></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="flat" @click="closeDialog">Cancel</v-btn>
          <v-btn variant="flat" color="primary" @click="updateJob">Update Job</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
  name: 'AdminJobs',
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
.job-header {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}
.job-skills {
  font-size: 14px;
  color: #757575;
  margin-bottom: 8px;
}
.job-description {
  font-size: 14px;
  color: #424242;
}
</style>
