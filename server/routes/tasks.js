const express = require("express");
const router = express.Router();

const Task = require("../models/Task");
const TaskDone = require("../models/TaskDone");

// ➕ Create a new task
router.post("/", async (req, res) => {
  try {
    const newTask = new Task(req.body);
    const saved = await newTask.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📥 Get all tasks for a user
router.get("/", async (req, res) => {
  try {
    const { user } = req.query;
    const tasks = await Task.find({ userEmail: user });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✏️ Update a task by ID
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

// 🗑 Delete a task (move to task_done)
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).send("Task not found");

    const done = new TaskDone({
      ...task._doc,
      completedAt: new Date(),
    });

    await done.save();
    await task.remove();

    res.send("Moved to task_done");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
