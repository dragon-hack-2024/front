"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Typography,
  Paper,
  Box,
  Button,
  IconButton,
  useTheme,
  Container,
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
import SaveDialog from "@/components/saveDialog";

interface User {
  id: number;
  name: string;
  email: string;
  weight: number;
  height: number;
  birth_date: string;
}

interface Data {
  duration: number;
  score: number;
  calories_burned: number;
  rpm: number;
  challenge_id: number;
  user_id: number;
}

const bpmData = [100, 150, 200];

function WorkoutComponent() {
  const theme = useTheme();
  const maxRPM = 300;
  const [elapsedTime, setElapsedTime] = useState(0);
  const [matchTime, setMatchTime] = useState(0);
  const [calories, setCalories] = useState(0);
  //const [targetRPM, setTargetRPM] = useState(bpmData[0]);
  const targetRPM = useRef(bpmData[0]);
  const [currentRPM, setCurrentRPM] = useState(0);
  const active = useRef(false);
  const lastPingTime = useRef(1);
  const jumpCount = useRef(0);
  const timeoutRef = useRef(null);
  const [rpmHistory, setRpmHistory] = useState([]);
  const [user, setUser] = useState<User>({} as User);

  const bpmIndex = useRef(1);

  const isRpmsMatch = () =>
    currentRPM >= targetRPM.current - 25 &&
    currentRPM <= targetRPM.current + 25;

  useEffect(() => {
    let timer;
    let counter = 0;

    if (active.current) {
      timer = setInterval(() => {
        setElapsedTime((prev) => prev + 0.1);
        if (isRpmsMatch()) {
          setMatchTime((prev) => prev + 0.1);
        }

        counter += 1;
        if (counter >= 100) {
          // When counter hits 100 (which is 10 seconds), do something
          console.log("10 seconds have passed");
          // Reset the counter
          counter = 0;

          // Example: You can do more here, like updating state or triggering another function
          targetRPM.current = bpmData[bpmIndex.current];
          bpmIndex.current = (bpmIndex.current + 1) % bpmData.length;

          console.log(
            targetRPM.current,
            bpmIndex.current,
            bpmData[bpmIndex.current]
          );
        }
      }, 100);
    }
    return () => clearInterval(timer);
  }, [currentRPM, active.current]);

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
      const rpm = Math.min(300, 60 / timeDiff);

      lastPingTime.current = currentTime; // Update last ping time

      if (active.current) {
        jumpCount.current += 1;
        const weight = user.weight || 70; // Default weight is 70 kg
        setCalories((prev) => prev + (12 * weight * 3.5) / 200 / 120);
        setRpmHistory((prevHistory) => {
          const newHistory = [...prevHistory, rpm].slice(-5); // Keep only the last 5 entries
          console.log(newHistory);
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

  const [openSaveDialog, setOpenSaveDialog] = useState(false);
  const [workoutData, setWorkoutData] = useState<Data>({} as Data);

  const handleCloseDialog = () => {
    setOpenSaveDialog(false);
  };

  const finishWorkout = async () => {
    console.log(jumpCount.current);
    const data: Data = {
      calories_burned: Math.floor(calories),
      rpm: jumpCount.current / elapsedTime,
      duration: Math.floor(elapsedTime),
      score: getMatchPercentage(),
      challenge_id: 1,
      user_id: 1,
    };

    console.log(data);
    setWorkoutData(data);

    if (elapsedTime > 3) {
      setOpenSaveDialog(true);

      // Send data to server
      const response = await fetch("http://localhost:8080/v1/stats", {
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
      }
    }
  };

  return (
    <>
      <SaveDialog
        open={openSaveDialog}
        onClose={handleCloseDialog}
        data={workoutData}
      />
      <Container>
        <Scan onDataReceived={handleDataReceived} />
        <Box
          sx={{
            mt: 0.5,
            paddingY: 2,
            paddingX: 4
          }}
        >

          <Box display="flex" justifyContent="space-around">
            <Box
              width={"8rem"}
              sx={{
                backgroundColor: theme.palette.grey[100],
                borderRadius: "7px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mr: 2,
              }}
            >
              <RotateCwIcon size={24} />
              <Typography
                variant="h4"
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
              width={"8rem"}
              sx={{
                backgroundColor: theme.palette.grey[100],
                borderRadius: "7px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                ml: 2,
              }}
            >
              <FlameIcon size={24} />
              <Typography
                variant="h4"
                sx={{
                  my: 2,
                  ml: 1,
                }}
              >
                {calories.toFixed(0)}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              height: "55vh",
              display: "flex",
              justifyContent: "center",
              position: "relative",
              m: 2,
              mt: 4,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 0,
                width: "70%",
                height: "55vh",
                borderRadius: "7px",
                backgroundColor: theme.palette.grey[100],
              }}
            ></Box>
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                width: "70%",
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
                width: "70%",
                height: "10vh",
                borderRadius: "7px",
                opacity: 0.5,
                zIndex: 10,
                backgroundColor: theme.palette.grey[400],
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                transition: "bottom 0.5s ease",
              }}
            >
              <Typography variant="h3" sx={{ color: "black" }}>
                {targetRPM.current}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-around", justifyItems: "center", mt: "2rem", mb: "2rem"}}>
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
            
            <Box sx={{display: "flex", alignItems: "center"}}>
            <Typography
              variant="h3"
              sx={{ textAlign: "center" }}
            >
              {formatTime(elapsedTime.toFixed(0))}
            </Typography>
            </Box>

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
        </Box>
      </Container>
    </>
  );
}

export default WorkoutComponent;
