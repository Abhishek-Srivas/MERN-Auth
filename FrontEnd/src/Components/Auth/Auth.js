import React, { useState } from "react";
import { Redirect, Link } from "react-router-dom";
import "./Auth.css";
import axios from "axios";
import { GoogleLogin } from "react-google-login";
import { SiGmail } from "react-icons/si";
import { FaFacebookSquare } from "react-icons/fa";
import { GrInstagram } from "react-icons/gr";
import Alert from "../Alerts/Alerts";

const initialValues = {
  email: "",
  password: "",
};

const signupValues = {
  userName: "",
  email: "",
  password: "",
};

const altData = {
  message: "random",
  type: false,
};
const Auth = () => {
  const [Toggler, SetToggler] = useState(true);
  const [redirect, setRedirect] = useState(null);
  const [values, setValues] = useState(initialValues);
  const [signup, setSignup] = useState(signupValues);
  const [errors, setErrors] = useState({
    pass: true,
  });

  const [success, setSuccess] = useState(false);
  const [alertdata, setAlertData] = useState(altData);

  const validateLogin = () => {
    const er = {};
    er.pass = true;
    if (!values.email) {
      er.email = "Email Required";
      er.pass = false;
    } else if (
      !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(
        values.email
      )
    ) {
      er.email = "Email Address is Invalid";
      er.pass = false;
    }

    if (!values.password.trim()) {
      er.password = "Password required";
    }

    setErrors(er);
  };

  const validateSignup = () => {
    const er = {};
    er.pass = true;
    if (!signup.email) {
      er.emailS = "Email Required";
      er.pass = false;
    } else if (
      !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(
        signup.email
      )
    ) {
      er.emailS = "Email Address is Invalid";
      er.pass = false;
    }

    if (!signup.password.trim()) {
      er.passwordS = "Password required";
      er.pass = false;
    } else if (signup.password.length < 6) {
      er.passwordS = "Password needs to be 6 characters or more";
      er.pass = false;
    }

    if (!signup.userName.trim()) {
      er.userName = "Username Required";
      er.pass = false;
    } else if (signup.userName.length < 3) {
      er.userName = "Username needs to be 3 characters or more";
      er.pass = false;
    }

    setErrors(er);
  };

  const toggle = () => {
    const newState = !Toggler;
    SetToggler(newState);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;

    setSignup({
      ...signup,
      [name]: value,
    });
  };

  const loginHandler = (e) => {
    e.preventDefault();

    if (errors.pass) {
      const data = {
        email: values.email,
        password: values.password,
      };

      axios
        .post("http://localhost:8000/login", data)
        .then((result) => {
          console.log(result);
          const alertData = {
            message: "Logging In",
            type: true,
          };

          localStorage.setItem("refreshToken", result.data.refreshToken);
          localStorage.setItem("accessToken", result.data.signAccessToken);
          localStorage.setItem("userId", result.data.userId);
          setAlertData(alertData);
          setSuccess(true);
          const timer = setTimeout(() => setRedirect("home"), 3000);
          return () => clearTimeout(timer);
        })
        .catch((err) => {
          const alertData = {
            message: err.response.data.message,
            type: false,
          };
          setAlertData(alertData);
          setSuccess(true);
        });

      setSuccess(false);
    }
  };

  const signUpHandler = (e) => {
    e.preventDefault();

    if (errors.pass) {
      const data = {
        name: signup.userName,
        email: signup.email,
        password: signup.password,
      };

      localStorage.setItem("email", signup.email);

      axios
        .post("http://localhost:8000/signup", data)
        .then((result) => {
          const alertData = {
            message: "OTP send to your Email",
            type: true,
          };
          setAlertData(alertData);
          setSuccess(true);
          const timer = setTimeout(() => setRedirect("otp-check"), 3000);
          return () => clearTimeout(timer);
        })
        .catch((err) => {
          if (err.response.status === 422) {
            const alertData = {
              message: err.response.data.error.message.data[0].msg,
              type: false,
            };

            setAlertData(alertData);
            setSuccess(true);
          } else {
            const alertData = {
              message: err.response.data.error.message.data[0].msg,
              type: false,
            };

            setAlertData(alertData);
            setSuccess(true);
          }
        });

      setSuccess(false);
    }
  };

  const responseSuccessGoogleSignup = (res) => {
    console.log(res);
    // /api/googleauth
    const data = {
      name: res.profileObj.name,
      email: res.profileObj.email,
      token: res.tokenId,
    };
    // isloading = true;
    axios
      .post("http://localhost:8000/api/googleauth", data)
      .then((result) => {
        console.log(result);
        setRedirect("home");
        //isloading = false
      })
      .catch((err) => {
        console.log(err.response);
        //isloading = false
      });
  };

  const responseSuccessGoogleLogin = (res) => {
    console.log(res.tokenId);
    const data = {
      token: res.tokenId,
    };

    axios
      .post("http://localhost:8000/api/googlelogin", data)
      .then((result) => {
        console.log(result);
        setRedirect("home");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const responseFailureGoogle = (res) => {
    console.log(res);
  };

  if (redirect) {
    return <Redirect to={`/${redirect}`} />;
  }
  // if(isloading === true){
  //   return( <h1>Loading</h1>    )
  // }
  return (
    <div className="Auth-container">
      <div className="Auth-card">
        <div className="Auth-Buttons-Wrapper">
          <div className={Toggler ? "auth-btn" : "auth-btn-transition"}></div>
          <button
            type="button"
            className="Auth-Button"
            onClick={Toggler ? null : toggle}
          >
            Log In
          </button>
          <button
            type="button"
            className="Auth-Button"
            onClick={Toggler ? toggle : null}
          >
            Sign Up
          </button>
        </div>
        {Toggler ? (
          <>
            <form className="Auth-loginForm" onSubmit={loginHandler}>
              <input
                value={values.email}
                onChange={handleInputChange}
                type="text"
                className="Auth-loginForm-Input"
                placeholder="Email"
                name="email"
              />
              <div className="Validation">
                {errors.email && <p>{errors.email}</p>}
              </div>
              <input
                value={values.password}
                onChange={handleInputChange}
                type="password"
                className="Auth-loginForm-Input"
                placeholder="Passowrd"
                name="password"
              />
              <div className="Validation">
                {errors.password && <p>{errors.password}</p>}
              </div>
              <div className="Auth-loginForm-ForgetPassword">
                <p>
                  <Link
                    to="/reset-email"
                    style={{ textDecoration: "none", color: "#000" }}
                  >
                    {" "}
                    Forgot Password :
                  </Link>
                  (
                </p>
              </div>
              <button
                type="submit"
                className="Auth-Login-Button"
                onClick={validateLogin}
              >
                {" "}
                Log In
              </button>
            </form>
            <div className="Auth-Icons-Container">
              <ul className="Auth-Icons-Wrapper">
                <li className="Auth-Icons">
                  <GoogleLogin
                    clientId="277609826086-e51snulj2eqgj20kurchcae927meok7f.apps.googleusercontent.com"
                    render={(renderProps) => (
                      <SiGmail
                        style={{ color: "#BB001B" }}
                        onClick={renderProps.onClick}
                        disabled={renderProps.disabled}
                      />
                    )}
                    buttonText="Login"
                    onSuccess={responseSuccessGoogleLogin}
                    onFailure={responseFailureGoogle}
                    cookiePolicy={"single_host_origin"}
                  />
                  {/* <SiGmail style={{ color: "#BB001B" }} /> */}
                </li>
                <li className="Auth-Icons">
                  <FaFacebookSquare style={{ color: "#4267B2" }} />
                </li>
                <li className="Auth-Icons">
                  <GrInstagram style={{ color: "#E1306C" }} />
                </li>
              </ul>
            </div>
          </>
        ) : (
          <>
            <form className="Auth-loginForm" onSubmit={signUpHandler}>
              <input
                value={signup.userName}
                type="text"
                onChange={handleSignupChange}
                className="Auth-loginForm-Input"
                placeholder="User Name"
                name="userName"
              />
              <div className="Validation">
                {errors.userName && <p>{errors.userName}</p>}
              </div>
              <input
                value={signup.email}
                type="text"
                onChange={handleSignupChange}
                className="Auth-loginForm-Input"
                placeholder="Email"
                name="email"
              />
              <div className="Validation">
                {errors.emailS && <p>{errors.emailS}</p>}
              </div>
              <input
                value={signup.password}
                type="password"
                onChange={handleSignupChange}
                className="Auth-loginForm-Input"
                placeholder="Passowrd"
                name="password"
              />
              <div className="Validation">
                {errors.passwordS && <p>{errors.passwordS}</p>}
              </div>
              <button
                type="submit"
                className="Auth-Login-Button"
                onClick={validateSignup}
              >
                <span>Sign Up</span>
              </button>
            </form>
            <div className="Auth-Icons-Container">
              <ul className="Auth-Icons-Wrapper">
                <li className="Auth-Icons">
                  <GoogleLogin
                    clientId="277609826086-e51snulj2eqgj20kurchcae927meok7f.apps.googleusercontent.com"
                    render={(renderProps) => (
                      <SiGmail
                        style={{ color: "#BB001B" }}
                        onClick={renderProps.onClick}
                        disabled={renderProps.disabled}
                      />
                    )}
                    buttonText="Login"
                    onSuccess={responseSuccessGoogleSignup}
                    onFailure={responseFailureGoogle}
                    cookiePolicy={"single_host_origin"}
                  />

                  {/* <SiGmail style={{ color: "#BB001B" }} /> */}
                </li>
                <li className="Auth-Icons">
                  <FaFacebookSquare style={{ color: "#4267B2" }} />
                </li>
                <li className="Auth-Icons">
                  <GrInstagram style={{ color: "#E1306C" }} />
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
      {success ? <Alert alertdata={alertdata} /> : ""}
    </div>
  );
};

export default Auth;
