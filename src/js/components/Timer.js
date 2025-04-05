// src/js/components/Timer.js
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import css from "../containers/Home/Home.scss";

const Timer = ({ onComplete }) => {
  const [seconds, setSeconds] = useState(0); // Start from 0
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState("pomodoro"); // pomodoro, shortBreak, longBreak
  const [cycles, setCycles] = useState(0);
  const [settings, setSettings] = useState({
    pomodoroLength: 25,
    shortBreakLength: 5,
    longBreakLength: 15,
    longBreakInterval: 4,
    soundEnabled: true,
    vibrationEnabled: true
  });

  const intervalRef = useRef(null);
  const audioRef = useRef(new Audio("/sounds/tick.mp3"));
  const completeAudioRef = useRef(new Audio("/sounds/complete.mp3"));

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('focusFlowSettings');
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      setSettings({
        pomodoroLength: parsedSettings.pomodoroLength || 25,
        shortBreakLength: parsedSettings.shortBreakLength || 5,
        longBreakLength: parsedSettings.longBreakLength || 15,
        longBreakInterval: parsedSettings.longBreakInterval || 4,
        soundEnabled: parsedSettings.soundEnabled !== undefined ? parsedSettings.soundEnabled : true,
        vibrationEnabled: parsedSettings.vibrationEnabled !== undefined ? parsedSettings.vibrationEnabled : true
      });
    }
  }, []);

  const timeLimits = {
    pomodoro: settings.pomodoroLength * 60,
    shortBreak: settings.shortBreakLength * 60,
    longBreak: settings.longBreakLength * 60
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          const newSeconds = prev + 1;

          if (newSeconds >= timeLimits[mode]) {
            if (settings.soundEnabled) {
              completeAudioRef.current.play();
            }

            if (settings.vibrationEnabled && navigator.vibrate) {
              navigator.vibrate(1000);
            }

            clearInterval(intervalRef.current);
            setIsRunning(false);

            if (onComplete) {
              onComplete();
            }

            if (mode === "pomodoro") {
              setCycles(prev => prev + 1);
              if ((cycles + 1) % settings.longBreakInterval === 0) {
                setMode("longBreak");
                return 0;
              } else {
                setMode("shortBreak");
                return 0;
              }
            } else {
              setMode("pomodoro");
              return 0;
            }
          }

          return newSeconds;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, mode, cycles, settings, timeLimits, onComplete]);

  const handleToggle = () => {
    if (isRunning) {
      if (settings.soundEnabled) {
        audioRef.current.pause();
      }
    } else {
      if (settings.soundEnabled) {
        audioRef.current.loop = true;
        audioRef.current.play();
      }
    }
    setIsRunning((prev) => !prev);
  };

  const handleReset = () => {
    if (settings.soundEnabled) {
      audioRef.current.pause();
    }
    setIsRunning(false);
    setSeconds(0);
    setMode("pomodoro");
  };

  const handleModeChange = (newMode) => {
    if (settings.soundEnabled) {
      audioRef.current.pause();
    }
    setIsRunning(false);
    setMode(newMode);
    setSeconds(0);
  };

  const formatTime = () => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getProgressPercentage = () => {
    return (seconds / timeLimits[mode]) * 100;
  };

  const getSmiley = () => {
    if (mode !== 'pomodoro') return '';
    const progress = seconds / timeLimits.pomodoro;

    if (progress < 0.25) return '☹️';
    if (progress < 0.5) return '😐';
    if (progress < 0.75) return '🙂';
    return '😄';
  };

  return (
    <motion.div 
      className={css.timer}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        ⏱️ Focus Timer
      </motion.h2>
      
      <motion.div 
        className={css.timerModes}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <motion.button 
          className={`${css.modeBtn} ${mode === "pomodoro" ? css.active : ""}`}
          onClick={() => handleModeChange("pomodoro")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Pomodoro
        </motion.button>
        <motion.button 
          className={`${css.modeBtn} ${mode === "shortBreak" ? css.active : ""}`}
          onClick={() => handleModeChange("shortBreak")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Short Break
        </motion.button>
        <motion.button 
          className={`${css.modeBtn} ${mode === "longBreak" ? css.active : ""}`}
          onClick={() => handleModeChange("longBreak")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Long Break
        </motion.button>
      </motion.div>
      
      <motion.div 
        className={css.timerCircle}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 100, 
          damping: 15,
          delay: 0.5 
        }}
      >
        <svg viewBox="0 0 100 100" className={css.timerSvg}>
          <circle 
            cx="50" 
            cy="50" 
            r="45" 
            className={css.timerBackground}
          />
          <motion.circle 
            cx="50" 
            cy="50" 
            r="45" 
            className={css.timerProgress}
            style={{ 
              strokeDasharray: `${getProgressPercentage() * 2.83} 283`,
              stroke: mode === "pomodoro" ? "#ff6b6b" : mode === "shortBreak" ? "#4ecdc4" : "#45b7d1"
            }}
            initial={{ strokeDasharray: "0 283" }}
            animate={{ strokeDasharray: `${getProgressPercentage() * 2.83} 283` }}
            transition={{ duration: 0.5 }}
          />
        </svg>
        <motion.div 
          className={css.timerDisplay}
          animate={{ scale: isRunning ? [1, 1.02, 1] : 1 }}
          transition={{ 
            duration: 1, 
            repeat: isRunning ? Infinity : 0,
            ease: "easeInOut"
          }}
        >
          <motion.span 
            className={css.timerText}
            key={formatTime()}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {formatTime()}
          </motion.span>

          <motion.span 
            className={css.timerMode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {mode === "pomodoro" ? "Focus Time" : mode === "shortBreak" ? "Short Break" : "Long Break"}
          </motion.span>

          {mode === "pomodoro" && (
            <motion.div 
              className={css.timerSmiley}
              key={getSmiley()}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {getSmiley()}
            </motion.div>
          )}
        </motion.div>
      </motion.div>
      
      <motion.div 
        className={css.timerControls}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <motion.button 
          className={css.btn} 
          onClick={handleToggle}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isRunning ? "Pause" : "Start"}
        </motion.button>
        <motion.button 
          className={css.btn} 
          onClick={handleReset} 
          style={{ marginLeft: "1rem" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Reset
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default Timer;
