const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    // =========================
    // BASIC ISSUE INFO
    // =========================
    title: {
      type: String,
      required: true
    },

    description: {
      type: String
    },

    type: {
      type: String,
      enum: ["bug", "task", "feature"],
      default: "task"
    },

    // =========================
    // ISSUE LIFECYCLE
    // =========================
    status: {
      type: String,
      enum: ["todo", "in-progress", "done"],
      default: "todo"
    },

    statusHistory: [
      {
        status: {
          type: String
        },
        changedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        changedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],

    // =========================
    // OWNERSHIP
    // =========================
    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    // =========================
    // SLA / OPS
    // =========================
    deadline: {
      type: Date
    },

    isOverdue: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Issue", issueSchema);
