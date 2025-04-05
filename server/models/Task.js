const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  userEmail: { type: String, required: true },
});

module.exports = mongoose.model("Task", TaskSchema);
