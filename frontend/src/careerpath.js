// ------------------ Imports ------------------
import React, { useState, useEffect, useRef } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  Tooltip,
  TextField,
  Button,
  CircularProgress,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  AccountCircle,
  Chat,
  Settings,
  Logout,
  Timeline,
  Download,
  Email,
  Menu as MenuIcon,
} from "@mui/icons-material";
import jsPDF from "jspdf";
import { styled } from "@mui/material/styles";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  updatePassword,
} from "firebase/auth";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { useNavigate } from "react-router-dom";

// ------------------ Config ------------------
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const drawerWidth = 80;

// ------------------ Styles ------------------
const GlassCard = styled(Paper)(() => ({
  borderRadius: 20,
  background: "rgba(255, 255, 255, 0.7)",
  backdropFilter: "blur(12px)",
  boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
  padding: 20,
}));

const ChatWindow = styled(Paper)(() => ({
  borderRadius: 20,
  padding: 20,
  height: "70vh",
  display: "flex",
  flexDirection: "column",
  background: "rgba(255, 255, 255, 0.85)",
  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
}));

const ChatBubble = styled(Box)(({ from }) => ({
  maxWidth: "70%",
  padding: "12px 16px",
  borderRadius: 16,
  marginBottom: 12,
  alignSelf: from === "user" ? "flex-end" : "flex-start",
  background: from === "user" ? "#0a9396" : "#f1f5f9",
  color: from === "user" ? "#fff" : "#222",
  fontWeight: 500,
  lineHeight: 1.5,
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  whiteSpace: "pre-line",
  wordBreak: "break-word",
  cursor: "default",
}));

// ------------------ Roadmap Flow ------------------
function CareerFlow({ roadmap }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    if (!roadmap || roadmap.length === 0) return;

    const generatedNodes = roadmap.map((item, idx) => ({
      id: `node-${idx}`,
      data: {
        label: (
          <div style={{ padding: 10, textAlign: "center" }}>
            <strong>{item.step}</strong>
          </div>
        ),
      },
      position: { x: 250 * idx, y: 50 },
      style: {
        border: "2px solid #0a9396",
        borderRadius: 10,
        padding: 10,
        background: "#e0f7f7",
        minWidth: 180,
      },
    }));

    const generatedEdges = roadmap.slice(1).map((_, idx) => ({
      id: `edge-${idx}`,
      source: `node-${idx}`,
      target: `node-${idx + 1}`,
      animated: true,
      style: { stroke: "#0a9396" },
    }));

    setNodes(generatedNodes);
    setEdges(generatedEdges);
  }, [roadmap, setNodes, setEdges]);

  return (
    <div style={{ height: "70vh", width: "100%", borderRadius: 12 }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        nodesDraggable={false}
        nodesConnectable={false}
      >
        <MiniMap />
        <Controls />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </div>
  );
}

// ------------------ Main Dashboard ------------------
export default function UserDashboardPro() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [question, setQuestion] = useState("");
  const [roadmap, setRoadmap] = useState([]);
  const [chatHistory, setChatHistory] = useState([
    {
      from: "bot",
      text: "👋 Hi! What career interests do you have? You can also say 'not decided'.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [activePage, setActivePage] = useState("Chat");
  const bottomRef = useRef(null);
  const navigate = useNavigate();

  // Password change state
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  // Mobile drawer open state
  const [mobileOpen, setMobileOpen] = useState(false);

  // MUI theme and media query for responsiveness
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // ------------------ Auth ------------------
  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        navigate("/login");
      }
    });
    return () => unsub();
  }, [navigate]);

  // ------------------ Logout ------------------
  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      localStorage.clear();
      sessionStorage.clear();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // ------------------ Change Password ------------------
  const handleChangePassword = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      alert("⚠️ You need to be logged in.");
      return;
    }
    try {
      await updatePassword(user, newPassword);
      alert("✅ Password updated successfully!");
      setNewPassword("");
      setOpenPasswordDialog(false);
    } catch (error) {
      console.error("Error updating password:", error);
      if (error.code === "auth/requires-recent-login") {
        alert("⚠️ Please log out and log in again to change password.");
      } else {
        alert("⚠️ Failed to change password: " + error.message);
      }
    }
  };

  // ------------------ Auto-scroll ------------------
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  // ------------------ Chat Submit ------------------
  const handleSubmit = async () => {
    if (!question.trim()) return;
    setChatHistory((prev) => [...prev, { from: "user", text: question }]);
    setQuestion("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question }),
      });
      const data = await res.json();

      setChatHistory((prev) => [
        ...prev,
        { from: "bot", text: data.reply || "Sorry, I could not answer that." },
      ]);

      if (Array.isArray(data.roadmapUpdates)) {
        const steps = ["10th Class", ...data.roadmapUpdates];
        setRoadmap(
          steps.map((step) =>
            typeof step === "string" ? { step, completed: false } : step
          )
        );
      }
    } catch {
      setChatHistory((prev) => [
        ...prev,
        { from: "bot", text: "⚠️ Server error. Try again later." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // ------------------ Download PDF ------------------
  const handleDownload = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.text("CareerPath Chat & Roadmap", 10, 10);

    let y = 20;
    doc.setFont("helvetica", "normal");
    doc.text("Chat History:", 10, y);
    y += 10;
    chatHistory.forEach((msg) => {
      const prefix = msg.from === "user" ? "You: " : "Bot: ";
      doc.text(`${prefix}${msg.text}`, 10, y, { maxWidth: 180 });
      y += 10;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    y += 10;
    doc.text("Roadmap:", 10, y);
    y += 10;
    roadmap.forEach((stepObj, idx) => {
      doc.text(`${idx + 1}. ${stepObj.step}`, 10, y);
      y += 10;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save("careerpath.pdf");
  };

  // ------------------ Send Email ------------------
  const handleSendEmail = async () => {
    if (!userEmail) return alert("Please log in to send reports.");

    try {
      const res = await fetch(`${API_URL}/api/send-report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, chatHistory, roadmap }),
      });

      const data = await res.json();
      alert(data.message);
    } catch (err) {
      alert("⚠️ Server error while sending email.");
      console.error(err);
    }
  };

  // ------------------ Mobile Drawer Toggle ------------------
  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  // ------------------ Drawer Content ------------------
  const drawer = (
    <>
      <Toolbar />
      <List>
        {[
          { text: "Chat", icon: <Chat /> },
          { text: "Roadmap", icon: <Timeline /> },
        ].map((item, i) => (
          <Tooltip key={i} title={item.text} placement="right">
            <ListItem
              button
              onClick={() => {
                setActivePage(item.text);
                if (isMobile) setMobileOpen(false); // Close drawer on mobile after page select
              }}
              sx={{
                justifyContent: "center",
                py: 2,
                bgcolor:
                  activePage === item.text
                    ? "rgba(255,255,255,0.2)"
                    : "transparent",
                borderRadius: 2,
                mx: 1,
              }}
            >
              <ListItemIcon sx={{ color: "#fff", minWidth: "unset" }}>
                {item.icon}
              </ListItemIcon>
            </ListItem>
          </Tooltip>
        ))}
      </List>
    </>
  );

  // ------------------ UI ------------------
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f8fafc" }}>
      {/* Topbar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: 1201,
          background: "#fff",
          color: "#111",
          borderBottom: "1px solid #e5e7eb",
          ml: isMobile ? 0 : `${drawerWidth}px`,
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            CareerPath
          </Typography>
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            <Avatar sx={{ bgcolor: "#0a9396" }}>
              <AccountCircle />
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem disabled>{userEmail || "Guest User"}</MenuItem>
            <MenuItem
              onClick={() => {
                setOpenPasswordDialog(true);
                setAnchorEl(null);
              }}
            >
              <Settings fontSize="small" sx={{ mr: 1 }} /> Change Password
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <Logout fontSize="small" sx={{ mr: 1 }} /> Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Permanent drawer for md and up */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
              background: "#0a9396",
              color: "#fff",
              alignItems: "center",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      )}

      {/* Temporary drawer for mobile */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
              background: "#0a9396",
              color: "#fff",
              alignItems: "center",
            },
          }}
        >
          {drawer}
        </Drawer>
      )}

      {/* Main */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          ml: isMobile ? 0 : `${drawerWidth}px`,
          mt: 8,
        }}
      >
        {/* Page 1: Chat */}
        {activePage === "Chat" && (
          <Box
            sx={{
              display: "flex",
              gap: 3,
              flexDirection: { xs: "column", md: "row" },
            }}
          >
            <Box sx={{ flex: 2, display: "flex", flexDirection: "column" }}>
              <Typography variant="h5" fontWeight={700} mb={2}>
                Roadmap Generator
              </Typography>
              <ChatWindow>
                <Box sx={{ flex: 1, overflowY: "auto" }}>
                  {chatHistory.map((msg, i) => (
                    <ChatBubble key={i} from={msg.from}>
                      {msg.text}
                    </ChatBubble>
                  ))}
                  {loading && (
                    <Typography align="center" sx={{ mt: 2 }}>
                      <CircularProgress size={20} sx={{ mr: 1 }} /> Thinking...
                    </Typography>
                  )}
                  <div ref={bottomRef} />
                </Box>
                <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                  <TextField
                    placeholder="Type your question..."
                    fullWidth
                    multiline
                    maxRows={3}
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    disabled={loading}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 20, bgcolor: "#fff" } }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit();
                      }
                    }}
                  />
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: "#0a9396",
                      fontWeight: 600,
                      borderRadius: 20,
                      px: 3,
                      "&:hover": { bgcolor: "#005f73" },
                    }}
                    onClick={handleSubmit}
                    disabled={loading || !question.trim()}
                  >
                    Ask
                  </Button>
                </Box>
              </ChatWindow>
            </Box>
          </Box>
        )}

        {/* Page 2: Roadmap */}
        {activePage === "Roadmap" && (
          <Box>
            <Typography variant="h5" fontWeight={700} mb={2}>
              Career Roadmap
            </Typography>
            <CareerFlow roadmap={roadmap} />
            <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
              <Button
                variant="contained"
                startIcon={<Download />}
                sx={{ bgcolor: "#0a9396" }}
                onClick={handleDownload}
              >
                Download PDF
              </Button>
              <Button variant="outlined" startIcon={<Email />} onClick={handleSendEmail}>
                Send to Email
              </Button>
            </Box>
          </Box>
        )}
      </Box>

      {/* Change Password Dialog */}
      <Dialog open={openPasswordDialog} onClose={() => setOpenPasswordDialog(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            label="New Password"
            type="password"
            fullWidth
            margin="normal"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPasswordDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleChangePassword}>
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
