import React from "react";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const GuidanceBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(6),
  textAlign: "center",
  color: "#0a9396",
  fontWeight: 700,
}));

const FacultyName = styled(Typography)(({ theme }) => ({
  fontSize: "1.25rem",
  fontWeight: 600,
  color: "#005f73",
  marginTop: theme.spacing(1),
}));

export function FacultyGuidance({ facultyNames = [] }) {
  return (
    <GuidanceBox>
      <Typography variant="h6">Under the Guidance of</Typography>
      {facultyNames.map((name, idx) => (
        <FacultyName key={idx}>{name}</FacultyName>
      ))}
    </GuidanceBox>
  );
}
