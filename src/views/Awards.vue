<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import awardservices from "../services/awardServices.js"; 

const router = useRouter();

const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

const awards = ref([]);

const award = ref({
  employeName: "",
  awardTitle: "",
  city: "",
  state: "",
  startDate: "",
  endDate: "",
  description: ""
});

const dialog = ref(false);
const addDialog = ref(false);

const selectedaward = ref({});

const openEditDialog = async (exp) => {
  selectedaward.value = exp;
  dialog.value = true;
};

const user = ref({});

onMounted(async () => {
  if (localStorage.getItem("user") !== null) {
    user.value = JSON.parse(localStorage.getItem("user"));
  } else {
    router.push({ name: "login" });
  }
  getawards();
});

function getawards() {
  awardservices.getAwardsByUserId(user.value.id)
    .then((response) => {
      awards.value = response.data;
    })
    .catch((e) => {
      console.log(e);
    });
}

function createaward() {
  if (
    award.value.organizationName === "" ||
    award.value.awardTitle === "" || 
    award.value.startDate === "" ||
    award.value.endDate === "" ||
    award.value.description === ""
  ) {
    snackbar.value.color = "red";
    snackbar.value.text = "Please fill all fields";
    snackbar.value.value = true;
    return;
  }

  award.value.userId = user.value.id;
  awardservices.createAwards(award.value)
    .then((response) => {
      getawards();
      snackbar.value.color = "green";
      snackbar.value.text = "award created successfully";
      snackbar.value.value = true;

      award.value = {
        organizationName: "",
        awardTitle: "", 
        startDate: "",
        endDate: "",
        description: ""
      };

      addDialog.value = false;
    })
    .catch((e) => {
      snackbar.value.color = "red";
      snackbar.value.text = "Error creating award";
      snackbar.value.value = true;
      console.log(e);
    });
}

function updateaward() {
  if (
    selectedaward.value.organizationName === "" ||
    selectedaward.value.awardTitle === "" || 
    selectedaward.value.startDate === "" ||
    selectedaward.value.endDate === "" ||
    selectedaward.value.description === ""
  ) {
    snackbar.value.color = "red";
    snackbar.value.text = "Please fill all fields";
    snackbar.value.value = true;
    return;
  }

  awardservices.updateAwards(selectedaward.value.id, selectedaward.value)
    .then((response) => {
      getawards();
      snackbar.value.color = "green";
      snackbar.value.text = "award updated successfully";
      snackbar.value.value = true;

      selectedaward.value = {};
      dialog.value = false;
    })
    .catch((e) => {
      snackbar.value.color = "red";
      snackbar.value.text = "Error updating award";
      snackbar.value.value = true;
      console.log(e);
    });
}

function onDeleteaward(exp) {
  if (!confirm("Are you sure you want to delete this award?")) {
    return;
  }

  awardservices.deleteAwards(exp.id)
    .then((response) => {
      getawards();
      snackbar.value.color = "green";
      snackbar.value.text = "award deleted successfully";
      snackbar.value.value = true;
    })
    .catch((e) => {
      snackbar.value.color = "red";
      snackbar.value.text = "Error deleting award";
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
        <v-card-title class="headline">Add award</v-card-title>
  
        <v-card-text>
          <v-text-field v-model="award.organizationName" label="Organization  Name" required></v-text-field>
          <v-text-field v-model="award.awardTitle" label="Award Title" required></v-text-field> 
          <v-text-field v-model="award.startDate" label="Start Date" type="date" required></v-text-field>
          <v-text-field v-model="award.endDate" label="End Date" type="date" required></v-text-field>
          <v-textarea v-model="award.description" label="Description" required></v-textarea>
        </v-card-text>
  
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="flat" @click="closeAddDialog">Cancel</v-btn>
          <v-btn variant="flat" color="primary" @click="createaward">Create award</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  
    <v-container>
      <v-row>
        
          <v-col cols="12">
            
            
       
      <v-card-title class="headline mb-2">awards</v-card-title>
      <v-container>
      <v-card-actions>
        <v-spacer></v-spacer>
      <v-btn color="primary"  variant="flat" @click="openAddDialog">Add award</v-btn>
      </v-card-actions>
    </v-container>
    <div v-if="awards.length === 0">
    <v-alert type="info" class="mb-2">
      No award records found. Please add your award details.
    </v-alert>
  </div>
      <div v-for="(exp, index) in awards" :key="exp.id">
        <v-card class="mb-2 pa-4">
           
            <v-row>
              <v-col cols="10">
                <span class="headline"> <strong>{{ exp.awardTitle }} </strong> , {{ exp.organizationName }}     </span>
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
  
                <v-btn icon @click="onDeleteaward(exp)">
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
          <v-card-title class="headline">Edit award</v-card-title>
          <v-card-text>
            <v-text-field v-model="selectedaward.organizationName" label="Organization Name" required></v-text-field>
            <v-text-field v-model="selectedaward.awardTitle" label="Award" required></v-text-field> 
            <v-text-field v-model="selectedaward.startDate" label="Start Date" type="date" required></v-text-field>
            <v-text-field v-model="selectedaward.endDate" label="End Date" type="date" required></v-text-field>
            <v-textarea v-model="selectedaward.description" label="Description" required></v-textarea>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="flat" @click="closeDialog">Cancel</v-btn>
            <v-btn variant="flat" color="primary" @click="updateaward">Update award</v-btn>
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
  