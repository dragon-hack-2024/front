"use client";
import {
  Typography,
  Container,
  Checkbox,
  Box,
  Button,
  IconButton,
  Skeleton,
} from "@mui/material";
import Scan from "@/components/Scan";
import { BellIcon, CircleUserRoundIcon, RulerIcon, WeightIcon } from "lucide-react";
import ProgressGraph from "@/components/ProgressGraph";
import Calendar from "@/components/Calendar";
import History from "@/components/History";
import Challenges from "@/components/Challenges";
import React, { useEffect, useState } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  weight: number;
  height: number;
  birth_date: string;
}

const getAge = (birth_date: string): number => {
  const today = new Date();
  const birthDate = new Date(birth_date);
  let age = today.getFullYear() - birthDate.getFullYear();
  const month = today.getMonth() - birthDate.getMonth();

  if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

export default function Home() {

  const [user, setUser] = useState<User>({} as User);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:8080/v1/users/1");

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json() as User;
        console.log(data);
        setUser(data);
      } catch (error) {
        console.error("Error fetching challenges:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

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
          <Typography variant="subtitle1">welcome back</Typography>
          { isLoading ? 
          <Skeleton variant="rounded" animation="wave" width={"100%"} height={40}/>
          : 
          <Typography variant="h1" sx={{ display: "inline", mr: 2 }}>
            { user.name }
          </Typography>
          }
        </Box>
        <IconButton aria-label="notifications">
          <BellIcon />
        </IconButton>
      </Box>
      
      { isLoading ? 
      <Skeleton variant="rounded" animation="wave" width={"100%"} height={50} sx={{mt: 0.5}}/>
      : 
      <Box sx={{display: "flex", justifyContent: "space-around", mt: 0.5}}>
        <Box sx={{display: "flex", alignItems: "center", borderRadius: "7px", px: "1rem", py: "0.75rem"}}>
          <WeightIcon size={20} style={{marginRight: "0.5rem"}}/>
          <Typography variant="h5">{ user.weight } kg</Typography>
        </Box>

        <Box sx={{display: "flex", alignItems: "center", borderRadius: "7px", px: "1rem", py: "0.75rem"}}>
          <RulerIcon size={20} style={{marginRight: "0.5rem"}}/>
          <Typography variant="h5">{ user.height } cm</Typography>
        </Box>

        <Box sx={{display: "flex", alignItems: "center", borderRadius: "7px", px: "1rem", py: "0.75rem"}}>
          <CircleUserRoundIcon size={20} style={{marginRight: "0.5rem"}}/>
          <Typography variant="h5">{ user.birth_date ? getAge(user.birth_date) : '' } yo</Typography>
        </Box>
      </Box>
      }

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" sx={{ textAlign: "center"}}>
          Weekly Skips
        </Typography>
        <ProgressGraph />
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" sx={{ textAlign: "center"}}>
          History
        </Typography>
        <History />
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" sx={{ textAlign: "center"}}>
          Challenges
        </Typography>
        <Challenges />
      </Box>

      <Box sx={{ mt: 4, mb: 4 }}>
      </Box>
    </Container>
  );
}
