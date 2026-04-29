import api from "..";

export const getNotifications = async () => {
  return await api.get("/notifications/");
};

export const markAsRead = async ({ ids }) => {
  return await api.put("/notifications/read/", { ids });
};

export const markAllAsRead = async () => {
    return await api.get('/notifications/readAll')
}