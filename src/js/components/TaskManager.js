import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import css from "../containers/Home/Home.scss";

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [settings, setSettings] = useState({
    soundEnabled: true,
    vibrationEnabled: true
  });

  // Load tasks and settings from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("focusFlowTasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }

    const savedSettings = localStorage.getItem("focusFlowSettings");
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      setSettings({
        soundEnabled: parsedSettings.soundEnabled !== undefined ? parsedSettings.soundEnabled : true,
        vibrationEnabled: parsedSettings.vibrationEnabled !== undefined ? parsedSettings.vibrationEnabled : true
      });
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("focusFlowTasks", JSON.stringify(tasks));
    
    // Check if all tasks are completed
    const allCompleted = tasks.length > 0 && tasks.every(task => task.done);
    if (allCompleted) {
      triggerConfetti();
    }
  }, [tasks]);

  const triggerConfetti = () => {
    setShowConfetti(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const addTask = (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      const task = {
        id: Date.now(),
        text: newTask.trim(),
        done: false,
        createdAt: new Date().toISOString()
      };
      setTasks([...tasks, task]);
      setNewTask("");
    }
  };

  const toggleDone = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  };

  const deleteTask = (id, e) => {
    e.stopPropagation(); // Prevent triggering toggleDone
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const clearCompletedTasks = () => {
    setTasks(tasks.filter((task) => !task.done));
  };

  return (
    <motion.div 
      className={css.taskManager}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        📝 Task Manager
      </motion.h2>

      {showConfetti && (
        <motion.div 
          className={css.confettiMessage}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
        >
          🎉 All tasks completed! Great job!
        </motion.div>
      )}

      <motion.form 
        onSubmit={addTask}
        className={css.taskForm}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <motion.input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          className={css.taskInput}
          whileFocus={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        />
        <motion.button 
          type="submit"
          className={css.btn}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Add Task
        </motion.button>
      </motion.form>

      <motion.div 
        className={css.taskList}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <AnimatePresence>
          {tasks.map((task) => (
            <motion.div
              key={task.id}
              className={`${css.taskItem} ${task.done ? css.completed : ""}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => toggleDone(task.id)}
            >
              <motion.div 
                className={css.taskCheckbox}
                animate={{ 
                  scale: task.done ? [1, 1.2, 1] : 1 
                }}
                transition={{ 
                  duration: 0.3,
                  times: [0, 0.5, 1]
                }}
              >
                {task.done ? "✓" : ""}
              </motion.div>
              <motion.span 
                className={css.taskText}
                animate={{ 
                  textDecoration: task.done ? "line-through" : "none",
                  color: task.done ? "var(--text-secondary)" : "var(--text-primary)"
                }}
              >
                {task.text}
              </motion.span>
              <motion.button
                className={css.deleteBtn}
                onClick={(e) => deleteTask(task.id, e)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ×
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {tasks.some((task) => task.done) && (
        <motion.button
          className={css.clearBtn}
          onClick={clearCompletedTasks}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Clear Completed Tasks
        </motion.button>
      )}
    </motion.div>
  );
};

export default TaskManager;