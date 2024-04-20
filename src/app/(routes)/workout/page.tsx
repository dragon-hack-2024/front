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
  RotateCwIcon,
} from "lucide-react";
import Scan from "@/components/Scan";

function WorkoutComponent() {
  const theme = useTheme();
  const maxRPM = 300;
  const [elapsedTime, setElapsedTime] = useState(0);
  const [matchTime, setMatchTime] = useState(0);
  const [calories, setCalories] = useState(0);
  const [targetRPM, setTargetRPM] = useState(160);
  const [currentRPM, setCurrentRPM] = useState(0);
  const [active, setActive] = useState(false);
  const [lastPingTime, setLastPingTime] = useState(1);

  const isRpmsMatch = () =>
    currentRPM >= targetRPM - 25 && currentRPM <= targetRPM + 25;

  useEffect(() => {
    let timer;
    if (active) {
      timer = setInterval(() => {
        setElapsedTime((prev) => prev + 0.1);
        setCalories((prev) => prev + (0.1 * currentRPM) / 600); // Example calorie calculation
        if (isRpmsMatch()) {
          setMatchTime((prev) => prev + 0.1);
        }
      }, 100);
    }
    return () => clearInterval(timer);
  }, [currentRPM, active, targetRPM]);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleStartPauseToggle = () => {
    setActive(!active);
  };

  const handleStop = () => {
    setActive(false);
    setElapsedTime(0);
    setMatchTime(0);
    setCalories(0);
  };

  // Calculate percentage of time the RPMs were within range
  const getMatchPercentage = () => {
    if (elapsedTime === 0) return 0;
    return (matchTime / elapsedTime) * 100;
  };

  const handleDataReceived = (data) => {
    // Check if the data is an integer
    if (typeof data === "number" && Number.isInteger(data)) {
      console.log("Received data from Bluetooth device:", data);

      // Capture the current time in milliseconds
      const currentTime: number = Date.now();

      console.log(currentTime, lastPingTime);
      console.log(currentRPM);

      if (lastPingTime) {
        // Calculate the time difference in seconds
        const timeDiff = (currentTime - lastPingTime) / 1000;

        console.log(timeDiff);

        // Calculate RPM: 60 seconds divided by the time difference per revolution
        const currentRPM = 60 / timeDiff;
        setCurrentRPM(currentRPM);
        console.log(`Current RPM: ${currentRPM.toFixed(2)}`);
      }
      console.log("mrs", currentTime);
      setLastPingTime(currentTime);
    } else {
      console.log("Received non-integer data:", data);
    }
  };

  useEffect(() => {
    console.log(`Last Ping Time updated to: ${lastPingTime}`);
  }, [lastPingTime]);

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
      <div
        style={{
          padding: "20px",
          backgroundColor: theme.palette.background.default,
        }}
      >
        <h1>Jump Rope Workout Tracker</h1>
        <p>Elapsed Time: {formatTime(elapsedTime)}</p>
        <p>Match Time: {formatTime(matchTime)}</p>
        <p>Calories Burned: {calories.toFixed(2)}</p>
        <p>Current RPM: {currentRPM.toFixed(0)}</p>
        <p>Percentage of Match Time: {getMatchPercentage().toFixed(2)}%</p>
        <p>BLE:{}</p>
      </div>
      <Scan onDataReceived={handleDataReceived} />
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
          <RotateCwIcon size={30} />
          <Typography
            variant="h3"
            ml="2"
            sx={{
              my: 2,
              ml: 1,
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
              ml: 1,
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
            backgroundColor: isRpmsMatch()
              ? theme.palette.primary.main
              : theme.palette.error.main,
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
          <Typography variant="h3" sx={{ color: "black" }}>
            {targetRPM}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex" }}>
        <IconButton
          onClick={handleStartPauseToggle}
          sx={{
            mx: 1,
            background: theme.palette.primary.main,
            "&:hover": { background: theme.palette.primary.main },
          }}
        >
          {active ? (
            <Pause size={24} color={"white"} />
          ) : (
            <Play size={24} color={"white"} />
          )}
        </IconButton>

        <Typography
          variant="h2"
          sx={{ mb: 1, width: "20vw", textAlign: "center" }}
        >
          {formatTime(elapsedTime.toFixed(0))}
        </Typography>

        <IconButton
          onClick={handleStop}
          sx={{
            mx: 1,
            backgroundColor: theme.palette.primary.main,
            "&:hover": { background: theme.palette.primary.main },
          }}
        >
          <Square size={24} color={"white"} />
        </IconButton>
      </Box>
    </Paper>
  );
}

export default WorkoutComponent;
