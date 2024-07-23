import apiClient from "./services";

export default { 
 
  getAllleaderships() {
    return apiClient.get("leaderships");
  },

  getleadershipById(id) {
    return apiClient.get(`leaderships/${id}`);
  },
  

  getleadershipByUserId(userId) {
    return apiClient.get(`leaderships/user/${userId}`);
  },

  createleadership(leadershipData) {
    return apiClient.post("leaderships", leadershipData);
  },

  updateleadership(id, leadershipData) {
    console.log("updateleadership", id, leadershipData);
    return apiClient.put(`leaderships/${id}`, leadershipData);
  },

  deleteleadership(id) {
    return apiClient.delete(`leaderships/${id}`);
  },
  
};
