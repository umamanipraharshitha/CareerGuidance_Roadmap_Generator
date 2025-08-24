// src/MaterialsSection.js
import React from "react";
import {
  Typography,
  Grid,
  Paper,
  Button,
  Box
} from "@mui/material";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DownloadIcon from "@mui/icons-material/Download";
import { styled, keyframes } from "@mui/material/styles";

// Fade-in animation
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(15px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const SectionWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: "#e0f2f1",
  padding: theme.spacing(8, 4),
  borderRadius: theme.shape.borderRadius * 2,
  textAlign: "center",
}));

const MaterialCard = styled(Paper)(({ theme }) => ({
  borderRadius: 16,
  padding: theme.spacing(3),
  boxShadow: "0 5px 15px rgba(0, 95, 115, 0.1)",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  animation: `${fadeUp} 0.5s ease both`,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 12px 30px rgba(0, 95, 115, 0.18)",
  },
}));

const FileIcon = styled(InsertDriveFileIcon)(({ theme }) => ({
  fontSize: 48,
  color: "#005f73",
  marginBottom: theme.spacing(1),
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "scale(1.1)",
  },
}));

const ViewButton = styled(Button)({
  borderRadius: 24,
  textTransform: "none",
  fontWeight: 600,
  padding: "8px 30px",
  marginTop: "auto",
  backgroundColor: "#005f73",
  color: "#fff",
  boxShadow: "0 3px 10px rgba(10, 147, 150, 0.3)",
  "&:hover": {
    backgroundColor: "#0a9396",
    boxShadow: "0 6px 20px rgba(10, 147, 150, 0.5)",
  },
});

const DownloadButton = styled(Button)({
  borderRadius: 24,
  textTransform: "none",
  fontWeight: 600,
  padding: "8px 30px",
  marginTop: "12px",
  backgroundColor: "#0a9396",
  color: "#fff",
  boxShadow: "0 3px 10px rgba(10, 147, 150, 0.3)",
  "&:hover": {
    backgroundColor: "#005f73",
    boxShadow: "0 6px 20px rgba(10, 147, 150, 0.5)",
  },
});

const Heading = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: "2rem",
  color: "#005f73",
  marginBottom: theme.spacing(4),
  position: "relative",
  "&::after": {
    content: '""',
    display: "block",
    width: 60,
    height: 4,
    backgroundColor: "#0a9396",
    borderRadius: 2,
    margin: "8px auto 0",
  },
}));

export default function MaterialsSection() {
  // ✅ Import local PDF asset
  const pdfFile = require("../assets/What Next.pdf");

  // ✅ List of materials
  const materials = [
    {
      title: "Career Guidance Presentation",
      link: "https://docs.google.com/presentation/d/1K9LIrQU1BW8JOohSZ4I3SOanDspSP1WkDLl82JSKBCk/export/pptx", // direct download PPTX
      view: "https://docs.google.com/presentation/d/1K9LIrQU1BW8JOohSZ4I3SOanDspSP1WkDLl82JSKBCk/edit?usp=sharing",
    },
    {
      title: "What Next? (PDF)",
      link: pdfFile,
      view: pdfFile,
    },
  ];

  return (
    <SectionWrapper>
      <Heading variant="h4">Materials</Heading>
      <Grid container spacing={4} justifyContent="center">
        {materials.map((mat, i) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={mat.title}>
            <MaterialCard style={{ animationDelay: `${i * 0.1}s` }}>
              <FileIcon />
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 600,
                  color: "#0a9396",
                  minHeight: 48,
                  textAlign: "center",
                  mb: 2,
                }}
              >
                {mat.title}
              </Typography>
              <ViewButton
                variant="contained"
                href={mat.view}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View ${mat.title}`}
                endIcon={<InsertDriveFileIcon />}
              >
                View File
              </ViewButton>

              <DownloadButton
                variant="contained"
                href={mat.link}
                download
                aria-label={`Download ${mat.title}`}
                endIcon={<DownloadIcon />}
              >
                Download
              </DownloadButton>
            </MaterialCard>
          </Grid>
        ))}
      </Grid>
    </SectionWrapper>
  );
}
