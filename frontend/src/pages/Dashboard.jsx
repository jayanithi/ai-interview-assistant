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
          backgroundColor: "background.default",
          color: "text.primary",
          py: { xs: 3, sm: 4, md: 5 },
        }}
      >
        <Container maxWidth="lg">
          {/* ================= HEADER ================= */}

          <Box mb={5}>
            <Typography
              variant="h3"
              fontWeight="bold"
              gutterBottom
              sx={{ fontSize: { xs: "1.8rem", sm: "2.25rem", md: "3rem" } }}
            >
              Analytics Dashboard
            </Typography>

            <Typography
              variant="h6"
              sx={{ color: "text.secondary", fontSize: { xs: "1rem", sm: "1.25rem" } }}
            >
              Track your interview performance with AI-powered
              insights.
            </Typography>
          </Box>

          {/* ================= STATS CARDS ================= */}

          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
            {/* TOTAL INTERVIEWS */}

            <Grid size={{ xs: 12, md: 4 }}>
              <Card
                sx={{
                  backgroundColor: "background.paper",
                  borderRadius: "20px",
                  color: "text.primary",
                  boxShadow: "0px 0px 20px rgba(99,102,241,0.3)",
                }}
              >
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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

            <Grid size={{ xs: 12, md: 4 }}>
              <Card
                sx={{
                  backgroundColor: "background.paper",
                  borderRadius: "20px",
                  color: "text.primary",
                  boxShadow: "0px 0px 20px rgba(168,85,247,0.3)",
                }}
              >
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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

            <Grid size={{ xs: 12, md: 4 }}>
              <Card
                sx={{
                  backgroundColor: "background.paper",
                  borderRadius: "20px",
                  color: "text.primary",
                  boxShadow: "0px 0px 20px rgba(59,130,246,0.3)",
                }}
              >
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <Typography variant="h6" gutterBottom>
                    Start AI Interview
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{ mb: 3, color: "text.secondary" }}
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
              sx={{ fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" } }}
            >
              Resume Analyzer
            </Typography>

            <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
              <Grid size={12}>
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
              sx={{ fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" } }}
            >
              Recent Interviews
            </Typography>

            <Grid container spacing={{ xs: 2, sm: 3 }}>
              {dashboardData.recent_interviews?.map(
                (item, index) => (
                  <Grid size={{ xs: 12, md: 6 }} key={index}>
                    <Card
                      sx={{
                        backgroundColor: "background.paper",
                        borderRadius: "18px",
                        color: "text.primary",
                      }}
                    >
                      <CardContent>
                        <Typography
                          variant="h5"
                          fontWeight="bold"
                          sx={{ overflowWrap: "anywhere", fontSize: { xs: "1.15rem", sm: "1.5rem" } }}
                        >
                          {item.role}
                        </Typography>

                        <Typography
                          sx={{
                            mt: 2,
                            mb: 1,
                            color: "text.secondary",
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
                backgroundColor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                color: "text.primary",
                borderRadius: "25px",
                p: { xs: 1, sm: 2 },
              }}
            >
              <CardContent>
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  gutterBottom
                  sx={{ fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" } }}
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