import React, { useEffect, useState } from 'react';

import axios from 'axios';

import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Stack,
  LinearProgress,
  Chip,
  CircularProgress
} from '@mui/material';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

import {
  TrendingUp,
  Psychology,
  EmojiEvents,
  AutoAwesome
} from '@mui/icons-material';

import { motion } from 'framer-motion';

import Navbar from '../components/Navbar';

function Analytics() {

  const [loading, setLoading] = useState(true);

  const [analyticsData, setAnalyticsData] =
    useState({
      overallScore: 0,
      aiRating: '',
      topSkill: '',
      technical: 0,
      communication: 0,
      confidence: 0
    });

  // FETCH ANALYTICS
 // FETCH ANALYTICS
useEffect(() => {

  const fetchAnalytics = async () => {

    try {

      const token =
        localStorage.getItem("access");

      const response =
        await axios.get(
          "http://127.0.0.1:8000/api/interview/dashboard/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      console.log(response.data);

    setAnalyticsData({

  overallScore:
    Number(response.data.average_score) || 0,

  aiRating:
    "AI Evaluated",

  topSkill:
    "Full Stack Development",

  technical:
    Number(response.data.technical_score) || 0,

  communication:
    Number(response.data.communication_score) || 0,

  confidence:
    Number(response.data.confidence_score) || 0,

});

    } catch (error) {

      console.error(error);

      alert("Failed to load analytics");

    } finally {

      setLoading(false);

    }

  };

  fetchAnalytics();

}, []);

  // CHART DATA
  const data = [

  {
    name: "Technical",
    value: Math.min(
      100,
      Math.max(
        0,
        Number(analyticsData.technical) || 0
      )
    ),
    color: "#3b82f6"
  },

  {
    name: "Communication",
    value: Math.min(
      100,
      Math.max(
        0,
        Number(analyticsData.communication) || 0
      )
    ),
    color: "#8b5cf6"
  },

  {
    name: "Confidence",
    value: Math.min(
      100,
      Math.max(
        0,
        Number(analyticsData.confidence) || 0
      )
    ),
    color: "#06b6d4"
  }

];

  // STATS
  const stats = [
    {
      title: 'Overall Score',
      value: `${analyticsData.overallScore}%`,
      icon: <TrendingUp />,
      gradient:
        'linear-gradient(135deg, #3b82f6, #2563eb)'
    },
    {
      title: 'AI Rating',
      value: analyticsData.aiRating,
      icon: <Psychology />,
      gradient:
        'linear-gradient(135deg, #8b5cf6, #7c3aed)'
    },
    {
      title: 'Top Skill',
      value: analyticsData.topSkill,
      icon: <EmojiEvents />,
      gradient:
        'linear-gradient(135deg, #06b6d4, #0891b2)'
    }
  ];

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'background.default',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Navbar />

      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: 'background.default',
          py: { xs: 4, sm: 6, md: 8 }
        }}
      >

        <Container maxWidth="xl">

          {/* HEADER */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >

            <Stack
              spacing={3}
              sx={{ mb: { xs: 4, md: 6 } }}
            >

              <Box>

                <Chip
                  icon={<AutoAwesome />}
                  label="AI Performance Insights"
                  sx={{
                    mb: 2,
                    color: 'white',
                    background:
                      'linear-gradient(90deg, #3b82f6, #8b5cf6)',
                    fontWeight: 600
                  }}
                />

                <Typography
                  variant="h2"
                  sx={{
                    color: 'text.primary',
                    fontWeight: 800,
                    fontSize: { xs: "2rem", sm: "2.75rem", md: "3.75rem" },
                    overflowWrap: "anywhere"
                  }}
                >
                  Analytics Dashboard
                </Typography>

              </Box>

            </Stack>

          </motion.div>

          {/* STATS */}
          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} sx={{ mb: 5 }}>

            {stats.map((item, index) => (

              <Grid size={{ xs: 12, md: 4 }} key={index}>

                <Paper
  elevation={0}
  sx={{
    p: { xs: 2, sm: 3, md: 4 },
    borderRadius: "32px",
    minHeight: { xs: 380, sm: 440, md: 500 },
    backgroundColor: "background.paper",
    backdropFilter: "blur(16px)",
    border: "1px solid",
    borderColor: "divider",
    color: "text.primary"
  }}
>
  <Typography
    variant="h5"
    sx={{
      fontWeight: 700,
      mb: 4
    }}
  >
    Performance Breakdown
  </Typography>

  <Box
  sx={{
    width: "100%",
    height: { xs: 260, sm: 310, md: 350 },
    minHeight: { xs: 260, sm: 310, md: 350 }
  }}
>
  <ResponsiveContainer
    width="100%"
    height="100%"
  >
    <PieChart>

      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        outerRadius="70%"
        innerRadius="40%"
        label
      >
        {data.map((entry,index)=>(
          <Cell
            key={index}
            fill={entry.color}
          />
        ))}
      </Pie>

      <Tooltip />
      <Legend />

    </PieChart>
  </ResponsiveContainer>
</Box>

</Paper>

              </Grid>

            ))}

          </Grid>

          {/* CHARTS */}
          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>

            {/* PIE CHART */}
            <Grid size={{ xs: 12, lg: 7 }}>

              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 3, md: 4 },
                  borderRadius: '32px',
                  height: { xs: 390, sm: 450, md: 500 },
                  backgroundColor: 'background.paper',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid',
                  borderColor: 'divider',
                  color: 'text.primary'
                }}
              >

                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    mb: 4
                  }}
                >
                  Performance Breakdown
                </Typography>

                <Box sx={{ width: "100%", height: { xs: 300, sm: 350, md: 400 } }}>
                <ResponsiveContainer width="100%" height="100%">

                  <PieChart>

                    <Pie
                      data={data}
                      dataKey="value"
                      nameKey="name"
                      outerRadius="70%"
                      innerRadius="40%"
                      label
                    >

                      {data.map((entry, index) => (

                        <Cell
                          key={index}
                          fill={entry.color}
                        />

                      ))}

                    </Pie>

                    <Tooltip />

                    <Legend />

                  </PieChart>

                </ResponsiveContainer>
                </Box>

              </Paper>

            </Grid>

            {/* SKILLS */}
            <Grid size={{ xs: 12, lg: 5 }}>

              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 3, md: 4 },
                  borderRadius: '32px',
                  minHeight: { xs: 380, sm: 440, md: 500 },
                  backgroundColor: 'background.paper',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid',
                  borderColor: 'divider',
                  color: 'text.primary'
                }}
              >

                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    mb: 4
                  }}
                >
                  Skill Progress
                </Typography>

                <Stack spacing={5}>

                  {data.map((item, index) => (

                    <Box key={index}>

                      <Stack
                        direction="row"
                        sx={{
                          mb: 1.5,
                          justifyContent: "space-between",
                        }}
                      >

                        <Typography>
                          {item.name}
                        </Typography>

                        <Typography
                          sx={{
                            color: item.color,
                            fontWeight: 700
                          }}
                        >
                          {item.value}%
                        </Typography>

                      </Stack>
<LinearProgress
  variant="determinate"
  value={
    Number.isFinite(item.value)
      ? item.value
      : 0
  }
/>

                    </Box>

                  ))}

                </Stack>

              </Paper>

            </Grid>

          </Grid>

        </Container>

      </Box>
    </>
  );
}

export default Analytics;