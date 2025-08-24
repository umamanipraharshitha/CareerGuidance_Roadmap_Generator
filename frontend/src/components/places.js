import React from "react";
import { Box, Typography, Grid, useTheme, useMediaQuery } from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";

// Fade-in animation
const cardFadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// Background blur
const BgShape = styled(Box)({
  position: "absolute",
  top: "-60px",
  left: "50%",
  transform: "translateX(-50%)",
  width: "800px",
  height: "800px",
  background:
    "radial-gradient(circle, rgba(148,210,189,0.25) 0%, rgba(10,147,150,0.15) 70%, transparent 100%)",
  zIndex: 0,
  filter: "blur(60px)",
  pointerEvents: "none",
});

// Section wrapper
const Section = styled(Box)(({ theme }) => ({
  position: "relative",
  maxWidth: 1400,
  margin: "0 auto",
  padding: theme.spacing(10, 4),
  textAlign: "center",
}));

const Heading = styled(Typography)({
  fontWeight: 900,
  fontSize: "clamp(2rem, 4vw, 3rem)",
  color: "#005f73",
  marginBottom: 24,
  position: "relative",
  zIndex: 1,
});

const Description = styled(Typography)({
  fontSize: "1.1rem",
  color: "#0a9396",
  marginBottom: 48,
  maxWidth: 750,
  marginLeft: "auto",
  marginRight: "auto",
  lineHeight: 1.5,
  zIndex: 1,
});

// Card styling
const PlaceCard = styled(Box)({
  background: "#fff",
  borderRadius: 20,
  overflow: "hidden",
  boxShadow: "0 8px 20px rgba(0, 95, 115, 0.08)",
  animation: `${cardFadeIn} 0.6s ease forwards`,
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-6px) scale(1.02)",
    boxShadow: "0 14px 36px rgba(0, 95, 115, 0.15)",
  },
});

const ImgWrapper = styled(Box)({
  position: "relative",
  height: 200,
  overflow: "hidden",
});

const PlaceImg = styled("img")({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  transition: "transform 0.4s ease",
  display: "block",
  "&:hover": {
    transform: "scale(1.05)",
  },
});

const PlaceInfo = styled(Box)({
  padding: 24,
});

const PlaceTitle = styled(Typography)({
  fontWeight: 700,
  fontSize: "1.3rem",
  color: "#005f73",
  textAlign: "center",
});

// Card data
const places = [
  { name: "ZPHS High School Gaigolupaadu", image: "/images/gaigolupaadu.jpg" },
  { name: "Anandanilayam Kakinada", image: "/images/anandanilayam.jpg" },
  { name: "Synergy School, Kakinada", image: "/images/synergy.jpg" },
  { name: "Municipal High School, Kakinada", image: "/images/Kakinada.jpg" },
];

export default function PlacesVisitedShowcase() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Section>
      <BgShape />
      <Heading>Places We Visited</Heading>
      <Description>
        A glimpse into the inspiring locations we had the privilege to visit —
        each one adding a unique chapter to our journey of our project and career guidance sessions.
      </Description>

      <Grid container spacing={isMobile ? 3 : 4} justifyContent="center">
        {places.map((place, index) => (
          <Grid item xs={12} sm={6} md={4} key={place.name}>
            <PlaceCard sx={{ animationDelay: `${index * 0.15}s` }}>
              <ImgWrapper>
                <PlaceImg src={place.image} alt={place.name} />
              </ImgWrapper>
              <PlaceInfo>
                <PlaceTitle>{place.name}</PlaceTitle>
              </PlaceInfo>
            </PlaceCard>
          </Grid>
        ))}
      </Grid>
    </Section>
  );
}
