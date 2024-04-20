"use client";
import React, { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  Box,
  Button,
  IconButton,
  useTheme,
} from "@mui/material";
import { LinearProgress } from "@mui/material";
import {
  Play,
  Pause,
  Square,
  FlameIcon,
  TimerIcon,
  Disc3Icon,
} from "lucide-react";

function WorkoutComponent() {
  const theme = useTheme();
  const maxRPM = 300;
  const [elapsedTime, setElapsedTime] = useState(0);
  const [calories, setCalories] = useState(0);
  const [currentRPM, setCurrentRPM] = useState(0);
  const [targetRPM, setTargetRPM] = useState(160);
  const [active, setActive] = useState(false);

  useEffect(() => {
    let timer;
    if (active) {
      timer = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
        setCalories((prev) => prev + (0.1 * currentRPM) / 60); // Example calorie calculation
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [currentRPM, active]);

  useEffect(() => {
    let rpmInterval;
    if (active) {
      rpmInterval = setInterval(() => {
        const newRPM = Math.random() * maxRPM; // Simulate RPM change
        setCurrentRPM(newRPM);
      }, 2000);
    }
    return () => clearInterval(rpmInterval);
  }, [active]);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const rpmProgress = Math.min((currentRPM / maxRPM) * 100, 100);

  const handleStartPauseToggle = () => {
    setActive(!active);
  };

  const handleStop = () => {
    setActive(false);
    setElapsedTime(0);
    setCalories(0);
    setCurrentRPM(0);
  };

  return (
    <Paper
      sx={{
        paddingY: 2,
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography variant="h1" gutterBottom>
        Jump Rope HERO
      </Typography>

      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box
          width={"35vw"}
          sx={{
            backgroundColor: theme.palette.grey[100],
            borderRadius: "7px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mr: 2,
          }}
        >
          <Disc3Icon size={30} />
          <Typography
            variant="h3"
            ml="2"
            sx={{
              my: 2,
            }}
          >
            {currentRPM.toFixed(0).toString().padStart(3, "0")}
          </Typography>
        </Box>

        <Box
          width={"35vw"}
          sx={{
            backgroundColor: theme.palette.grey[100],
            borderRadius: "7px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            ml: 2,
          }}
        >
          <FlameIcon size={30} />
          <Typography
            variant="h3"
            sx={{
              my: 2,
            }}
          >
            {calories.toFixed(2)}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          height: "55vh",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          position: "relative",
          m: 2,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            width: "50%",
            height: "55vh",
            borderRadius: "7px",
            backgroundColor: theme.palette.grey[100],
          }}
        ></Box>
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            width: "50%",
            height: (currentRPM / maxRPM) * 55 + "vh",
            borderRadius: "7px",
            backgroundColor: theme.palette.primary.main,
            opacity: 0.8,
            zIndex: 5,
            transition: "height 0.5s ease",
          }}
        ></Box>
        <Box
          sx={{
            position: "absolute",
            bottom: (targetRPM / maxRPM) * 55 - 5 + "vh",
            width: "50%",
            height: "10vh",
            borderRadius: "7px",
            opacity: 0.5,
            zIndex: 10,
            backgroundColor: theme.palette.grey[400],
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h3">{targetRPM}</Typography>
        </Box>
      </Box>

      <Typography variant="h2" sx={{ mb: 1 }}>
        {formatTime(elapsedTime)}
      </Typography>

      <Box>
        <IconButton
          onClick={handleStartPauseToggle}
          sx={{ mx: 1, backgroundColor: theme.palette.primary.main }}
        >
          {active ? (
            <Pause size={24} color={"white"} />
          ) : (
            <Play size={24} color={"white"} />
          )}
        </IconButton>
        <IconButton
          onClick={handleStop}
          sx={{ mx: 1, backgroundColor: theme.palette.primary.main }}
        >
          <Square size={24} color={"white"} />
        </IconButton>
      </Box>
    </Paper>
  );
}

export default WorkoutComponent;
