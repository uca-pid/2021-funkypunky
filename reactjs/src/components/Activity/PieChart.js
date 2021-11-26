import React, {useState, useEffect} from 'react'
import { Pie } from 'react-chartjs-2'

import { useSelector } from "react-redux";
import authToken from "../../utils/authToken";
import { Alert } from "react-bootstrap";
import { withStyles } from '@mui/styles';
import {styles} from'.././styles'
import axios from "axios";
import {BASE_DEV_URL} from "../../utils/constants.js";
import { Container, Row, Col } from 'react-grid-system';
import jwt_decode from "jwt-decode";





const PieChart = (props) => {
    const {
          setSingleDate,
          singleDate
           } = props;

    const [categories, setCategories] = useState([]);
    const [values, setValues] = useState([]);
    const [username, setUsername] = useState();
    const [loading, setLoading] = useState(true);

    const peticionGetData = async () => {
                await axios.get(BASE_DEV_URL + "rest/metrics/userCategoryBreakdown?user_email="+username+"&yearMonthStr="+ singleDate).then(response=> {
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
                if (localStorage && localStorage.jwtToken) {
                        const token = localStorage.jwtToken
                        const decoded = jwt_decode(token);
                        const usuario = decoded.sub;
                        setUsername(usuario);
                        if (username != ''){
                            setLoading(false);
                        }
                }
        peticionGetData();
    },[singleDate, username])

    const onChangeStartDateHandler = (event) => {
    setSingleDate(event.target.value);
    }

  return loading ? <div style={{color: 'white'}}>Cargando datos...</div> :
  (
    <div>
    <Container>
         <Row>
             <Col sm={4}>
            <input  value={singleDate} onInput={e => setSingleDate(e.target.value)} onChange={onChangeStartDateHandler} className="form-control" required type="month" name="fecha_inicial" id="fecha_inicial" />
             </Col>
          </Row>
          <Row>
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
        </Row>
    </Container>
    </div>
  )
}

export default PieChart;