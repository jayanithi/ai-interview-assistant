import React, {
  useEffect,
  useState,
  useRef
} from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  TextField,
  Stack,
  Chip,
  LinearProgress,
  Avatar,
  CircularProgress
} from '@mui/material';

import {
  Mic as MicIcon,
  Send as SendIcon,
  AutoAwesome,
  Psychology,
  Timer,
  GraphicEq
} from '@mui/icons-material';
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';

import axios from 'axios';

import Navbar from '../components/Navbar';

function InterviewRoom() {

const [questions, setQuestions] = useState([]);
const [currentIndex, setCurrentIndex] = useState(0);
const [answer, setAnswer] = useState("");
const [feedback, setFeedback] = useState("");
const [score, setScore] = useState(0);
const navigate = useNavigate();
const [technicalScore, setTechnicalScore] = useState(0);
const [communicationScore, setCommunicationScore] = useState(0);
const [confidenceScore, setConfidenceScore] = useState(0);

const [loading, setLoading] = useState(false);
const [isListening, setIsListening] = useState(false);

const [role, setRole] = useState("frontend");
const [interviewStarted, setInterviewStarted] = useState(false);

const recognitionRef = useRef(null);
const INTERVIEW_TIME = 30 * 60;

const [timeLeft, setTimeLeft] =
  useState(INTERVIEW_TIME);

const timerRef = useRef(null);
  const progress =
  questions.length > 0
    ? ((currentIndex + 1) / questions.length) * 100
    : 0;
  // ===============================
  // GET QUESTION FROM BACKEND
  // ===============================

const fetchQuestion = async () => {
  try {

    const res = await axios.get(
      `http://127.0.0.1:8000/api/interview/start/?role=${role}`
    );

    console.log("START API");
    console.log(res.data);

    setQuestions(res.data.questions || []);
    setCurrentIndex(0);
    setInterviewStarted(true);

  } catch (error) {

    console.error(error);
    alert("Failed to load questions");
  }
};
  // ===============================
  // LOAD QUESTION
  // ===============================

useEffect(() => {
  fetchQuestion();
}, [role]);
useEffect(() => {

  if (!interviewStarted)
    return;

  timerRef.current =
    setInterval(() => {

      setTimeLeft(prev => {

        if (prev <= 1) {

          clearInterval(
            timerRef.current
          );

          alert(
            "Interview Completed"
          );

          navigate("/dashboard");

          return 0;
        }

        return prev - 1;

      });

    }, 1000);

  return () =>
    clearInterval(
      timerRef.current
    );

}, [
  interviewStarted,
  navigate
]);
const handleSubmit = async () => {

  if (!answer.trim()) {
    alert("Please enter your answer");
    return;
  }

  try {

    setLoading(true);

   const token = localStorage.getItem("access");

const response = await axios.post(
  "http://127.0.0.1:8000/api/interview/submit-answer/",
  {
    role: role,
    question: questions[currentIndex],
    answer: answer
  },
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);

    setFeedback(response.data.feedback || "");
    setScore(response.data.score || 0);

    setTechnicalScore(
      response.data.technical_score || 0
    );

    setCommunicationScore(
      response.data.communication_score || 0
    );

    setConfidenceScore(
      response.data.confidence_score || 0
    );

    setAnswer("");

    if (currentIndex < questions.length - 1) {

      setCurrentIndex(prev => prev + 1);

    } else {

      // alert(`${role.toUpperCase()} Interview Completed`);
      alert(
 `${role.toUpperCase()}
 Interview Completed`
);

navigate("/dashboard");
    }

  } catch (error) {

    console.error(error);
    alert("Submission Failed");

  } finally {

    setLoading(false);
  }
};

  // ===============================
  // SPEECH RECOGNITION
  // ===============================

const startSpeechRecognition = () => {

  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if (!SpeechRecognition) {

    alert(
      "Speech Recognition Not Supported In This Browser"
    );

    return;
  }

  const recognition =
    new SpeechRecognition();

  recognitionRef.current =
    recognition;

  recognition.continuous = true;

  recognition.interimResults = true;

  recognition.lang = "en-US";

  recognition.start();

  setIsListening(true);

  recognition.onresult = (event) => {

    let transcript = "";

    for (
      let i = event.resultIndex;
      i < event.results.length;
      i++
    ) {

      transcript +=
        event.results[i][0].transcript + " ";
    }

    setAnswer(transcript);
  };

  recognition.onerror = (event) => {

    console.log(
      "Speech Error:",
      event.error
    );

    setIsListening(false);
  };

  recognition.onend = () => {

    setIsListening(false);
  };
};

const stopSpeechRecognition = () => {

  if (
    recognitionRef.current
  ) {

    recognitionRef.current.stop();

    setIsListening(false);
  }
};

  return (
    <>
      <Navbar />

      <Box
        sx={{
          minHeight: '100vh',
          background:
            'linear-gradient(135deg, #020617 0%, #0f172a 40%, #111827 100%)',
          position: 'relative',
          overflow: 'hidden',
          py: 8
        }}
      >
        {/* Glow Effects */}

        <Box
          sx={{
            position: 'absolute',
            width: 350,
            height: 350,
            background: 'rgba(59,130,246,0.25)',
            filter: 'blur(120px)',
            borderRadius: '50%',
            top: -100,
            right: -100
          }}
        />

        <Box
          sx={{
            position: 'absolute',
            width: 300,
            height: 300,
            background: 'rgba(168,85,247,0.25)',
            filter: 'blur(120px)',
            borderRadius: '50%',
            bottom: -100,
            left: -100
          }}
        />

        <Container maxWidth="lg">

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >

            {/* HEADER */}

            <Paper
              elevation={0}
              sx={{
                p: 4,
                mb: 4,
                borderRadius: '28px',
                background: 'rgba(255,255,255,0.06)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'white'
              }}
            >

              <Stack
                direction={{ xs: 'column', md: 'row' }}
                justifyContent="space-between"
                alignItems={{ xs: 'flex-start', md: 'center' }}
                spacing={3}
              >

                <Box>

                  <Chip
                    icon={<AutoAwesome />}
                    label="AI Powered Mock Interview"
                    sx={{
                      mb: 2,
                      color: 'white',
                      background:
                        'linear-gradient(90deg, #3b82f6, #8b5cf6)',
                      fontWeight: 600
                    }}
                  />

                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 800,
                      mb: 1
                    }}
                  >
                    Interview Room
                  </Typography>

                  <Typography
                    sx={{
                      color: 'rgba(255,255,255,0.7)'
                    }}
                  >
                    Practice interviews with AI
                  </Typography>

                </Box>
<Box sx={{ mt: 3 }}>

  <Typography sx={{ mb: 2 }}>
    Select Interview Role
  </Typography>

  <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap" }}>

    <Button disabled={interviewStarted}
  variant={role === "frontend" ? "contained" : "outlined"}
 onClick={() => {

  setQuestions([]);
  setCurrentIndex(0);

  setTimeLeft(
    INTERVIEW_TIME
  );

  setRole("frontend");

}}
>

  Frontend
</Button>

<Button
disabled={interviewStarted}
  variant={role === "backend" ? "contained" : "outlined"}
  onClick={() => {
    setQuestions([]);
    setCurrentIndex(0);
    setTimeLeft(INTERVIEW_TIME);
    setRole("backend");
  }}
>
  Backend
</Button>

<Button
disabled={interviewStarted}
  variant={role === "fullstack" ? "contained" : "outlined"}
  onClick={() => {
    setQuestions([]);
    setCurrentIndex(0);
    setTimeLeft(INTERVIEW_TIME);
    setRole("fullstack");
  }}
>
  Full Stack
</Button>

<Button
disabled={interviewStarted}
  variant={role === "aiml" ? "contained" : "outlined"}
  onClick={() => {
    setQuestions([]);
    setCurrentIndex(0);
    setTimeLeft(INTERVIEW_TIME);
    setRole("aiml");
  }}
>
  AI / ML
</Button>
  </Stack>

</Box>
                <Stack direction="row" spacing={2}>

                  <Paper
                    sx={{
                      px: 3,
                      py: 2,
                      borderRadius: '20px',
                      background: 'rgba(255,255,255,0.08)',
                      color: 'white'
                    }}
                  >
                    <Stack direction="row" spacing={1}>
                      <Timer />
                     <Typography>

  {String(
    Math.floor(
      timeLeft / 60
    )
  ).padStart(2,"0")}

  :

  {String(
    timeLeft % 60
  ).padStart(2,"0")}

</Typography>
                    </Stack>
                  </Paper>

                  <Paper
                    sx={{
                      px: 3,
                      py: 2,
                      borderRadius: '20px',
                      background: 'rgba(255,255,255,0.08)',
                      color: 'white'
                    }}
                  >
                    <Stack direction="row" spacing={1}>
                      <Psychology />
                      <Typography>
                        AI Active
                      </Typography>
                    </Stack>
                  </Paper>

                </Stack>

              </Stack>

            </Paper>

            {/* MAIN CARD */}

            <Paper
              elevation={0}
              sx={{
                p: 5,
                borderRadius: '32px',
                background: 'rgba(255,255,255,0.06)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'white'
              }}
            >

              {/* AI INTERVIEWER */}

              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ mb: 4 }}
              >

                <Avatar
                  sx={{
                    width: 65,
                    height: 65,
                    background:
                      'linear-gradient(135deg, #3b82f6, #8b5cf6)'
                  }}
                >
                  <GraphicEq />
                </Avatar>

                <Box>

                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700
                    }}
                  >
                    AI Interviewer
                  </Typography>

                  <Typography
                    sx={{
                      color: 'rgba(255,255,255,0.6)'
                    }}
                  >
                    Senior Recruiter
                  </Typography>

                </Box>

              </Stack>

              {/* PROGRESS */}

              <Box sx={{ mb: 4 }}>

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  sx={{ mb: 1 }}
                >

                  <Typography>
                    Interview Progress
                  </Typography>

                  <Typography
                    sx={{
                      color: '#3b82f6',
                      fontWeight: 700
                    }}
                  >{questions.length > 0
  ? Math.round(
      ((currentIndex + 1) /
        questions.length) *
        100
    )
  : 0}
%
                  </Typography>

                </Stack>

                <LinearProgress
                    variant="determinate"
  value={
 questions.length > 0
   ? ((currentIndex + 1) / questions.length) * 100
   : 0
}

                  sx={{
                    height: 10,
                    borderRadius: 10,
                    background:
                      'rgba(255,255,255,0.08)',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 10,
                      background:
                        'linear-gradient(90deg, #3b82f6, #8b5cf6)'
                    }
                  }}
                />

              </Box>

              {/* QUESTION */}

              <Paper
                sx={{
                  p: 4,
                  mb: 4,
                  borderRadius: '24px',
                  background:
                    'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(168,85,247,0.12))',
                  border:
                    '1px solid rgba(255,255,255,0.08)',
                  color: 'white'
                }}
              >

               <Typography variant="h6">
  Question {currentIndex + 1} of {questions.length}
</Typography>

<Typography>
  {questions.length > 0
    ? questions[currentIndex]
    : "Loading..."}
</Typography>

              </Paper>

              {/* ANSWER FIELD */}

              <TextField
                fullWidth
                multiline
                rows={8}
                value={answer}
                onChange={(e) =>
                  setAnswer(e.target.value)
                }
                placeholder="Type your answer here..."
                variant="outlined"
                sx={{
                  mb: 4,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '24px',
                    background:
                      'rgba(255,255,255,0.05)',
                    color: 'white',

                    '& fieldset': {
                      borderColor:
                        'rgba(255,255,255,0.08)'
                    }
                  },

                  '& textarea': {
                    color: 'white'
                  }
                }}
              />

              {/* BUTTONS */}

             <Stack
  direction={{ xs: "column", sm: "row" }}
  spacing={3}
>

  <Button
    variant="contained"
    startIcon={<MicIcon />}
    onClick={startSpeechRecognition}
    disabled={isListening}
    sx={{
      flex: 1,
      py: 1.8,
      borderRadius: "18px"
    }}
  >
    {isListening
      ? "Listening..."
      : "Start Speaking"}
  </Button>

  <Button
    color="error"
    variant="contained"
    onClick={stopSpeechRecognition}
    disabled={!isListening}
    sx={{
      flex: 1,
      py: 1.8,
      borderRadius: "18px"
    }}
  >
    Stop Speaking
  </Button>
<Button
  variant="contained"
  endIcon={
    loading
      ? <CircularProgress size={20}/>
      : <SendIcon />
  }
  onClick={handleSubmit}
  disabled={loading}
  sx={{
    flex: 1,
    py: 1.8,
    borderRadius: "18px",
    background:
      "linear-gradient(90deg,#3b82f6,#8b5cf6)"
  }}
>
  {
    loading
      ? "Submitting..."
      : "Submit Answer"
  }
</Button>
</Stack>
              {/* FEEDBACK */}

              {
                feedback && (
                  <Paper
                    sx={{
                      mt: 5,
                      p: 4,
                      borderRadius: '24px',
                      background:
                        'rgba(255,255,255,0.05)',
                      color: 'white',
                      border:
                        '1px solid rgba(255,255,255,0.08)'
                    }}
                  >

                    <Typography
                      variant="h5"
                      sx={{
                        mb: 2,
                        fontWeight: 700
                      }}
                    >
                      AI Feedback
                    </Typography>

                    <Typography
                      sx={{
                        mb: 2,
                        color:
                          'rgba(255,255,255,0.7)'
                      }}
                    >
                      {feedback}
                    </Typography>

                    <Typography
                      variant="h6"
                      sx={{
                        color: '#3b82f6',
                        fontWeight: 700
                      }}
                    >
                      Score: {score}%
                    </Typography>
                       <Box sx={{ mt: 3 }}>

  <Typography sx={{ mb: 1 }}>
    Technical Skills: {technicalScore}%
  </Typography>

  <LinearProgress
    variant="determinate"
    value={technicalScore}
    sx={{ height: 8, borderRadius: 5, mb: 2 }}
  />

  <Typography sx={{ mb: 1 }}>
    Communication: {communicationScore}%
  </Typography>

  <LinearProgress
    variant="determinate"
    value={communicationScore}
    sx={{ height: 8, borderRadius: 5, mb: 2 }}
  />

  <Typography sx={{ mb: 1 }}>
    Confidence: {confidenceScore}%
  </Typography>

  <LinearProgress
    variant="determinate"
    value={confidenceScore}
    sx={{ height: 8, borderRadius: 5 }}
  />

</Box>
                  </Paper>
                )
              }

            </Paper>

          </motion.div>

        </Container>

      </Box>
    </>
  );
}

export default InterviewRoom;