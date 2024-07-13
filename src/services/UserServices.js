import apiClient from "./services";

export default {

  getUsers() {
    return apiClient.get("users");
  },
  addUser(user) {
    return apiClient.post("users", user);
  },
  loginUser(user) {
    return apiClient.post("login", user.value, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        crossDomain: true,
        Authorization:
          "Basic " + btoa(user.value.email + ":" + user.value.password),
      },
    });
  },
  logoutUser() {
    return apiClient.post("logout");
  },

  deleteUser(id) {
    return apiClient.delete("users/" + id);
  },

  updateUser(user) {
    return apiClient.put("users/" + user.id, user);
  },
  updatePassword(id, oldPassword, newPassword) {
    return apiClient.put("users/" + id + "/password",
      {
        oldPassword: oldPassword,
        password: newPassword,
      }
    );
  },
};