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


    // save summary
    saveSummary(summary) {
        return apiClient.post("user-details/summary", summary);
    },

    // get summary
    getSummary(userId) {
        return apiClient.get(`user-details/summary/${userId}`);
    },

    // update summary
    updateSummary(id, summary) {
        return apiClient.put(`user-details/summary/${id}`, summary);
    },

    // delete summary
    deleteSummary(id) {
        return apiClient.delete(`user-details/summary/${id}`);
    },
    

    // save education
    saveEducation(education) {
        return apiClient.post("user-details/education", education);
    },

    // get education
    getEducation(userId) {
        return apiClient.get(`user-details/education/${userId}`);
    },

    // update education
    updateEducation(id, education) {
        return apiClient.put(`user-details/education/${id}`, education);
    },

    // delete education
    deleteEducation(id) {
        return apiClient.delete(`user-details/education/${id}`);
    },

    // save experience
    saveExperience(experience) {
        return apiClient.post("user-details/experience", experience);
    },

    // get experience
    getExperience(userId) {
        return apiClient.get(`user-details/experience/${userId}`);
    },

    // update experience

    updateExperience(id, experience) {
        return apiClient.put(`user-details/experience/${id}`, experience);
    },

    // delete experience

    deleteExperience(id) {
        return apiClient.delete(`user-details/experience/${id}`);
    },

    // save skill
    saveSkill(skill) {
        return apiClient.post("user-details/skill", skill);
    },

    // get skill
    getSkills(userId) {
        return apiClient.get(`user-details/skill/${userId}`);
    },

    // update skill
    updateSkill(id, skill) {
        return apiClient.put(`user-details/skill/${id}`, skill);
    },

    // delete skill
    deleteSkill(id) {
        return apiClient.delete(`user-details/skill/${id}`);
    },


}