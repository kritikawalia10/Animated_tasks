import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Timer from "../../js/components/Timer";
import TaskManager from "../../js/components/TaskManager";
import Settings from "../../js/components/Settings";
import Header from "../../js/components/Header";
import css from "./Home.scss";

const Home = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [dailyQuote, setDailyQuote] = useState("The only way to do great work is to love what you do.");

  // Load dark mode preference from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  // Save dark mode preference to localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleTimerComplete = () => {
    // Play notification sound
    const audio = new Audio("/sounds/complete.mp3");
    audio.play();
    
    // Show notification
    if (Notification.permission === "granted") {
      new Notification("FocusFlow", {
        body: "Timer completed! Time for a break.",
        icon: "/favicon.ico"
      });
    }
  };

  const handleSettingsSave = (newSettings) => {
    // Settings are already saved to localStorage in the Settings component
    console.log("Settings saved:", newSettings);
  };

  // Request notification permission
  useEffect(() => {
    if (Notification.permission !== "granted" && Notification.permission !== "denied") {
      Notification.requestPermission();
    }
  }, []);

  return (
    <div className={`${css.homeContainer} ${darkMode ? css.darkMode : ''}`}>
      <Header toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
      
      <motion.div 
        className={css.quoteContainer}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <p className={css.quote}>{dailyQuote}</p>
      </motion.div>

      <main className={css.mainContent}>
        <Timer onComplete={handleTimerComplete} />
        <TaskManager />
      </main>

      <motion.button
        className={css.settingsButton}
        onClick={() => setIsSettingsOpen(true)}
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
      >
        ⚙️
      </motion.button>

      <Settings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSettingsSave}
      />
    </div>
  );
};

export default Home; 