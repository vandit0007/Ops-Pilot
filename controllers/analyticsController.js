const Issue = require("../models/Issue");

// =====================================
// ANALYTICS OVERVIEW (ADMIN)
// =====================================
exports.getOverview = async (req, res) => {
  try {
    // -------------------------------
    // Issues by status
    // -------------------------------
    const byStatus = await Issue.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    // -------------------------------
    // Total issues
    // -------------------------------
    const totalIssues = await Issue.countDocuments();

    // -------------------------------
    // Overdue issues (SLA breaches)
    // -------------------------------
    const overdueIssues = await Issue.countDocuments({
      isOverdue: true
    });

    // -------------------------------
    // Avg resolution time (closed)
    // -------------------------------
    const resolvedIssues = await Issue.find({
      status: "closed",
      closedAt: { $exists: true }
    });

    let avgResolutionTime = 0;

    if (resolvedIssues.length > 0) {
      const totalTime = resolvedIssues.reduce(
        (sum, issue) =>
          sum + (issue.closedAt - issue.createdAt),
        0
      );

      avgResolutionTime =
        totalTime / resolvedIssues.length;
    }

    res.json({
      totalIssues,
      overdueIssues,
      avgResolutionTime, // ms
      byStatus
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};
