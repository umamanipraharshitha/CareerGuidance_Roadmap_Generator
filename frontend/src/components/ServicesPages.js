import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import DownloadIcon from "@mui/icons-material/Download";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

// Fade-in animation
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Section = styled(Box)(({ theme }) => ({
  maxWidth: 960,
  margin: "0 auto",
  padding: theme.spacing(8, 3),
  textAlign: "center",
  color: "#005f73",
}));

const Heading = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  fontSize: "2.5rem",
  marginBottom: theme.spacing(3),
  position: "relative",
  "&::after": {
    content: '""',
    display: "block",
    width: 80,
    height: 4,
    backgroundColor: "#0a9396",
    margin: "12px auto 0",
    borderRadius: 3,
  },
  animation: `${fadeUp} 0.8s ease forwards`,
}));

const MaterialsGrid = styled(Grid)(({ theme }) => ({
  marginTop: theme.spacing(4),
}));

const MaterialCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 20,
  boxShadow: "0 4px 24px rgba(10,147,150,0.12)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  animation: `${fadeUp} 1.3s ease forwards`,
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 12px 28px rgba(10,147,150,0.25)",
  },
}));

const FileIcon = styled(InsertDriveFileIcon)(({ theme }) => ({
  fontSize: 54,
  marginBottom: theme.spacing(2),
  color: "#005f73",
}));

const ExportButton = styled(Button)({
  marginTop: 32,
  borderRadius: 30,
  fontWeight: 700,
  paddingLeft: 32,
  paddingRight: 32,
  backgroundColor: "#ee9b00",
  color: "#fff",
  boxShadow: "0 6px 20px rgba(238,155,0,0.4)",
  "&:hover": {
    backgroundColor: "#ca8a04",
  },
  display: "flex",
  alignItems: "center",
  gap: 8,
});

export default function ServicesPage({ materials }) {
  const [signedIn, setSignedIn] = useState(false);

  const handleGoogleSignIn = () => {
    setSignedIn(true);
  };

  return (
    <Section>
      <Heading>Materials We Provided</Heading>
      <Typography variant="body1" color="#004d4d" mb={3}>
        Access and download study guides, presentations, and other helpful resources shared during our sessions.
      </Typography>

      {!signedIn ? (
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#0a9396",
            color: "#fff",
            fontWeight: 700,
            borderRadius: 30,
            padding: "10px 30px",
            fontSize: "1.1rem",
            "&:hover": { backgroundColor: "#005f73" },
            mb: 4,
          }}
          onClick={handleGoogleSignIn}
        >
          Sign in with Google to Export
        </Button>
      ) : (
        <ExportButton
          startIcon={<DownloadIcon />}
          onClick={() => alert("Exporting materials as CSV...")}
        >
          Export Materials as CSV
        </ExportButton>
      )}

      <MaterialsGrid container spacing={4} justifyContent="center">
        {materials.map((mat) => (
          <Grid item xs={12} sm={6} md={4} key={mat.title}>
            <MaterialCard>
              <FileIcon />
              <Typography
                variant="h6"
                color="#0a9396"
                textAlign="center"
                mb={2}
                sx={{ minHeight: 48 }}
              >
                {mat.title}
              </Typography>
              <Button
                variant="outlined"
                href={mat.link}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  borderColor: "#005f73",
                  color: "#005f73",
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: 24,
                  "&:hover": { backgroundColor: "#e0f2f1" },
                }}
              >
                View
              </Button>
            </MaterialCard>
          </Grid>
        ))}
      </MaterialsGrid>
    </Section>
  );
}
