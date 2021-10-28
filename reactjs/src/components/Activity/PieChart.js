import React, {useState, useEffect} from 'react'
import { Pie } from 'react-chartjs-2'

import { useSelector } from "react-redux";
import authToken from "../../utils/authToken";
import { Alert } from "react-bootstrap";
import { withStyles } from '@mui/styles';
import {styles} from'.././styles'
import axios from "axios";
import {BASE_DEV_URL} from "../../utils/constants.js";

const PieChart = () => {
    const [categories, setCategories] = useState([]);
    const [values, setValues] = useState([]);

    const peticionGetData = async () => {
                await axios.get(BASE_DEV_URL + "rest/metrics/userCategoryBreakdown?user_email=test@user.com&yearMonthStr=2021-09").then(response=> {
                    setCategories(Object.keys(response.data));
                    setValues(Object.values(response.data));
                }).catch(error=>{
                    console.log(error.message);
                })
            }

  if (localStorage.jwtToken) {
    authToken(localStorage.jwtToken);
  }

  const auth = useSelector((state) => state.auth);
    //const [dataLine, setDataLine] = useState();
useEffect(() => {
peticionGetData();
},[])

  return (
    <div>
      <Pie
        data={{
          labels: categories,
          datasets: [
            {
              label: '# of votes',
              data: values,
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)'
              ],
              borderWidth: 3,
            },
          ],
        }}
        height={400}
        width={600}
        options={{
          maintainAspectRatio: false,
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
          legend: {
            labels: {
              fontSize: 20,
            },
          },
        }}
      />
    </div>
  )
}

export default PieChart;