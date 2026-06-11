import api from "..";

export const createCar = async (data) => {
  return await api.post("/cars/", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
export const editCar = async ({ id, data }) => {
  return await api.put(`/cars/${id}`, data);
};
export const removeCar = async ({ id }) => {
  return await api.delete(`/cars/${id}`);
};
export const getCars = async () => {
  return await api.get("/cars/");
};
