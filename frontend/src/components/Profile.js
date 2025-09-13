import React from "react";
import { Box, Typography, Button } from "@mui/material";

export default function Profile({ userEmail, chatHistory }) {
  // Generate plain text transcript from chat history
  const generateExportText = () => {
    if (!chatHistory || chatHistory.length === 0) return "No chat history available.\n";

    return chatHistory
      .map(({ from, text }) => {
        const speaker = from === "user" ? "You" : "AI";
        // Strip HTML tags if any
        const cleanText = text.replace(/<\/?[^>]+(>|$)/g, "");
        return `${speaker}:\n${cleanText}\n`;
      })
      .join("\n---\n");
  };

  // Send chat transcript by email via backend API
  const handleExport = async () => {
    if (!userEmail) {
      alert("User email not available. Please log in.");
      return;
    }

    const text = generateExportText();
    try {
      const response = await fetch("/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userEmail.split("@")[0] || "User",
          email: userEmail,
          message: `Your career chat transcript:\n\n${text}`,
        }),
      });

      if (response.ok) {
        alert("Chat transcript emailed successfully!");
      } else {
        alert("Failed to send email. Please try again later.");
      }
    } catch (err) {
      alert(`Error sending email: ${err.message}`);
    }
  };

  return (
    <Box sx={{ maxWidth: 480, mx: "auto", my: 4, p: 3, border: "1px solid #ddd", borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        User Profile
      </Typography>
      <Typography variant="body1" gutterBottom>
        Logged in as: <strong>{userEmail || "Not logged in"}</strong>
      </Typography>

      <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
        Your Career Chat History
      </Typography>

      {chatHistory && chatHistory.length > 0 ? (
        <Box
          sx={{
            maxHeight: 300,
            overflowY: "auto",
            border: "1px solid #ccc",
            borderRadius: 1,
            p: 1,
            bgcolor: "#fafafa",
            fontSize: "0.9rem",
            whiteSpace: "pre-wrap",
            fontFamily: "monospace",
          }}
        >
          {chatHistory
            .map(({ from, text }) => {
              const speaker = from === "user" ? "You" : "AI";
              const cleanText = text.replace(/<\/?[^>]+(>|$)/g, "");
              return `${speaker}: ${cleanText}`;
            })
            .join("\n\n")}
        </Box>
      ) : (
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          No chat history available.
        </Typography>
      )}

      <Button
        variant="outlined"
        sx={{ mt: 3 }}
        onClick={handleExport}
        disabled={!chatHistory || chatHistory.length === 0 || !userEmail}
      >
        Export Chat History by Email
      </Button>
    </Box>
  );
}
