<script setup>
import { onMounted, ref } from "vue";
import UserInfo from "../services/ResumeService.js";

const user = ref({});
const loggedInuser = ref({});
const userId = ref(null);

onMounted(async () => {
  if (localStorage.getItem("user") !== null) {
    loggedInuser.value = JSON.parse(localStorage.getItem("user"));
    userId.value = loggedInuser.value.id;
    console.log("userId is", userId.value);
    try {
      const userData = await UserInfo.getUserDetails(userId.value);
      console.log("userData is", userData.data);
      user.value = userData.data;
      console.log(user.value);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  }
});
</script>

<template>
<!-- <div >Template Id: {{ templateId }}</div>--> 
    <v-text v-if="templateId === 1"> 
      <v-card class="text-center"   tile>
        <v-card-title  >
          <h1><span  >  {{ user.firstName }} {{ user.lastName }}</span></h1>
        </v-card-title>
        <v-card-subtitle>
          {{ user.address }} | {{ user.number }} | {{ user.email }} | {{ user.link1 }}
        </v-card-subtitle>
      </v-card>
    </v-text>
    <v-text v-if="templateId === 2"> 
      <v-card    tile>
        <v-card-title class="header">
          <h1><span  >  {{ user.firstName }} {{ user.lastName }}</span></h1>
        </v-card-title>
        <v-card-subtitle>
          {{ user.address }}  | {{ user.number }} | {{ user.email }} | {{ user.link1 }}
        </v-card-subtitle>
      </v-card>
    </v-text>
    <v-text v-if="templateId === 3"> 
      <v-card class="text-center"   tile>
        <v-card-title  >
          <h1><span  >  {{ user.firstName }} {{ user.lastName }}</span></h1>
        </v-card-title>
        <v-card-subtitle class="title-with-line">
          {{ user.address }}  | {{ user.number }} | {{ user.email }} | {{ user.link1 }}
        </v-card-subtitle>
       <v-divider   />
      </v-card>
    </v-text>
 
    <v-text v-if="templateId === 4"> 
      <v-card class="text-center"   tile>
        <v-card-title  >
          <h1><span  >  {{ user.firstName }} {{ user.lastName }}</span></h1>
        </v-card-title>
        <v-card-subtitle >
          {{ user.address }}  ♦ {{ user.number }} ♦ {{ user.email }} ♦ {{ user.link1 }}
        </v-card-subtitle>
      </v-card>
    </v-text>
</template>


<script>
export default {
  props: {
    user: {
      type: Object,
      required: true
    },
    templateId: {
      type: Number,
      required: true
    }
  }
};
</script>
