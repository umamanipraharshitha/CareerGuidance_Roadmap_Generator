import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import SchoolIcon from '@mui/icons-material/School';
import GroupIcon from '@mui/icons-material/Group';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';

// Card container styled for a clean look
const StatCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: "center",
  backgroundColor: "#ffffffff", // Solid white background for clarity
  color: "#005f73", // Dark teal for text
  borderRadius: 20,
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)", // Soft shadow for depth
  transition: "transform 0.3s",
  "&:hover": {
    transform: "scale(1.05)", // Slight scale effect on hover
  },
}));

const StatIcon = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(1.5),
  color: "#0a9396", // Teal color for icons
  fontSize: 52,
}));

const StatNumber = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: "2.4rem",
  lineHeight: 1,
  color: "#005f73", // Dark teal for numbers
}));

const StatLabel = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: "1.1rem",
  marginTop: theme.spacing(0.5),
  color: "#0a9396", // Teal for labels
}));

// Animated number component remains same but visually muted
function AnimatedNumber({ target, duration = 2500 }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    let numericTarget = parseInt(target, 10);
    if (start === numericTarget) return;

    const intervalTime = 50;
    const increments = duration / intervalTime;
    const step = numericTarget / increments;
    let current = start;

    const timer = setInterval(() => {
      current += step;
      if (current >= numericTarget) {
        setCount(numericTarget);
        clearInterval(timer);
      } else {
        setCount(Math.ceil(current));
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [target, duration]);

  return <>{count}{target.includes('+') ? "+" : ""}</>;
}

export default function StatsCardsBackground() {
  const stats = [
    { icon: <SchoolIcon fontSize="inherit" />, number: "150+", label: "Students" },
    { icon: <GroupIcon fontSize="inherit" />, number: "4+", label: "Schools & Places" },
    { icon: <PeopleIcon fontSize="inherit" />, number: "11", label: "Members" },
    { icon: <PersonIcon fontSize="inherit" />, number: "4", label: "Faculty Guidance" },
  ];

  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        mt: { xs: 6, md: 10 },
        mb: { xs: 6, md: 10 },
        maxWidth: 1100,
        mx: "auto",
      }}
    >
      <Grid container spacing={3} justifyContent="center">
        {stats.map(({ icon, number, label }) => (
          <Grid item xs={6} sm={3} key={label}>
            <StatCard elevation={0} square>
              <StatIcon>{icon}</StatIcon>
              <StatNumber>
                <AnimatedNumber target={number} />
              </StatNumber>
              <StatLabel>{label}</StatLabel>
            </StatCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
