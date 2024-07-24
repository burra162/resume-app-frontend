<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import ResumeServices from "../services/ResumeService.js";
import JobComponent from "./UserJobs.vue";
import ProjetComponent from "./Projects.vue";
import LeadershipsComponent from "./Leaderships.vue"; 
import AwardsComponent from "./Awards.vue";
import { useRouter } from "vue-router";
const router = useRouter();


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
    education.value.userId = user.value.id;
    experience.value.userId = user.value.id;
    skill.value.userId = user.value.id;


    getUserDetails();
    getSummary();
    getEducations();
    getExperiences();
    getSkills();
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
    "Leaderships",
    "Awards",
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

const experiences = ref([]);

const experience = ref({
    employer: "",
    jobTitle: "",
    startDate: "",
    endDate: "",
    description: "",
    address: "",
    userId: "",
});

const isExperienceSave = ref(true);

const showExperienceDialog = ref(false);

function closeExperienceDialog() {
    experience.value = {
        employer: "",
        jobTitle: "",
        startDate: "",
        endDate: "",
        description: "",
        address: "",
        userId: user.value.id,
    };
    showExperienceDialog.value = false;
}

function openAddExperience() {
    isExperienceSave.value = true;
    showExperienceDialog.value = true;
}

function showExpeience(exp) {
    isExperienceSave.value = false;
    experience.value = exp;
    showExperienceDialog.value = true;
}

function formatExperienceDate(date) {
    return new Date(date).toLocaleDateString();
}

async function getExperiences() {
    ResumeServices.getExperience(experience.value.userId)
        .then((data) => {
            experiences.value = data.data;
        })
        .catch((error) => {
        });
}


async function saveExperience() {
    await ResumeServices.saveExperience(experience.value)
        .then(() => {
            snackbar.value.value = true;
            snackbar.value.color = "green";
            snackbar.value.text = "Experience saved successfully!";
            getExperiences();
            closeExperienceDialog();
        })
        .catch((error) => {
            snackbar.value.value = true;
            snackbar.value.color = "error";
            snackbar.value.text = "Error saving experience!";
        });
}

async function updateExperience() {
    await ResumeServices.updateExperience(experience.value.id, experience.value)
        .then(() => {
            snackbar.value.value = true;
            snackbar.value.color = "green";
            snackbar.value.text = "Experience updated successfully!";
            closeExperienceDialog();
            getExperiences();
        })
        .catch((error) => {
            snackbar.value.value = true;
            snackbar.value.color = "error";
            snackbar.value.text = "Error updating experience!";
        });
}

async function deleteExperience(exp) {
    if (!confirm("Are you sure you want to delete this experience?")) {
        return;
    }
    await ResumeServices.deleteExperience(exp.id)
        .then(() => {
            snackbar.value.value = true;
            snackbar.value.color = "green";
            snackbar.value.text = "Experience deleted successfully!";
            getExperiences();
            closeExperienceDialog();
        })
        .catch((error) => {
            snackbar.value.value = true;
            snackbar.value.color = "error";
            snackbar.value.text = "Error deleting experience!";
        });
}

const skills = ref([]);

const skill = ref({
    skill: "",
    userId: "",
});

const isSkillSave = ref(true);

const showSkillDialog = ref(false);

function closeSkillDialog() {
    skill.value = {
        skill: "",
        userId: user.value.id,
    };
    showSkillDialog.value = false;
}


function openAddSkill() {
    isSkillSave.value = true;
    showSkillDialog.value = true;
}

function editSkill(s) {
    isSkillSave.value = false;
    skill.value = s;
    showSkillDialog.value = true;
}

async function getSkills() {
    ResumeServices.getSkills(skill.value.userId)
        .then((data) => {
            skills.value = data.data;
        })
        .catch((error) => {
        });
}


async function saveSkill() {
    await ResumeServices.saveSkill(skill.value)
        .then(() => {
            snackbar.value.value = true;
            snackbar.value.color = "green";
            snackbar.value.text = "Skill saved successfully!";
            getSkills();
            closeSkillDialog();
        })
        .catch((error) => {
            snackbar.value.value = true;
            snackbar.value.color = "error";
            snackbar.value.text = "Error saving skill!";
        });
}

async function updateSkill() {
    await ResumeServices.updateSkill(skill.value.id, skill.value)
        .then(() => {
            snackbar.value.value = true;
            snackbar.value.color = "green";
            snackbar.value.text = "Skill updated successfully!";
            closeSkillDialog();
            getSkills();
        })
        .catch((error) => {
            snackbar.value.value = true;
            snackbar.value.color = "error";
            snackbar.value.text = "Error updating skill!";
        });
}

async function deleteSkill(s) {
    if (!confirm("Are you sure you want to delete this skill?")) {
        return;
    }
    await ResumeServices.deleteSkill(s.id)
        .then(() => {
            snackbar.value.value = true;
            snackbar.value.color = "green";
            snackbar.value.text = "Skill deleted successfully!";
            getSkills();
            closeSkillDialog();
        })
        .catch((error) => {
            snackbar.value.value = true;
            snackbar.value.color = "error";
            snackbar.value.text = "Error deleting skill!";
        });
}



const educations = ref([]);

const education = ref({
    school: "",
    address: "",
    degree: "",
    startDate: "",
    endDate: "",
    gpa: "",
    coursework: "",
    userId: "",
});

const isEducationSave = ref(true);

const showEducationDialog = ref(false);

function closeEducationDialog() {
    education.value = {
        school: "",
        address: "",
        degree: "",
        startDate: "",
        endDate: "",
        gpa: "",
        coursework: "",
        userId: user.value.id,
    };
    showEducationDialog.value = false;
}

function openSaveEducation() {
    isEducationSave.value = true;
    showEducationDialog.value = true;
}

function editEducation(edu) {
    isEducationSave.value = false;
    education.value = edu;
    showEducationDialog.value = true;
}

function formatEducationDate(date) {
    return new Date(date).toLocaleDateString();
}

async function getEducations() {
    ResumeServices.getEducation(education.value.userId)
        .then((data) => {
            educations.value = data.data;
        })
        .catch((error) => {
        });
}

async function saveEducation() {
    await ResumeServices.saveEducation(education.value)
        .then(() => {
            snackbar.value.value = true;
            snackbar.value.color = "green";
            snackbar.value.text = "Education saved successfully!";
            getEducations();
            closeEducationDialog();
        })
        .catch((error) => {
            snackbar.value.value = true;
            snackbar.value.color = "error";
            snackbar.value.text = "Error saving education!";
        });
}

async function updateEducation() {
    await ResumeServices.updateEducation(education.value.id, education.value)
        .then(() => {
            snackbar.value.value = true;
            snackbar.value.color = "green";
            snackbar.value.text = "Education updated successfully!";
            closeEducationDialog();
            getEducations();
        })
        .catch((error) => {
            snackbar.value.value = true;
            snackbar.value.color = "error";
            snackbar.value.text = "Error updating education!";
        });
}

async function deleteEducation(edu) {
    if (!confirm("Are you sure you want to delete this education?")) {
        return;
    }
    await ResumeServices.deleteEducation(edu.id)
        .then(() => {
            snackbar.value.value = true;
            snackbar.value.color = "green";
            snackbar.value.text = "Education deleted successfully!";
            getEducations();
            closeEducationDialog();
        })
        .catch((error) => {
            snackbar.value.value = true;
            snackbar.value.color = "error";
            snackbar.value.text = "Error deleting education!";
        });
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

function goToResume(resumeTemplateId) {
  if(resumeTemplateId == 1)
          router.push({ name: "resume-1" });
  else if(resumeTemplateId==2)
         router.push({ name: "resume-2" });
   else if(resumeTemplateId==3)
         router.push({ name: "resume-3" });
   else if(resumeTemplateId==4)
         router.push({ name: "resume-4" });
   
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

                        <v-card v-else-if="selectedResumeTab === 2">
                            <v-card-title>
                                <v-card-actions>
                                    <h3>Education</h3>
                                    <v-spacer></v-spacer>
                                    <v-btn variant="flat" color="primary" @click="openSaveEducation()">Add
                                        Education</v-btn>
                                </v-card-actions>

                            </v-card-title>
                            <v-card-text>
                                <v-table>
                                    <template v-slot:default>
                                        <thead>
                                            <tr>
                                                <th class="text-left">School</th>
                                                <th class="text-left">Degree</th>
                                                <th class="text-left">Start Date</th>
                                                <th class="text-left">End Date</th>
                                                <th class="text-left">GPA</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr @click="editEducation(education)" v-for="education in educations"
                                                :key="education.id">
                                                <td>{{ education.school }}</td>
                                                <td>{{ education.degree }}</td>
                                                <td>{{ formatEducationDate(education.startDate) }}</td>
                                                <td>{{ formatEducationDate(education.endDate) }}</td>
                                                <td>{{ education.gpa }}</td>
                                            </tr>
                                        </tbody>
                                    </template>
                                </v-table>
                            </v-card-text>
                        </v-card>

                        <v-card v-else-if="selectedResumeTab === 3">
                            <v-card-title>
                                <v-card-actions>
                                    <h3>Professional Experience</h3>
                                    <v-spacer></v-spacer>
                                    <v-btn variant="flat" color="primary" @click="openAddExperience()">Add
                                        Experience</v-btn>
                                </v-card-actions>

                            </v-card-title>
                            <v-card-text>
                                <v-table>
                                    <template v-slot:default>
                                        <thead>
                                            <tr>
                                                <th class="text-left">Employer</th>
                                                <th class="text-left">Job Title</th>
                                                <th class="text-left">Start Date</th>
                                                <th class="text-left">End Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr @click="showExpeience(experience)" v-for="experience in experiences"
                                                :key="experience.id">
                                                <td>{{ experience.employer }}</td>
                                                <td>{{ experience.jobTitle }}</td>
                                                <td>{{ formatExperienceDate(experience.startDate) }}</td>
                                                <td>{{ experience.endDate?formatExperienceDate(experience.endDate):'Present'  }}</td>
                                            </tr>
                                        </tbody>
                                    </template>
                                </v-table>
                            </v-card-text>
                        </v-card>

                        <v-card v-else-if="selectedResumeTab === 4">
                            <v-card-title>
                                <v-card-actions>
                                    <h3>Skills</h3>
                                    <v-spacer></v-spacer>
                                    <v-btn variant="flat" color="primary" @click="openAddSkill()">Add
                                        Skill</v-btn>
                                </v-card-actions>

                            </v-card-title>
                            <v-card-text>
                                <v-table>
                                    <template v-slot:default>
                                        <tbody>
                                            <tr @click="editSkill(skill)" v-for="skill in skills" :key="skill.id">
                                                <td>{{ skill.skill }}</td>
                                            </tr>
                                        </tbody>
                                    </template>
                                </v-table>
                            </v-card-text>
                        </v-card>
                        <v-card v-else-if="selectedResumeTab === 5">
                          <ProjetComponent ></ProjetComponent>
                          
                        </v-card>
                        <v-card v-else-if="selectedResumeTab === 6">
                          <LeadershipsComponent ></LeadershipsComponent>
                          
                        </v-card>
                        <v-card v-else-if="selectedResumeTab === 7">
                          <AwardsComponent ></AwardsComponent>
                          
                        </v-card>
                        
                    </v-col>


                    <v-col v-else-if="selectedTab === 1">
                            <h2>Templates</h2>
                            <v-card-text>
            <v-row>
                    <v-col cols="12" md="6" lg="3">
                         <v-card @click="goToResume(1)" class="cursor-pointer">
                               <v-card-title>Resume 1 Template</v-card-title>
                                <v-card-text>
                                        View your resume with Template 1.
                                </v-card-text>
                            </v-card>
                    </v-col>

                    <v-col cols="12" md="6" lg="3">
                         <v-card @click="goToResume(2)" class="cursor-pointer">
                               <v-card-title>Resume 2 Template</v-card-title>
                                <v-card-text>
                                        View your resume with Template 2.
                                </v-card-text>
                            </v-card>
                    </v-col>
                    <v-col cols="12" md="6" lg="3">
                         <v-card @click="goToResume(3)" class="cursor-pointer">
                               <v-card-title>Resume 3 Template</v-card-title>
                                <v-card-text>
                                        View your resume with Template 3.
                                </v-card-text>
                            </v-card>
                    </v-col>
                    <v-col cols="12" md="6" lg="3">
                         <v-card @click="goToResume(4)" class="cursor-pointer">
                               <v-card-title>Resume 4 Template</v-card-title>
                                <v-card-text>
                                        View your resume with Template 4.
                                </v-card-text>
                            </v-card>
                    </v-col>
               
               
               
               
            </v-row>
          </v-card-text>
                    </v-col>
                    <v-col v-else-if="selectedTab === 2">
                        <JobComponent   />
                    </v-col>
                </v-row>
            </v-container>


            <v-dialog v-model="showEducationDialog" max-width="500px">
                <v-card>
                    <v-card-title>

                        <h2 v-if="isEducationSave">Add Education</h2>
                        <h2 v-else>Update Education</h2>
                    </v-card-title>
                    <v-card-text>
                        <v-form>
                            <v-text-field v-model="education.school" label="School"></v-text-field>
                            <v-text-field v-model="education.address" label="Address"></v-text-field>
                            <v-text-field v-model="education.degree" label="Degree"></v-text-field>
                            <v-text-field v-model="education.startDate" type="date" label="Start Date"></v-text-field>
                            <v-text-field v-model="education.endDate" type="date" label="End Date"></v-text-field>
                            <v-text-field v-model="education.gpa" type="number" label="GPA"></v-text-field>
                            <v-text-field v-model="education.coursework" label="Coursework"></v-text-field>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn v-if="!isEducationSave" variant="flat" color="error" @click="deleteEducation(education)">Delete</v-btn>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" @click="closeEducationDialog">Cancel</v-btn>
                        <v-btn v-if="isEducationSave" variant="flat" color="primary" @click="saveEducation">Save</v-btn>
                        <v-btn v-else variant="flat" color="primary" @click="updateEducation">Update</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>


            <v-dialog v-model="showExperienceDialog" max-width="500px">
                <v-card>
                    <v-card-title>

                        <h2 v-if="isExperienceSave">Add Experience</h2>
                        <h2 v-else>Experience</h2>
                    </v-card-title>
                    <v-card-text>
                        <v-form>
                            <v-text-field v-model="experience.employer" label="Employer"></v-text-field>
                            <v-text-field v-model="experience.jobTitle" label="Job Title"></v-text-field>
                            <v-text-field v-model="experience.startDate" type="date" label="Start Date"></v-text-field>
                            <v-text-field v-model="experience.endDate" type="date" label="End Date"></v-text-field>
                            <v-text-field v-model="experience.address" label="Address"></v-text-field>
                            <v-textarea v-model="experience.description" label="Description"></v-textarea>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn v-if="!isExperienceSave" variant="flat" color="error" @click="deleteExperience(experience)">Delete</v-btn>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" @click="closeExperienceDialog">Cancel</v-btn>
                        <v-btn v-if="isExperienceSave" variant="flat" color="primary"
                            @click="saveExperience">Save</v-btn>
                        <v-btn v-else variant="flat" color="primary" @click="updateExperience">Update</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

            <v-dialog v-model="showSkillDialog" max-width="500px">
                <v-card>
                    <v-card-title>

                        <h2 v-if="isSkillSave">Add Skill</h2>
                        <h2 v-else>Skill</h2>
                    </v-card-title>
                    <v-card-text>
                        <v-form>
                            <v-text-field v-model="skill.skill" label="Skill"></v-text-field>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn v-if="!isSkillSave"  variant="flat" color="error" @click="deleteSkill(skill)">Delete</v-btn>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" @click="closeSkillDialog">Cancel</v-btn>
                        <v-btn v-if="isSkillSave" variant="flat" color="primary" @click="saveSkill">Save</v-btn>
                        <v-btn v-else variant="flat" color="primary" @click="updateSkill">Update</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

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
v-table {
    cursor: pointer;
}

thead {
    background-color: #80162B;
    color: white;
}

tr:nth-child(even) {
    background-color: #dddddd;
}
</style>