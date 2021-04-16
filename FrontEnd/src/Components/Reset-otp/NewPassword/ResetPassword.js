import React, { useState } from "react";
import axios from "axios";
import { IoMdArrowBack } from "react-icons/io";
import { Link, Redirect } from "react-router-dom";

const initialValues = {
  newPassword: "",
  confirmPassword: "",
};

const ResetPassword = () => {
  const [passwordDetail, setPasswordDetail] = useState(initialValues);
  const [redirect, setRedirect] = useState(null);
  const [errors, setErrors] = useState({
    pass: true,
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setPasswordDetail({
      ...passwordDetail,
      [name]: value,
    });
  };
  const validatePassword = () => {
    const er = {};
    er.pass = true;
    if (!passwordDetail.newPassword) {
      er.newPassword = "Password Required";
      er.pass = false;
    }

    // if (!passwordDetail.confirmPassword) {
    //   er.confirmPassword = "Password Required";
    //   er.pass = false;
    // }

    if (passwordDetail.newPassword !== passwordDetail.confirmPassword) {
      er.confirmPassword = "Password Don't Match";
      er.pass = false;
    }

    setErrors(er);
  };

  const otpRequestHandler = (e) => {
    e.preventDefault();

    if (errors.pass) {
      const data = {
        email: localStorage.getItem("email"),
        newPassword: passwordDetail.newPassword,
        confirmPassword: passwordDetail.confirmPassword,
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
    }
  };
  if (redirect) {
    return <Redirect to={`${redirect}`} />;
  }
  return (
    <div className="Otp-Container">
      <div className="Otp-Card">
        <Link to="/">
          <IoMdArrowBack className="back-arrow" />
        </Link>
        <form className="Auth-loginForm" onSubmit={otpRequestHandler}>
          <input
            value={passwordDetail.newPassword}
            onChange={handleInputChange}
            type="password"
            className="Auth-loginForm-Input"
            placeholder="New Password"
            name="newPassword"
            required
          />
          <div className="Validation">
            {errors.newPassword && <p>{errors.newPassword}</p>}
          </div>
          <input
            value={passwordDetail.confirmPassword}
            onChange={handleInputChange}
            type="password"
            className="Auth-loginForm-Input"
            placeholder="Confirm Password"
            name="confirmPassword"
            required
          />
          <div className="Validation">
            {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
          </div>
          <button
            type="submit"
            className="Auth-Login-Button"
            onClick={validatePassword}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
