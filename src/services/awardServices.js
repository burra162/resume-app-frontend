import apiClient from "./services";

export default { 
 
  getAllawards() {
    return apiClient.get("awards");
  },

  getAwardsById(id) {
    return apiClient.get(`awards/${id}`);
  },
  

  getAwardsByUserId(userId) {
    return apiClient.get(`awards/user/${userId}`);
  },

  createAwards(AwardsData) {
    return apiClient.post("awards", AwardsData);
  },

  updateAwards(id, AwardsData) {
    console.log("updateAwards", id, AwardsData);
    return apiClient.put(`awards/${id}`, AwardsData);
  },

  deleteAwards(id) {
    return apiClient.delete(`awards/${id}`);
  },
  
};
