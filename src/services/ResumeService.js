import apiClient from "./services";

export default {

    // save user details
    saveUserDetails(userDetails) {
        return apiClient.post("user-details", userDetails);
    },

    // get user details
    getUserDetails(userId) {
        return apiClient.get(`user-details/${userId}`);
    },

    // update user details
    updateUserDetails(id, userDetails) {
        return apiClient.put(`user-details/${id}`, userDetails);
    },

    // delete user details
    deleteUserDetails(id) {
        return apiClient.delete(`user-details/${id}`);
    },
    

}