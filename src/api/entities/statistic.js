import api from "..";

export const getStatistic = async () => {
  return await api.get("/statistics/");
};
