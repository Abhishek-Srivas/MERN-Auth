import React, { useState } from "react";
import {  Redirect,Link } from "react-router-dom";
import "./Auth.css";
import axios from "axios";
import {SiGmail} from 'react-icons/si'
import {FaFacebookSquare} from 'react-icons/fa'
import {GrInstagram} from 'react-icons/gr'

const initialValues = {
  email: "",
  password: "",
};

const signupValues = {
  userName: "",
  email: "",
  password: "",
};

const Auth = () => {
  const [Toggler, SetToggler] = useState(true);
  const [redirect, setRedirect] = useState(null);
  const [values, setValues] = useState(initialValues);
  const [signup, setSignup] = useState(signupValues);
  const [errors, setErrors] = useState({
    pass: true
  });

  const validateLogin = () => {
    const er = {} 
    er.pass = true;
    if(!values.email){
        er.email = "Email Required";
        er.pass = false;
    }
    else if(!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(values.email)){
      er.email = "Email Address is Invalid"
      er.pass = false;
    }

    if(!values.password.trim()){
      er.password = "Password required";      
    }

    setErrors(er);
  }


  const validateSignup = () => {
    const er = {} 
    er.pass = true;
    if(!signup.email){
        er.emailS = "Email Required";
        er.pass = false;
    }
    else if(!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(signup.email)){
      er.emailS = "Email Address is Invalid"
      er.pass = false;
    }

    if(!signup.password.trim()){
      er.passwordS = "Password required"; 
      er.pass = false;     
    }else if(signup.password.length < 6){
      er.passwordS = "Password needs to be 6 characters or more"
      er.pass = false;
    }

    if(!signup.userName.trim()){
      er.userName = "Username Required";
      er.pass = false;      
    }else if(signup.userName.length < 3){
      er.userName = "Username needs to be 3 characters or more"
      er.pass = false;
    }

    setErrors(er);
  }

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
    console.log(errors)
    if(errors.pass){
      console.log("here")
    const data = {
      email: values.email,
      password: values.password,
    };
    console.log(data);
    axios
      .post("http://localhost:8000/login", data)
      .then((result) => {
        console.log(result);
        setRedirect("home");
      })
      .catch((err) => {
        console.log(err);
      });
    }
  };

  const signUpHandler = (e) => {
    e.preventDefault();

    if(errors.pass){
    const data = {
      name: signup.userName,
      email: signup.email,
      password: signup.password,
    };

    localStorage.setItem('email',signup.email );

    axios
      .post("http://localhost:8000/signup", data)
      .then((result) => {
        console.log(result);
        setRedirect("otp-check");
      })
      .catch((err) => {
        console.log(err);
      });
    }
  };
  if (redirect) {
    return <Redirect to={`/${redirect}`} />;
  }

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
          <form className="Auth-loginForm" onSubmit={loginHandler}>
            <input
              value={values.email}
              onChange={handleInputChange}
              type="email"
              className="Auth-loginForm-Input"
              placeholder="Email"
              name="email"
              required
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
              required
            />
            <div className="Validation">
            {errors.password && <p>{errors.password}</p>}
            </div>
            <div className="Auth-loginForm-ForgetPassword">
              <p><Link to="/reset-email" style={{textDecoration:"none",color:"#000"}}> Forgot Password :</Link>(</p> 
            </div>
            <button
              type="submit"
              className="Auth-Login-Button"
              onClick={ validateLogin }
            > Log In
              
            </button>
          </form>
        ) : (
          <form className="Auth-loginForm" onSubmit={signUpHandler}>
            <input
              value={signup.userName}
              type="text"
              onChange={handleSignupChange}
              className="Auth-loginForm-Input"
              placeholder="User Name"
              name="userName"
              required
            />
            <div className="Validation">
            {errors.userName && <p>{errors.userName}</p>}
            </div>
            <input
              value={signup.email}
              type="email"
              onChange={handleSignupChange}
              className="Auth-loginForm-Input"
              placeholder="Email"
              name="email"
              required
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
              required
            />
            <div className="Validation">
            {errors.passwordS && <p>{errors.passwordS}</p>}
            </div>
            <button
              type="submit"
              className="Auth-Login-Button"
              onClick = {validateSignup}
            ><span>
              Sign Up
              </span>
            </button>
          </form>
        )}

        <div className="Auth-Icons-Container">
          <ul className="Auth-Icons-Wrapper">
            <li className="Auth-Icons"><SiGmail style={{color:"#BB001B"}} /></li>
            <li className="Auth-Icons"><FaFacebookSquare style={{color:"#4267B2"}}/></li>
            <li className="Auth-Icons"><GrInstagram style={{color:"#E1306C"}}/></li>
          </ul>
        </div>
      </div>
      
    </div>
  );
};

export default Auth;
