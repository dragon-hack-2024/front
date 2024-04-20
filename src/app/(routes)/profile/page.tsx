"use client";
import Scan from "@/components/Scan";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { Car } from "lucide-react";
import { start } from "repl";

const userData = [
  { value: 80, text: "weight" },
  { value: 180, text: "height" },
  { value: 25, text: "age" },
];

export default function Profile() {
  return (
    <Container>
      <Box
        sx={{ display: "flex", justifyContent: "start", alignItems: "center" }}
      >
        <Avatar
          alt="Profile"
          sx={{
            m: 2,
          }}
        >
          A
        </Avatar>
        <Typography variant="h3" color="text.secondary" textAlign={"center"}>
          John Doe
        </Typography>
      </Box>

      <Grid container justifyContent="center" alignItems="center">
        {userData.map((data) => (
          <Grid item xs={4}>
            <Card
              sx={{
                cursor: "pointer",
                p: 4,
                m: 2,
              }}
            >
              <Typography
                variant="h4"
                color="text.secondary"
                textAlign={"center"}
              >
                {data.value}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                textAlign={"center"}
              >
                {data.text}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card sx={{ m: 2 }}>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Account
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}
