import React from "react";
import { Box, Typography } from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";

// Subtle fade-in
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(12px);}
  to { opacity: 1; transform: translateY(0);}
`;

const Section = styled(Box)(({ theme }) => ({
  maxWidth: 900,
  margin: "0 auto",
  padding: theme.spacing(8, 3),
  textAlign: "center",
  animation: `${fadeUp} 0.8s ease forwards`,
}));

const Heading = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  fontSize: "2.4rem",
  color: "#005f73",
  marginBottom: theme.spacing(2),
  "&::after": {
    content: '""',
    display: "block",
    width: 70,
    height: 4,
    backgroundColor: "#0a9396",
    margin: "12px auto 0",
    borderRadius: 3,
  },
}));

const Paragraph = styled(Typography)(({ theme }) => ({
  fontSize: "1.1rem",
  lineHeight: 1.7,
  color: "#004c4c",
  marginTop: theme.spacing(3),
}));

export default function AboutProject() {
  return (
    <Section>
      <Heading>About Our Project</Heading>
      <Paragraph>
        Our mission is simple: guide students in choosing the right educational path after 10th grade, helping them align their strengths with future career opportunities.
      </Paragraph>
      <Paragraph>
        By visiting schools and conducting interactive sessions, we provide clarity on streams, career options, and the skills needed to succeed.
      </Paragraph>
      <Paragraph>
        We aim to empower students to make informed decisions, build confidence, and pursue their passions—shaping brighter futures, one student at a time.
      </Paragraph>
    </Section>
  );
}
