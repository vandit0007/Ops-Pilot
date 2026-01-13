const Issue = require("../models/Issue");
const User = require("../models/User");
const AuditLog = require("../models/AuditLog");

// =====================================
// CREATE ISSUE
// Smart auto-assign + audit log
// =====================================
exports.createIssue = async (req, res) => {
  try {
    const { title, description, type, deadline } = req.body;

    if (!title) {
      return res.status(400).json({ msg: "Title is required" });
    }

    // 1️⃣ Fetch all users
    const users = await User.find();
    if (users.length === 0) {
      return res.status(400).json({ msg: "No users available" });
    }

    // 2️⃣ Find least-loaded user
    let selectedUser = null;
    let minLoad = Infinity;

    for (let user of users) {
      const activeIssuesCount = await Issue.countDocuments({
        assignee: user._id,
        status: { $ne: "closed" } // 🔁 normalized
      });

      if (activeIssuesCount < minLoad) {
        minLoad = activeIssuesCount;
        selectedUser = user;
      }
    }

    // 3️⃣ Create issue
    const issue = await Issue.create({
      title,
      description,
      type,
      deadline,
      assignee: selectedUser._id,
      createdBy: req.user.id,
      status: "open",
      statusHistory: [
        {
          status: "open",
          changedBy: req.user.id
        }
      ]
    });

    // 4️⃣ Audit log
    await AuditLog.create({
      action: "ISSUE_CREATED",
      issueId: issue._id,
      performedBy: req.user.id
    });

    const populated = await issue.populate(
      "assignee",
      "name email"
    );

    res.status(201).json(populated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

// =====================================
// GET ALL ISSUES
// Includes SLA overdue detection
// =====================================
exports.getIssues = async (req, res) => {
  try {
    const issues = await Issue.find()
      .populate("assignee", "name email")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    const now = new Date();

    // SLA overdue check
    for (let issue of issues) {
      if (
        issue.deadline &&
        issue.deadline < now &&
        issue.status !== "closed" &&
        !issue.isOverdue
      ) {
        issue.isOverdue = true;
        await issue.save();
      }
    }

    res.json(issues);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

// =====================================
// UPDATE ISSUE STATUS
// Tracks history + audit log
// =====================================
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ msg: "Issue not found" });
    }

    // Update status
    issue.status = status;

    // Push status history
    issue.statusHistory.push({
      status,
      changedBy: req.user.id
    });

    // Clear overdue if closed
    if (status === "closed") {
      issue.isOverdue = false;
    }

    await issue.save();

    // Audit log
    await AuditLog.create({
      action: `STATUS_CHANGED_TO_${status.toUpperCase()}`,
      issueId: issue._id,
      performedBy: req.user.id
    });

    const populated = await issue.populate(
      "assignee",
      "name email"
    );

    res.json(populated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

// =====================================
// ASSIGN ISSUE (ADMIN)
// =====================================
exports.assignIssue = async (req, res) => {
  try {
    const { userId } = req.body;

    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ msg: "Issue not found" });
    }

    issue.assignee = userId || null;
    await issue.save();

    await AuditLog.create({
      action: "ISSUE_ASSIGNED",
      issueId: issue._id,
      performedBy: req.user.id
    });

    const populated = await issue.populate(
      "assignee",
      "name email"
    );

    res.json(populated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};
