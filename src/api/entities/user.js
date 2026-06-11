import api from "..";

export const loginUser = async (data) => {
  return await api.post("/users/login", data);
};

export const registerUser = async (data) => {
  return await api.post("/users/register/", data);
};

export const currentUser = async () => {
  return await api.get("/users/");
};

export const editUser = async (data) => {
  return await api.put("/users/", data);
};

export const changePassword = async (data) => {
  return await api.put("/users/change-password", data);
};

export const getAllUsers = async () => {
  return await api.get("/users/all");
};

export const removeUser = async (id) => {
  return await api.delete(`/users/${id}`);
};
