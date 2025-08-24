// src/ServicePages.js
import React from "react";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import NavBar from "./components/NavBar";
import SessionTopics from "./components/SessionTopics";
import MaterialsSection from "./components/MaterialsSection";

// ==== Hero Section ====
const HeroSectionBG = styled(Box)(({ theme }) => ({
  width: "100%",
  minHeight: 280,
  background: "linear-gradient(135deg, #005f73 0%, #0a9396 70%, #94d2bd 100%)",
  color: "#fff",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "'Poppins', sans-serif",
  padding: theme.spacing({ xs: 4, sm: 6 }),
  textAlign: "center",
  boxSizing: "border-box",
}));

const Title = styled(Typography)({
  fontWeight: 800,
  fontSize: "2.5rem",
  marginBottom: 8,
  textShadow: "0 3px 8px rgba(0,0,0,0.3)",
});

const Subtitle = styled(Typography)({
  fontWeight: 500,
  fontSize: "1.2rem",
  marginBottom: 24,
  color: "#f9f7e8ff",
  textShadow: "0 2px 6px rgba(0,0,0,0.4)",
});

// ==== Content Section ====
const ContentSection = styled(Box)(({ theme }) => ({
  backgroundColor: "#fff",
  color: "#222",
  padding: theme.spacing({ xs: 3, sm: 4 }),
  maxWidth: 1200,
  margin: "0 auto",
  borderRadius: 12,
  boxShadow: "0 4px 16px rgb(0 0 0 / 0.1)",
  marginTop: theme.spacing(-8),
  fontFamily: "'Poppins', sans-serif",
  zIndex: 10,
  position: "relative",
  overflowX: "hidden", // prevent horizontal scroll
  width: "100%",
  boxSizing: "border-box",
}));

export default function ServicePages({ materials = [], materialsRef }) {
  return (
    <>
      {/* Hero Section */}
      <HeroSectionBG>
        <NavBar />
        <Title>Our Services</Title>
        <Subtitle>
          Your success is our priority — check out our programs and resources.
        </Subtitle>
      </HeroSectionBG>

      {/* Main Content */}
      <ContentSection>
        {/* Session Topics */}
        <section style={{ marginBottom: 40, overflowX: "hidden" }}>
          <SessionTopics />
        </section>

        {/* Materials Provided */}
        <section style={{ marginBottom: 40 }} ref={materialsRef}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: "#005f73", marginBottom: 2 }}
          >
            Materials Provided
          </Typography>
          <MaterialsSection materials={materials} />
        </section>
      </ContentSection>
    </>
  );
}
