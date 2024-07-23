<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import leadershipservices from "../services/LeadershipServices.js"; 

const router = useRouter();

const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

const leaderships = ref([]);

const leadership = ref({
  employeName: "",
  positionTitle: "",
  city: "",
  state: "",
  startDate: "",
  endDate: "",
  description: ""
});

const dialog = ref(false);
const addDialog = ref(false);

const selectedleadership = ref({});

const openEditDialog = async (exp) => {
  selectedleadership.value = exp;
  dialog.value = true;
};

const user = ref({});

onMounted(async () => {
  if (localStorage.getItem("user") !== null) {
    user.value = JSON.parse(localStorage.getItem("user"));
  } else {
    router.push({ name: "login" });
  }
  getleaderships();
});

function getleaderships() {
  leadershipservices.getleadershipByUserId(user.value.id)
    .then((response) => {
      leaderships.value = response.data;
    })
    .catch((e) => {
      console.log(e);
    });
}

function createleadership() {
  if (
    leadership.value.organizationName === "" ||
    leadership.value.positionTitle === "" ||
    leadership.value.city === "" ||
    leadership.value.state === "" ||
    leadership.value.startDate === "" ||
    
    leadership.value.description === ""
  ) {
    snackbar.value.color = "red";
    snackbar.value.text = "Please fill all fields";
    snackbar.value.value = true;
    return;
  }

  leadership.value.userId = user.value.id;
  leadershipservices.createleadership(leadership.value)
    .then((response) => {
      getleaderships();
      snackbar.value.color = "green";
      snackbar.value.text = "leadership created successfully";
      snackbar.value.value = true;

      leadership.value = {
        employeName: "",
        postionTitle: "",
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
      snackbar.value.text = "Error creating leadership";
      snackbar.value.value = true;
      console.log(e);
    });
}

function updateleadership() {
  if (
    selectedleadership.value.organizationName === "" ||
    selectedleadership.value.positionTitle === "" ||
    selectedleadership.value.city === "" ||
    selectedleadership.value.state === "" ||
    selectedleadership.value.startDate === "" ||
    
    selectedleadership.value.description === ""
  ) {
    snackbar.value.color = "red";
    snackbar.value.text = "Please fill all fields";
    snackbar.value.value = true;
    return;
  }

  leadershipservices.updateleadership(selectedleadership.value.id, selectedleadership.value)
    .then((response) => {
      getleaderships();
      snackbar.value.color = "green";
      snackbar.value.text = "leadership updated successfully";
      snackbar.value.value = true;

      selectedleadership.value = {};
      dialog.value = false;
    })
    .catch((e) => {
      snackbar.value.color = "red";
      snackbar.value.text = "Error updating leadership";
      snackbar.value.value = true;
      console.log(e);
    });
}

function onDeleteleadership(exp) {
  if (!confirm("Are you sure you want to delete this leadership?")) {
    return;
  }

  leadershipservices.deleteleadership(exp.id)
    .then((response) => {
      getleaderships();
      snackbar.value.color = "green";
      snackbar.value.text = "leadership deleted successfully";
      snackbar.value.value = true;
    })
    .catch((e) => {
      snackbar.value.color = "red";
      snackbar.value.text = "Error deleting leadership";
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
        <v-card-title class="headline">Add leadership</v-card-title>
  
        <v-card-text>
          <v-text-field v-model="leadership.organizationName" label="Organization  Name" required></v-text-field>
          <v-text-field v-model="leadership.positionTitle" label="Position Title" required></v-text-field>
          <v-text-field v-model="leadership.city" label="City" required></v-text-field>
          <v-text-field v-model="leadership.state" label="State" required></v-text-field>
          <v-text-field v-model="leadership.startDate" label="Start Date" type="date" required></v-text-field>
          <v-text-field v-model="leadership.endDate" label="End Date" type="date" required></v-text-field>
          <v-textarea v-model="leadership.description" label="Description" required></v-textarea>
        </v-card-text>
  
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="flat" @click="closeAddDialog">Cancel</v-btn>
          <v-btn variant="flat" color="primary" @click="createleadership">Create leadership</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  
    <v-container>
      <v-row>
         
          <v-col cols="12">
            
            
       
      <v-card-title class="headline mb-2">Leaderships</v-card-title>
      <v-container>
      <v-card-actions>
        <v-spacer></v-spacer>
      <v-btn color="primary"  variant="flat" @click="openAddDialog">Add leadership</v-btn>
      </v-card-actions>
    </v-container>
    <div v-if="leaderships.length === 0">
    <v-alert type="info" class="mb-2">
      No leadership records found. Please add your leadership details.
    </v-alert>
  </div>
      <div v-for="(exp, index) in leaderships" :key="exp.id">
        <v-card class="mb-2 pa-4">
           
            <v-row>
              <v-col cols="10">
                <span class="headline"> <strong>{{ exp.positionTitle }} </strong> , {{ exp.organizationName }} ,    {{ exp.city }} ,  {{ exp.state }} </span>
                <span class="pa-2" > {{ formatDate(exp.startDate) }} - {{  exp.endDate ? formatDate(exp.endDate):'Present' }} </span>
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
  
                <v-btn icon @click="onDeleteleadership(exp)">
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
          <v-card-title class="headline">Edit leadership</v-card-title>
          <v-card-text>
            <v-text-field v-model="selectedleadership.organizationName" label="Organization Name" required></v-text-field>
            <v-text-field v-model="selectedleadership.positionTitle" label="Position" required></v-text-field>
            <v-text-field v-model="selectedleadership.city" label="City" required></v-text-field>
            <v-text-field v-model="selectedleadership.state" label="State" required></v-text-field>
            <v-text-field v-model="selectedleadership.startDate" label="Start Date" type="date" required></v-text-field>
            <v-text-field v-model="selectedleadership.endDate" label="End Date" type="date" required></v-text-field>
            <v-textarea v-model="selectedleadership.description" label="Description" required></v-textarea>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="flat" @click="closeDialog">Cancel</v-btn>
            <v-btn variant="flat" color="primary" @click="updateleadership">Update leadership</v-btn>
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
  