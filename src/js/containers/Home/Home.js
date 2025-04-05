import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Timer from "../../components/Timer";
import TaskManager from "../../components/TaskManager";
import Settings from "../../components/Settings";
import Header from "../../components/Header";
import css from "./Home.scss";

const Home = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    darkMode: false,
    soundEnabled: true,
    vibrationEnabled: true,
    pomodoroLength: 25,
    shortBreakLength: 5,
    longBreakLength: 15,
    longBreakInterval: 4
  });

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("focusFlowSettings");
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      setSettings(parsedSettings);
      setDarkMode(parsedSettings.darkMode);
    } else {
      // Check system preference for dark mode
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setDarkMode(prefersDark);
      setSettings(prev => ({ ...prev, darkMode: prefersDark }));
    }
  }, []);

  // Apply dark mode class to body
  useEffect(() => {
    document.body.classList.toggle(css.darkMode, darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
    setSettings(prev => ({ ...prev, darkMode: !prev.darkMode }));
    localStorage.setItem("focusFlowSettings", JSON.stringify({
      ...settings,
      darkMode: !darkMode
    }));
  };

  const toggleSettings = () => {
    setShowSettings(prev => !prev);
  };

  const handleSettingsChange = (newSettings) => {
    setSettings(newSettings);
    setDarkMode(newSettings.darkMode);
    localStorage.setItem("focusFlowSettings", JSON.stringify(newSettings));
  };

  const handleTimerComplete = () => {
    // Play sound if enabled
    if (settings.soundEnabled) {
      const audio = new Audio("/sounds/complete.mp3");
      audio.play();
    }
    
    // Vibrate if enabled
    if (settings.vibrationEnabled && navigator.vibrate) {
      navigator.vibrate(1000);
    }
  };

  return (
    <motion.div 
      className={css.app}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Header 
        darkMode={darkMode} 
        toggleDarkMode={toggleDarkMode}
        toggleSettings={toggleSettings}
      />
      
      <motion.main 
        className={css.content}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className={css.cardContainer}>
          <Timer onComplete={handleTimerComplete} />
          <TaskManager />
        </div>
      </motion.main>

      <AnimatePresence>
        {showSettings && (
          <Settings 
            settings={settings}
            onSettingsChange={handleSettingsChange}
            onClose={toggleSettings}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Home;