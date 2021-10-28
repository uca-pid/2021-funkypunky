import React, {useState, useEffect} from 'react';
import { useSelector } from "react-redux";
import authToken from "../utils/authToken";
import { Alert } from "react-bootstrap";
import PieChart from './Activity/PieChart.js';
import LineChart from './Activity/LineChart.js';
import { withStyles } from '@mui/styles';
import {styles} from'./styles'
import axios from "axios";
import {BASE_DEV_URL} from "../utils/constants.js";
import moment from "moment";

const Home = (props) => {
    const {
    classes
    } = props;

  if (localStorage.jwtToken) {
    authToken(localStorage.jwtToken);
  }
  const auth = useSelector((state) => state.auth);
    const [startDate, setStartDate] = useState(moment().subtract(1, 'months').format("YYYY-MM"));
    const [endDate, setEndDate] = useState(moment().format("YYYY-MM"));

    useEffect(()=>{
        console.log(startDate, 'startDate')
        console.log(endDate, 'endDate')
    }, [])

  return (
  <div className={classes.root}>
      <Alert style={{ backgroundColor: "#343A40", color: "#ffffff80" }}>
        Welcome {auth.username}
      </Alert>
      <div className={classes.container}>
        <div className={classes.header}>
         <h4>Porcentaje entrenamientos por categoría</h4>
        </div>
         <PieChart />
       </div>
        <div className={classes.container}>
            <div className={classes.header}>
              <h4>Calorías quemadas por mes</h4>
            </div>
            <LineChart startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} />
        </div>
  </div>
  );
};
  //

export default withStyles(styles)(Home);

