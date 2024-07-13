<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import UserServices from "../services/UserServices";

const snackbar = ref({
    value: false,
    color: "",
    text: "",
});

const users = ref([]);

onMounted(async () => {
    await getUsers();
});


async function getUsers() {
    await UserServices.getUsers()
        .then((data) => {
            users.value = data.data;
        })
        .catch((error) => {
            console.log(error);
        });
}

const userUnderEdit = ref(null);
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
            getUsers();
        })
        .catch((error) => {
            snackbar.value.color = "error";
            snackbar.value.text = "Error updating user";
            snackbar.value.value = true;
            console.log(error);
        });
}


function deleteUser(user) {
    UserServices.deleteUser(user.id)
        .then(() => {
            snackbar.value.color = "success";
            snackbar.value.text = "User deleted successfully";
            snackbar.value.value = true;
            getUsers();
        })
        .catch((error) => {
            snackbar.value.color = "error";
            snackbar.value.text = "Error deleting user";
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
            <v-card class="elevation-2">
                <v-card-title>
                    <h2>Manage Users</h2>
                </v-card-title>
                <v-card-text>
                    <v-table>
                        <template v-slot:default>
                            <thead>
                                <tr>
                                    <th class="text-left">Name</th>
                                    <th class="text-left">Email</th>
                                    <th class="text-left">Role</th>
                                    <th class="text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="user in users" :key="user.id">
                                    <td>{{ user.firstName + " " + user.lastName }}</td>
                                    <td>{{ user.email }}</td>
                                    <td>{{ user.type }}</td>
                                    <td>
                                        <v-btn class="mx-2" color="primary" @click="editUser(user)">
                                            Edit
                                        </v-btn>
                                        <v-btn color="error" @click="deleteUser(user)">
                                            Delete
                                        </v-btn>
                                    </td>
                                </tr>
                            </tbody>
                        </template>
                    </v-table>
                </v-card-text>
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