import React, { useState, useEffect } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  IconButton,
  useMediaQuery,
  Divider,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Add,
  List as ListIcon,
  Menu as MenuIcon,
  AccountCircle,
  Logout,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const drawerWidth = 240;
  const [open, setOpen] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  useEffect(() => {
    // Check if the user is logged in by validating the presence of a token
    const token = sessionStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleLinkClick = () => {
    if (isMobile) {
      setOpen(false);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    sessionStorage.clear(); // Clear session storage
    setIsLoggedIn(false); // Update state to reflect logged-out status
    navigate("/"); // Redirect to login page
  };

  const SidebarButton = ({ to, text, icon }) => (
    <ListItem button component={Link} to={to} onClick={handleLinkClick} sx={{ mb: 1 }}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText
        primary={text}
        primaryTypographyProps={{ fontSize: "1.1rem" }}
      />
    </ListItem>
  );

  return (
    <Box sx={{ display: "flex" }}>
      {/* Mobile Menu Icon */}
      {isMobile && (
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{
            position: "absolute",
            top: 10,
            left: 10,
            zIndex: 1201,
          }}
          onClick={toggleDrawer}
        >
          <MenuIcon sx={{ fontSize: "2rem" }} />
        </IconButton>
      )}

      {/* Sidebar Drawer */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
            height: "100vh",
            transition: "width 0.3s ease",
          },
        }}
        variant={isMobile ? "temporary" : "permanent"}
        anchor="left"
        open={open}
        onClose={toggleDrawer}
      >
        <Toolbar />
        <Box
          sx={{
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            gap: 2,
          }}
        >
          {/* Section: Student Management */}
          <List dense>
            <SidebarButton
              to="/dashboard/add-student"
              text="Add Student"
              icon={<Add />}
            />
            <SidebarButton
              to="/dashboard/view-students"
              text="View Students"
              icon={<ListIcon />}
            />
            <SidebarButton
              to="/dashboard/mark-attendance"
              text="Mark Attendance"
              icon={<ListIcon />}
            />
             <SidebarButton
              to="/dashboard/set-selection"
              text="Set Selection to add students"
              icon={<ListIcon />}
            />
             <SidebarButton
              to="/dashboard/update-attendance"
              text="update student attendance"
              icon={<ListIcon />}
            />
          </List>
        </Box>

        {/* More Options Section */}
        <Divider />
        <Box sx={{ padding: "10px" }}>
          <Button
            fullWidth
            variant="contained"
            sx={{ backgroundColor: "#1976d2", color: "#fff" }}
            startIcon={<AccountCircle />}
            onClick={handleMenuOpen}
            aria-label="More Options"
          >
            More Options
          </Button>
          <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={handleMenuClose}>
            <MenuItem onClick={() => navigate("/profile")}>My Profile</MenuItem>
          </Menu>
        </Box>

        {/* Conditional Logout Button */}
        <Box sx={{ padding: "10px", marginTop: "auto" }}>
          {isLoggedIn && (
            <Button
              fullWidth
              variant="contained"
              color="error"
              startIcon={<Logout />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          )}
        </Box>

        {/* Conditional Login Button */}
        <Box sx={{ padding: "10px", marginTop: "10px" }}>
          {!isLoggedIn && (
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={() => navigate("/")}
            >
              Login
            </Button>
          )}
        </Box>
      </Drawer>
    </Box>
  );
};

export default Sidebar;
