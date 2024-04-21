"use client";
import React, { useEffect, useState } from "react";
import { FlameIcon, RotateCwIcon, CalendarIcon, TargetIcon } from "lucide-react";
import { Box, Typography, LinearProgress, duration, Skeleton, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";

const toDate = (dateStr: string) => {
    const date = new Date(dateStr);
    // Format date as '24.3.2024 8:35'
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
}

function History() {

  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch("http://localhost:8080/v1/stats?limit=4&offset=0&user_id=1");

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setHistory(data);
      } catch (error) {
        console.error("Error fetching challenges:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (isLoading) {
    return <Box>
      <Skeleton variant="rounded" animation="wave" width={"100%"} height={40} sx={{ mt: 2}}/>
      <Skeleton variant="rounded" animation="wave" width={"100%"} height={40} sx={{ mt: 2}}/>
    </Box>
  }

  return (
    <Box>
        {history.map((item, index) => (
            <Box key={index} sx={{ 
            display: "flex",
            justifyContent: "space-around",
            flexDirection: "column",
            mt: 2, 
            borderRadius: "7px",
            paddingX: "1rem", 
            paddingY: "0.75rem", 
            '--tw-shadow': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)', 
            '--tw-shadow-colored': '0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color)', 
            boxShadow: 'var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)',
            }}>
              <Box sx={{display: "flex", justifyContent: "space-around"}}>
                <Box sx={{ display: "flex", justifyItems: "center" }}>
                  <CalendarIcon size={16} style={{marginRight: "0.2rem"}}/>
                  <Typography variant="text">{ toDate(item.created_at) }</Typography>
                </Box>
                
                <Box sx={{ display: "flex", justifyItems: "center" }}>
                  <TargetIcon size={16} style={{marginRight: "0.2rem"}}/>
                  <Typography variant="text">{ item.score.toFixed() }%</Typography>
                </Box>
              </Box>

              <Box sx={{display: "flex", justifyContent: "space-around", mt: 2}}>
              <Box sx={{ display: "flex", justifyItems: "center" }}>
                  <FlameIcon size={16} style={{marginRight: "0.2rem"}} />
                  <Typography variant="text">{ item.calories_burned.toFixed() } kcal</Typography>
                </Box>

                <Box sx={{ display: "flex", justifyItems: "center" }}>
                  <RotateCwIcon size={16} style={{marginRight: "0.2rem"}}/>
                  <Typography variant="text">{ item.rpm.toFixed() } RPM</Typography>
                </Box>
              </Box>
                
            </Box>
        ))}
    </Box>
  );
}

export default History;
