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
});

const showEditDialog = ref(false);
const showChangePasswordDialog = ref(false);

const oldPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");

function editUser(user) {
    userUnderEdit.value = user;
    showEditDialog.value = true;
}

function showChangePassword() {
    showChangePasswordDialog.value = true;
}


function changePassword() {
    if (newPassword.value !== confirmPassword.value) {
        snackbar.value.color = "error";
        snackbar.value.text = "Passwords do not match";
        snackbar.value.value = true;
        return;
    }
    if(oldPassword.value === newPassword.value) {
        snackbar.value.color = "error";
        snackbar.value.text = "New password cannot be the same as the old password";
        snackbar.value.value = true;
        return;
    }

    if(oldPassword.value.length == 0 || newPassword.value.length == 0 || confirmPassword.value.length == 0) {
        snackbar.value.color = "error";
        snackbar.value.text = "All fields are required";
        snackbar.value.value = true;
        return;
    }

    UserServices.updatePassword(userUnderEdit.value.id, oldPassword.value, newPassword.value)
        .then(() => {
            snackbar.value.color = "success";
            snackbar.value.text = "Password changed successfully";
            snackbar.value.value = true;
            showChangePasswordDialog.value = false;
        })
        .catch((error) => {
            snackbar.value.color = "error";
            snackbar.value.text = error.response.data.message ;
            snackbar.value.value = true;
            console.log(error);
        });
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
                    <v-btn color="primary" @click="showChangePassword">Change password</v-btn>
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

            <v-dialog v-model="showChangePasswordDialog" max-width="500px">
                <v-card>
                    <v-card-title>
                        <h2>Change Password</h2>
                    </v-card-title>

                    <v-card-text>
                        <v-form>
                            <v-text-field v-model="oldPassword" label="Old Password" type="password"></v-text-field>
                            <v-text-field v-model="newPassword" label="New Password" type="password"></v-text-field>
                            <v-text-field v-model="confirmPassword" label="Confirm Password" type="password"></v-text-field>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="primary" @click="showChangePasswordDialog = false">Cancel</v-btn>
                        <v-btn variant="flat" color="primary" @click="changePassword">Save</v-btn>
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