import React, {useState} from 'react';
import { useSelector } from "react-redux";
import authToken from "../utils/authToken";
import { Alert } from "react-bootstrap";
import PieChart from './Activity/PieChart.js';
import LineChart from './Activity/LineChart.js';
import { withStyles } from '@mui/styles';
import {styles} from'./styles'

const Home = (props) => {
    const {
    classes
    } = props;

const [value, setValue] = useState(new Date());
  if (localStorage.jwtToken) {
    authToken(localStorage.jwtToken);
  }

  const auth = useSelector((state) => state.auth);

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
           <LineChart />
        </div>
  </div>


  );
};

export default withStyles(styles)(Home);

