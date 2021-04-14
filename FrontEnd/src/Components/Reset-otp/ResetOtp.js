import React, { useState } from "react";
import axios from "axios";
import { IoMdArrowBack } from "react-icons/io";
import { Link, Redirect } from "react-router-dom";

const initialValues = {
  email: "",
};

const RestOtp = () => {
  const [otpDetail, setOtpDetail] = useState(initialValues);
  const [redirect, setRedirect] = useState(null);
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
      email: otpDetail.email,
    };

    localStorage.setItem("email", otpDetail.email);

    axios
      .post("http://localhost:8000/send-reset-otp", data)
      .then((result) => {
        console.log(result);
        setRedirect("check-resetotp");
      })
      .catch((err) => {
        console.log(err);
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
        <form className="Auth-loginForm">
          <input
            value={otpDetail.email}
            onChange={handleInputChange}
            type="text"
            className="Auth-loginForm-Input"
            placeholder="Email"
            name="email"
            required
          />

          <button
            type="submit"
            className="Auth-Login-Button"
            onClick={otpRequestHandler}
          >
             Submit 
          </button>
        </form>
      </div>
    </div>
  );
};

export default RestOtp;
