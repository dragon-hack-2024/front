"use client";
import {
  Typography,
  Container,
  Checkbox,
  Box,
  Button,
  IconButton,
  Skeleton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper
} from "@mui/material";
import Scan from "@/components/Scan";
import { BellIcon, HomeIcon, CircleUserRoundIcon, RulerIcon, WeightIcon, PlayIcon } from "lucide-react";
import ProgressGraph from "@/components/ProgressGraph";
import Calendar from "@/components/Calendar";
import History from "@/components/History";
import Challenges from "@/components/Challenges";
import React, { useEffect, useState } from "react";
import { Play } from "next/font/google";

export default function ChallengePage({ params }: {params: {id: number}}) {

    

    const [challenge, setChallenge] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [stats, setStats] = useState([]);
    const [isLoadingTable, setIsLoadingTable] = useState(true);
  
    useEffect(() => {
      const fetchChallenge = async () => {
        try {
          const response = await fetch(`http://localhost:8080/v1/challenges/${params.id}`);
  
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
  
          const data = await response.json();
          setChallenge(data);
        } catch (error) {
          console.error("Error fetching challenges:", error);
        } finally {
          setIsLoading(false);
        }
      };

      const fetchStats = async () => {
        try {
          const response = await fetch(`http://localhost:8080/v1/stats/challenge?challenge_id=${params.id}&limit=10&offset=0`);
  
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
  
          const data = await response.json();
          console.log(data);
          setStats(data);
        } catch (error) {
          console.error("Error fetching challenges:", error);
        } finally {
          setIsLoadingTable(false);
        }
      };
  
      fetchChallenge();
      fetchStats();
    }, []);

  function createData(
    name: string,
    calories: number,
    fat: number,
    carbs: number,
    protein: number,
  ) {
    return { name, calories, fat, carbs, protein };
  }

  return (
    <Container>
      <Box
        sx={{
          mt: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography variant="subtitle1">challenge</Typography>
          { isLoading ? 
          <Skeleton variant="rounded" animation="wave" width={"100%"} height={40}/>
          : 
          <Typography variant="h3" sx={{ display: "inline", mr: 2 }}>
            { challenge.name }
          </Typography>
          }
        </Box>
        <IconButton href="/" aria-label="notifications">
          <HomeIcon size={22}/>
        </IconButton>
      </Box>

      <Button variant="contained" href="/workout"
        sx={{mt: 2, width:"100%", height: "4rem", fontSize: "1rem" }}
      
      >
        <PlayIcon size={22} style={{marginRight: "0.75rem"}}/>
        Start Challenge
      </Button>

      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table sx={{ minWidth: 250 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Rank</TableCell>
              <TableCell align="right">Name</TableCell>
              <TableCell align="right">Score</TableCell>
              <TableCell align="right">RPM</TableCell>
              <TableCell align="right">Calories</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stats.map((stat, index) => (
              <TableRow
                key={index + 1}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {index + 1}.
                </TableCell>
                <TableCell align="right">{stat.name}</TableCell>
                <TableCell align="right">{stat.score.toFixed()}%</TableCell>
                <TableCell align="right">{stat.rpm.toFixed()}</TableCell>
                <TableCell align="right">{stat.calories_burned.toFixed()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
