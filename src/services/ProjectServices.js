import apiClient from "./services";

export default { 
 
  getAllprojects() {
    return apiClient.get("projects");
  },

  getProjectById(id) {
    return apiClient.get(`projects/${id}`);
  },
  

  getProjectByUserId(userId) {
    return apiClient.get(`projects/user/${userId}`);
  },

  createProject(ProjectData) {
    return apiClient.post("projects", ProjectData);
  },

  updateProject(id, ProjectData) {
    console.log("updateProject", id, ProjectData);
    return apiClient.put(`projects/${id}`, ProjectData);
  },

  deleteProject(id) {
    return apiClient.delete(`projects/${id}`);
  },
  
};
