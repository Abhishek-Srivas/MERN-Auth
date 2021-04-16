import React, { useState } from "react";
import "./Otp.css";
import axios from "axios";
import { IoMdArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";

const initialValues = {
  otp: "",
};

const Otp = () => {
  const [otpDetail, setOtpDetail] = useState(initialValues);

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
        // setRedirect("signup");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="Otp-Container">
      <div className="Otp-Card">
        <Link to="/">
          <IoMdArrowBack className="back-arrow" />
        </Link>
        <form className="Auth-loginForm">
          <input
            value={otpDetail.otp}
            onChange={handleInputChange}
            type="text"
            className="Auth-loginForm-Input"
            placeholder="Otp"
            name="otp"
            required
          />

          <button
            type="submit"
            className="Auth-Login-Button"
            onClick={otpRequestHandler}
          >
            <Link to="/home"> Submit </Link>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Otp;
