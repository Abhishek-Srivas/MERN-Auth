import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <p> You are logged In</p>
      <div className="logout-btn">
        <Link to="/"> Logout </Link>
      </div>
    </div>
  );
};

export default Home;
