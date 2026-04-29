import api from "..";

export const createFuelExpence = async (data) => {
  return await api.post("/fuel/", data);
};

export const editFuelExpence = async ({ id, data }) => {
  return await api.put(`/fuel/${id}`, data);
};

export const getFuelExpence = async () => {
  return await api.get("/fuel/");
};

export const removeFuelExpence = async ({ id }) => {
  return await api.delete(`/fuel/${id}`);
};

export const getTotalFuelExpencesForCar = async ({ carId }) => {
  return await api.get(`/fuel/fuelExpence/${carId}`);
};
