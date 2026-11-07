import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  LinearProgress,
} from "@mui/material";

import {
  TrendingUp,
  Assignment,
  UploadFile,
  PlayArrow,
} from "@mui/icons-material";

import axios from "axios";
import Navbar from "../components/Navbar";
import ResumeUpload from "../components/Resume";

function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    total_interviews: 0,
    average_score: 0,
    recent_interviews: [],
  });

  const [loading, setLoading] = useState(true);

  // ==============================
  // FETCH DASHBOARD DATA
  // ==============================
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
       const token = localStorage.getItem("access");

        const response = await axios.get(
          "http://127.0.0.1:8000/api/interview/dashboard/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(response.data);

        setDashboardData(response.data);
      } catch (error) {
        console.log("Dashboard Error:", error);

        // fallback dummy data
        setDashboardData({
          total_interviews: 12,
          average_score: 86,
          recent_interviews: [
            {
              role: "Frontend Developer",
              score: 84,
            },
            {
              role: "React Developer",
              score: 91,
            },
          ],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <>
      <Navbar />

      <Box
        sx={{
          minHeight: "100vh",
          background:
            "linear-gradient(to right, #020617, #0f172a, #1e293b)",
          color: "white",
          py: 5,
        }}
      >
        <Container maxWidth="lg">
          {/* ================= HEADER ================= */}

          <Box mb={5}>
            <Typography
              variant="h3"
              fontWeight="bold"
              gutterBottom
            >
              Analytics Dashboard
            </Typography>

            <Typography
              variant="h6"
              sx={{ color: "#cbd5e1" }}
            >
              Track your interview performance with AI-powered
              insights.
            </Typography>
          </Box>

          {/* ================= STATS CARDS ================= */}

          <Grid container spacing={4}>
            {/* TOTAL INTERVIEWS */}

            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  background: "#1e293b",
                  borderRadius: "20px",
                  color: "white",
                  boxShadow: "0px 0px 20px rgba(99,102,241,0.3)",
                }}
              >
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box>
                      <Typography variant="h6">
                        Total Interviews
                      </Typography>

                      <Typography
                        variant="h3"
                        fontWeight="bold"
                      >
                        {dashboardData.total_interviews}
                      </Typography>
                    </Box>

                    <Assignment
                      sx={{
                        fontSize: 50,
                        color: "#818cf8",
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* AVERAGE SCORE */}

            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  background: "#1e293b",
                  borderRadius: "20px",
                  color: "white",
                  boxShadow: "0px 0px 20px rgba(168,85,247,0.3)",
                }}
              >
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box>
                      <Typography variant="h6">
                        Average Score
                      </Typography>

                      <Typography
                        variant="h3"
                        fontWeight="bold"
                      >
                        {dashboardData.average_score}%
                      </Typography>
                    </Box>

                    <TrendingUp
                      sx={{
                        fontSize: 50,
                        color: "#a855f7",
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* START INTERVIEW */}

            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  background: "#1e293b",
                  borderRadius: "20px",
                  color: "white",
                  boxShadow: "0px 0px 20px rgba(59,130,246,0.3)",
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Start AI Interview
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{ mb: 3, color: "#cbd5e1" }}
                  >
                    Practice with real-time AI interview
                    questions.
                  </Typography>

                  <Button
                    variant="contained"
                    startIcon={<PlayArrow />}
                    href="/interview"
                    sx={{
                      background:
                        "linear-gradient(to right,#3b82f6,#8b5cf6)",
                      borderRadius: "12px",
                      px: 3,
                      py: 1,
                    }}
                  >
                    Start Now
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* ================= RESUME SECTION ================= */}

          <Box mt={6}>
            <Typography
              variant="h4"
              fontWeight="bold"
              gutterBottom
            >
              Resume Analyzer
            </Typography>

            <Grid container spacing={4}>
              <Grid item xs={12}>
                <ResumeUpload />
              </Grid>
            </Grid>
          </Box>

          {/* ================= RECENT INTERVIEWS ================= */}

          <Box mt={6}>
            <Typography
              variant="h4"
              fontWeight="bold"
              gutterBottom
            >
              Recent Interviews
            </Typography>

            <Grid container spacing={3}>
              {dashboardData.recent_interviews?.map(
                (item, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Card
                      sx={{
                        background: "#1e293b",
                        borderRadius: "18px",
                        color: "white",
                      }}
                    >
                      <CardContent>
                        <Typography
                          variant="h5"
                          fontWeight="bold"
                        >
                          {item.role}
                        </Typography>

                        <Typography
                          sx={{
                            mt: 2,
                            mb: 1,
                            color: "#cbd5e1",
                          }}
                        >
                          Score: {item.score}%
                        </Typography>

                        <LinearProgress
                          variant="determinate"
                          value={item.score}
                          sx={{
                            height: 10,
                            borderRadius: 5,
                          }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                )
              )}
            </Grid>
          </Box>

          {/* ================= ANALYTICS PREVIEW ================= */}

          <Box mt={6}>
            <Card
              sx={{
                background:
                  "linear-gradient(to right,#312e81,#581c87)",
                color: "white",
                borderRadius: "25px",
                p: 2,
              }}
            >
              <CardContent>
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  gutterBottom
                >
                  AI Performance Insight
                </Typography>

                <Typography variant="body1">
                  Your communication skills are improving.
                  Focus more on technical confidence to
                  achieve higher interview scores.
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Container>
      </Box>
    </>
  );
}

export default Dashboard;