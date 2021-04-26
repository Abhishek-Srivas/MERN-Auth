import React, { useState } from "react";
import "./Otp.css";
import axios from "axios";
import { IoMdArrowBack } from "react-icons/io";
import { Link, Redirect } from "react-router-dom";
import Alert from "../Alerts/Alerts";

const initialValues = {
  otp: "",
};
const altData = {
  message: "random",
  type: false,
};
const Otp = () => {
  const [otpDetail, setOtpDetail] = useState(initialValues);
  const [redirect, setRedirect] = useState(null);
  const [success, setSuccess] = useState(false);
  const [alertdata, setAlertData] = useState(altData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setOtpDetail({
      ...otpDetail,
      [name]: value,
    });
  };

  const otpRequestHandler = (e) => {
    e.preventDefault();
    const data = {
      email: localStorage.getItem("email"),
      otp: otpDetail.otp,
    };

    axios
      .post("http://localhost:8000/signup/check-otp", data)
      .then((result) => {
        console.log(result);

        const alertData = {
          message: "OTP Verified! Logging In",
          type: true,
        };
        setAlertData(alertData);
        setSuccess(true);

        const timer = setTimeout(() => setRedirect("home"), 3000);
        return () => clearTimeout(timer);
        
      })
      .catch((err) => {
        console.log(err.response);
        if (err.response.status === 406) {
          console.log(err.response.data);

          const alertData = {
            message: err.response.data,
            type: false,
          };

          setAlertData(alertData);
          setSuccess(true);
        } else {
          const alertData = {
            message: err.response.data,
            type: false,
          };

          setAlertData(alertData);
          setSuccess(true);
        }
      });
    setSuccess(false);
  };

  const resendOtpHandler = () => {
    const resendOtpData = {email:localStorage.getItem("email")};
    console.log(resendOtpData)
    axios
      .post("http://localhost:8000/resendOtp", resendOtpData)
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  if (redirect) {
    return <Redirect to={`/${redirect}`} />;
  }

  return (
    <div className="Otp-Container">
      <div className="Otp-Card">
        <Link to="/">
          <IoMdArrowBack className="back-arrow" />
        </Link>
        <form className="Auth-loginForm" onSubmit={otpRequestHandler}>
          <input
            value={otpDetail.otp}
            onChange={handleInputChange}
            type="text"
            className="Auth-loginForm-Input"
            placeholder="Otp"
            name="otp"
            required
          />
          <div className="Auth-loginForm-ForgetPassword">
            <p
              style={{ textDecoration: "none", color: "#00000099" }}
              onClick={resendOtpHandler}
            >
              Resend Otp
            </p>
          </div>
          <button type="submit" className="Auth-Login-Button">
            Submit
          </button>
        </form>
      </div>
      {success ? <Alert alertdata={alertdata} /> : ""}
    </div>
  );
};

export default Otp;
