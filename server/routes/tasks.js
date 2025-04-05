const express = require("express");
const router = express.Router();

const Task = require("../models/Task");
const TaskDone = require("../models/TaskDone");

// ➕ Create a Task
router.post("/", async (req, res) => {
  try {
    const newTask = new Task(req.body);
    const saved = await newTask.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📥 Get Tasks for a User
router.get("/", async (req, res) => {
  try {
    const userEmail = req.query.user;
    const tasks = await Task.find({ userEmail });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✏️ Update Task (Mark Complete)
router.put("/:id", async (req, res) => {
  try {
    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🗑 Delete Task (Move to task_done)
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).send("Task not found");

    const taskDone = new TaskDone({
      ...task._doc,
      completedAt: new Date(),
    });

    await taskDone.save();
    await task.remove();
    res.send("Task moved to 'task_done'");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
