<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import UserServices from "../services/UserServices";

const snackbar = ref({
    value: false,
    color: "",
    text: "",
});

const userUnderEdit = ref(null);

onMounted(async () => {
    userUnderEdit.value = JSON.parse(localStorage.getItem("user"));
    console.log(userUnderEdit.value);
});

const showEditDialog = ref(false);


function editUser(user) {
    userUnderEdit.value = user;
    showEditDialog.value = true;
}


function updateUser() {
    UserServices.updateUser(userUnderEdit.value)
        .then(() => {
            snackbar.value.color = "success";
            snackbar.value.text = "User updated successfully";
            snackbar.value.value = true;
            showEditDialog.value = false;
            localStorage.setItem("user", JSON.stringify(userUnderEdit.value));
        })
        .catch((error) => {
            snackbar.value.color = "error";
            snackbar.value.text = "Error updating user";
            snackbar.value.value = true;
            console.log(error);
        });
}


function closeSnackBar() {
    snackbar.value.value = false;
}
</script>

<template>
    <v-container>
        <div id="body">
            <v-card v-if="userUnderEdit !== null">
                <v-card-title>
                    <h2>Profile</h2>
                </v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="userUnderEdit.firstName" label="First Name" readonly></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="userUnderEdit.lastName" label="Last Name" readonly></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="userUnderEdit.email" label="Email" readonly></v-text-field>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="primary">Change password</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn variant="flat" color="primary" @click="editUser(userUnderEdit)">Edit</v-btn>
                </v-card-actions>
            </v-card>


            <v-dialog v-model="showEditDialog" max-width="500px">
                <v-card>
                    <v-card-title>
                        <h2>Edit User</h2>
                    </v-card-title>
                    <v-card-text>
                        <v-form>
                            <v-text-field v-model="userUnderEdit.firstName" label="First Name"></v-text-field>
                            <v-text-field v-model="userUnderEdit.lastName" label="Last Name"></v-text-field>
                            <v-text-field v-model="userUnderEdit.email" label="Email"></v-text-field>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="primary" @click="showEditDialog = false">Cancel</v-btn>
                        <v-btn variant="flat" color="primary" @click="updateUser">Save</v-btn>
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