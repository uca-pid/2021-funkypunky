import React from "react";
import { useSelector } from "react-redux";
import authToken from "../utils/authToken";
import { Alert } from "react-bootstrap";
import PieChart from './Activity/PieChart.js';

const Home = () => {
  if (localStorage.jwtToken) {
    authToken(localStorage.jwtToken);
  }

  const auth = useSelector((state) => state.auth);

  return (
  <div>
      <Alert style={{ backgroundColor: "#343A40", color: "#ffffff80" }}>
        Welcome {auth.username}
      </Alert>
      <div>This is your Historical Training Dashboard!</div>
      <PieChart />
  </div>


  );
};

export default Home;

