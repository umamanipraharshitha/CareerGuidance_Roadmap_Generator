import React from "react";
import { Box, Typography, Modal, Tabs, Tab, Button, Grid } from "@mui/material";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ImageIcon from "@mui/icons-material/Image";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";

export default function WeekDetailsModal({ week, open, onClose }) {
  const [tab, setTab] = React.useState(0);

  React.useEffect(() => {
    setTab(0);
  }, [week]);

  if (!week) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: { xs: "94vw", md: 600 },
          bgcolor: "#fff",
          borderRadius: 3,
          p: 4,
          boxShadow: 7,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
          Week {week.week} Details
        </Typography>
        <Tabs value={tab} onChange={(_, val) => setTab(val)} sx={{ mb: 2 }}>
          <Tab label="Report" icon={<InsertDriveFileIcon />} iconPosition="start" />
          <Tab label="Images" icon={<ImageIcon />} iconPosition="start" />
          <Tab label="Clips" icon={<PlayCircleOutlineIcon />} iconPosition="start" />
        </Tabs>
        {tab === 0 && (
          <Box>
            <Typography>Downloadable Report:</Typography>
            <Button
              variant="outlined"
              href={week.report}
              startIcon={<InsertDriveFileIcon />}
              target="_blank"
              rel="noopener noreferrer" // Security improvement
              aria-label="View report for week details" // Accessibility
            >
              View Report
            </Button>
          </Box>
        )}
        {tab === 1 && (
          <Grid container spacing={2}>
            {week.images.map((img, idx) => (
              <Grid item xs={6} key={idx}>
                <Box
                  component="img"
                  src={img}
                  alt={`Image for week ${week.week} - ${idx + 1}`} // Improved accessibility
                  sx={{ width: "100%", borderRadius: 2, boxShadow: 2, mb: 1 }}
                />
              </Grid>
            ))}
          </Grid>
        )}
        {tab === 2 && (
          <Box>
            <Typography gutterBottom>Video Clip:</Typography>
            <video
              src={week.video}
              controls
              width="100%"
              style={{ borderRadius: 8 }}
              aria-label={`Video clip for week ${week.week}`} // Accessibility
            />
          </Box>
        )}
        <Button sx={{ mt: 3 }} onClick={onClose}>
          Close
        </Button>
      </Box>
    </Modal>
  );
}
