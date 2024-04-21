"use client";
import React, { useEffect, useState } from "react";
import { RotateCwIcon } from "lucide-react";
import { Box, Typography, LinearProgress, duration, Skeleton } from "@mui/material";

const averageBpm = (steps) => {
  return steps.reduce((acc, step) => acc + step.bpm, 0) / steps.length;
}

const backgroundDifficulty = (bpm: number) => {
  if (bpm < 90) {
    return "#bbf7d0";
  } else if (bpm < 120) {
    return "#fde68a";
  } else {
    return "#fecaca";
  }
}

const borderDifficulty = (bpm: number) => {
    if (bpm < 90) {
        return "2px #86efac solid";
    } else if (bpm < 120) {
        return "2px #fcd34d solid";
    } else {
        return "2px #fca5a5 solid";
    }
}

function Challenges() {

  const [challenges, setChallenges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await fetch("http://localhost:8080/v1/challenges?limit=10&offset=0");

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setChallenges(data);
      } catch (error) {
        console.error("Error fetching challenges:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  if (isLoading) {
    return <Box>
      <Skeleton variant="rounded" animation="wave" width={"100%"} height={80} sx={{ mt: 2}}/>
      <Skeleton variant="rounded" animation="wave" width={"100%"} height={80} sx={{ mt: 2}}/>
    </Box>
  }

  return (
    <Box>
        {challenges.map((challenge, index) => (
            <Box key={index} sx={{ mt: 2, 
            borderRadius: "7px", 
            paddingX: "1rem", 
            paddingY: "0.75rem", 
            '--tw-shadow': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)', 
            '--tw-shadow-colored': '0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color)', 
            boxShadow: 'var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)',}}>
                <Typography variant="h6">{challenge.name}</Typography>
                <Typography variant="caption">Duration: {Math.floor(challenge.duration / 60) > 0 ? Math.floor(challenge.duration / 60) + "min" : ""} {challenge.duration % 60}s</Typography>

                <Box sx={{display: "flex", justifyContent: "end"}}>

                    <Box sx={{ display: "flex", justifyItems: "center" }}>
                      <RotateCwIcon size={16} style={{marginRight: "0.3rem"}}/>
                      <Typography variant="text" sx={{ display: "block" }}
                        >{ averageBpm(challenge.steps).toFixed() } RPM
                      </Typography>
                    </Box>
                </Box>
            </Box>
        ))}
    </Box>
  );
}

export default Challenges;
