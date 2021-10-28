import authToken from "../../utils/authToken";
import React, { useState, useEffect, useMemo } from 'react';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import jwt_decode from "jwt-decode";
import Timestamp from 'react-timestamp'
import {BASE_DEV_URL} from "../../utils/constants.js";
import CategoriesSelector from './CategoriesSelector.js'
import { useSelector } from "react-redux";
import { Bar } from 'react-chartjs-2';


// {auth.username}

const Objetivos = () => {

const [data, setData] = useState([]);
const [categorias, setCategorias] = useState([]);
const [objetivos, setObjetivos] = useState([]);
const [modalInsertar, setModalInsertar] = useState(false);
const [modalEliminar, setModalEliminar] = useState(false);
const [username, setUsername] = useState('');
const [form, setForm] = useState({ id:'', usuario: '', periodo:'', objetivo:''})
const [tipoModal, setTipoModal] = useState();
const [loading, setLoading] = useState(true);
const [inicio, setInicio] = useState();
const [fin, setFin] = useState();
const [chartData, setChartData] = useState([]);
const [chartLabels, setChartLabels] = useState([]);

// INICIO

 useEffect(() => {
  if (localStorage && localStorage.jwtToken) {
        const token = localStorage.jwtToken
        const decoded = jwt_decode(token);
        const usuario = decoded.sub;
        setUsername(usuario);

        setForm({...form, usuario: decoded.sub});
  }
  peticionGet();
 }, [username])

// AXIOS

const peticionGet = async () =>{
  setLoading(true);
 await axios.get(BASE_DEV_URL + "rest/categorias/categoriaByUser?user_email="+ username).then(response=>{
  setCategorias(response.data);
}).catch(error=>{
  console.log(error.message);
})
await axios.get(BASE_DEV_URL + "rest/objetivos/getHistorialObjetivo?user_email="+ username).then(response=>{
  setObjetivos(response.data);
}).catch(error=>{
  console.log(error.message);
})
setLoading(false);
}

const peticionPost = async () => {
setForm({...form, usuario: username}); // {auth.username}
 delete form.id;
 await axios.post(BASE_DEV_URL + 'rest/objetivos/agregarObjetivo',{
                                                              'objetivo': parseInt(form.objetivo),
                                                              'usuario': username,
                                                              "periodo": form.periodo}).then(response=> {
                                                                                        handleModalInsertar();
                                                                                        peticionGet();
                                                                                        }).catch(error=>{ console.log(error.message); })}

const peticionPut = () => {
  axios.post(BASE_DEV_URL + 'rest/objetivos/editarObjetivo', {
                                                                'objetivo': parseInt(form.objetivo),
                                                                'usuario': username,
                                                                "periodo": form.periodo}).then(response=>{ handleModalInsertar(); peticionGet(); })}


const peticionGetRango = async () =>{
  const chartData = [];
  const chartLabels = [];
 await axios.get(BASE_DEV_URL + "rest/objetivos/getProgresoObjetivo?user_email=" + username +"&"+"yearMonthPeriodStart="+inicio+"&"+"yearMonthPeriodEnd="+fin).then(response=>{
  setData(response.data);
  for(const obj of response.data){
    chartLabels.push(obj.period);
    chartData.push(parseInt(obj.progressCalory)/parseInt(obj.targetCaloryCount) * 100 );
  }
}).catch(error=>{
  console.log(error.message);
})
  setChartData(chartData);
  setChartLabels(chartLabels);
}

const peticionDelete = () => {
  axios.post(BASE_DEV_URL + 'rest/objetivos/eliminarObjetivo', {'id':form.id}).then(response=>{
    setModalEliminar(false)
    peticionGet();
  })
}
  if (localStorage.jwtToken) {
    authToken(localStorage.jwtToken);
  }

// GRAFICO

const dataChart = {
  labels: chartLabels,
  datasets: [{
    label: '% Calorias Consumidas / Calorias Objetivo',
    data: chartData,
    backgroundColor: [
      'rgba(255, 99, 132, 0.2)',
      'rgba(255, 159, 64, 0.2)',
      'rgba(255, 205, 86, 0.2)',
      'rgba(75, 192, 192, 0.2)',
      'rgba(54, 162, 235, 0.2)',
      'rgba(153, 102, 255, 0.2)',
      'rgba(255, 99, 132, 0.2)',
      'rgba(255, 159, 64, 0.2)',
      'rgba(255, 205, 86, 0.2)',
      'rgba(75, 192, 192, 0.2)',
      'rgba(54, 162, 235, 0.2)',
      'rgba(153, 102, 255, 0.2)',
    ],
    borderColor: [
      'rgb(255, 99, 132)',
      'rgb(255, 159, 64)',
      'rgb(255, 205, 86)',
      'rgb(75, 192, 192)',
      'rgb(54, 162, 235)',
      'rgb(153, 102, 255)',
      'rgb(255, 99, 132)',
      'rgb(255, 159, 64)',
      'rgb(255, 205, 86)',
      'rgb(75, 192, 192)',
      'rgb(54, 162, 235)',
      'rgb(153, 102, 255)',
    ],
    borderWidth: 1
  }]
};

const options = {
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
          suggestedMax: 1.0,
        },
      },
    ],
  },
};



// OTROS

const auth = useSelector((state) => state.auth);

const handleModalInsertar = () => {
  setModalInsertar(!modalInsertar);
}

const seleccionarObjetivo = (objetivo) => {
setTipoModal('actualizar');
setForm({        id: objetivo.id,
                 usuario: username, // {auth.username}
                 periodo: objetivo.period,
                 objetivo: objetivo.targetCaloryCount
                 })
}

const handleChange = async e => {
e.persist();
setForm({
    ...form,
    [e.target.name]: e.target.value
  })
};

  const handleAgregarObjetivo = (objetivo) =>{
  setForm({});
  setTipoModal('insertar');
  handleModalInsertar()
  };

  const handleEditarObjetivo = (objetivo) =>{
  seleccionarObjetivo(objetivo);
  handleModalInsertar()
  }

  const handleEliminarObjetivo = (objetivo) =>{
  seleccionarObjetivo(objetivo);
  setModalEliminar(true)
  }

  return loading ? <div style={{color: 'white'}}>Cargando datos...</div> :
    <div className="App py-3 px-md-5"  style={{backgroundColor: "#CDCDCD"}}>
  <button className="btn btn-success" onClick={handleAgregarObjetivo}>Agregar objetivo</button>
  <br/>
   <div style={{display:'inline-block'}}>
        Desde:
        <input value={inicio} onInput={e => setInicio(e.target.value)} className="form-control" required type="month" name="fecha_inicial" id="fecha_inicial" />
        Hasta:
        <input  value={fin} onInput={e => setFin(e.target.value)} className="form-control" required type="month" name="fecha_final" id="fecha_final" />
        <br/>
        <button className="btn btn-primary" onClick={peticionGetRango}>
          Obtener % Cals/Obj
        </button>
   </div>
  <Bar data={dataChart} options={options} />
    <table className="table " style={{textAlignVertical: "center",textAlign: "center",}}>
      <thead style={{textAlignVertical: "center",textAlign: "center",}}>
        <tr>
          <th>Calorias a Quemar</th>
          <th>Mes y Año</th>
          <th> </th>
        </tr>
      </thead>
      <tbody style={{textAlignVertical: "center",textAlign: "center",}}>
        {objetivos.map(objetivo => {
            var today = new Date(),
            date = today.getFullYear() + '-' + (today.getMonth() + 1)
            if (objetivo.period > date){
          return(
          <tr key={objetivo.id}>
          <td>{objetivo.targetCaloryCount}</td>
          <td>{objetivo.period}</td>
          <td>
                <button className="btn btn-primary" onClick={() => handleEditarObjetivo(objetivo)}><FontAwesomeIcon icon={faEdit}/></button>
                {"   "}
                <button className="btn btn-danger" onClick={() => handleEliminarObjetivo(objetivo)}><FontAwesomeIcon icon={faTrashAlt}/></button>
                </td>
          </tr>
          )
        }else{
          return(
          <tr key={objetivo.id}>
          <td>{objetivo.targetCaloryCount}</td>
          <td>{objetivo.period}</td>
          <td>
                <button className="btn btn-danger" onClick={() => handleEliminarObjetivo(objetivo)}><FontAwesomeIcon icon={faTrashAlt}/></button>
                </td>
          </tr>
          )
        }
        }) || "No hay informacion para esa categoria"}
      </tbody>
    </table>
    <Modal isOpen={modalInsertar}>
                <ModalHeader style={{display: 'block'}}>
                  <span style={{float: 'right'}} onClick={handleModalInsertar}>x</span>
                </ModalHeader>
                <ModalBody>
                  <div className="form-group">
                    <label htmlFor="objetivo">Objetivo (Cals. a Quemar)</label>
                    <input className="form-control" min='0' required type="number" name="objetivo" id="objetivo" onChange={handleChange} value={form?form.objetivo: ''}/>
                    <br />
                    <label htmlFor="periodo">Periodo (mes y año)</label>
                    <input className="form-control" min='2021-10' required type="month" name="periodo" id="periodo" onChange={handleChange} value={form?form.periodo: ''}/>
                    <br />
                  </div>
                </ModalBody>
                <ModalFooter>
                  {tipoModal==='insertar'?
                    <button className="btn btn-success" onClick={()=>peticionPost()}>
                    Insertar
                  </button>: <button className="btn btn-primary" onClick={()=>peticionPut()}>
                    Actualizar
                  </button>
                  }
                    <button className="btn btn-danger" onClick={handleModalInsertar}>Cancelar</button>
                </ModalFooter>
          </Modal>
          <Modal isOpen={modalEliminar}>
            <ModalBody>
               Estás seguro que deseas eliminar el objetivo?
            </ModalBody>
            <ModalFooter>
              <button className="btn btn-danger" onClick={peticionDelete}>Sí</button>
              <button className="btn btn-secundary" onClick={()=>setModalEliminar(false)}>No</button>
            </ModalFooter>
          </Modal>
  </div>
}
export default Objetivos;
