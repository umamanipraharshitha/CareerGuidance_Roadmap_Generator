import React from "react";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

// Container for the cards in a responsive grid
const Container = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: theme.spacing(4),
  maxWidth: 1200,
  margin: "0 auto",
  padding: theme.spacing(4, 2),
  fontFamily: "'Poppins', sans-serif",
}));

// Individual card styling
const TopicCard = styled(Box)(({ theme }) => ({
  backgroundColor: "#f9fafb",
  borderRadius: 16,
  boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  padding: theme.spacing(3),
  cursor: "default",
  transition: "transform 0.25s ease",
  "&:hover": {
    transform: "translateY(-6px)",
    boxShadow: "0 12px 28px rgba(0,0,0,0.2)",
  },
}));

// Image at the top of each card
const CardImage = styled("img")({
  width: "100%",
  height: 180,
  objectFit: "cover",
  borderRadius: "12px",
  marginBottom: 12,
});

// Bottom description text
const Description = styled(Typography)({
  fontSize: "1rem",
  fontWeight: 500,
  color: "#004d40",
});

// Title text
const Title = styled(Typography)({
  fontWeight: 700,
  fontSize: "1.2rem",
  marginBottom: 8,
  color: "#0a9396",
});

const SessionTopicsCards = () => {
  const topics = [
    {
      title: "How to Choose a Goal",
      imgSrc: "/images/goal-setting.png",
      alt: "Goal Setting",
      description:
        "Learn how to select meaningful and achievable goals for your career journey.",
    },
    {
      title: "Role of Interest in Goal Setting",
      imgSrc: "/images/interest.png",
      alt: "Role of Interest",
      description:
        "Understand how your passions and interests can shape your goals and future path.",
    },
    {
      title: "Career Paths Available",
      imgSrc: "/images/career-paths.png",
      alt: "Career Paths",
      description:
        "Discover the many career opportunities out there and find the one that fits you best.",
    },
    {
      title: "Involvement of Technology in Various Careers",
      imgSrc: "/images/technology-career.png",
      alt: "Technology in Careers",
      description:
        "Explore how technology is revolutionizing different industries and roles.",
    },
    // ✅ NEW CARDS ADDED
    {
      title: "Interactive Session",
      imgSrc: "/images/interactive-session.png",
      alt: "Interactive Session",
      description:
        "Participate in live, engaging sessions where you can ask questions, share ideas, and learn collaboratively.",
    },
    {
      title: "Personal Guidance",
      imgSrc: "/images/personal-guidance.png",
      alt: "Personal Guidance",
      description:
        "Receive one-on-one mentorship and tailored advice to confidently pursue your career path.",
    },
  ];

  return (
    <Container>
      {topics.map(({ title, imgSrc, alt, description }, index) => (
        <TopicCard key={index}>
          <CardImage src={imgSrc} alt={alt} />
          <Title>{title}</Title>
          <Description>{description}</Description>
        </TopicCard>
      ))}
    </Container>
  );
};

export default SessionTopicsCards;
