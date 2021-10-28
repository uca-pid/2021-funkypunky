import React, {useState, useEffect} from 'react';
import { Line } from 'react-chartjs-2'

import { useSelector } from "react-redux";
import authToken from "../../utils/authToken";
import { Alert } from "react-bootstrap";
import { withStyles } from '@mui/styles';
import {styles} from'.././styles'
import axios from "axios";
import {BASE_DEV_URL} from "../../utils/constants.js";
import { Container, Row, Col } from 'react-grid-system';

const LineChart = (props) => {
    const {
          startDate,
          setStartDate,
          endDate,
          setEndDate
           } = props;

    const [categories, setCategories] = useState([]);
    const [values, setValues] = useState([]);

    const peticionGetData = async () => {
                await axios.get(BASE_DEV_URL +"rest/metrics/caloriesInRange?user_email=test@user.com&rangeStart="+ startDate + "&rangeEnd=" + endDate).then(response=> {
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

    useEffect(() => {
    peticionGetData();
    },[startDate, endDate])

    const onChangeStartDateHandler = (event) => {
    setStartDate(event.target.value);
    }
    const onChangeEndDateHandler = (event) => {
    setEndDate(event.target.value);
    }

      return (
   <Container>
     <Row>
         <Col sm={4}>
        <input  value={startDate} onInput={e => setStartDate(e.target.value)} onChange={onChangeStartDateHandler} className="form-control" required type="month" name="fecha_inicial" id="fecha_inicial" />
         </Col>
         <Col sm={4}>
        <input  value={endDate} onInput={e => setEndDate(e.target.value)}  onChange={onChangeEndDateHandler} className="form-control" required type="month" name="fecha_final" id="fecha_final" />
        </Col>
      </Row>
      <Row>
      <Line
        data={{
          labels: categories,
          datasets: [
            {
              label: 'Total',
              data: values,
              backgroundColor: [
                              'rgba(153, 102, 255, 0.2)',

                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
              ],
              borderColor: [
                 'rgba(153, 102, 255, 1)',
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
        height={300}
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
           </Row>
          </Container>
  )
}

export default LineChart;