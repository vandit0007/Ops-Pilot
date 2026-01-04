import { useEffect, useState, useContext } from "react";
import {
  getIssues,
  updateIssueStatus,
  createIssue,
  assignIssue,
} from "../services/issueService";
import { getUsers } from "../services/userService";
import { AuthContext } from "../context/AuthContext";

import CreateIssueModal from "../components/CreateIssueModal";
import KanbanBoard from "../components/KanbanBoard";

function Dashboard() {
  const { user } = useContext(AuthContext);

  const [issues, setIssues] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [view, setView] = useState("list"); // list | kanban

  // ------------------------------------
  // FETCH ISSUES
  // ------------------------------------
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const data = await getIssues();
        setIssues(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load issues");
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  // ------------------------------------
  // FETCH USERS (ADMIN ONLY)
  // ------------------------------------
  useEffect(() => {
    if (user?.role === "admin") {
      getUsers()
        .then(setUsers)
        .catch((err) => console.error(err));
    }
  }, [user]);

  // ------------------------------------
  // STATUS UPDATE
  // ------------------------------------
  const handleStatusChange = async (issueId, status) => {
    // optimistic UI
    setIssues((prev) =>
      prev.map((i) =>
        i._id === issueId ? { ...i, status } : i
      )
    );

    try {
      const updated = await updateIssueStatus(
        issueId,
        status
      );
      setIssues((prev) =>
        prev.map((i) =>
          i._id === issueId ? updated : i
        )
      );
    } catch (err) {
      console.error(err);
      setError("Failed to update status");
    }
  };

  // ------------------------------------
  // CREATE ISSUE
  // ------------------------------------
  const handleCreateIssue = async (data) => {
    try {
      const newIssue = await createIssue(data);
      setIssues((prev) => [newIssue, ...prev]);
    } catch (err) {
      console.error(err);
      setError("Failed to create issue");
    }
  };

  // ------------------------------------
  // ASSIGN ISSUE (ADMIN)
  // ------------------------------------
  const handleAssign = async (issueId, userId) => {
    try {
      const updated = await assignIssue(
        issueId,
        userId
      );
      setIssues((prev) =>
        prev.map((i) =>
          i._id === issueId ? updated : i
        )
      );
    } catch (err) {
      console.error(err);
      setError("Failed to assign issue");
    }
  };

  // ------------------------------------
  // RENDER STATES
  // ------------------------------------
  if (loading) {
    return (
      <p className="text-neutral-400">
        Loading issues...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-red-400">
        {error}
      </p>
    );
  }

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Issues
        </h1>

        <div className="flex gap-3">
          <button
            onClick={() => setView("list")}
            className={`px-3 py-1 rounded text-sm ${
              view === "list"
                ? "bg-blue-600 text-white"
                : "bg-neutral-800"
            }`}
          >
            List
          </button>

          <button
            onClick={() => setView("kanban")}
            className={`px-3 py-1 rounded text-sm ${
              view === "kanban"
                ? "bg-blue-600 text-white"
                : "bg-neutral-800"
            }`}
          >
            Kanban
          </button>

          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white text-sm"
          >
            + Create Issue
          </button>
        </div>
      </div>

      {/* CREATE MODAL */}
      {showModal && (
        <CreateIssueModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreateIssue}
        />
      )}

      {/* KANBAN / LIST */}
      {view === "kanban" ? (
        <KanbanBoard
          issues={issues}
          onStatusChange={handleStatusChange}
        />
      ) : (
        <div className="space-y-4">
          {issues.map((issue) => (
            <div
              key={issue._id}
              className="p-4 border border-neutral-800 bg-neutral-900 rounded"
            >
              <div className="flex justify-between gap-4">
                <div>
                  <h2 className="font-semibold">
                    {issue.title}
                  </h2>
                  <p className="text-sm text-neutral-400">
                    {issue.description}
                  </p>
                </div>

                <select
                  value={issue.status}
                  onChange={(e) =>
                    handleStatusChange(
                      issue._id,
                      e.target.value
                    )
                  }
                  className="bg-neutral-800 border border-neutral-700 rounded px-2 py-1"
                >
                  <option value="open">open</option>
                  <option value="in-progress">
                    in-progress
                  </option>
                  <option value="closed">
                    closed
                  </option>
                </select>
              </div>

              {/* ASSIGNEE */}
              <div className="mt-3 text-xs text-neutral-400">
                Assigned to:{" "}
                {user?.role === "admin" ? (
                  <select
                    value={
                      issue.assignee?._id || ""
                    }
                    onChange={(e) =>
                      handleAssign(
                        issue._id,
                        e.target.value
                      )
                    }
                    className="ml-2 bg-neutral-800 border border-neutral-700 rounded px-2 py-1"
                  >
                    <option value="">
                      Unassigned
                    </option>
                    {users.map((u) => (
                      <option
                        key={u._id}
                        value={u._id}
                      >
                        {u.email}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="text-neutral-300">
                    {issue.assignee?.email ||
                      "Unassigned"}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
