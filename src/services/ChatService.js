import apiClient from "./services";

export default {
    

  getchatsByJobId(jobid) {
    return apiClient.get(`chats/${jobid}`);
  },

  updateChat(jobid, promptMessage) {
    console.log("update Chat", jobid, promptMessage);
    return apiClient.put(`chats/${jobid}`, promptMessage);
  },
  publishChat(jobid, chatInfo) {
    console.log("Publish the  Chat", jobid, chatInfo);
    return apiClient.put(`chats/publish/${jobid}`, chatInfo);
  },


  deletechat(id) {
    return apiClient.delete(`chats/${id}`);
  },
  
};
