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
        background: "#020817",
        px: 2,
        backdropFilter: "blur(20px)",
        borderBottom:
          "1px solid rgba(255,255,255,0.08)",
      }}
    >

      <Toolbar
        sx={{
          display: "flex",
          justifyContent:
            "space-between",
          minHeight: "80px",
        }}
      >

        {/* LOGO */}

        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{
            letterSpacing: 1,
            background:
              "linear-gradient(135deg,#60A5FA,#A855F7)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor:
              "transparent",
          }}
        >
          AI Interview Assistant
        </Typography>

        {/* NAVIGATION */}

        <Box
          display="flex"
          alignItems="center"
          gap={2}
        >

          <Button
            color="inherit"
            component={Link}
            to="/"
            startIcon={<Home />}
          >
            Home
          </Button>

          <Button
            color="inherit"
            component={Link}
            to="/dashboard"
            startIcon={<Dashboard />}
          >
            Dashboard
          </Button>

          <Button
            color="inherit"
            component={Link}
            to="/analytics"
            startIcon={<Analytics />}
          >
            Analytics
          </Button>

        </Box>

        {/* PROFILE */}

        <Box>

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
                      width: 48,
                      height: 48,
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
                  PaperProps={{
                    sx: {
                      width: 270,
                      borderRadius: "20px",
                      mt: 1.5,
                      background:
                        "rgba(15,23,42,0.95)",
                      color: "white",
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
                        color: "#94A3B8",
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