// AdminDashboardPro.jsx
import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  Tooltip,
  Box,
  Paper,
  TextField,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputAdornment,
  Stack,
} from "@mui/material";
import {
  People as PeopleIcon,
  BarChart as BarChartIcon,
  Mail as MailIcon,
  Search as SearchIcon,
  Menu as MenuIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler,
} from "chart.js";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Title, ChartTooltip, Legend, Filler);

const drawerWidth = 80;
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const GlassCard = styled(Paper)(() => ({
  borderRadius: 16,
  background: "rgba(255,255,255,0.75)",
  backdropFilter: "blur(8px)",
  padding: 16,
  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
}));

export default function AdminDashboardPro() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activePage, setActivePage] = useState("Users");
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("user");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [stats, setStats] = useState({ registrations: [], totalUsers: 0 });
  const [loadingStats, setLoadingStats] = useState(false);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  useEffect(() => {
    if (activePage === "Users") fetchUsers();
    else if (activePage === "Statistics") fetchStats();
  }, [activePage]);

  // ===== FETCH USERS =====
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/users`);
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(Array.isArray(data.users) ? data.users : []);
    } catch (err) {
      console.error(err);
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  // ===== FETCH STATS (FIXED) =====
  const fetchStats = async () => {
  setLoadingStats(true);
  try {
    const res = await fetch(`${API_URL}/api/admin/stats`);
    if (!res.ok) throw new Error("Failed to fetch stats");
    const data = await res.json();
    console.log("Stats API response:", data); // 👈 you'll see { totalUsers, registrations }

    const monthly = Array.from({ length: 12 }, (_, i) => {
      const monthIndex = i; // 0 = Jan
      const count =
        data.registrations
          ?.filter((d) => {
            const date = new Date(d.date);
            return date.getMonth() === monthIndex;
          })
          .reduce((a, c) => a + c.count, 0) || 0;

      return { month: monthIndex + 1, count };
    });

    setStats({
      registrations: monthly,
      totalUsers: data.totalUsers || 0,
    });
  } catch (err) {
    console.error(err);
    setStats({ registrations: [], totalUsers: 0 });
  } finally {
    setLoadingStats(false);
  }
};


  // ===== SEARCH FILTER =====
  const filteredUsers = users.filter((u) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    switch (searchType) {
      case "user":
        return (u.displayName || "").toLowerCase().includes(q);
      case "email":
        return (u.email || "").toLowerCase().includes(q);
      case "uid":
        return (u.uid || "").toLowerCase().includes(q);
      default:
        return true;
    }
  });

  // ===== SEND NOTIFICATION =====
  const handleSendNotification = async () => {
    if (!subject.trim() || !message.trim()) return alert("Please fill subject and message");
    setSending(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/send-notification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || "Notification sent successfully");
        setSubject("");
        setMessage("");
      } else alert(data.message || "Failed to send notification");
    } catch (err) {
      console.error(err);
      alert("Server error while sending notifications");
    } finally {
      setSending(false);
    }
  };

  // ===== RESET DATABASE =====
  const handleResetDatabase = async () => {
    if (!window.confirm("⚠️ Are you sure? This will permanently delete ALL data!")) return;
    try {
      const res = await fetch(`${API_URL}/api/admin/reset-database`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || "Database reset successfully");
        fetchUsers();
        fetchStats();
      } else alert(data.message || "Failed to reset database");
    } catch (err) {
      console.error(err);
      alert("Server error while resetting database");
    }
  };

  // ===== LOGOUT =====
  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  // ===== USERS PAGE =====
  const UsersPage = () => (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={2}>
        Users
      </Typography>
      <GlassCard>
        <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={2} mb={2} flexWrap="wrap">
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <TextField
              select
              size="small"
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              sx={{ width: 120 }}
              SelectProps={{ native: true }}
            >
              <option value="user">User</option>
              <option value="email">Email</option>
              <option value="uid">UID</option>
            </TextField>
            <TextField
              placeholder={`Search by ${searchType}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 180, flex: 1 }}
            />
          </Stack>
          <Box>
            <Button
              variant="contained"
              sx={{ mr: 1, mt: { xs: 1, md: 0 } }}
              startIcon={<MailIcon />}
              onClick={() => setActivePage("Notifications")}
            >
              Send Notification
            </Button>
            <Button variant="outlined" sx={{ mt: { xs: 1, md: 0 } }} onClick={fetchUsers}>
              Refresh
            </Button>
          </Box>
        </Stack>

        {/* Responsive Users Table */}
        <Box sx={{ overflowX: "auto" }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>UID</TableCell>
                  <TableCell>Joined Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loadingUsers ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <CircularProgress size={20} />
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((u) => (
                    <TableRow key={u.uid} hover>
                      <TableCell>{u.displayName || "—"}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>{u.uid}</TableCell>
                      <TableCell>{new Date(u.creationTime).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </GlassCard>
    </Box>
  );

  // ===== STATISTICS PAGE =====
  const StatisticsPage = () => {
    const chartData = {
      labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
      datasets: [
        {
          label: "Registrations",
          data: stats.registrations.map((r) => r.count),
          fill: true,
          borderColor: "#0a9396",
          backgroundColor: "rgba(10, 147, 150, 0.1)",
          tension: 0.3,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { mode: "index", intersect: false } },
      scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
    };
    return (
      <Box>
        <Typography variant="h5" fontWeight={700} mb={2}>Statistics</Typography>
        <GlassCard>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="center" mb={2}>
            <Box sx={{ minWidth: 200 }}>
              <Typography variant="h6">Total Users</Typography>
              <Typography variant="h4" fontWeight={800}>{stats.totalUsers}</Typography>
            </Box>
            <Box sx={{ flex: 1, height: 300 }}>
              {loadingStats ? (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Line data={chartData} options={chartOptions} />
              )}
            </Box>
          </Stack>
          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
            <Button variant="contained" color="error" onClick={handleResetDatabase}>Reset Database</Button>
          </Box>
        </GlassCard>
      </Box>
    );
  };

  // ===== NOTIFICATIONS PAGE =====
  const NotificationsPage = () => (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={2}>Send Notifications</Typography>
      <GlassCard>
        <Stack spacing={2}>
          <TextField label="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} fullWidth />
          <TextField label="Message" value={message} onChange={(e) => setMessage(e.target.value)} fullWidth multiline rows={4} />
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button variant="contained" onClick={handleSendNotification} disabled={sending}>
              {sending ? "Sending..." : "Send to All Users"}
            </Button>
          </Box>
        </Stack>
      </GlassCard>
    </Box>
  );

  // ===== DRAWER ITEMS =====
  const drawerItems = [
    { text: "Users", icon: <PeopleIcon /> },
    { text: "Statistics", icon: <BarChartIcon /> },
    { text: "Notifications", icon: <MailIcon /> },
  ];

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f8fafc" }}>
      <AppBar position="fixed" elevation={0} sx={{ zIndex: 1201, background: "#fff", color: "#111", borderBottom: "1px solid #e5e7eb" }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { md: "none" } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>Admin Dashboard</Typography>
          <IconButton onClick={handleLogout}><LogoutIcon /></IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: "block", md: "none" }, "& .MuiDrawer-paper": { width: drawerWidth, bgcolor: "#0a9396", color: "#fff" } }}
      >
        <List>
          {drawerItems.map((item) => (
            <Tooltip key={item.text} title={item.text} placement="right">
              <ListItem button onClick={() => { setActivePage(item.text); setMobileOpen(false); }} sx={{ justifyContent: "center", py: 2 }}>
                <ListItemIcon sx={{ color: "#fff", minWidth: "unset" }}>{item.icon}</ListItemIcon>
              </ListItem>
            </Tooltip>
          ))}
        </List>
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{ display: { xs: "none", md: "block" }, width: drawerWidth, flexShrink: 0, "& .MuiDrawer-paper": { width: drawerWidth, bgcolor: "#0a9396", color: "#fff", alignItems: "center" } }}
      >
        <Toolbar />
        <List>
          {drawerItems.map((item) => (
            <Tooltip key={item.text} title={item.text} placement="right">
              <ListItem button onClick={() => setActivePage(item.text)} sx={{ justifyContent: "center", py: 2, bgcolor: activePage === item.text ? "rgba(255,255,255,0.2)" : "transparent", borderRadius: 2, mx: 1 }}>
                <ListItemIcon sx={{ color: "#fff", minWidth: "unset" }}>{item.icon}</ListItemIcon>
              </ListItem>
            </Tooltip>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 4, ml: { md: `${drawerWidth}px` }, mt: 8 }}>
        {activePage === "Users" && <UsersPage />}
        {activePage === "Statistics" && <StatisticsPage />}
        {activePage === "Notifications" && <NotificationsPage />}
      </Box>
    </Box>
  );
}
