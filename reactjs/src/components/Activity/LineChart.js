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
import jwt_decode from "jwt-decode";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

function swalAlert(texto){
    return MySwal.fire(texto)
}

const LineChart = (props) => {
    const {
          startDate,
          setStartDate,
          endDate,
          setEndDate
           } = props;

    const [categories, setCategories] = useState([]);
    const [values, setValues] = useState([]);
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(true);
    const [anio, setAnio] = useState(2021);
    const peticionGetData = async () => {
    await axios.get(BASE_DEV_URL +"rest/metrics/caloriesInRange?user_email="+username+"&rangeStart="+ startDate + "&rangeEnd=" + endDate).then(response=> {
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
    },[username])

    const onChangeStartDateHandler = (event) => {
    if(event == ""){
        swalAlert("Ingrese un año por favor");
    }else{
        if(event<0){
            swalAlert("Ingrese un año por favor");
        }else{
            setStartDate(event.target.value);

        }
    }



    }
    const onChangeEndDateHandler = (event) => {
    setEndDate(event.target.value);
    }

    const peticionGetCalorias = (event) => {
    if(anio < 2000 || anio > 2100){
        swalAlert("Ingrese un año valido (entre 2000 y 2100)");
    }else{
    let fecha1 = anio+"-01";
        let fecha2 = anio+"-12";
        axios.get(BASE_DEV_URL +"rest/metrics/caloriesInRange?user_email="+username+"&rangeStart="+ fecha1 + "&rangeEnd=" + fecha2).then(response=> {
                                setCategories(Object.keys(response.data));
                                setValues(Object.values(response.data));
                            }).catch(error=>{
                                console.log(error.message);
                            })
    }

    }

    const onChangeAnioDateHandler = (event) => {
        setAnio(event.target.value);

    }

      return loading ? <div style={{color: 'white'}}>Cargando datos...</div> :
      (
   <Container>
     <Row>
         <Col sm={4}>
        <input placeholder="Ingrese año" value={startDate} onInput={e => setStartDate(e.target.value)} onChange={onChangeAnioDateHandler} className="form-control" required type="number" name="fecha_inicial" id="fecha_inicial" />
         </Col>
         <Col sm={4}>
           <button className="btn btn-primary" onClick={peticionGetCalorias}>
             Obtener % Cals/Obj
           </button>
        </Col>
      </Row>
      <br />
      <Row>
      <br />
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