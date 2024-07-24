import apiClient from "./services";

export default {
   
 
  getAllskills() {
    return apiClient.get("skills");
  },

  getskillById(id) {
    return apiClient.get(`skills/${id}`);
  },
  

  getSkillsByUserId(userId) {
    return apiClient.get(`skills/user/${userId}`);
  },

  createSkill(skillData) {
    return apiClient.post("skills", skillData);
  },

  updateSkill(id, skillData) {
    console.log("updateskill", id, skillData);
    return apiClient.put(`skills/${id}`, skillData);
  },

  deleteSkill(id) {
    return apiClient.delete(`skills/${id}`);
  },
  
};
