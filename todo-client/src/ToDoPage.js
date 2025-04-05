import React, { useEffect, useState } from "react";
import axios from "axios";

function ToDoPage({ userEmail }) {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`/api/tasks?user=${userEmail}`);
      setTasks(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const addTask = async () => {
    if (!input.trim()) return;
    try {
      await axios.post("/api/tasks", {
        title: input,
        completed: false,
        userEmail,
      });
      setInput("");
      fetchTasks();
    } catch (err) {
      console.error("Add error:", err);
    }
  };

  const updateTask = async (id, completed) => {
    try {
      await axios.put(`/api/tasks/${id}`, { completed });
      fetchTasks();
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`/api/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div>
      <h2>Welcome, {userEmail}</h2>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="New task"
      />
      <button onClick={addTask}>Add Task</button>

      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => updateTask(task._id, !task.completed)}
            />
            {task.title}
            <button onClick={() => deleteTask(task._id)}>Done</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ToDoPage;
