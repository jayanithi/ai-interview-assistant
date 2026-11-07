import React, { useEffect, useState } from "react";

import {
  Box,
  Paper,
  Typography,
  Stack,
  Switch,
  FormControlLabel,
  Divider,
  Avatar,
  Button,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from "@mui/material";

import {
  DarkMode,
  LightMode,
  Notifications,
  Security,
  Palette,
  Logout,
  LockReset,
} from "@mui/icons-material";

import axios from "axios";

import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";

import { useThemeCustom } from "../context/ThemeContext";

const Settings = () => {

  const navigate = useNavigate();

  const { mode, toggleTheme } =
    useThemeCustom();

  // ==========================================
  // STATES
  // ==========================================

  const [notifications, setNotifications] =
    useState(true);

  const [twoFactor, setTwoFactor] =
    useState(false);

  const [open, setOpen] =
    useState(false);

  const [passwordOpen, setPasswordOpen] =
    useState(false);

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const token =
    localStorage.getItem("access");

  // ==========================================
  // LOAD SETTINGS FROM BACKEND
  // ==========================================

  useEffect(() => {

    fetchSettings();

  }, []);

  const fetchSettings = async () => {

    try {

      const response = await axios.get(
        "http://127.0.0.1:8000/api/accounts/settings/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);

      setNotifications(
        response.data.notifications
      );

      setTwoFactor(
        response.data.two_factor
      );

    } catch (error) {

      console.log(error);

    }
  };

  // ==========================================
  // UPDATE SETTINGS
  // ==========================================

  const updateSettings = async (
    updatedNotifications,
    updatedTwoFactor
  ) => {

    try {

      await axios.put(
        "http://127.0.0.1:8000/api/accounts/settings/",
        {
          notifications:
            updatedNotifications,

          two_factor:
            updatedTwoFactor,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOpen(true);

    } catch (error) {

      console.log(error);

      alert("Settings Update Failed");
    }
  };

  // ==========================================
  // NOTIFICATIONS
  // ==========================================

  const handleNotifications = (e) => {

    const value = e.target.checked;

    setNotifications(value);

    updateSettings(value, twoFactor);
  };

  // ==========================================
  // TWO FACTOR
  // ==========================================

  const handleTwoFactor = (e) => {

    const value = e.target.checked;

    setTwoFactor(value);

    updateSettings(
      notifications,
      value
    );
  };

  // ==========================================
  // CHANGE PASSWORD
  // ==========================================

  const handlePasswordChange =
    async () => {

      if (
        !currentPassword ||
        !newPassword
      ) {

        alert("Fill all fields");

        return;
      }

      try {

        setLoading(true);

        const response =
          await axios.put(
            "http://127.0.0.1:8000/api/accounts/change-password/",
            {
              current_password:
                currentPassword,

              new_password:
                newPassword,
            },
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        console.log(response.data);

        alert(response.data.message);

        setPasswordOpen(false);

        setCurrentPassword("");

        setNewPassword("");

      } catch (error) {

        console.log(error);

        alert(
          error.response?.data?.message ||
          "Password Change Failed"
        );

      } finally {

        setLoading(false);
      }
    };

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {

    localStorage.removeItem("access");

    localStorage.removeItem("refresh");

    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <>
      <Navbar />

      <Box
        sx={{
          minHeight: "100vh",

          background:
            mode === "dark"
              ? "linear-gradient(to bottom right,#020617,#0f172a,#111827)"
              : "linear-gradient(to bottom right,#f8fafc,#e2e8f0,#ffffff)",

           px: {
      xs: 2,
      sm: 3,
      md: 4
    },
    py: {
      xs: 2,
      sm: 3,
      md: 5
    }
        }}
      >
        <Paper
          elevation={0}
          sx={{
            maxWidth: 950,
            width: "100%",
            margin: "auto",

            borderRadius: "35px",

            overflow: "hidden",

            background:
              mode === "dark"
                ? "rgba(255,255,255,0.05)"
                : "rgba(255,255,255,0.85)",

            backdropFilter: "blur(20px)",

            border:
              mode === "dark"
                ? "1px solid rgba(255,255,255,0.08)"
                : "1px solid rgba(0,0,0,0.08)",

            boxShadow:
              "0px 20px 60px rgba(0,0,0,0.25)",
          }}
        >
          {/* HEADER */}

          <Box
            sx={{
              p: 5,

              background:
                "linear-gradient(135deg,#2563EB,#7C3AED)",

              color: "white",
            }}
          >
            <Typography
              variant="h3"
              fontWeight="bold"
            >
              Settings
            </Typography>

            <Typography mt={1}>
              Manage your application
              preferences, security and
              personalization.
            </Typography>
          </Box>

          {/* CONTENT */}

          <Box p={5}>
            <Stack spacing={4}>

              {/* THEME */}

              <Paper
                elevation={0}
                sx={{
                  p: 4,

                  borderRadius: "25px",

                  background:
                    mode === "dark"
                      ? "rgba(255,255,255,0.03)"
                      : "#f8fafc",
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                  >
                    <Avatar
                      sx={{
                        bgcolor: "#2563EB",
                      }}
                    >
                      <Palette />
                    </Avatar>

                    <Box>
                      <Typography fontWeight="bold">
                        Appearance Theme
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Switch between dark and
                        light mode
                      </Typography>
                    </Box>
                  </Stack>

                  <FormControlLabel
                    control={
                      <Switch
                        checked={
                          mode === "dark"
                        }
                        onChange={
                          toggleTheme
                        }
                      />
                    }
                    label={
                      mode === "dark" ? (
                        <DarkMode />
                      ) : (
                        <LightMode />
                      )
                    }
                  />
                </Stack>
              </Paper>

              {/* NOTIFICATIONS */}

              <Paper
                elevation={0}
                sx={{
                  p: 4,

                  borderRadius: "25px",

                  background:
                    mode === "dark"
                      ? "rgba(255,255,255,0.03)"
                      : "#f8fafc",
                }}
              >
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                >
                  <Avatar
                    sx={{
                      bgcolor: "#7C3AED",
                    }}
                  >
                    <Notifications />
                  </Avatar>

                  <Box flex={1}>
                    <Typography fontWeight="bold">
                      Notifications
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Manage email alerts and
                      AI interview notifications
                    </Typography>
                  </Box>

                  <Switch
                    checked={notifications}
                    onChange={
                      handleNotifications
                    }
                  />
                </Stack>
              </Paper>

              {/* SECURITY */}

              <Paper
                elevation={0}
                sx={{
                  p: 4,

                  borderRadius: "25px",

                  background:
                    mode === "dark"
                      ? "rgba(255,255,255,0.03)"
                      : "#f8fafc",
                }}
              >
                <Stack spacing={3}>
                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                  >
                    <Avatar
                      sx={{
                        bgcolor: "#10B981",
                      }}
                    >
                      <Security />
                    </Avatar>

                    <Box flex={1}>
                      <Typography fontWeight="bold">
                        Security
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Protect your account and
                        login activity
                      </Typography>
                    </Box>

                    <Switch
                      checked={twoFactor}
                      onChange={
                        handleTwoFactor
                      }
                    />
                  </Stack>

                  <Divider />

                  <Button
                    variant="outlined"
                    startIcon={<LockReset />}
                    onClick={() =>
                      setPasswordOpen(true)
                    }
                    sx={{
                      borderRadius: "14px",
                      textTransform: "none",
                    }}
                  >
                    Change Password
                  </Button>
                </Stack>
              </Paper>

              {/* LOGOUT */}

              <Paper
                elevation={0}
                sx={{
                  p: 4,

                  borderRadius: "25px",

                  background:
                    mode === "dark"
                      ? "rgba(255,0,0,0.05)"
                      : "#fff1f2",

                  border:
                    "1px solid rgba(239,68,68,0.15)",
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Typography
                      fontWeight="bold"
                      color="error"
                    >
                      Logout Session
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Securely logout from your
                      account
                    </Typography>
                  </Box>

                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<Logout />}
                    onClick={handleLogout}
                    sx={{
                      borderRadius: "14px",
                      textTransform: "none",
                    }}
                  >
                    Logout
                  </Button>
                </Stack>
              </Paper>

            </Stack>
          </Box>
        </Paper>

        {/* SNACKBAR */}

        <Snackbar
          open={open}
          autoHideDuration={3000}
          onClose={() => setOpen(false)}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <Alert
            severity="success"
            variant="filled"
          >
            Settings Updated Successfully
          </Alert>
        </Snackbar>

        {/* PASSWORD DIALOG */}

        <Dialog
          open={passwordOpen}
          onClose={() =>
            setPasswordOpen(false)
          }
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>
            Change Password
          </DialogTitle>

          <DialogContent>
            <Stack spacing={3} mt={1}>

              <TextField
                label="Current Password"
                type="password"
                fullWidth
                value={currentPassword}
                onChange={(e) =>
                  setCurrentPassword(
                    e.target.value
                  )
                }
              />

              <TextField
                label="New Password"
                type="password"
                fullWidth
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(
                    e.target.value
                  )
                }
              />

            </Stack>
          </DialogContent>

          <DialogActions>

            <Button
              onClick={() =>
                setPasswordOpen(false)
              }
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              onClick={
                handlePasswordChange
              }
              disabled={loading}
            >
              {
                loading ? (
                  <CircularProgress
                    size={22}
                    sx={{
                      color: "white"
                    }}
                  />
                ) : (
                  "Update"
                )
              }
            </Button>

          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default Settings;