import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert as MuiAlert,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import emailjs from "emailjs-com"; // or "@emailjs/browser"
import NavBar from "./components/NavBar"; // Your reusable navigation bar

// Container fills viewport and centers form
const PageContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  backgroundColor: "#f0f3f5",
  position: "relative",
  fontFamily: "'Poppins', sans-serif",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(0, 2, 6, 2),
}));

// Shortened arc-shaped gradient background at top
const BackgroundHero = styled(Box)({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "220px",  // Reduced from 350px to 220px for less dominance
  background: "linear-gradient(135deg, #005f73 0%, #0a9396 70%, #94d2bd 100%)",
  clipPath: "ellipse(150% 100% at 50% 0%)", // keeps the arc shape
  zIndex: 1,
});

// Form container: pure white background with smooth corners and shadow
const FormWrapper = styled(Box)(({ theme }) => ({
  position: "relative",
  zIndex: 10,
  maxWidth: 480,
  width: "100%",
  backgroundColor: "#ffffff",  // Changed to solid white
  borderRadius: 24,
  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
  padding: theme.spacing(6, 5),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(3),
  [theme.breakpoints.down("sm")]: {
    maxWidth: "100%",
    padding: theme.spacing(4, 3),
  },
}));

const Title = styled(Typography)({
  fontWeight: 900,
  fontSize: "2.5rem",
  textAlign: "center",
  color: "#004d40",
  marginBottom: 8,
});

const Subtitle = styled(Typography)({
  fontWeight: 500,
  fontSize: "1.1rem",
  color: "#00796b",
  marginBottom: 16,
  textAlign: "center",
});

const StyledTextField = styled(TextField)({
  "& label": {
    color: "#00796b",
    fontWeight: 600,
  },
  "& label.Mui-focused": {
    color: "#004d40",
  },
  "& .MuiInputBase-input": {
    color: "#004d40",
    fontWeight: 700,
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#00796b",
      borderRadius: 18,
    },
    "&:hover fieldset": {
      borderColor: "#004d40",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#004d40",
      borderWidth: 2,
    },
  },
});

const SubmitButton = styled(Button)({
  backgroundColor: "#0a9396",
  color: "#fff",
  fontWeight: 700,
  fontSize: "1rem",
  borderRadius: 30,
  padding: "14px 0",
  textTransform: "none",
  boxShadow: "0 8px 18px rgba(10,147,150,0.5)",
  transition: "background-color 0.3s ease",
  "&:hover": {
    backgroundColor: "#005f73",
    boxShadow: "0 10px 25px rgba(0,95,115,0.7)",
  },
});

export default function ContactMe() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    setError(false);

    emailjs
      .send("service_46yfrpi", "template_0yzjqgb", form, "_7B-O_2Cr_iI7TA3s")
      .then(() => {
        setSent(true);
        setForm({ name: "", email: "", message: "" });
      })
      .catch(() => setError(true))
      .finally(() => setSending(false));
  };

  return (
    <>
      <NavBar />

      <BackgroundHero />

      <PageContainer>
        <FormWrapper component="form" onSubmit={handleSubmit} noValidate>
          <Title>Contact Us</Title>
          <Subtitle>We’d love to hear from you. Fill out the form below.</Subtitle>

          <StyledTextField
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            size={isSmallScreen ? "small" : "medium"}
          />
          <StyledTextField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            size={isSmallScreen ? "small" : "medium"}
          />
          <StyledTextField
            label="Message"
            name="message"
            multiline
            minRows={4}
            value={form.message}
            onChange={handleChange}
            required
            size={isSmallScreen ? "small" : "medium"}
          />

          <SubmitButton type="submit" disabled={sending}>
            {sending ? "Sending..." : "Send Message"}
          </SubmitButton>
        </FormWrapper>
      </PageContainer>

      <Snackbar
        open={sent}
        autoHideDuration={4000}
        onClose={() => setSent(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <MuiAlert
          severity="success"
          variant="filled"
          onClose={() => setSent(false)}
          sx={{ fontWeight: 700 }}
        >
          ✅ Your message has been sent successfully!
        </MuiAlert>
      </Snackbar>
      <Snackbar
        open={error}
        autoHideDuration={4000}
        onClose={() => setError(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <MuiAlert
          severity="error"
          variant="filled"
          onClose={() => setError(false)}
          sx={{ fontWeight: 700 }}
        >
          ❌ Oops! Something went wrong. Please try again.
        </MuiAlert>
      </Snackbar>
    </>
  );
}
