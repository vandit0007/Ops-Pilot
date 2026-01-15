const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true
  },
  issueId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Issue"
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("AuditLog", auditLogSchema);
