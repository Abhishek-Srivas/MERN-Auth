import React, { useState } from "react";
import axios from "axios";
import {IoMdArrowBack} from 'react-icons/io'
import { Link,Redirect } from "react-router-dom";

const initialValues = {
  newPassword:"",
  confirmPassword:""
};

const ResetPassword = () => {
  const [passwordDetail, setPasswordDetail] = useState(initialValues);
  const [redirect, setRedirect] = useState(null);
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setPasswordDetail({
      ...passwordDetail,
      [name]: value,
    });
  };

  const otpRequestHandler = (e) => {
    e.preventDefault();
    const data = {
      email: localStorage.getItem('email'),
      newPassword:passwordDetail.newPassword,
      confirmPassword:passwordDetail.confirmPassword
    };

    axios
      .post("http://localhost:8000/reset-password", data)
      .then((result) => {
        console.log(result);
        setRedirect("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  if (redirect) {
    return <Redirect to={`${redirect}`} />;
  }
  return (
    <div className="Otp-Container">
      <div className="Otp-Card">
      <Link to="/"><IoMdArrowBack className="back-arrow"/></Link>
        <form className="Auth-loginForm">
          <input
            value={passwordDetail.newPassword}
            onChange={handleInputChange}
            type="password"
            className="Auth-loginForm-Input"
            placeholder="New Password"
            name="newPassword"
            required
          />
          <input
            value={passwordDetail.confirmPassword}
            onChange={handleInputChange}
            type="password"
            className="Auth-loginForm-Input"
            placeholder="Confirm Password"
            name="confirmPassword"
            required
          />

          <button type="submit" className="Auth-Login-Button" onClick={otpRequestHandler}>
             Submit 
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
