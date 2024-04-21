"use client";
import React, { useState, useEffect, useRef } from "react";
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

interface User {
  id: number;
  name: string;
  email: string;
  weight: number;
  height: number;
  birth_date: string;
}

function WorkoutComponent() {
  const theme = useTheme();
  const maxRPM = 300;
  const [elapsedTime, setElapsedTime] = useState(0);
  const [matchTime, setMatchTime] = useState(0);
  const [calories, setCalories] = useState(0);
  const [targetRPM, setTargetRPM] = useState(150);
  const [currentRPM, setCurrentRPM] = useState(0);
  const active = useRef(false);
  const lastPingTime = useRef(1);
  const jumpCount = useRef(0);
  const timeoutRef = useRef(null);
  const [rpmHistory, setRpmHistory] = useState([]);
  const [user, setUser] = useState<User>({} as User);

  const isRpmsMatch = () =>
    currentRPM >= targetRPM - 25 && currentRPM <= targetRPM + 25;

  useEffect(() => {
    let timer;
    if (active.current) {
      timer = setInterval(() => {
        setElapsedTime((prev) => prev + 0.1);
        setCalories((prev) => prev + (0.1 * currentRPM) / 600); // Example calorie calculation
        if (isRpmsMatch()) {
          setMatchTime((prev) => prev + 0.1);
        }
      }, 100);
    }
    return () => clearInterval(timer);
  }, [currentRPM, active.current, targetRPM]);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleStartPauseToggle = () => {
    active.current = !active.current;
    setRpmHistory((prevHistory) => {
      const newHistory = [].slice(-5);
      setCurrentRPM(0);
      return newHistory;
    });
  };

  const handleStop = () => {
    active.current = false;
    finishWorkout();
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
    if (typeof data === "number" && Number.isInteger(data)) {
      const currentTime = Date.now();
      const timeDiff = (currentTime - lastPingTime.current) / 1000;
      const rpm = 60 / timeDiff;

      lastPingTime.current = currentTime; // Update last ping time

      if (active.current) {
        setRpmHistory((prevHistory) => {
          const newHistory = [...prevHistory, rpm].slice(-5); // Keep only the last 5 entries
          setCurrentRPM(
            newHistory.reduce((a, b) => a + b, 0) / newHistory.length
          ); // Calculate average RPM
          return newHistory;
        });

        // Reset the timeout each time data is received
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          setCurrentRPM(0); // Reset RPM to zero after 2 seconds of inactivity
          setRpmHistory([]); // Optionally clear history
        }, 2000); // 2 seconds timeout
      }
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:8080/v1/users/1");

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = (await response.json()) as User;
        console.log(data);
        setUser(data);
      } catch (error) {
        console.error("Error fetching challenges:", error);
      }
    };

    fetchUser();

    return () => clearTimeout(timeoutRef.current);
  }, []);

  const finishWorkout = async () => {
    const data = {
      calories_burned: calories.toFixed(0),
      rpm: jumpCount.current / (elapsedTime / 60),
      duration: elapsedTime,
      score: getMatchPercentage(),
      challenge_id: 1,
      user_id: 1,
    };

    console.log(data);

    // Send data to server
    /*const response = await fetch("http://localhost:8080/v1/stats", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      console.log("Data sent successfully");
    } else {
      console.error("Failed to send data to server");
    }*/
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
      <Scan onDataReceived={handleDataReceived} />

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
          {active.current ? (
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
