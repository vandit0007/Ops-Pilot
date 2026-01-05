import api from "./api";

export const getAnalytics = async () => {
  const res = await api.get("/analytics/overview");
  return res.data;
};
