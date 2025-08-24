import React from "react";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

// Container for team section
const TeamSection = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(6),
  maxWidth: 900,
  marginLeft: "auto",
  marginRight: "auto",
  textAlign: "center",
}));

// Group photo styling
const GroupPhoto = styled("img")(({ theme }) => ({
  width: "100%",
  maxWidth: 600,
  borderRadius: 16,
  boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
  marginBottom: theme.spacing(3),
  objectFit: "cover",
}));

// Names container: flex wrap if long list
const NamesContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  flexWrap: "wrap",
  gap: theme.spacing(2),
}));

// Individual name style
const MemberName = styled(Typography)(({ theme }) => ({
  color: "#0a9396",
  fontWeight: 600,
  fontSize: "1.1rem",
  minWidth: 120,
}));

export function TeamGroup({ photoSrc, memberNames = [] }) {
  return (
    <TeamSection>
      <GroupPhoto src={photoSrc} alt="Team Group Photo" />
      <NamesContainer>
        {memberNames.map((name, idx) => (
          <MemberName key={idx}>{name}</MemberName>
        ))}
      </NamesContainer>
    </TeamSection>
  );
}
