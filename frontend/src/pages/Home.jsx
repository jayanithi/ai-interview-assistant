import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  Stack,
  Chip
} from '@mui/material';

import {
  AutoAwesome,
  Psychology,
  TrendingUp,
  Bolt
} from '@mui/icons-material';

import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Psychology fontSize="large" />,
      title: 'AI Mock Interviews',
      desc: 'Experience realistic interview simulations powered by advanced AI.'
    },
    {
      icon: <TrendingUp fontSize="large" />,
      title: 'Performance Analytics',
      desc: 'Track confidence, communication, and technical performance.'
    },
    {
      icon: <Bolt fontSize="large" />,
      title: 'Instant Feedback',
      desc: 'Get smart feedback and improvement suggestions instantly.'
    }
  ];

  return (
    <>
      <Navbar />

      <Box
        sx={{
          minHeight: '100vh',
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
          backgroundColor: 'background.default',
          color: 'text.primary'
        }}
      >
        {/* Background Glow */}
        <Box
          sx={{
            position: 'absolute',
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'rgba(59,130,246,0.25)',
            filter: 'blur(120px)',
            top: -100,
            right: -100
          }}
        />

        <Box
          sx={{
            position: 'absolute',
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'rgba(168,85,247,0.25)',
            filter: 'blur(100px)',
            bottom: -80,
            left: -80
          }}
        />

        <Container maxWidth="xl">
          <Grid
            container
            spacing={{ xs: 4, md: 6 }}
            sx={{
              alignItems: 'center',
              minHeight: '100vh',
              py: { xs: 6, sm: 8, md: 10 }
            }}
          >
            {/* Left Content */}
            <Grid size={{ xs: 12, md: 6 }}>
              <motion.div
                initial={{ opacity: 0, y: 80 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              >
                <Chip
                  icon={<AutoAwesome />}
                  label="AI Powered Career Platform"
                  sx={{
                    mb: 3,
                    px: 1,
                    py: 2.5,
                    color: 'text.primary',
                    backgroundColor: 'background.paper',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}
                />

                <Typography
                  variant="h1"
                  sx={{
                    fontWeight: 800,
                    lineHeight: 1.1,
                    mb: 3,
                    fontSize: {
                      xs: '2.5rem',
                      sm: '3.5rem',
                      md: '5rem'
                    }
                  }}
                >
                  Crack Your
                  <Box
                    component="span"
                    sx={{
                      background:
                        'linear-gradient(90deg, #3b82f6, #8b5cf6)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    {' '}
                    Dream Job
                  </Box>
                </Typography>

                <Typography
                  variant="h6"
                  sx={{
                    color: 'text.secondary',
                    maxWidth: 600,
                    mb: 4,
                    lineHeight: 1.8
                  }}
                >
                  Master interviews with AI-generated questions,
                  real-time feedback, and personalized performance
                  analytics built for modern professionals.
                </Typography>

                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={{ xs: 1.5, sm: 2 }}
                  sx={{ width: { xs: '100%', sm: 'auto' } }}
                >
                 <Button
  variant="contained"
  size="large"
  onClick={() => {
    const token = localStorage.getItem("access");

    if (!token) {
      navigate("/login");
    } else {
      navigate("/interview");
    }
  }}
  sx={{
    px: { xs: 2.5, sm: 4, md: 5 },
    py: 1.8,
    borderRadius: '16px',
    textTransform: 'none',
    fontSize: '1rem',
    fontWeight: 700,
    background:
      'linear-gradient(90deg, #3b82f6, #8b5cf6)',
    boxShadow:
      '0 10px 30px rgba(59,130,246,0.4)',
    '&:hover': {
      transform: 'translateY(-3px)',
      boxShadow:
        '0 14px 40px rgba(59,130,246,0.6)'
    },
    transition: '0.3s',
    width: { xs: '100%', sm: 'auto' }
  }}
>
  Start Practicing
</Button>

                  <Button
                    variant="outlined"
                    size="large"
                    sx={{
                      px: { xs: 2.5, sm: 4, md: 5 },
                      py: 1.8,
                      borderRadius: '16px',
                      textTransform: 'none',
                      color: 'text.primary',
                      borderColor: 'divider',
                      '&:hover': {
                        borderColor: 'text.primary',
                        backgroundColor: 'action.hover'
                      },
                      width: { xs: '100%', sm: 'auto' }
                    }}
                  >
                    Learn More
                  </Button>
                </Stack>
              </motion.div>
            </Grid>

            {/* Right Side Cards */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Grid container spacing={3}>
                {features.map((feature, index) => (
                  <Grid size={{ xs: 12, sm: 6, md: 12 }} key={index}>
                    <motion.div
                      initial={{ opacity: 0, x: 80 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.8,
                        delay: index * 0.2
                      }}
                    >
                      <Card
                        sx={{
                          backgroundColor: 'background.paper',
                          border: '1px solid',
                          borderColor: 'divider',
                          backdropFilter: 'blur(14px)',
                          borderRadius: '24px',
                          color: 'text.primary',
                          transition: '0.4s',
                          '&:hover': {
                            transform: 'translateY(-10px)',
                            borderColor: '#3b82f6',
                            boxShadow:
                              '0 20px 40px rgba(59,130,246,0.25)'
                          }
                        }}
                      >
                        <CardContent sx={{ p: { xs: 2.5, sm: 3, md: 4 } }}>
                          <Box
                            sx={{
                              width: 70,
                              height: 70,
                              borderRadius: '20px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background:
                                'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                              mb: 3
                            }}
                          >
                            {feature.icon}
                          </Box>

                          <Typography
                            variant="h5"
                            sx={{
                              fontWeight: 700,
                              mb: 2
                            }}
                          >
                            {feature.title}
                          </Typography>

                          <Typography
                            sx={{
                              color: 'text.secondary',
                              lineHeight: 1.8
                            }}
                          >
                            {feature.desc}
                          </Typography>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}

export default Home;