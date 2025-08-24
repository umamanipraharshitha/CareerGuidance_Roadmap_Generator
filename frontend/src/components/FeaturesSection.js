import React, { useRef } from "react";
import { Box, Typography, IconButton, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CloseIcon from "@mui/icons-material/Close";

// === Styled Components ===
const TimelineContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(4),
  overflowX: "auto",
  padding: theme.spacing(4, 0),
  scrollBehavior: "smooth",
  scrollbarWidth: "none",
  "&::-webkit-scrollbar": { display: "none" },
}));

const WeekCard = styled(Box)(({ theme }) => ({
  flex: "0 0 350px",
  backgroundColor: "#0a9396",
  borderRadius: 24,
  padding: theme.spacing(5),
  boxShadow: "0 4px 12px rgba(0,0,0,0.17)",
  color: "#e0fbfc",
  cursor: "pointer",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  ":hover": {
    transform: "translateY(-6px)",
    boxShadow: "0 10px 28px rgba(0,0,0,0.3)",
  },
  fontFamily: "'Poppins', sans-serif",
}));

const WeekNumber = styled(Typography)({
  fontWeight: 700,
  fontSize: "2rem",
  marginBottom: 12,
  color: "#fff",
});

const WeekDesc = styled(Typography)({
  fontSize: "1.15rem",
  lineHeight: 1.5,
  color: "#d8f3dc",
});

const ConnectorArrow = ({ direction = "right" }) => {
  const pathRight = "M0 50 C20 20, 60 80, 80 50";
  const pathLeft = "M80 50 C60 20, 20 80, 0 50";
  return (
    <svg width="100" height="120" viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <path d={direction === "right" ? pathRight : pathLeft} stroke="#94d2bd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <polygon points={direction === "right" ? "75,45 80,50 75,55" : "5,45 0,50 5,55"} fill="#94d2bd"/>
    </svg>
  );
};

const BigDetailCard = styled(Box)(({ theme }) => ({
  position: "fixed",
  top: 40,
  left: "50%",
  transform: "translateX(-50%)",
  width: "90%",
  maxWidth: 900,
  backgroundColor: "#ffffff",
  borderRadius: 16,
  boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
  padding: theme.spacing(4),
  zIndex: 999,
  overflowY: "auto",
  maxHeight: "85vh",
  fontFamily: "'Poppins', sans-serif",
}));

const Overlay = styled(Box)({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0,0,0,0.3)",
  backdropFilter: "blur(6px)",
  zIndex: 998,
});

const ImageBox = styled("img")({
  width: "100%",
  borderRadius: 12,
  objectFit: "cover",
});

export default function FeaturesSection({ weeks = [], selectedWeek, setSelectedWeek }) {
  const containerRef = useRef(null);

  const scrollLeft = () => containerRef.current?.scrollBy({ left: -380, behavior: "smooth" });
  const scrollRight = () => containerRef.current?.scrollBy({ left: 380, behavior: "smooth" });

  return (
    <Box sx={{ position: "relative", py: 6, maxWidth: "100vw", overflow: "hidden" }}>
      <Typography variant="h4" align="center" sx={{ mb: 5, color: "#005f73", fontWeight: 700 }}>
        8 Week Journey
      </Typography>

      <IconButton onClick={scrollLeft} sx={{ position: "absolute", top: "50%", left: 12 }}>
        <ArrowBackIosNewIcon fontSize="small" />
      </IconButton>

      <TimelineContainer ref={containerRef}>
        {weeks?.map((week, i) => (
          <React.Fragment key={week.week}>
            <WeekCard onClick={() => setSelectedWeek(week)}>
              <WeekNumber>Week {week.week}</WeekNumber>
              <WeekDesc>{week.desc}</WeekDesc>
            </WeekCard>
            {i < weeks.length - 1 && <ConnectorArrow />}
          </React.Fragment>
        ))}
      </TimelineContainer>

      <IconButton onClick={scrollRight} sx={{ position: "absolute", top: "50%", right: 12 }}>
        <ArrowForwardIosIcon fontSize="small" />
      </IconButton>

      {selectedWeek && <Overlay onClick={() => setSelectedWeek(null)} />}
      {selectedWeek && (
        <BigDetailCard>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: "#0a9396" }}>
              Week {selectedWeek.week} Details
            </Typography>
            <IconButton onClick={() => setSelectedWeek(null)}><CloseIcon /></IconButton>
          </Box>

          <Typography sx={{ mb: 3 }}>{selectedWeek.desc}</Typography>

          {selectedWeek.report && (
            <Button href={selectedWeek.report} target="_blank" rel="noopener noreferrer" sx={{ mb: 3, backgroundColor: "#0a9396", color: "#fff" }}>
              View Report
            </Button>
          )}

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" }, gap: 2, mb: 3 }}>
            {selectedWeek.images?.map((img, idx) => (
              <ImageBox key={idx} src={img} alt={`Week ${selectedWeek.week} image ${idx + 1}`} />
            ))}
          </Box>

          {selectedWeek.video && (
            <Box sx={{ mt: 2 }}>
              <video controls style={{ width: "100%", borderRadius: 12 }}>
                <source src={selectedWeek.video} type="video/mp4" />
              </video>
            </Box>
          )}
        </BigDetailCard>
      )}
    </Box>
  );
}
