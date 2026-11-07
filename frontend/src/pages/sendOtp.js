// ==========================================
// SEND OTP
// ==========================================

const sendOTP = async () => {

  // VALIDATION

  if (!phone) {

    alert("Enter Phone Number");

    return;
  }

  try {

    setLoading(true);

    const response = await axios.post(
      "http://127.0.0.1:8000/api/accounts/send-otp/",
      {
        phone: phone
      }
    );

    console.log(response.data);

    alert(response.data.message);

    // SHOW OTP FIELD
    setOtpSent(true);

  } catch (error) {

    console.log(error);

    if (error.response) {

      alert(
        error.response.data.message ||
        "OTP Send Failed"
      );

    } else {

      alert("Server Error");

    }

  } finally {

    setLoading(false);

  }
};


// ==========================================
// VERIFY OTP
// ==========================================

const verifyOTP = async () => {

  // VALIDATION

  if (!otp) {

    alert("Enter OTP");

    return;
  }

  try {

    setLoading(true);

    const response = await axios.post(
      "http://127.0.0.1:8000/api/accounts/verify-otp/",
      {
        otp: otp
      }
    );

    console.log(response.data);

    alert(response.data.message);

    // ==========================================
    // SAVE LOGIN STATUS
    // ==========================================

    localStorage.setItem(
      "isAuthenticated",
      "true"
    );

    // ==========================================
    // REDIRECT
    // ==========================================

    navigate("/dashboard");

  } catch (error) {

    console.log(error);

    if (error.response) {

      alert(
        error.response.data.message ||
        "Invalid OTP"
      );

    } else {

      alert("Server Error");

    }

  } finally {

    setLoading(false);

  }
};