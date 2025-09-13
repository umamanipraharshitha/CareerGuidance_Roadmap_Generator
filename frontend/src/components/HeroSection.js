// src/components/CommunityHero.js
import React from "react";
import { Box, Typography, Button, keyframes } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";

// ===== Simple fade-slide animation =====
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(25px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// ===== Background =====
const HeroSectionBG = styled(Box)(({ theme }) => ({
  width: "100%",
  minHeight: "100vh",
  background: "linear-gradient(135deg, #005f73 0%, #0a9396 70%, #94d2bd 100%)",
  color: "#fff",
  display: "flex",
  flexDirection: "column",
  position: "relative",
  overflow: "hidden",
  fontFamily: "'Poppins', sans-serif",
}));

// ===== Center Wrapper =====
const ContentWrapper = styled(Box)(({ theme }) => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(6, 2),
  textAlign: "center",
  maxWidth: 1100,
  margin: "0 auto",
  animation: `${fadeInUp} 1.2s ease-out`,
  zIndex: 5, // ensure buttons stay clickable
}));

const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  lineHeight: 1.25,
  marginBottom: "1.2rem",
  textShadow: "0 3px 10px rgba(0,0,0,0.25)",
  [theme.breakpoints.down("md")]: { fontSize: "2.5rem" },
  [theme.breakpoints.up("md")]: { fontSize: "3.4rem" },
}));

const Subtitle = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  marginBottom: "1.6rem",
  color: "#e0fbfc",
  [theme.breakpoints.down("md")]: { fontSize: "1.2rem" },
  [theme.breakpoints.up("md")]: { fontSize: "1.5rem" },
}));

const Description = styled(Typography)(({ theme }) => ({
  fontWeight: 400,
  lineHeight: 1.7,
  maxWidth: 800,
  marginBottom: "2.5rem",
  color: "#d8f3dc",
  [theme.breakpoints.down("md")]: { fontSize: "1rem" },
  [theme.breakpoints.up("md")]: { fontSize: "1.2rem" },
}));

const PrimaryButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#ee9b00",
  color: "#fff",
  fontWeight: 700,
  textTransform: "none",
  padding: theme.spacing(1.6, 4.5),
  borderRadius: 30,
  fontSize: "1.1rem",
  boxShadow: "0 6px 16px rgba(238, 155, 0, 0.4)",
  "&:hover": { backgroundColor: "#ca8a04", transform: "translateY(-2px)" },
  [theme.breakpoints.down("md")]: { padding: theme.spacing(1.3, 3.5), fontSize: "1rem" },
}));

const SecondaryButton = styled(Button)(({ theme }) => ({
  border: "2px solid #ee9b00",
  color: "#ee9b00",
  fontWeight: 700,
  textTransform: "none",
  padding: theme.spacing(1.5, 4.5),
  borderRadius: 30,
  fontSize: "1.1rem",
  "&:hover": { backgroundColor: "rgba(238,155,0,0.1)", transform: "translateY(-2px)" },
  [theme.breakpoints.down("md")]: { padding: theme.spacing(1.3, 3.5), fontSize: "1rem" },
}));

const ButtonsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: "1.4rem",
  flexWrap: "wrap",
  justifyContent: "center",
}));

const WaveShape = styled("svg")({
  position: "absolute",
  bottom: 0,
  left: 0,
  width: "100%",
  height: 160,
  pointerEvents: "none", // <-- prevents overlay from blocking clicks
});

export default function CommunityHero() {
  const navigate = useNavigate();
  


  return (
    <HeroSectionBG>
      <NavBar />

      <ContentWrapper>
        <Title>
          Empowering Students
          <br />
          For a Brighter Future
        </Title>
        <Subtitle>Career Guidance & Community Support</Subtitle>
        <Description>
          We provide comprehensive career guidance and in-depth knowledge of
          various career paths, empowering students to make informed decisions
          and choose their future paths.
        </Description>

        <ButtonsContainer>

  <PrimaryButton onClick={() => navigate("/login")}>
    Try RoadmapGenerator
  </PrimaryButton>

  <SecondaryButton onClick={() => navigate("/contact")}>
    Contact Us
  </SecondaryButton>
</ButtonsContainer>

      </ContentWrapper>

      <WaveShape viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
        <path
          fill="#ffffff"
          fillOpacity="1"
          d="M0,256L48,245.3C96,235,192,213,288,202.7C384,192,480,192,576,213.3C672,235,768,277,864,282.7C960,288,1056,256,1152,229.3C1248,203,1344,181,1392,170.7L1440,160L1440,320L0,320Z"
        ></path>
      </WaveShape>
    </HeroSectionBG>
  );
}
