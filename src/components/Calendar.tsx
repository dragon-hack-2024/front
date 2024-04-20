"use client";
import React, { useState } from "react";
import { Grid, Paper, Typography, IconButton, Box } from "@mui/material";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  subMonths,
  addMonths,
  isSameMonth,
  isSameDay,
} from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const renderHeader = () => {
    return (
      <Grid container justifyContent="space-between" alignItems="center">
        <IconButton onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
          <ChevronLeftIcon />
        </IconButton>
        <Typography variant="h6">
          {format(currentMonth, "MMMM yyyy")}
        </Typography>
        <IconButton onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
          <ChevronRightIcon />
        </IconButton>
      </Grid>
    );
  };

  const renderDays = () => {
    const dateFormat = "EEE";
    const days = [];
    let startDate = startOfWeek(currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <Grid item xs key={i}>
          <Typography variant="caption">
            {format(addDays(startDate, i), dateFormat)}
          </Typography>
        </Grid>
      );
    }

    return <Grid container>{days}</Grid>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, "d");
        const cloneDay = day;
        days.push(
          <Grid item xs key={day.toString()}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: isSameDay(day, new Date())
                  ? "lightblue"
                  : "white",
                boxShadow: "none",
                m: 2,
              }}
              onClick={() => setCurrentMonth(cloneDay)}
            >
              <Typography
                variant="body2"
                sx={{
                  color: isSameMonth(day, monthStart)
                    ? "text.primary"
                    : "lightgray",
                }}
              >
                {formattedDate}
              </Typography>
            </Box>
          </Grid>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <Grid container key={day.toString()}>
          {days}
        </Grid>
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  return (
    <Box>
      {" "}
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </Box>
  );
}

export default Calendar;
