const mongoose = require("mongoose");

const TaskDoneSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: true },
  userEmail: { type: String, required: true },
  completedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("TaskDone", TaskDoneSchema);
