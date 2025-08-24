// src/ServicePages.js
import React from "react";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import MaterialsSection from "./components/MaterialsSection"; // adjust path if needed
import NavBar from "./components/NavBar"; // Reusable NavBar
import SessionTopics from "./components/SessionTopics"; // Topics component with images

// ==== Top Hero section with gradient background ====
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
  position: "relative",
  padding: theme.spacing(6, 2),
}));

// ==== Content area below hero ====
const ContentSection = styled(Box)(({ theme }) => ({
  backgroundColor: "#fff",
  color: "#222",
  padding: theme.spacing(4, 2),
  maxWidth: 1200, // widened card
  margin: "0 auto",
  borderRadius: 12,
  boxShadow: "0 4px 16px rgb(0 0 0 / 0.1)",
  marginTop: theme.spacing(-8), // overlap effect
  fontFamily: "'Poppins', sans-serif",
  zIndex: 10,
  position: "relative",
}));

// ==== Title & Subtitle in hero ====
const Title = styled(Typography)({
  fontWeight: 800,
  fontSize: "2.8rem",
  marginBottom: 8,
  textAlign: "center",
  textShadow: "0 3px 8px rgba(0,0,0,0.3)",
});

const Subtitle = styled(Typography)({
  fontWeight: 500,
  fontSize: "1.45rem", // ⬅️ slightly bigger
  marginBottom: 24,
  color: "#f9f7e8ff", // ⬅️ white for contrast
  textAlign: "center",
  textShadow: "0 2px 6px rgba(0,0,0,0.4)", // ⬅️ subtle shadow for visibility
});

export default function ServicePages({ materials = [], materialsRef }) {
  return (
    <>
      {/* ==== Hero Section ==== */}
      <HeroSectionBG>
        <NavBar />
        <Title>Our Services</Title>
        <Subtitle>
          Your success is our priority — check out our programs and resources.
        </Subtitle>
      </HeroSectionBG>

      {/* ==== Main Content Section ==== */}
      <ContentSection>
        {/* Session Topics Section */}
        <section style={{ marginBottom: 40 }}>
          <SessionTopics />
        </section>

        {/* Materials Provided - assign ref here */}
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
