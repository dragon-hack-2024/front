"use client";
import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import {
  CalendarIcon,
  FlameIcon,
  RotateCwIcon,
  TargetIcon,
  TimerIcon,
} from "lucide-react";

interface Data {
  duration: number;
  score: number;
  calories_burned: number;
  rpm: number;
  challenge_id: number;
  user_id: number;
}

function SaveDialog({
  open,
  onClose,
  data,
}: {
  open: boolean;
  onClose: () => void;
  data: Data;
}) {
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Workout Summary</DialogTitle>
      <DialogContent sx={{ width: "70vw" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            flexDirection: "column",
            mt: 2,
            borderRadius: "7px",
            paddingX: "1rem",
            paddingY: "0.75rem",
            "--tw-shadow":
              "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
            "--tw-shadow-colored":
              "0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color)",
            boxShadow:
              "var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-around" }}>
            <Box sx={{ display: "flex", justifyItems: "center" }}>
              <TimerIcon size={16} style={{ marginRight: "0.2rem" }} />
              <Typography>{formatTime(data?.duration || 0)}</Typography>
            </Box>

            <Box sx={{ display: "flex", justifyItems: "center" }}>
              <TargetIcon size={16} style={{ marginRight: "0.2rem" }} />
              <Typography>{data?.score?.toFixed(2)}%</Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-around", mt: 2 }}>
            <Box sx={{ display: "flex", justifyItems: "center" }}>
              <FlameIcon size={16} style={{ marginRight: "0.2rem" }} />
              <Typography>{data?.calories_burned} kcal</Typography>
            </Box>

            <Box sx={{ display: "flex", justifyItems: "center" }}>
              <RotateCwIcon size={16} style={{ marginRight: "0.2rem" }} />
              <Typography>{data?.rpm?.toFixed(2)} RPM</Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default SaveDialog;
