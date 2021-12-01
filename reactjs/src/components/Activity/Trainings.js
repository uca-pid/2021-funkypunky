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
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import moment from "moment";
import { withStyles } from '@mui/styles';
import {styles} from'./styles'
import { Alert } from "react-bootstrap";

// {auth.username}`

const MySwal = withReactContent(Swal);

function swalAlert(texto){
    return MySwal.fire(texto)
}

const Trainings = (props) => {

const {
    classes
    } = props;

const [data, setData] = useState([]);
const [categorias, setCategorias] = useState([]);
const [modalInsertar, setModalInsertar] = useState(false);
const [modalEliminar, setModalEliminar] = useState(false);
const [username, setUsername] = useState('');
const [form, setForm] = useState({ id:'', usuario: '', description:'', categoria:'', fecha:'', hora:'', duracion:''})
const [tipoModal, setTipoModal] = useState();
const [loading, setLoading] = useState(true);
const [filteredData, setFilteredData] = useState(data);
const [categoriesSelected, setCategoriesSelected] = useState([]);

useEffect(()=>{
setFilteredData(data)
}, [data, setData]);

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

const peticionGet = async () =>{
  setLoading(true);
 await axios.get(BASE_DEV_URL + "rest/entrenamiento/entrenamientoByUser?user_email="+ username).then(response=>{
  setData(response.data);
  setFilteredData(response.data)
}).catch(error=>{
  console.log(error.message);
})
 await axios.get(BASE_DEV_URL + "rest/categorias/categoriaByUser?user_email="+ username).then(response=>{
  setCategorias(response.data);

}).catch(error=>{
  console.log(error.message);
})
setLoading(false);
}

const peticionPost = async () => {
setForm({...form, usuario: username}); // {auth.username}
if(form.categoria == '' || form.description == '' || form.duracion == '' || form.fecha == ''){
        swalAlert("Hay campos vacios");
 }else{
  delete form.id;
   await axios.post(BASE_DEV_URL + 'rest/entrenamiento/agregarEntrenamiento',{'id_categoria': parseInt(form.categoria),
                                                                'descripcion': form.description,
                                                                'duracion': parseInt(form.duracion),
                                                                'usuario': username,
                                                                'fecha':form.fecha}).then(response=> {
                                                                                          handleModalInsertar();
                                                                                          peticionGet();
                                                                                          }).catch(error=>{ console.log(error.message); })
 }
 }

const peticionPut = () => {
  axios.post(BASE_DEV_URL + 'rest/entrenamiento/editarEntrenamiento', {'id': form.id,
                                                         'id_categoria':parseInt(form.categoria),
                                                         'descripcion': form.description,
                                                         'duracion':parseInt(form.duracion),
                                                         'usuario': username,
                                                         'fecha':moment(form.fecha).format('YYYY-MM-DDTHH:mm')}).then(response=>{ handleModalInsertar(); peticionGet(); })
  }

const peticionDelete = () => {
  axios.post(BASE_DEV_URL + 'rest/entrenamiento/eliminarEntrenamiento', {'id':form.id}).then(response=>{
    setModalEliminar(false)
    peticionGet();
  })
}
  if (localStorage.jwtToken) {
    authToken(localStorage.jwtToken);
  }

const auth = useSelector((state) => state.auth);




const handleModalInsertar = () => {
  setModalInsertar(!modalInsertar);
}

const seleccionarEntrenamiento = (entrenamiento) => {
setTipoModal('actualizar');
setForm({  id: entrenamiento.id,
                 usuario: username, // {auth.username}
                 description: entrenamiento.description,
                 categoria: entrenamiento.categoria.id,
                 fecha: entrenamiento.startTime,
                 hora: entrenamiento.endTime,
                 duracion: entrenamiento.duracion,
                 calorias: entrenamiento.categoria.calPerMin,
                 })
}

const handleChange = async e => {
e.persist();
setForm({
    ...form,
    [e.target.name]: e.target.value
  })
};

  const handleAgregarEntrenamiento = (entrenamiento) =>{
  setForm({ id:'', usuario: '', description:'', categoria:'', fecha:'', hora:'', duracion:''});
  setTipoModal('insertar');
  handleModalInsertar()
  };

  const handleEditarEntrenamiento = (entrenamiento) =>{
  seleccionarEntrenamiento(entrenamiento);
  handleModalInsertar()
  }

  const handleEliminarEntrenamiento = (entrenamiento) =>{
  seleccionarEntrenamiento(entrenamiento);
  setModalEliminar(true)
  }

  return loading ? <div style={{color: 'white'}}>Cargando datos...</div> :
    <div className={classes.root}>
       <Alert style={{ backgroundColor: "#343A40", color: "#ffffff80" }}>
      <button className="btn btn-success" onClick={handleAgregarEntrenamiento}>Agregar entrenamiento</button>
      </Alert>
      <div style={{border: '5px solid rgb(33,37,41)',borderRadius: '10px', padding:'3%', color:'white'}}>
          <CategoriesSelector data={data} filteredData={filteredData} setFilteredData={setFilteredData} categories={categorias} />
  <br /><br />
    <table className="table " style={{textAlignVertical: "center",textAlign: "center",}}>
      <thead style={{textAlignVertical: "center",textAlign: "center", color:'white'}}>
        <tr>
          <th style={{color: 'white'}}>Categoria</th>
          <th style={{color: 'white'}}>Descripcion</th>
          <th style={{color: 'white'}}>Fecha y Hora de Inicio</th>
          <th style={{color: 'white'}}>Duracion (min)</th>
          <th style={{color: 'white'}}>Calorias Quemadas</th>
          <th> </th>
        </tr>
      </thead>
      <tbody style={{textAlignVertical: "center",textAlign: "center",}}>
        {filteredData.map(entrenamiento => {
          return(
          <tr key={entrenamiento.id}>
          <td style={{color: 'white'}}>{entrenamiento.categoria.nombre}</td>
          <td style={{color: 'white'}}>{entrenamiento.description}</td>
          <td style={{color: 'white'}}><Timestamp date={entrenamiento.startTime} options={{ includeDay: false, twentyFourHour: true }} /></td>
          <td style={{color: 'white'}}>{entrenamiento.duracion}</td>
          <td style={{color: 'white'}}>{entrenamiento.categoria.calPerMin * entrenamiento.duracion}</td>
          <td>
                <button className="btn btn-primary" onClick={() => handleEditarEntrenamiento(entrenamiento)}><FontAwesomeIcon icon={faEdit}/></button>
                {"   "}
                <button className="btn btn-danger" onClick={() => handleEliminarEntrenamiento(entrenamiento)}><FontAwesomeIcon icon={faTrashAlt}/></button>
          </td>
          </tr>
          )
        }) || "No hay informacion para esa categoria"}
      </tbody>
    </table>
    </div>
    <Modal isOpen={modalInsertar}>
                <ModalHeader style={{display: 'block'}}>
                  <span style={{float: 'right'}} onClick={handleModalInsertar}>x</span>
                </ModalHeader>
                <ModalBody>
                  <div className="form-group">
                    <label htmlFor="categoria">Categoria</label>
                    <select className="form-control" name='categoria' id='categoria' required onChange={handleChange} value={form?form.categoria: ''}>
                    <option>  </option>
                    {categorias.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                    ))}
                    </select>
                    <br />
                    <label htmlFor="description">Descripcion</label>
                    <input className="form-control" required type="text" name="description" id="description" maxLength="50" onChange={handleChange} value={form?form.description: ''}/>
                    <br />
                    <label htmlFor="fecha">Fecha y Hora de Inicio</label>
                    <input className="form-control" required type="datetime-local" name="fecha" id="fecha" onChange={handleChange} value={form?form.fecha: ''}/>
                    <br />
                    <label htmlFor="duracion">Duracion (en min.)</label>
                    <input className="form-control" required type="number" name="duracion" id="duracion" onChange={handleChange} value={form?form.duracion: ''}/>
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
               Estás seguro que deseas eliminar al entrenamiento {form && form.description}
            </ModalBody>
            <ModalFooter>
              <button className="btn btn-danger" onClick={peticionDelete}>Sí</button>
              <button className="btn btn-secundary" onClick={()=>setModalEliminar(false)}>No</button>
            </ModalFooter>
          </Modal>
  </div>
}
export default withStyles(styles)(Trainings);
