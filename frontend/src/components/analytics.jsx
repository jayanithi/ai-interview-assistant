import React, { useEffect, useState } from 'react';

import {
  Box,
  Typography,
  Grid,
  Paper,
  LinearProgress,
  Stack,
  Avatar
} from '@mui/material';

import {
  TrendingUp,
  MessageSquare,
  Brain,
  Lightbulb
} from 'lucide-react';

import { motion } from 'framer-motion';
import axios from 'axios';
// const analyticsData = [
//   {
//     title: 'Confidence',
//     value: 88,
//     icon: <TrendingUp size={28} />
//   },
//   {
//     title: 'Communication',
//     value: 79,
//     icon: <MessageSquare size={28} />
//   },
//   {
//     title: 'Technical Skills',
//     value: 91,
//     icon: <Brain size={28} />
//   },
//   {
//     title: 'Problem Solving',
//     value: 84,
//     icon: <Lightbulb size={28} />
//   }
// ];

function Analytics() {
  const [analyticsData, setAnalyticsData] = useState([]);
const [analyticsData, setAnalyticsData] =
  useState([]);

const [loading, setLoading] =
  useState(true);
  useEffect(() => {

  fetchAnalytics();

}, []);

const fetchAnalytics = async () => {

  try {

    const token =
      localStorage.getItem("access");

    const response =
      await axios.get(
        "http://127.0.0.1:8000/api/interview/dashboard/",
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

    console.log(response.data);

    const data = response.data;

    setAnalyticsData([
      {
        title: "Technical Skills",
        value:
          data.technical_score || 0,
        icon:
          <Brain size={28}/>
      },
      {
        title: "Communication",
        value:
          data.communication_score || 0,
        icon:
          <MessageSquare size={28}/>
      },
      {
        title: "Confidence",
        value:
          data.confidence_score || 0,
        icon:
          <TrendingUp size={28}/>
      },
      {
        title: "Average Score",
        value:
          data.average_score || 0,
        icon:
          <Lightbulb size={28}/>
      }
    ]);

  } catch (error) {

    console.log(error);

  } finally {

    setLoading(false);
  }
};
if (loading) {

  return (
    <Typography
      color="white"
      sx={{ p: 5 }}
    >
      Loading Analytics...
    </Typography>
  );
}
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top left,#1e3a8a 0%, #0f172a 40%, #020617 100%)',
        color: 'white',
        p: { xs: 2, sm: 3, md: 6 }
      }}
    >
      {/* Header */}

      <Box mb={{ xs: 4, md: 8 }}>
        <Typography
          variant='h3'
          fontWeight='bold'
          sx={{
            background: 'linear-gradient(90deg,#60a5fa,#a855f7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2,
            fontSize: { xs: "1.8rem", sm: "2.25rem", md: "3rem" },
            overflowWrap: "anywhere"
          }}
        >
          Performance Analytics
        </Typography>

        <Typography
          sx={{
            color: '#cbd5e1',
            maxWidth: '700px',
            lineHeight: 1.8,
            fontSize: '1.05rem'
          }}
        >
          Analyze your interview performance with AI-powered metrics,
          communication insights, confidence tracking, and technical skill
          evaluation.
        </Typography>
      </Box>

      {/* Analytics Cards */}

      <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
        {analyticsData.map((item, index) => (
          <Grid size={{ xs: 12, md: 6 }} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.2
              }}
              whileHover={{
                y: -8,
                scale: 1.02
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 3, md: 4 },
                  borderRadius: '28px',
                  background: 'rgba(255,255,255,0.06)',
                  backdropFilter: 'blur(16px)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.08)',
                  transition: '0.4s',
                  position: 'relative',
                  overflow: 'hidden',

                  '&:hover': {
                    border: '1px solid #3b82f6',
                    boxShadow: '0px 0px 40px rgba(59,130,246,0.25)'
                  }
                }}
              >
                {/* Glow Effect */}

                <Box
                  sx={{
                    position: 'absolute',
                    width: '180px',
                    height: '180px',
                    background: 'rgba(59,130,246,0.15)',
                    borderRadius: '50%',
                    top: '-60px',
                    right: '-60px',
                    filter: 'blur(50px)'
                  }}
                />

                <Stack
                  direction='row'
                  mb={4}
                  sx={{
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Avatar
                    sx={{
                      width: { xs: 54, sm: 70 },
                        height: { xs: 54, sm: 70 },
                      background:
                        'linear-gradient(135deg,#2563eb,#9333ea)',
                      boxShadow:
                        '0px 0px 25px rgba(59,130,246,0.4)'
                    }}
                  >
                    {item.icon}
                  </Avatar>

                  <Typography
                    variant='h3'
                    fontWeight='bold'
                    sx={{
                      color: '#60a5fa',
                      fontSize: { xs: "1.75rem", sm: "2.5rem", md: "3rem" }
                    }}
                  >
                    {item.value}%
                  </Typography>
                </Stack>

                <Typography
                  variant='h5'
                  fontWeight='bold'
                  mb={3}
                >
                  {item.title}
                </Typography>

                <LinearProgress
                  variant='determinate'
                  value={item.value}
                  sx={{
                    height: 12,
                    borderRadius: '30px',
                    backgroundColor: '#1e293b',

                    '& .MuiLinearProgress-bar': {
                      borderRadius: '30px',
                      background:
                        'linear-gradient(90deg,#3b82f6,#8b5cf6)'
                    }
                  }}
                />

                <Typography
                  sx={{
                    mt: 3,
                    color: '#cbd5e1',
                    lineHeight: 1.7
                  }}
                >
                  {item.value >= 90
                    ? 'Outstanding performance with excellent consistency.'
                    : item.value >= 80
                    ? 'Strong performance with room for minor improvements.'
                    : 'Good progress. Focus more on clarity and confidence.'}
                </Typography>
              </Paper>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Summary Section */}

      <Box
        sx={{
          mt: { xs: 4, md: 8 },
          p: { xs: 2.5, sm: 4, md: 5 },
          borderRadius: '30px',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(14px)'
        }}
      >
        <Typography
          variant='h4'
          fontWeight='bold'
          mb={3}
          sx={{ fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" } }}
        >
          AI Performance Summary
        </Typography>

        <Typography
          sx={{
            color: '#cbd5e1',
            lineHeight: 2,
            fontSize: '1.05rem'
          }}
        >
          Your interview performance shows strong technical understanding and
          problem-solving abilities. Communication skills are improving steadily,
          while confidence levels indicate good presentation capability.
          Continue practicing mock interviews regularly to improve fluency,
          precision, and real-world interview readiness.
        </Typography>
      </Box>
    </Box>
  );
}

export default Analytics;