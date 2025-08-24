import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  TextField,
  IconButton,
  Typography,
  Avatar,
  CircularProgress,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import PersonIcon from "@mui/icons-material/Person";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function GeminiChat() {
  // ---- Palette ----
  const COLORS = {
    teal: "#0a9396",
    tealDark: "#086f70",
    userBubble: "#daf5f3",
    botBubble: "#ffffff",
    bg: "#ffffff",
    surface: "#f8fafc",
    botGradient: "linear-gradient(135deg, #ffd43b, #ffa94d)", // Gemini avatar gradient
  };

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const chatEndRef = useRef(null);

  const API_BASE =
    process.env.NODE_ENV === "production" ? "" : "http://localhost:5000";

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const text = input;
    setMessages((m) => [...m, { text, sender: "user" }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();

      if (data?.reply) {
        // Format basic markdown-like text into HTML manually
        const formatted = data.reply
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
          .replace(/\n/g, "<br/>");

        setMessages((m) => [...m, { text: formatted, sender: "bot" }]);
      } else {
        setMessages((m) => [
          ...m,
          { text: "No response from server", sender: "bot" },
        ]);
      }
    } catch (e) {
      setMessages((m) => [
        ...m,
        { text: "⚠️ Error contacting server", sender: "bot" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Collapsed → floating button
  if (collapsed) {
    return (
      <IconButton
        aria-label="Open chat"
        onClick={() => setCollapsed(false)}
        sx={{
          position: "fixed",
          right: 24,
          bottom: 24,
          bgcolor: COLORS.teal,
          color: "#fff",
          width: 64,
          height: 64,
          borderRadius: "50%",
          boxShadow: "0 10px 24px rgba(0,0,0,0.25)",
          "&:hover": { bgcolor: COLORS.tealDark },
          zIndex: 2147483647,
        }}
      >
        <ChatIcon fontSize="large" />
      </IconButton>
    );
  }

  return (
    <Box
      sx={{
        position: "fixed",
        right: 20,
        bottom: 20,
        zIndex: 2147483647,
        bgcolor: COLORS.bg,
        width: 380,
        height: 520,
        boxShadow: "0 12px 32px rgba(0,0,0,0.22)",
        borderRadius: 4,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        border: `1px solid ${COLORS.teal}22`,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: `linear-gradient(90deg, ${COLORS.tealDark}, ${COLORS.teal})`,
          color: "#fff",
          px: 2,
          py: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontWeight: 600,
          fontSize: 16,
        }}
      >
        <span>🌿 Gemini Career Chat</span>
        <IconButton
          size="small"
          sx={{ color: "#fff" }}
          onClick={() => setCollapsed(true)}
        >
          <ExpandMoreIcon />
        </IconButton>
      </Box>

      {/* Messages */}
      <Box
        sx={{
          p: 2,
          flexGrow: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          backgroundColor: COLORS.surface,
        }}
      >
        {messages.length === 0 && !loading && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: "center", mt: 2 }}
          >
            💬 Ask me anything about your career path!
          </Typography>
        )}

        {messages.map((msg, idx) => (
          <Box
            key={idx}
            sx={{
              display: "flex",
              alignItems: "flex-end",
              flexDirection: msg.sender === "user" ? "row-reverse" : "row",
              gap: 1,
            }}
          >
            <Avatar
              sx={{
                background:
                  msg.sender === "user" ? COLORS.tealDark : COLORS.botGradient,
                width: 34,
                height: 34,
                color: msg.sender === "user" ? "#fff" : "#000",
                fontWeight: "bold",
                fontSize: "0.9rem",
              }}
            >
              {msg.sender === "user" ? <PersonIcon /> : "G"}
            </Avatar>

            <Box
              sx={{
                bgcolor:
                  msg.sender === "user" ? COLORS.userBubble : COLORS.botBubble,
                borderRadius: 3,
                px: 2,
                py: 1.2,
                maxWidth: "75%",
                wordBreak: "break-word",
                boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
                fontSize: "0.9rem",
                lineHeight: 1.5,
              }}
              dangerouslySetInnerHTML={{ __html: msg.text }}
            />
          </Box>
        ))}

        {loading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: 1,
              mt: 1,
            }}
          >
            <Avatar
              sx={{
                background: COLORS.botGradient,
                width: 34,
                height: 34,
                color: "#000",
                fontWeight: "bold",
              }}
            >
              G
            </Avatar>
            <CircularProgress size={22} sx={{ color: COLORS.teal }} />
          </Box>
        )}
        <div ref={chatEndRef} />
      </Box>

      {/* Input */}
      <Box
        sx={{
          p: 1.5,
          display: "flex",
          alignItems: "center",
          gap: 1,
          borderTop: "1px solid #ddd",
          bgcolor: COLORS.bg,
        }}
      >
        <TextField
          placeholder="Type your question..."
          size="small"
          fullWidth
          multiline
          maxRows={3}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              "& fieldset": { borderColor: `${COLORS.teal}55` },
              "&:hover fieldset": { borderColor: COLORS.teal },
              "&.Mui-focused fieldset": { borderColor: COLORS.teal },
            },
          }}
        />
        <IconButton
          onClick={sendMessage}
          disabled={!input.trim() || loading}
          sx={{
            bgcolor: COLORS.teal,
            color: "#fff",
            "&:hover": { bgcolor: COLORS.tealDark },
          }}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
