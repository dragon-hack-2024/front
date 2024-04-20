"use client";
import React, { useEffect, useState } from "react";
import { Box, Typography, Skeleton } from "@mui/material";

const getDayLabel = (dateStr: string): string =>  {
  const date = new Date(dateStr);
  const dayIndex = date.getDay();
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[dayIndex];
}

function ProgressGraph() {

  const [weeklyStats, setWeeklyStats] = useState([]);
  const [maxProgress, setMaxProgress] = useState(100);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWeeklyProgress = async () => {
      try {
        const response = await fetch("http://localhost:8080/v1/stats/weekly/1");

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const weeklyStats = data.map(stat => {
          return {'day': getDayLabel(stat.date), 'progress': stat.total_skips};
        });

        setMaxProgress(Math.max(...weeklyStats.map(stat => stat.progress)));
        setWeeklyStats(weeklyStats);
      } catch (error) {
        console.error("Error fetching weekly progress:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeeklyProgress();
  }, []);

  if (isLoading) {
    return <Skeleton variant="rounded" animation="wave" width={"100%"} height={"13rem"} sx={{ mt: 2 }}/>
  }


  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-end",
        p: 2,
        height: "13rem",
        gap: 1,
      }}
    >
      {weeklyStats.map((weeklyStat, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: 1,
            backgroundColor: "#e7e5e4",
            position: "relative",
            height: "100%",
            borderRadius: "7px",
          }}
        >
          <Box
            sx={{
              height: `${weeklyStat.progress / maxProgress * 100 * 0.7}%`,
              width: "100%",
              backgroundColor: weeklyStat.progress > 0 ? "#f87171" : "#a8a29e",
              borderRadius: "7px",
              transition: "height 0.3s ease",
              position: "absolute",
              bottom: 0,
            }}
          >
            <Typography sx={{ position: "absolute", top: -23,  width: "100%", textAlign: "center"}}>{ weeklyStat.progress }</Typography>
          </Box>
          <Typography
            variant="caption"
            sx={{ mt: 1, position: "absolute", top: 0 }}
          >
            {weeklyStat.day}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

export default ProgressGraph;
