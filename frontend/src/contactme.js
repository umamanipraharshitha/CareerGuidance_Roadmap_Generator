// src/ContactUs.js
import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert as MuiAlert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
 import emailjs from "@emailjs/browser";
import NavBar from "./components/NavBar";

// ==== Hero Section ====
const HeroSectionBG = styled(Box)(({ theme }) => ({
  width: "100%",
  minHeight: 260,
  background: "linear-gradient(135deg, #005f73 0%, #0a9396 70%, #94d2bd 100%)",
  color: "#fff",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "'Poppins', sans-serif",
  padding: theme.spacing(6, 2),
  boxSizing: "border-box",
}));

const Title = styled(Typography)({
  fontWeight: 800,
  fontSize: "2.5rem",
  marginBottom: 8,
  textAlign: "center",
  textShadow: "0 3px 8px rgba(0,0,0,0.3)",
});

const Subtitle = styled(Typography)({
  fontWeight: 500,
  fontSize: "1.2rem",
  marginBottom: 24,
  color: "#e0f2f1",
  textAlign: "center",
});

// ==== Content Section ====
const ContentSection = styled(Box)(({ theme }) => ({
  backgroundColor: "#fff",
  color: "#222",
  padding: theme.spacing(4, 2),
  maxWidth: 1100,
  width: "100%",
  margin: "0 auto",
  borderRadius: 12,
  boxShadow: "0 4px 16px rgb(0 0 0 / 0.1)",
  marginTop: theme.spacing(-8),
  fontFamily: "'Poppins', sans-serif",
  zIndex: 10,
  position: "relative",
  display: "flex",
  gap: theme.spacing(4),
  flexWrap: "wrap", // wrap on small screens
  boxSizing: "border-box",
}));

// ==== Form ====
const FormBox = styled(Box)(({ theme }) => ({
  flex: "1 1 300px", // min width 300px
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2.5),
}));

const StyledTextField = styled(TextField)({
  "& label": { color: "#666", fontWeight: 500 },
  "& label.Mui-focused": { color: "#0a9396" },
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "#ccc" },
    "&:hover fieldset": { borderColor: "#0a9396" },
    "&.Mui-focused fieldset": { borderColor: "#0a9396" },
    borderRadius: 10,
  },
});

const SubmitButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(90deg, #0a9396, #94d2bd)",
  color: "#fff",
  fontWeight: 700,
  padding: theme.spacing(1.2, 4),
  borderRadius: 30,
  textTransform: "none",
  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  "&:hover": { background: "linear-gradient(90deg, #005f73, #0a9396)" },
}));

// ==== Info Section ====
const InfoBox = styled(Box)(({ theme }) => ({
  flex: "1 1 250px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  padding: theme.spacing(2),
  boxSizing: "border-box",
}));

const FacultySection = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
  borderTop: "1px solid #ddd",
  paddingTop: theme.spacing(2),
}));

const FacultyName = styled(Typography)({
  fontWeight: 600,
  color: "#005f73",
  marginTop: 4,
});

// ==== Faculty data ====
const facultyNames = [
  "Dr. A.Karuna",
  "Smt Ch.Priyadharshini",
  "Smt K.Mythri Sridevi",
  "Smt M.Lova Kumari",
];

// ==== EmailJS IDs ====
const serviceID = "service_46yfrpi";
const templateID = "template_0yzjqgb";
const userID = "_7B-O_2Cr_iI7TA3s";

export default function ContactUs() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);
  const [sending, setSending] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    setError(false);

    emailjs
      .send(serviceID, templateID, form, userID)
      .then(() => {
        setSent(true);
        setForm({ name: "", email: "", message: "" });
      })
      .catch(() => setError(true))
      .finally(() => setSending(false));
  };

  return (
    <>
      <HeroSectionBG>
        <NavBar />
        <Title>Contact Us</Title>
        <Subtitle>We’d love to hear from you — send us a quick message.</Subtitle>
      </HeroSectionBG>

      <ContentSection>
        <FormBox component="form" onSubmit={handleSubmit}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#0a9396", mb: 1 }}>
            Get in Touch
          </Typography>
          <StyledTextField label="Name" name="name" value={form.name} onChange={handleChange} required size="small" fullWidth />
          <StyledTextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} required size="small" fullWidth />
          <StyledTextField label="Message" name="message" multiline minRows={3} value={form.message} onChange={handleChange} required size="small" fullWidth />
          <SubmitButton type="submit" disabled={sending}>
            {sending ? "Sending..." : "Send Message"}
          </SubmitButton>
        </FormBox>

        <InfoBox>
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#0a9396", mb: 1 }}>
            Let’s Connect & Grow Together
          </Typography>
          <Typography sx={{ color: "#444", mb: 3 }}>
            Have any questions or want to collaborate? Fill out the form, and we’ll get back to you soon.
          </Typography>

          <FacultySection>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#0a9396", mb: 1 }}>
              Under the Guidance of
            </Typography>
            {facultyNames.map((name, idx) => (
              <FacultyName key={idx}>{name}</FacultyName>
            ))}
          </FacultySection>
        </InfoBox>
      </ContentSection>

      <Snackbar open={sent} autoHideDuration={3000} onClose={() => setSent(false)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <MuiAlert severity="success" variant="filled" sx={{ fontWeight: 700 }}>
          ✅ Your message has been sent!
        </MuiAlert>
      </Snackbar>
      <Snackbar open={error} autoHideDuration={3000} onClose={() => setError(false)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <MuiAlert severity="error" variant="filled" sx={{ fontWeight: 700 }}>
          ❌ Something went wrong. Please try again.
        </MuiAlert>
      </Snackbar>
    </>
  );
}
