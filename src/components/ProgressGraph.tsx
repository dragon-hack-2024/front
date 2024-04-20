import React from "react";
import { Box, Typography, LinearProgress } from "@mui/material";

// Mock data - you should replace this with real data possibly fetched from a server or a state management store
const workouts = [
  { day: "Mon", progress: 75 },
  { day: "Tue", progress: 50 },
  { day: "Wed", progress: 20 },
  { day: "Thu", progress: 80 },
  { day: "Fri", progress: 60 },
  { day: "Sat", progress: 30 },
  { day: "Sun", progress: 100 },
];

function ProgressGraph() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-end",
        p: 2,
        height: 300,
        gap: 1,
      }}
    >
      {workouts.map((workout, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: 1,
            backgroundColor: "grey.200",
            position: "relative",
            height: "100%",
            borderRadius: "7px",
          }}
        >
          <Box
            sx={{
              height: `${workout.progress}%`,
              width: "100%",
              backgroundColor: workout.progress > 0 ? "red" : "grey.300",
              borderRadius: "7px",
              transition: "height 0.3s ease",
              position: "absolute",
              bottom: 0,
            }}
          />
          <Typography
            variant="caption"
            sx={{ mt: 1, position: "absolute", top: 5 }}
          >
            {workout.day}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

export default ProgressGraph;
