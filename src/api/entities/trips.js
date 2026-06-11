import api from "..";

export const createTrip = async (data) => {
  return await api.post("/trips/", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getTrips = async () => {
  return await api.get("/trips/");
};

export const editTrip = async ({ id, data }) => {
  return await api.put(`/trips/${id}`, data);
};

export const removeTrip = async ({ id }) => {
  return await api.delete(`/trips/${id}`);
};

export const getUsersTrips = async (id) => {
  return await api.get(`/trips/users/${id}`);
};
