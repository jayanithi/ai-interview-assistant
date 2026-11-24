import React, {
  useEffect,
  useState,
} from "react";

import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  IconButton,
  Button,
  CircularProgress,
} from "@mui/material";

import {
  Home,
  Dashboard,
  Analytics,
  Person,
  Settings,
  Logout,
} from "@mui/icons-material";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import axios from "axios";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {

  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] =
    useState(null);

  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const open = Boolean(anchorEl);

  // =====================================
  // FETCH PROFILE
  // =====================================

  useEffect(() => {

    fetchProfile();

  }, []);

  const fetchProfile = async () => {

    try {

      const token =
        localStorage.getItem("access");

      if (!token) {

        navigate("/login");

        return;
      }

      const response = await axios.get(

        "http://127.0.0.1:8000/api/accounts/profile/",

        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      setUser(response.data);

      setLoading(false);

    } catch (error) {

      console.log(error);

      localStorage.clear();

      navigate("/login");

      setLoading(false);
    }
  };

  // =====================================
  // MENU OPEN
  // =====================================

  const handleOpen = (event) => {

    setAnchorEl(event.currentTarget);

  };

  // =====================================
  // MENU CLOSE
  // =====================================

  const handleClose = () => {

    setAnchorEl(null);

  };

  // =====================================
  // LOGOUT
  // =====================================

  const handleLogout = () => {

    localStorage.removeItem("access");

    localStorage.removeItem("refresh");

    localStorage.removeItem("user");

    navigate("/login");
  };

  return (

    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "background.paper",
        color: "text.primary",
        px: { xs: 1, sm: 2 },
        borderBottom: 1,
        borderColor: "divider",
      }}
    >

      <Toolbar
        sx={{
          display: "flex",
          justifyContent:
            "space-between",
          minHeight: { xs: 64, sm: 80 },
          gap: { xs: 0.5, sm: 2 },
          px: { xs: 0, sm: 2 },
        }}
      >

        {/* LOGO */}

        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{
            letterSpacing: 1,
            fontSize: { xs: "1rem", sm: "1.5rem", md: "2.125rem" },
            whiteSpace: "nowrap",
            flexShrink: 0,
            background:
              "linear-gradient(135deg,#60A5FA,#A855F7)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor:
              "transparent",
          }}
        >
          AI Interview
          <Box component="span" sx={{ display: { xs: "none", lg: "inline" } }}>
            {" "}Assistant
          </Box>
        </Typography>

        {/* NAVIGATION */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 0, lg: 2 },
            flexShrink: 0,
          }}
        >

          <Button
            color="inherit"
            component={Link}
            to="/"
            startIcon={<Home />}
            aria-label="Home"
            sx={{ minWidth: { xs: 36, lg: 64 }, px: { xs: 0.5, lg: 1.5 } }}
          >
            <Box component="span" sx={{ display: { xs: "none", lg: "inline" } }}>Home</Box>
          </Button>

          <Button
            color="inherit"
            component={Link}
            to="/dashboard"
            startIcon={<Dashboard />}
            aria-label="Dashboard"
            sx={{ minWidth: { xs: 36, lg: 64 }, px: { xs: 0.5, lg: 1.5 } }}
          >
            <Box component="span" sx={{ display: { xs: "none", lg: "inline" } }}>Dashboard</Box>
          </Button>

          <Button
            color="inherit"
            component={Link}
            to="/analytics"
            startIcon={<Analytics />}
            aria-label="Analytics"
            sx={{ minWidth: { xs: 36, lg: 64 }, px: { xs: 0.5, lg: 1.5 } }}
          >
            <Box component="span" sx={{ display: { xs: "none", lg: "inline" } }}>Analytics</Box>
          </Button>

        </Box>

        {/* PROFILE */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 0.5, sm: 1 },
            flexShrink: 0,
          }}
        >
          <ThemeToggle />

          {

            loading ? (

              <CircularProgress
                color="inherit"
                size={28}
              />

            ) : (

              <>

                <IconButton
                  onClick={handleOpen}
                >

                  <Avatar
                    src={user?.avatar}
                    sx={{
                      width: { xs: 36, sm: 48 },
                      height: { xs: 36, sm: 48 },
                      fontWeight: "bold",
                      background:
                        "linear-gradient(135deg,#2563EB,#7C3AED)",
                    }}
                  >
                    {
                      user?.name?.charAt(0)
                    }
                  </Avatar>

                </IconButton>

                {/* MENU */}

                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  slotProps={{
                    paper: {
                      sx: {
                      width: { xs: "min(270px, calc(100vw - 32px))", sm: 270 },
                      borderRadius: "20px",
                      mt: 1.5,
                      backgroundColor: "background.paper",
                      color: "text.primary",
                      },
                    },
                  }}
                >

                  {/* USER INFO */}

                  <Box px={3} py={2}>

                    <Typography
                      fontWeight="bold"
                    >
                      {user?.name}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        overflowWrap: "anywhere",
                      }}
                    >
                      {user?.email}
                    </Typography>

                  </Box>

                  <Divider />

                  {/* PROFILE */}

                  <MenuItem
                    onClick={() => {

                      navigate("/profile");

                      handleClose();
                    }}
                  >
                    <Person />
                    <Box ml={1}>
                      Profile
                    </Box>
                  </MenuItem>

                  {/* SETTINGS */}

                  <MenuItem
                    onClick={() => {

                      navigate("/settings");

                      handleClose();
                    }}
                  >
                    <Settings />
                    <Box ml={1}>
                      Settings
                    </Box>
                  </MenuItem>

                  <Divider />

                  {/* LOGOUT */}

                  <MenuItem
                    onClick={handleLogout}
                    sx={{
                      color: "#F87171",
                    }}
                  >
                    <Logout />
                    <Box ml={1}>
                      Logout
                    </Box>
                  </MenuItem>

                </Menu>

              </>

            )
          }

        </Box>

      </Toolbar>

    </AppBar>
  );
};

export default Navbar;