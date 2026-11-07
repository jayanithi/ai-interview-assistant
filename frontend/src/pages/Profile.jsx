import React, { useState } from "react";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Stack,
  Divider,
  Chip,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";

import {
  CameraAlt,
  Edit,
  Email,
  Person,
  WorkspacePremium,
  Verified,
} from "@mui/icons-material";

import Navbar from "../components/Navbar";

import axios from "axios";

const Profile = () => {
  // =========================
  // TOKEN
  // =========================
  const token = localStorage.getItem("access");

  // =========================
  // USER DATA
  // =========================
  const savedUser = JSON.parse(
    localStorage.getItem("user")
  );

  // =========================
  // STATES
  // =========================
  const [name, setName] = useState(
    savedUser?.name || ""
  );

  const [email, setEmail] = useState(
    savedUser?.email || ""
  );

  const [preview, setPreview] = useState(
    savedUser?.avatar || ""
  );

  const [open, setOpen] = useState(false);

  const [loading, setLoading] =
    useState(false);

  // =========================
  // IMAGE CHANGE
  // =========================
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    setPreview(imageUrl);
  };

  // =========================
  // SAVE PROFILE
  // =========================
  const handleSave = async () => {
    try {
      setLoading(true);

      const response = await axios.put(
        "http://127.0.0.1:8000/api/accounts/profile/",
        {
          name: name,
          email: email,
          avatar: preview,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);

      // SAVE UPDATED USER
      localStorage.setItem(
        "user",
        JSON.stringify(response.data)
      );

      // UPDATE UI
      setName(response.data.name);
      setEmail(response.data.email);
      setPreview(response.data.avatar);

      setOpen(true);
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.detail ||
          "Profile Update Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <Box
        sx={{
          minHeight: "100vh",
          background:
            "linear-gradient(to bottom right,#020617,#0f172a,#111827)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 4,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: "1100px",
            borderRadius: "35px",
            overflow: "hidden",
            background:
              "rgba(255,255,255,0.05)",
            backdropFilter: "blur(20px)",
            border:
              "1px solid rgba(255,255,255,0.08)",
            boxShadow:
              "0px 25px 80px rgba(0,0,0,0.45)",
          }}
        >
          <Stack
            direction={{
              xs: "column",
              md: "row",
            }}
          >
            {/* LEFT PROFILE */}
            <Box
              sx={{
                width: {
                  xs: "100%",
                  md: "38%",
                },
                background:
                  "linear-gradient(180deg,#1E3A8A,#2563EB,#1D4ED8)",
                p: 5,
                color: "white",
                position: "relative",
              }}
            >
              {/* GLOW */}
              <Box
                sx={{
                  position: "absolute",
                  width: 250,
                  height: 250,
                  borderRadius: "50%",
                  background:
                    "rgba(255,255,255,0.12)",
                  top: -80,
                  right: -80,
                }}
              />

              {/* PROFILE IMAGE */}
              <Box textAlign="center">
                <Box
                  sx={{
                    position: "relative",
                    width: "fit-content",
                    margin: "auto",
                  }}
                >
                  <Avatar
                    src={preview}
                    sx={{
                      width: 150,
                      height: 150,
                      margin: "auto",
                      border:
                        "5px solid rgba(255,255,255,0.25)",
                      boxShadow:
                        "0px 15px 40px rgba(0,0,0,0.35)",
                      fontSize: "55px",
                      fontWeight: "bold",
                    }}
                  >
                    {name?.charAt(0)}
                  </Avatar>

                  {/* CAMERA BUTTON */}
                  <IconButton
                    component="label"
                    sx={{
                      position: "absolute",
                      bottom: 5,
                      right: 5,
                      bgcolor: "white",
                      "&:hover": {
                        bgcolor: "#e2e8f0",
                      },
                    }}
                  >
                    <CameraAlt color="primary" />

                    <input
                      hidden
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </IconButton>
                </Box>

                {/* NAME */}
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  mt={3}
                >
                  {name}
                </Typography>

                {/* EMAIL */}
                <Typography
                  sx={{
                    opacity: 0.85,
                    mt: 1,
                  }}
                >
                  {email}
                </Typography>

                {/* BADGES */}
                <Stack
                  direction="row"
                  spacing={1}
                  justifyContent="center"
                  mt={3}
                  flexWrap="wrap"
                >
                  <Chip
                    icon={<Verified />}
                    label="Verified"
                    sx={{
                      bgcolor:
                        "rgba(255,255,255,0.18)",
                      color: "white",
                    }}
                  />

                  <Chip
                    icon={<WorkspacePremium />}
                    label="Premium"
                    sx={{
                      bgcolor:
                        "rgba(255,255,255,0.18)",
                      color: "white",
                    }}
                  />
                </Stack>
              </Box>

              {/* STATS */}
              <Box mt={6}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: "25px",
                    bgcolor:
                      "rgba(255,255,255,0.12)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <Typography
                    fontWeight="bold"
                    mb={2}
                  >
                    AI Interview Stats
                  </Typography>

                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="body2">
                        Interviews Completed
                      </Typography>

                      <Typography
                        variant="h5"
                        fontWeight="bold"
                      >
                        24
                      </Typography>
                    </Box>

                    <Divider
                      sx={{
                        borderColor:
                          "rgba(255,255,255,0.2)",
                      }}
                    />

                    <Box>
                      <Typography variant="body2">
                        Resume Score
                      </Typography>

                      <Typography
                        variant="h5"
                        fontWeight="bold"
                      >
                        92%
                      </Typography>
                    </Box>

                    <Divider
                      sx={{
                        borderColor:
                          "rgba(255,255,255,0.2)",
                      }}
                    />

                    <Box>
                      <Typography variant="body2">
                        AI Accuracy
                      </Typography>

                      <Typography
                        variant="h5"
                        fontWeight="bold"
                      >
                        95%
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Box>
            </Box>

            {/* RIGHT SETTINGS */}
            <Box
              sx={{
                flex: 1,
                p: {
                  xs: 4,
                  md: 6,
                },
              }}
            >
              {/* HEADER */}
              <Box mb={5}>
                <Typography
                  variant="h3"
                  fontWeight="bold"
                  sx={{
                    color: "white",
                  }}
                >
                  Profile Settings
                </Typography>

                <Typography
                  sx={{
                    color: "#94A3B8",
                    mt: 1,
                  }}
                >
                  Update your profile information.
                </Typography>
              </Box>

              {/* FORM */}
              <Stack spacing={4}>
                {/* NAME */}
                <Box>
                  <Typography
                    color="#CBD5E1"
                    mb={1}
                    fontWeight="bold"
                  >
                    Full Name
                  </Typography>

                  <TextField
                    fullWidth
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    placeholder="Enter your full name"
                    InputProps={{
                      startAdornment: (
                        <Person
                          sx={{
                            mr: 1,
                            color: "#94A3B8",
                          }}
                        />
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "18px",
                        background:
                          "rgba(255,255,255,0.04)",
                        color: "white",
                      },

                      "& fieldset": {
                        borderColor:
                          "rgba(255,255,255,0.08)",
                      },
                    }}
                  />
                </Box>

                {/* EMAIL */}
                <Box>
                  <Typography
                    color="#CBD5E1"
                    mb={1}
                    fontWeight="bold"
                  >
                    Email Address
                  </Typography>

                  <TextField
                    fullWidth
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="Enter your email"
                    InputProps={{
                      startAdornment: (
                        <Email
                          sx={{
                            mr: 1,
                            color: "#94A3B8",
                          }}
                        />
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "18px",
                        background:
                          "rgba(255,255,255,0.04)",
                        color: "white",
                      },

                      "& fieldset": {
                        borderColor:
                          "rgba(255,255,255,0.08)",
                      },
                    }}
                  />
                </Box>

                {/* ACCOUNT INFO */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    borderRadius: "25px",
                    background:
                      "rgba(255,255,255,0.03)",
                    border:
                      "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    color="white"
                    mb={3}
                  >
                    Account Information
                  </Typography>

                  <Stack spacing={3}>
                    <Box>
                      <Typography
                        color="#94A3B8"
                        variant="body2"
                      >
                        Account Type
                      </Typography>

                      <Typography
                        color="white"
                        fontWeight="bold"
                      >
                        Premium User
                      </Typography>
                    </Box>

                    <Divider
                      sx={{
                        borderColor:
                          "rgba(255,255,255,0.08)",
                      }}
                    />

                    <Box>
                      <Typography
                        color="#94A3B8"
                        variant="body2"
                      >
                        Member Since
                      </Typography>

                      <Typography
                        color="white"
                        fontWeight="bold"
                      >
                        July 2025
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>

                {/* SAVE BUTTON */}
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Edit />}
                  onClick={handleSave}
                  disabled={loading}
                  sx={{
                    py: 1.8,
                    borderRadius: "18px",
                    fontSize: "16px",
                    fontWeight: "bold",
                    textTransform: "none",
                    background:
                      "linear-gradient(135deg,#2563EB,#7C3AED)",
                    boxShadow:
                      "0px 15px 40px rgba(37,99,235,0.35)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg,#1D4ED8,#6D28D9)",
                    },
                  }}
                >
                  {loading
                    ? "Saving..."
                    : "Save Profile Changes"}
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Paper>

        {/* SUCCESS MESSAGE */}
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
            Profile Updated Successfully
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
};

export default Profile;