import React, {useState, useEffect} from 'react';
import { useSelector } from "react-redux";
import authToken from "../utils/authToken";
import { Alert } from "react-bootstrap";
import PieChart from './Activity/PieChart.js';
import LineChart from './Activity/LineChart.js';
import { withStyles } from '@mui/styles';
import {styles} from'./styles'
import jwt_decode from "jwt-decode";

import axios from "axios";
import {BASE_DEV_URL} from "../utils/constants.js";
import moment from "moment";
import ProgressBar from './Activity/ProgressBar.js';

const Home = (props) => {
    const {
    classes
    } = props;

  if (localStorage.jwtToken) {
    authToken(localStorage.jwtToken);
  }
  const auth = useSelector((state) => state.auth);
    const [startDate, setStartDate] = useState(moment().subtract(9, 'months').format("YYYY-MM"));
    const [endDate, setEndDate] = useState(moment().format("YYYY-MM"));
    const [singleDate, setSingleDate] = useState(moment().format("YYYY-MM"));
    const [progressBarData, setProgressBarData] = useState("0");
    const [data, setData] = useState();
    const [username, setUsername] = useState();

 useEffect(() => {
     if (localStorage && localStorage.jwtToken) {
             const token = localStorage.jwtToken
             const decoded = jwt_decode(token);
             const usuario = decoded.sub;
             setUsername(usuario);
             peticionGetProgressBarData();
       }

 }, [username])

const peticionGetProgressBarData = async () =>{
  const chartData = "";
 await axios.get(BASE_DEV_URL + "rest/objetivos/getProgresoObjetivo?user_email=" + username + "&yearMonthPeriodStart="+ endDate + "&yearMonthPeriodEnd="+ endDate).then(response=>{
  if( response.data[0].progressCalory !== 0 && response.data[0].targetCaloryCount !== 0 ){
    let percentage = parseFloat((response.data[0].progressCalory)/parseInt(response.data[0].targetCaloryCount) * 100).toFixed(2);
      if(percentage  > 100){
          percentage = 100;
      }
    setProgressBarData(percentage.toString());
  }
}).catch(error=>{
  console.log(error.message);
})
}


  return (
  <div className={classes.root}>
      <Alert style={{ backgroundColor: "#343A40", color: "#ffffff80" }}>
        Welcome {auth.username}
      </Alert>
      <div>
        <ProgressBar done={progressBarData}/>
      </div>
      <div className={classes.container}>
        <div className={classes.header}>
         <h4>Porcentaje entrenamientos por categoría</h4>
        </div>
         <PieChart singleDate={singleDate} setSingleDate={setSingleDate}/>
       </div>
        <div className={classes.container}>
            <div className={classes.header}>
              <h4>Trackeo de Calorias Anual:</h4>
            </div>
            <LineChart startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} />
            <div className={classes.header}>
             <h7>Solo mostrara los meses en los que se registraron entrenamientos</h7>
            </div>
        </div>
  </div>
  );
};
  //

export default withStyles(styles)(Home);

