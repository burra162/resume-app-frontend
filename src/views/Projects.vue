<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import projectservices from "../services/ProjectServices.js"; 

const router = useRouter();

const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

const projects = ref([]);

const project = ref({
  employeName: "",
  projectTitle: "",
  city: "",
  state: "",
  startDate: "",
  endDate: "",
  description: ""
});

const dialog = ref(false);
const addDialog = ref(false);

const selectedproject = ref({});

const openEditDialog = async (exp) => {
  selectedproject.value = exp;
  dialog.value = true;
};

const user = ref({});

onMounted(async () => {
  if (localStorage.getItem("user") !== null) {
    user.value = JSON.parse(localStorage.getItem("user"));
  } else {
    router.push({ name: "login" });
  }
  getprojects();
});

function getprojects() {
  projectservices.getProjectByUserId(user.value.id)
    .then((response) => {
      projects.value = response.data;
    })
    .catch((e) => {
      console.log(e);
    });
}

function createproject() {
  if (
    project.value.organizationName === "" ||
    project.value.projectTitle === "" ||
    project.value.city === "" ||
    project.value.state === "" ||
    project.value.startDate === "" ||
    project.value.endDate === "" ||
    project.value.description === ""
  ) {
    snackbar.value.color = "red";
    snackbar.value.text = "Please fill all fields";
    snackbar.value.value = true;
    return;
  }

  project.value.userId = user.value.id;
  projectservices.createProject(project.value)
    .then((response) => {
      getprojects();
      snackbar.value.color = "green";
      snackbar.value.text = "project created successfully";
      snackbar.value.value = true;

      project.value = {
        employeName: "",
        projectTitle: "",
        city: "",
        state: "",
        startDate: "",
        endDate: "",
        description: ""
      };

      addDialog.value = false;
    })
    .catch((e) => {
      snackbar.value.color = "red";
      snackbar.value.text = "Error creating project";
      snackbar.value.value = true;
      console.log(e);
    });
}

function updateproject() {
  if (
    selectedproject.value.organizationName === "" ||
    selectedproject.value.projectTitle === "" ||
    selectedproject.value.city === "" ||
    selectedproject.value.state === "" ||
    selectedproject.value.startDate === "" ||
    selectedproject.value.endDate === "" ||
    selectedproject.value.description === ""
  ) {
    snackbar.value.color = "red";
    snackbar.value.text = "Please fill all fields";
    snackbar.value.value = true;
    return;
  }

  projectservices.updateProject(selectedproject.value.id, selectedproject.value)
    .then((response) => {
      getprojects();
      snackbar.value.color = "green";
      snackbar.value.text = "project updated successfully";
      snackbar.value.value = true;

      selectedproject.value = {};
      dialog.value = false;
    })
    .catch((e) => {
      snackbar.value.color = "red";
      snackbar.value.text = "Error updating project";
      snackbar.value.value = true;
      console.log(e);
    });
}

function onDeleteproject(exp) {
  if (!confirm("Are you sure you want to delete this project?")) {
    return;
  }

  projectservices.deleteProject(exp.id)
    .then((response) => {
      getprojects();
      snackbar.value.color = "green";
      snackbar.value.text = "project deleted successfully";
      snackbar.value.value = true;
    })
    .catch((e) => {
      snackbar.value.color = "red";
      snackbar.value.text = "Error deleting project";
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
function formatDate(date){
    const d = new Date(date);
    return `${('0' + (d.getMonth() + 1)).slice(-2)}/${d.getFullYear()}`;
  }
  //    split the description by new lines
function  formattedDescription(Description) {
  return  Description.split('\n').filter(line => line.trim() !== '');
}
</script>
<template>
   
  
    <v-dialog v-model="addDialog" max-width="600px">
      <v-card>
        <v-card-title class="headline">Add project</v-card-title>
  
        <v-card-text>
          <v-text-field v-model="project.organizationName" label="Organization  Name" required></v-text-field>
          <v-text-field v-model="project.projectTitle" label="Project Title" required></v-text-field>
          <v-text-field v-model="project.city" label="City" required></v-text-field>
          <v-text-field v-model="project.state" label="State" required></v-text-field>
          <v-text-field v-model="project.startDate" label="Start Date" type="date" required></v-text-field>
          <v-text-field v-model="project.endDate" label="End Date" type="date" required></v-text-field>
          <v-textarea v-model="project.description" label="Description" required></v-textarea>
        </v-card-text>
  
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="flat" @click="closeAddDialog">Cancel</v-btn>
          <v-btn variant="flat" color="primary" @click="createproject">Create project</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  
    <v-container>
      <v-row>
        
          <v-col cols="12">
            
            
       
      <v-card-title class="headline mb-2">Projects</v-card-title>
      <v-container>
      <v-card-actions>
        <v-spacer></v-spacer>
      <v-btn color="primary"  variant="flat" @click="openAddDialog">Add project</v-btn>
      </v-card-actions>
    </v-container>
    <div v-if="projects.length === 0">
    <v-alert type="info" class="mb-2">
      No project records found. Please add your project details.
    </v-alert>
  </div>
      <div v-for="(exp, index) in projects" :key="exp.id">
        <v-card class="mb-2 pa-4">
           
            <v-row>
              <v-col cols="10">
                <span class="headline"> <strong>{{ exp.projectTitle }} </strong> , {{ exp.organizationName }} ,    {{ exp.city }} ,  {{ exp.state }} </span>
                <span class="pa-2" > {{ formatDate(exp.startDate) }} - {{ formatDate(exp.endDate) }} </span>
                <div class="pa-8">
                  <ul>
                    <li v-for="(line, index) in formattedDescription(exp.description)" :key="index">{{ line }}</li>
              </ul>
    </div>
              </v-col>
              <v-col cols="2">
                <v-btn icon class="mx-2" @click="openEditDialog(exp)">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
  
                <v-btn icon @click="onDeleteproject(exp)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          
          
        </v-card>
      </div>
      </v-col>
      </v-row>
    </v-container>
  
    <template v-if="dialog">
      <v-dialog v-model="dialog" max-width="600px">
        <v-card>
          <v-card-title class="headline">Edit project</v-card-title>
          <v-card-text>
            <v-text-field v-model="selectedproject.organizationName" label="Employeer Name" required></v-text-field>
            <v-text-field v-model="selectedproject.projectTitle" label="Job Title" required></v-text-field>
            <v-text-field v-model="selectedproject.city" label="City" required></v-text-field>
            <v-text-field v-model="selectedproject.state" label="State" required></v-text-field>
            <v-text-field v-model="selectedproject.startDate" label="Start Date" type="date" required></v-text-field>
            <v-text-field v-model="selectedproject.endDate" label="End Date" type="date" required></v-text-field>
            <v-textarea v-model="selectedproject.description" label="Description" required></v-textarea>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="flat" @click="closeDialog">Cancel</v-btn>
            <v-btn variant="flat" color="primary" @click="updateproject">Update project</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
  
    <v-snackbar v-model="snackbar.value" rounded="pill">
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn :color="snackbar.color" variant="text" @click="closeSnackBar">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </template>
  