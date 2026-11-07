import React, {
  useEffect,
  useState
} from "react";

import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  Stack,
  Chip,
} from "@mui/material";

import {
  Brain,
  BarChart3,
  Zap,
  Users,
  Sparkles,
} from "lucide-react";

import { motion } from "framer-motion";

import axios from "axios";

import { useNavigate } from "react-router-dom";

function Hero() {

  const navigate = useNavigate();

  const [features, setFeatures] =
    useState([]);

  const [stats, setStats] =
    useState({});

  const [user, setUser] =
    useState(null);

  // ====================================
  // FETCH HERO DATA
  // ====================================

  useEffect(() => {

    fetchHeroData();

  }, []);

  const fetchHeroData = async () => {

    try {

      const token =
        localStorage.getItem("access");

      const response = await axios.get(

        "http://127.0.0.1:8000/api/dashboard/hero-stats/",

        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      setFeatures(
        response.data.features
      );

      setStats(
        response.data.stats
      );

      setUser(
        response.data.user
      );

    } catch (error) {

      console.log(error);
    }
  };

  // ====================================
  // ICON RENDER
  // ====================================

  const renderIcon = (icon) => {

    switch (icon) {

      case "brain":
        return <Brain size={34} />;

      case "analytics":
        return <BarChart3 size={34} />;

      case "zap":
        return <Zap size={34} />;

      default:
        return <Sparkles size={34} />;
    }
  };

  return (

    <Box
      sx={{
        minHeight: "100vh",

        background:
          "radial-gradient(circle at top left,#1d4ed8 0%, #0f172a 35%, #020617 100%)",

        color: "white",

        py: 10,

        overflow: "hidden",
      }}
    >

      <Container maxWidth="xl">

        <motion.div
          initial={{
            opacity: 0,
            y: 40
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            duration: 0.8
          }}
        >

          {/* BADGE */}

          <Chip
            icon={<Sparkles size={18} />}
            label="AI Powered Interview Platform"
            sx={{
              mb: 4,
              px: 2,
              py: 3,
              bgcolor:
                "rgba(59,130,246,0.15)",
              color: "#93c5fd",
              border:
                "1px solid rgba(59,130,246,0.3)",
            }}
          />

          {/* TITLE */}

          <Typography
            variant="h2"
            fontWeight="bold"
            sx={{
              background:
                "linear-gradient(90deg,#60a5fa,#a855f7)",
              WebkitBackgroundClip:
                "text",
              WebkitTextFillColor:
                "transparent",
              mb: 3,
            }}
          >
            AI Interview Assistant
          </Typography>

          {/* USER */}

          {

            user && (

              <Typography
                sx={{
                  color: "#60A5FA",
                  fontSize: "18px",
                  mb: 2,
                  fontWeight: "bold",
                }}
              >
                Welcome back,
                {" "}
                {user.name}
              </Typography>

            )
          }

          {/* DESCRIPTION */}

          <Typography
            variant="h6"
            sx={{
              color: "#cbd5e1",
              maxWidth: "700px",
              lineHeight: 1.8,
              mb: 5,
            }}
          >
            Practice technical and HR
            interviews with AI-powered
            mock sessions, analytics,
            and intelligent feedback
            built for modern
            professionals.
          </Typography>

          {/* BUTTONS */}

          <Box
            sx={{
              display: "flex",
              gap: 3,
              flexWrap: "wrap",
              mb: 8,
            }}
          >

            <Button
              variant="contained"
              size="large"
              onClick={() =>
                navigate("/interview")
              }
              sx={{
                px: 5,
                py: 1.7,
                borderRadius: "18px",
                fontWeight: "bold",
                fontSize: "1rem",
                background:
                  "linear-gradient(90deg,#3b82f6,#a855f7)",
                boxShadow:
                  "0px 0px 30px rgba(59,130,246,0.6)",
                textTransform: "none",
              }}
            >
              Start Practicing
            </Button>

            <Button
              variant="outlined"
              size="large"
              onClick={() =>
                navigate("/analytics")
              }
              sx={{
                px: 5,
                py: 1.7,
                borderRadius: "18px",
                borderColor: "#475569",
                color: "white",
                textTransform: "none",

                "&:hover": {
                  borderColor:
                    "#60a5fa",

                  background:
                    "rgba(255,255,255,0.04)",
                },
              }}
            >
              View Analytics
            </Button>

          </Box>

          {/* STATS */}

          <Stack
            direction="row"
            spacing={3}
            flexWrap="wrap"
            mb={8}
          >

            <Card
              sx={{
                bgcolor:
                  "rgba(255,255,255,0.05)",
                borderRadius: "24px",
                color: "white",
                minWidth: 220,
              }}
            >

              <CardContent>

                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                >

                  <Users />

                  <Box>

                    <Typography
                      variant="h4"
                      fontWeight="bold"
                    >
                      {
                        stats.active_users
                      }+
                    </Typography>

                    <Typography
                      color="#CBD5E1"
                    >
                      Active Users
                    </Typography>

                  </Box>

                </Stack>

              </CardContent>

            </Card>

            <Card
              sx={{
                bgcolor:
                  "rgba(255,255,255,0.05)",
                borderRadius: "24px",
                color: "white",
                minWidth: 220,
              }}
            >

              <CardContent>

                <Typography
                  variant="h4"
                  fontWeight="bold"
                >
                  {
                    stats.mock_interviews
                  }+
                </Typography>

                <Typography
                  color="#CBD5E1"
                >
                  Mock Interviews
                </Typography>

              </CardContent>

            </Card>

            <Card
              sx={{
                bgcolor:
                  "rgba(255,255,255,0.05)",
                borderRadius: "24px",
                color: "white",
                minWidth: 220,
              }}
            >

              <CardContent>

                <Typography
                  variant="h4"
                  fontWeight="bold"
                >
                  {
                    stats.ai_feedbacks
                  }+
                </Typography>

                <Typography
                  color="#CBD5E1"
                >
                  AI Feedback Reports
                </Typography>

              </CardContent>

            </Card>

          </Stack>

        </motion.div>

        {/* FEATURES */}

        <Grid container spacing={4}>

          {

            features.map(
              (item, index) => (

                <Grid
                  item
                  xs={12}
                  md={6}
                  lg={4}
                  key={index}
                >

                  <motion.div
                    whileHover={{
                      y: -10,
                      scale: 1.02
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 200
                    }}
                  >

                    <Card
                      sx={{
                        background:
                          "rgba(255,255,255,0.05)",

                        border:
                          "1px solid rgba(255,255,255,0.1)",

                        backdropFilter:
                          "blur(14px)",

                        borderRadius:
                          "30px",

                        color: "white",

                        minHeight:
                          "280px",

                        transition:
                          "0.4s",

                        "&:hover": {
                          boxShadow:
                            "0px 0px 40px rgba(59,130,246,0.35)",

                          borderColor:
                            "#3b82f6",
                        },
                      }}
                    >

                      <CardContent
                        sx={{ p: 5 }}
                      >

                        <Box
                          sx={{
                            width: 90,
                            height: 90,
                            borderRadius:
                              "24px",

                            background:
                              "linear-gradient(135deg,#3b82f6,#8b5cf6)",

                            display: "flex",

                            alignItems:
                              "center",

                            justifyContent:
                              "center",

                            mb: 4,
                          }}
                        >
                          {
                            renderIcon(
                              item.icon
                            )
                          }
                        </Box>

                        <Typography
                          variant="h4"
                          fontWeight="bold"
                          mb={3}
                        >
                          {item.title}
                        </Typography>

                        <Typography
                          sx={{
                            color:
                              "#cbd5e1",

                            lineHeight:
                              1.9,

                            fontSize:
                              "1rem",
                          }}
                        >
                          {item.desc}
                        </Typography>

                      </CardContent>

                    </Card>

                  </motion.div>

                </Grid>

              )
            )
          }

        </Grid>

      </Container>

    </Box>
  );
}

export default Hero;