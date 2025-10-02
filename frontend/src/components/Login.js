import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { FcGoogle } from "react-icons/fc";
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../firebase";

// ------------------ API BASE ------------------
const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://csp-2-3.onrender.com"
    : "http://localhost:5000";

export default function AuthForm() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("user");
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: "" });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");

  const handleAdminLogin = () => {
    if (email === "csp" && password === "csp@123") {
      setAlert({ open: true, message: "✅ Admin Login Successful" });
      navigate("/admin-dashboard");
    } else {
      setAlert({ open: true, message: "❌ Invalid Admin Credentials" });
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);

      // Example backend integration after Google login
      await fetch(`${API_BASE}/api/auth/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: result.user.uid, email: result.user.email }),
      });

      setAlert({ open: true, message: `Welcome ${result.user.displayName}` });
      navigate("/career-path");
    } catch (error) {
      setAlert({ open: true, message: `Google Auth Failed: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!displayName.trim() || !email.trim() || !password) {
      setAlert({ open: true, message: "Please fill all fields" });
      return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName });

      // Example backend call after registration
      await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: userCredential.user.uid,
          email,
          displayName,
        }),
      });

      setAlert({ open: true, message: `Welcome ${displayName}` });
      navigate("/career-path");
    } catch (error) {
      setAlert({ open: true, message: `Registration failed: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleUserLogin = async () => {
    if (!email.trim() || !password) {
      setAlert({ open: true, message: "Please enter email and password" });
      return;
    }
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // Example backend call after user login
      await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: userCredential.user.uid, email }),
      });

      setAlert({ open: true, message: "Login Successful" });
      navigate("/career-path");
    } catch (error) {
      setAlert({ open: true, message: `Login failed: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
        bgcolor: "#ffffff",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          width: { xs: "100%", md: 700 },
          minHeight: 480,
          borderRadius: 16,
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
          overflow: "hidden",
        }}
      >
        {/* Left: Form */}
        <Box
          sx={{
            flex: 1,
            p: { xs: 3, md: 5 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography variant="h4" fontWeight="bold" mb={3} color="#0a9396">
            {mode === "admin" ? "Admin Login" : isRegister ? "Register" : "User Login"}
          </Typography>

          <ToggleButtonGroup
            value={mode}
            exclusive
            onChange={(e, val) => val && setMode(val)}
            sx={{
              mb: 3,
              "& .MuiToggleButton-root": { color: "#0a9396", borderColor: "#0a9396" },
              "& .Mui-selected": { backgroundColor: "#0a9396", color: "#fff" },
            }}
          >
            <ToggleButton value="user">User</ToggleButton>
            <ToggleButton value="admin">Admin</ToggleButton>
          </ToggleButtonGroup>

          {mode === "user" && isRegister && (
            <TextField
              label="Display Name"
              fullWidth
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              margin="normal"
            />
          )}

          <TextField
            label={mode === "admin" ? "Admin Username" : "Email"}
            type={mode === "admin" ? "text" : "email"}
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
          />

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, py: 1.5, backgroundColor: "#0a9396", "&:hover": { backgroundColor: "#056969" } }}
            onClick={mode === "admin" ? handleAdminLogin : isRegister ? handleRegister : handleUserLogin}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "#fff" }} />
            ) : mode === "admin" ? (
              "Login as Admin"
            ) : isRegister ? (
              "Create Account"
            ) : (
              "Login"
            )}
          </Button>

          {mode === "user" && (
            <Button
              fullWidth
              startIcon={<FcGoogle />}
              variant="outlined"
              sx={{
                mt: 2,
                py: 1.5,
                color: "#0a9396",
                borderColor: "#0a9396",
                "&:hover": { borderColor: "#056969" },
              }}
              onClick={handleGoogleAuth}
              disabled={loading}
            >
              {loading ? <CircularProgress size={22} /> : "Continue with Google"}
            </Button>
          )}

          {mode === "user" && (
            <Typography align="center" sx={{ mt: 3 }}>
              {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
              <Button variant="text" onClick={() => setIsRegister(!isRegister)}>
                {isRegister ? "Login" : "Register"}
              </Button>
            </Typography>
          )}

          <Snackbar open={alert.open} autoHideDuration={4000} onClose={() => setAlert({ ...alert, open: false })} message={alert.message} />
        </Box>

        {/* Right Panel */}
        <Box
          sx={{
            width: { xs: "100%", md: 250 },
            bgcolor: "#0a9396",
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            p: 4,
            color: "#fff",
          }}
        >
          <Typography variant="h5" fontWeight="bold" mb={2} textAlign="center">
            Welcome Back!
          </Typography>
          <Typography variant="body2" textAlign="center">
            {mode === "admin"
              ? "Secure admin access to manage your dashboard."
              : "Login or register to continue your journey."}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}