import apiClient from "./services";

export default { 
  
  getfavoritesByUserId(userId) {
    return apiClient.get(`favorites/${userId}`);
  },
  

  createfavorite(favoriteData) {
    return apiClient.post("favorites", favoriteData);
  }, 
  deletefavorite(id) {
    return apiClient.delete(`favorites/${id}`);
  },
  
};
