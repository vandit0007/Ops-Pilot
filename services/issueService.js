import api from "./api";



export const assignIssue = async (issueId, userId) => {
  const res = await api.patch(
    `/issues/${issueId}/assign`,
    { userId }
  );
  return res.data;
};

export const getIssues = async () => {
  const res = await api.get("/issues");
  return res.data;
};

export const createIssue = async (data) => {
  const res = await api.post("/issues", data);
  return res.data;
};

export const updateIssueStatus = async (id, status) => {
  const res = await api.patch(`/issues/${id}/status`, { status });
  return res.data;
};
