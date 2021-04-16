import React, { useState } from "react";
import axios from "axios";
import { IoMdArrowBack } from "react-icons/io";
import { Link, Redirect } from "react-router-dom";

const initialValues = {
  otp: "",
};

const CheckOtp = () => {
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
      email: localStorage.getItem("email"),
      otp: otpDetail.otp,
    };

    axios
      .post("http://localhost:8000/check-reset-otp", data)
      .then((result) => {
        console.log(result);
        setRedirect("reset-password");
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
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckOtp;
