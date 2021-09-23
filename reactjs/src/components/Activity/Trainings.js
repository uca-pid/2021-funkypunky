import authToken from "../../utils/authToken";
import React, { useState, useEffect } from 'react';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import jwt_decode from "jwt-decode";
import Timestamp from 'react-timestamp'
import {BASE_DEV_URL} from "../../utils/constants.js";
import CategoriesSelector from './CategoriesSelector.js'


// {auth.username}`

const Trainings = () => {

const [data, setData] = useState(null);
const [categorias, setCategorias] = useState([]);
const [modalInsertar, setModalInsertar] = useState(false);
const [modalEliminar, setModalEliminar] = useState(false);
const [username, setUsername] = useState('');
const [form, setForm] = useState({ id:'', usuario: '', description:'', categoria:'', fecha:'', hora:'', duracion:''})
const [tipoModal, setTipoModal] = useState();
const [loading, setLoading] = useState(true);

const peticionGet = async () =>{
 await axios.get(BASE_DEV_URL + "rest/entrenamiento/entrenamientoByUser?user_email="+ username).then(response=>{
  setData(response.data);
  setLoading(false);
}).catch(error=>{
  console.log(error.message);
})
 await axios.get(BASE_DEV_URL + "rest/categorias/categoriaByUser?user_email="+ username).then(response=>{
  setCategorias(response.data);
    setLoading(false);
}).catch(error=>{
  console.log(error.message);
})
}

const peticionPost = async () => {
setForm({...form, usuario: username}); // {auth.username}
 delete form.id;
 await axios.post(BASE_DEV_URL + 'rest/entrenamiento/agregarEntrenamiento',{'id_categoria': parseInt(form.categoria),
                                                              'descripcion': form.description,
                                                              'duracion': parseInt(form.duracion),
                                                              'usuario': username,
                                                              'fecha':form.fecha}).then(response=> {
                                                                                        modalInsertar();
                                                                                        peticionGet();
                                                                                        }).catch(error=>{ console.log(error.message); })}

const peticionPut = () => {
  axios.post(BASE_DEV_URL + 'rest/entrenamiento/editarEntrenamiento', {'id': form.id,
                                                         'id_categoria':parseInt(form.categoria),
                                                         'descripcion': form.description,
                                                         'duracion':parseInt(form.duracion),
                                                         'usuario': username,
                                                         'fecha': form.fecha,}).then(response=>{ modalInsertar(); peticionGet(); })}

const peticionDelete = () => {
  axios.post(BASE_DEV_URL + 'rest/entrenamiento/eliminarEntrenamiento'+{'id':form.id}).then(response=>{
    setModalEliminar(false)
    peticionGet();
  })
}

const handleModalInsertar = () => {
  setModalInsertar(!modalInsertar);
}

const seleccionarentrenamiento = (entrenamiento) => {
setTipoModal('actualizar');
setForm({        id: entrenamiento.id,
                 usuario: username, // {auth.username}
                 description: entrenamiento.description,
                 categoria: entrenamiento.categoria.id,
                 fecha: entrenamiento.startTime,
                 hora: entrenamiento.endTime,
                 duracion: entrenamiento.duracion,
                 calorias: entrenamiento.categoria.calPerMin,
                 })}

const handleChange = async e => {
e.persist();
setForm({
    ...form,
    [e.target.name]: e.target.value
  })
};

  const handleAgregarEntrenamiento = () =>{
  setForm(null);
  setTipoModal('insertar');
  modalInsertar()
  };

  const handleEditarEntrenamiento = entrenamiento =>{
  seleccionarentrenamiento(entrenamiento);
  modalInsertar()
  }

  const handleEliminarEntrenamiento = entrenamiento =>{
  seleccionarentrenamiento(entrenamiento);
  setModalEliminar(true)
  }

  useEffect(() => {
  if (localStorage && localStorage.jwtToken) {
  console.log(localStorage, 'localstorage')
        authToken(localStorage.jwtToken);
        const token = localStorage.jwtToken
        const decoded = jwt_decode(token);
        setUsername(decoded.sub);
        setForm({...form, usuario: decoded.sub});
  }
    peticionGet();
 }, [localStorage, form, peticionGet])

  return loading ? <div style={{color: 'white'}}>Cargando datos...</div> :
    <div className="App py-3 px-md-5"  style={{backgroundColor: "#CDCDCD"}}>
  <button className="btn btn-success" onClick={handleAgregarEntrenamiento}>Agregar entrenamiento</button>
      <CategoriesSelector />
  <br /><br />
    <table className="table " style={{textAlignVertical: "center",textAlign: "center",}}>
      <thead style={{textAlignVertical: "center",textAlign: "center",}}>
        <tr>
          <th>Categoria</th>
          <th>Descripcion</th>
          <th>Fecha y Hora de Inicio</th>
          <th>Duracion (min)</th>
          <th>Calorias Quemadas</th>
          <th> </th>
        </tr>
      </thead>
      <tbody style={{textAlignVertical: "center",textAlign: "center",}}>
        {data.map(entrenamiento=>{
          return(
          <tr key={entrenamiento.id}>
          <td>{entrenamiento.categoria.nombre}</td>
          <td>{entrenamiento.description}</td>
          <td><Timestamp date={entrenamiento.startTime} options={{ includeDay: false, twentyFourHour: true }} /></td>
          <td>{entrenamiento.duracion}</td>
          <td>{entrenamiento.categoria.calPerMin * entrenamiento.duracion}</td>
          <td>
                <button className="btn btn-primary" onClick={entrenamiento => handleEditarEntrenamiento(entrenamiento)}><FontAwesomeIcon icon={faEdit}/></button>
                {"   "}
                <button className="btn btn-danger" onClick={entrenamiento => handleEliminarEntrenamiento(entrenamiento)}><FontAwesomeIcon icon={faTrashAlt}/></button>
                </td>
          </tr>
          )
        })}
      </tbody>
    </table>
    <Modal isOpen={modalInsertar}>
                <ModalHeader style={{display: 'block'}}>
                  <span style={{float: 'right'}} onClick={handleModalInsertar}>x</span>
                </ModalHeader>
                <ModalBody>
                  <div className="form-group">
                    <label htmlFor="categoria">Categoria</label>
                    <select className="form-control" name='categoria' id='categoria' required onChange={handleChange} value={form?form.categoria: ''}>
                    <option disable>  </option>
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
              <button className="btn btn-danger" onClick={()=>peticionDelete()}>Sí</button>
              <button className="btn btn-secundary" onClick={()=>setModalEliminar(false)}>No</button>
            </ModalFooter>
          </Modal>
  </div>
}
export default Trainings;
