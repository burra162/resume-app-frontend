<script setup>
import { onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import jobServices from "../services/JobsServices";
import ResumeServices from "../services/ResumeService.js"; 

const snackbar = ref({
    value: false,
    color: "",
    text: "",
});

const route = useRoute();
const router = useRouter();
const jobInfo = ref({});
const jobId = ref(null);
const user = ref({});
const valid = ref(false);
const loading = ref(false);
const description = ref('');
const selectedTemplate = ref(null);
const templates = [
  'Template 1',
  'Template 2',
  'Template 3',
  'Template 4',
];
const rules = {
  required: (value) => !!value || 'Required.',
  min: (v) => v.length >= 10 || 'Minimum 10 characters',
};

onMounted(async () => {
    if (localStorage.getItem("user") !== null) {
        user.value = JSON.parse(localStorage.getItem("user"));
    } else {
        router.push({ name: "login" });
    }
    await getJobDetails();
});

async function getJobDetails() {
    const jobIdFromRoute = route.params.jobId;
    if (jobIdFromRoute) {
        jobId.value = jobIdFromRoute; // Set the jobId value from route params
        try {
            const data = await jobServices.getJobById(jobId.value);
            jobInfo.value = data.data;
        } catch (error) {
            console.log(error);
        }
    }
}

function closeSnackBar() {
    snackbar.value.value = false;
}

async function submitForm() {
    console.log("submitting the form..")
    if (valid.value) {
        loading.value = true;
        const uinfo = JSON.parse(localStorage.getItem("user"));
        const templateNumber  = 0;
  
        const resumeData = {
            userId: uinfo.id,
            jobId: jobId.value,
            templateId: selectedTemplate.value.replace("Template ", "")
        };
        try {
            console.log("submitting the data "+resumeData);
            const response = await ResumeServices.generateResume(resumeData);
            console.log("Response:", response);
        } catch (e) {
            snackbar.value.color = "red";
            snackbar.value.text = "Error creating Resume";
            snackbar.value.value = true;
            console.log(e);
        } finally {
            loading.value = false;
        }
    }
}
</script>

<template>
    <v-container>
        <v-form ref="form" v-model="valid" lazy-validation>
            <h1>Generate Resume with AI</h1>
            <!-- Hidden Input for jobId -->
            <v-text-field
                v-model="jobId"
                type="hidden"
            ></v-text-field>
            
            <!-- Display Job Title -->
            <v-container>
                <v-text class="font-weight-bold">Job Title:</v-text>
                <v-text>{{ jobInfo.jobTitle }}</v-text>
            </v-container>
            
            <!-- Display Job Description -->
            <v-container>
                <v-text class="font-weight-bold">Job Description:</v-text>
                <v-text>{{ jobInfo.description }}</v-text>
            </v-container>
      
            <!-- Dropdown for resume templates -->
            <v-select
                v-model="selectedTemplate"
                :items="templates"
                label="Select Resume Template"
                :rules="[rules.required]"
                outlined
            ></v-select>
      
            <!-- Submit Button -->
            <v-btn
                :disabled="!valid || loading"
                color="primary"
                @click="submitForm"
            >
                Submit
                <v-progress-circular
                    v-if="loading"
                    indeterminate
                    color="white"
                    size="20"
                    class="ml-2"
                ></v-progress-circular>
            </v-btn>
        </v-form>
    </v-container>
</template>

<style scoped>
.v-container {
    max-width: 600px;
    margin: auto;
}
</style>
