import apiClient from "./services";

export default {
   
 
  getAlljobs() {
    return apiClient.get("jobs");
  },

  getJobById(id) {
    return apiClient.get(`jobs/${id}`);
  },
  
  getJobsByUserId(userId) {
    return apiClient.get(`jobs/user/${userId}`);
  },
  

  createJob(JobData) {
    return apiClient.post("jobs", JobData);
  },

  updateJob(id, JobData) {
    console.log("updateJob", id, JobData);
    return apiClient.put(`jobs/${id}`, JobData);
  },

  deleteJob(id) {
    return apiClient.delete(`jobs/${id}`);
  },
  
};
