// src/components/NavBar.js
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate, useLocation } from "react-router-dom";

const StyledAppBar = styled(AppBar)(() => ({
  backgroundColor: "transparent",
  boxShadow: "none",
  position: "absolute",
  top: 0,
  color: "#fff",
}));

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navButtons = [
    { label: "About", to: "/about" },
    { label: "Services", to: "/services" },
    { label: "Contact", to: "/contact" },
  ];

  return (
    <StyledAppBar>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Logo / Title */}
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", letterSpacing: "0.1em", cursor: "pointer" }}
          aria-label="Go to Home"
          onClick={() => navigate("/about")}
        >
          Community Service
        </Typography>

        {/* Desktop Menu (md and up) */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 6 }}>
          {navButtons.map(({ label, to }) => (
            <Button
              key={label}
              onClick={() => navigate(to)}
              sx={{
                color: "#fff",
                textTransform: "none",
                fontWeight: "bold",
                borderBottom:
                  location.pathname === to
                    ? "2px solid #ee9b00"
                    : "2px solid transparent",
              }}
            >
              {label}
            </Button>
          ))}
        </Box>

        {/* Mobile Hamburger (xs, sm) */}
        <IconButton
          sx={{ display: { xs: "flex", md: "none" } }}
          color="inherit"
          aria-label="menu"
          onClick={() => setDrawerOpen(true)}
        >
          <MenuIcon />
        </IconButton>

        {/* Drawer for small devices */}
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          <List sx={{ width: 250 }}>
            {navButtons.map(({ label, to }) => (
              <ListItem
                button
                key={label}
                onClick={() => {
                  navigate(to);
                  setDrawerOpen(false);
                }}
              >
                <ListItemText
                  primary={label}
                  sx={{
                    color: location.pathname === to ? "#ee9b00" : "#000",
                    fontWeight: "bold",
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Drawer>
      </Toolbar>
    </StyledAppBar>
  );
}
