import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import css from "../containers/Home/Home.scss";

const Settings = ({ settings, onSettingsChange, onClose }) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleToggle = (key) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleNumberChange = (key, value) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue > 0) {
      setLocalSettings(prev => ({
        ...prev,
        [key]: numValue
      }));
    }
  };

  const handleSave = () => {
    onSettingsChange(localSettings);
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 2000);
  };

  return (
    <motion.div 
      className={css.settings}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div 
        className={css.settingsContent}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        <motion.button 
          className={css.closeButton}
          onClick={onClose}
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
        >
          ×
        </motion.button>

        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          ⚙️ Settings
        </motion.h2>

        <motion.div 
          className={css.settingsSection}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3>Appearance</h3>
          <div className={css.settingItem}>
            <span className={css.settingLabel}>Dark Mode</span>
            <label className={css.toggleSwitch}>
              <input
                type="checkbox"
                checked={localSettings.darkMode}
                onChange={() => handleToggle("darkMode")}
              />
              <span className={css.slider}></span>
            </label>
          </div>
        </motion.div>

        <motion.div 
          className={css.settingsSection}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3>Notifications</h3>
          <div className={css.settingItem}>
            <span className={css.settingLabel}>Sound</span>
            <label className={css.toggleSwitch}>
              <input
                type="checkbox"
                checked={localSettings.soundEnabled}
                onChange={() => handleToggle("soundEnabled")}
              />
              <span className={css.slider}></span>
            </label>
          </div>
          <div className={css.settingItem}>
            <span className={css.settingLabel}>Vibration</span>
            <label className={css.toggleSwitch}>
              <input
                type="checkbox"
                checked={localSettings.vibrationEnabled}
                onChange={() => handleToggle("vibrationEnabled")}
              />
              <span className={css.slider}></span>
            </label>
          </div>
        </motion.div>

        <motion.div 
          className={css.settingsSection}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3>Timer Settings</h3>
          <div className={css.settingItem}>
            <span className={css.settingLabel}>Pomodoro Length (minutes)</span>
            <input
              type="number"
              className={css.numberInput}
              value={localSettings.pomodoroLength}
              onChange={(e) => handleNumberChange("pomodoroLength", e.target.value)}
              min="1"
              max="60"
            />
          </div>
          <div className={css.settingItem}>
            <span className={css.settingLabel}>Short Break Length (minutes)</span>
            <input
              type="number"
              className={css.numberInput}
              value={localSettings.shortBreakLength}
              onChange={(e) => handleNumberChange("shortBreakLength", e.target.value)}
              min="1"
              max="30"
            />
          </div>
          <div className={css.settingItem}>
            <span className={css.settingLabel}>Long Break Length (minutes)</span>
            <input
              type="number"
              className={css.numberInput}
              value={localSettings.longBreakLength}
              onChange={(e) => handleNumberChange("longBreakLength", e.target.value)}
              min="1"
              max="60"
            />
          </div>
          <div className={css.settingItem}>
            <span className={css.settingLabel}>Long Break Interval</span>
            <input
              type="number"
              className={css.numberInput}
              value={localSettings.longBreakInterval}
              onChange={(e) => handleNumberChange("longBreakInterval", e.target.value)}
              min="1"
              max="10"
            />
          </div>
        </motion.div>

        <motion.div 
          className={css.settingsActions}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            className={css.btn}
            onClick={handleSave}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Save Changes
          </motion.button>
        </motion.div>

        <AnimatePresence>
          {showConfirmation && (
            <motion.div
              className={css.confirmation}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              Settings saved successfully!
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default Settings; 