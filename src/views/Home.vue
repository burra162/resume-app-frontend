<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import ResumeServices from "../services/ResumeService.js";


const userDetails = ref({
    firstName: "",
    lastName: "",
    email: "",
    number: "",
    address: "",
    link1Name: "",
    link1: "",
    link2Name: "",
    link2: "",
    link3Name: "",
    link3: "",
    userId: "",
});

const user = ref(null);

const isSave = ref(false);

onMounted(async () => {
    user.value = JSON.parse(localStorage.getItem("user"));
    userDetails.value.userId = user.value.id;
    summary.value.userId = user.value.id;
    getUserDetails();
    getSummary();
});

async function getUserDetails() {
    ResumeServices.getUserDetails(userDetails.value.userId)
        .then((data) => {
            userDetails.value = data.data;
            isSave.value = false;
        })
        .catch((error) => {
            isSave.value = true;
        });

}

const snackbar = ref({
    value: false,
    color: "",
    text: "",
});

const selectedTab = ref(0);

function changeTab(index) {
    selectedTab.value = index;
}

const tabs = ref([
    "Details",
    "Templates",
    "Job Applications",
]);

const resumeTabs = ref([
    "Personal Details",
    "Professional Summary",
    "Education",
    "Professional Experience",
    "Skills",
    "Projects",
    "Certifications"
]);


async function saveUserDetails() {
    await ResumeServices.saveUserDetails(userDetails.value)
        .then(() => {
            snackbar.value.value = true;
            snackbar.value.color = "green";
            snackbar.value.text = "Details saved successfully!";
            getUserDetails();
        })
        .catch((error) => {
            snackbar.value.value = true;
            snackbar.value.color = "error";
            snackbar.value.text = error.response.data.message;
        });
}

async function updateUserDetails() {
    await ResumeServices.updateUserDetails(userDetails.value.id, userDetails.value)
        .then(() => {
            snackbar.value.value = true;
            snackbar.value.color = "green";
            snackbar.value.text = "Details updated successfully!";
            getUserDetails();
        })
        .catch((error) => {
            snackbar.value.value = true;
            snackbar.value.color = "error";
            snackbar.value.text = error.response.data.message;
        });
}

const selectedResumeTab = ref(0);

function changeResumeTab(index) {
    selectedResumeTab.value = index;
}

function closeSnackBar() {
    snackbar.value.value = false;
}

const summary = ref({
    summary: "",
    userId: "",
});

const isSummarySave = ref(false);

async function getSummary() {
    ResumeServices.getSummary(summary.value.userId)
        .then((data) => {
            summary.value = data.data;
            isSummarySave.value = false;
        })
        .catch((error) => {
            isSummarySave.value = true;
        });
}

async function saveSummary() {
    await ResumeServices.saveSummary(summary.value)
        .then(() => {
            snackbar.value.value = true;
            snackbar.value.color = "green";
            snackbar.value.text = "Summary saved successfully!";
            getSummary();
        })
        .catch((error) => {
            snackbar.value.value = true;
            snackbar.value.color = "error";
            snackbar.value.text = error.response.data.message;
        });
}

async function updateSummary() {
    await ResumeServices.updateSummary(summary.value.id, summary.value)
        .then(() => {
            snackbar.value.value = true;
            snackbar.value.color = "green";
            snackbar.value.text = "Summary updated successfully!";
            getSummary();
        })
        .catch((error) => {
            console.log(error);
            snackbar.value.value = true;
            snackbar.value.color = "error";
            snackbar.value.text = error.response.data.message;
        });
}



</script>

<template>
    <v-container>
        <v-app-bar color="primary" class="pr-3" dark>
            <v-container>
                <v-col>
                    <v-row>
                        <v-tabs bg-color="primary" fixed-tabs>
                            <v-tab v-for="(tab, index) in tabs" :key="index" @click="changeTab(index)">
                                {{ tab }}
                            </v-tab>
                        </v-tabs>
                    </v-row>
                </v-col>

            </v-container>
        </v-app-bar>

        <div id="body">

            <v-container>
                <v-row>
                    <v-col v-if="selectedTab === 0">
                        <v-tabs bg-color="primary" fixed-tabs>
                            <v-tab v-for="(tab, index) in resumeTabs" :key="index" @click="changeResumeTab(index)">
                                {{ tab }}
                            </v-tab>
                        </v-tabs>
                        <v-card v-if="selectedResumeTab === 0">
                            <v-card-title>
                                <h3>Personal Details</h3>
                            </v-card-title>
                            <v-card-text>
                                <v-row>
                                    <v-col cols="12" sm="6">
                                        <v-text-field v-model="userDetails.firstName" label="First Name"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6">
                                        <v-text-field v-model="userDetails.lastName" label="Last Name"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6">
                                        <v-text-field v-model="userDetails.email" type="email"
                                            label="Email"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6">
                                        <v-text-field v-model="userDetails.number" type="number"
                                            label="Phone Number"></v-text-field>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-text-field v-model="userDetails.address" label="Address"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6">
                                        <v-text-field v-model="userDetails.link1Name"
                                            label="Link 1 Name"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6">
                                        <v-text-field v-model="userDetails.link1" label="Link 1 URL"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6">
                                        <v-text-field v-model="userDetails.link2Name"
                                            label="Link 2 Name"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6">
                                        <v-text-field v-model="userDetails.link2" label="Link 2 URL"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6">
                                        <v-text-field v-model="userDetails.link3Name"
                                            label="Link 3 Name"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6">
                                        <v-text-field v-model="userDetails.link3" label="Link 3 URL"></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn v-if="isSave" variant="flat" color="primary"
                                    @click="saveUserDetails">Save</v-btn>
                                <v-btn v-else variant="flat" color="primary" @click="updateUserDetails">Update</v-btn>
                            </v-card-actions>
                        </v-card>

                        <v-card v-else-if="selectedResumeTab === 1">
                            <v-card-title>
                                <h3>Professional Summary</h3>
                            </v-card-title>
                            <v-card-text>
                                <v-row>
                                    <v-col cols="12">
                                        <v-textarea v-model="summary.summary" label="Summary"></v-textarea>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn v-if="isSummarySave" variant="flat" color="primary"
                                    @click="saveSummary">Save</v-btn>
                                <v-btn v-else variant="flat" color="primary" @click="updateSummary">Update</v-btn>
                            </v-card-actions>
                        </v-card>


                    </v-col>
                    <v-col v-else-if="selectedTab === 1">

                    </v-col>
                    <v-col v-else-if="selectedTab === 2">

                    </v-col>
                </v-row>
            </v-container>

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