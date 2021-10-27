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
import BarChart from './BarChart.js'
import { useSelector } from "react-redux";


// {auth.username}`

const Objetivos = () => {

const [data, setData] = useState([]);
const [categorias, setCategorias] = useState([]);
const [modalInsertar, setModalInsertar] = useState(false);
const [modalEliminar, setModalEliminar] = useState(false);
const [username, setUsername] = useState('');
const [form, setForm] = useState({ id:'', usuario: '', description:'', categoria:'', fecha:'', hora:'', duracion:''})
const [tipoModal, setTipoModal] = useState();
const [loading, setLoading] = useState(true);
const [filteredData, setFilteredData] = useState(data);
    console.log(filteredData, 'filteredData from trianings!!!')

useEffect(()=>{
setFilteredData(data)
}, [data, setData]);

 useEffect(() => {
  if (localStorage && localStorage.jwtToken) {
        const token = localStorage.jwtToken
        const decoded = jwt_decode(token);
        const usuario = decoded.sub;
        console.log(usuario, 'decoded')
        setUsername(usuario);
         console.log(username, ' username')

        setForm({...form, usuario: decoded.sub});
        console.log(username, ' username')
        console.log( form, 'form')
  }
  peticionGet();
 }, [username])

const peticionGet = async () =>{
  setLoading(true);
 await axios.get(BASE_DEV_URL + "rest/entrenamiento/entrenamientoByUser?user_email="+ username).then(response=>{
  setData(response.data);
}).catch(error=>{
  console.log(error.message);
})
 await axios.get(BASE_DEV_URL + "rest/categorias/categoriaByUser?user_email="+ username).then(response=>{
  setCategorias(response.data);

}).catch(error=>{
  console.log(error.message);
})
setLoading(false);
console.log(loading, ' loadingg')
}
  console.log(data, 'data')

const peticionPost = async () => {
setForm({...form, usuario: username}); // {auth.username}
 delete form.id;
 await axios.post(BASE_DEV_URL + 'rest/entrenamiento/agregarEntrenamiento',{'id_categoria': parseInt(form.categoria),
                                                              'descripcion': form.description,
                                                              'duracion': parseInt(form.duracion),
                                                              'usuario': username,
                                                              'fecha':form.fecha}).then(response=> {
                                                                                        handleModalInsertar();
                                                                                        peticionGet();
                                                                                        }).catch(error=>{ console.log(error.message); })}

const peticionPut = () => {
  axios.post(BASE_DEV_URL + 'rest/entrenamiento/editarEntrenamiento', {'id': form.id,
                                                         'id_categoria':parseInt(form.categoria),
                                                         'descripcion': form.description,
                                                         'duracion':parseInt(form.duracion),
                                                         'usuario': username,
                                                         'fecha': form.fecha,}).then(response=>{ handleModalInsertar(); peticionGet(); })}

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

const seleccionarObjetivo = (entrenamiento) => {
setTipoModal('actualizar');
setForm({        id: entrenamiento.id,
                 usuario: username, // {auth.username}
                 categoria: entrenamiento.categoria.id,
                 fecha: entrenamiento.startTime,
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

  const handleAgregarObjetivo = (entrenamiento) =>{
  setForm({});
  setTipoModal('insertar');
  handleModalInsertar()
  };

  const handleEditarEntrenamiento = (entrenamiento) =>{
  console.log(entrenamiento, 'entrenamiento!!')
  seleccionarObjetivo(entrenamiento);
  handleModalInsertar()
  }

  const handleEliminarEntrenamiento = (entrenamiento) =>{
  seleccionarObjetivo(entrenamiento);
  setModalEliminar(true)
  }

  return loading ? <div style={{color: 'white'}}>Cargando datos...</div> :
    <div className="App py-3 px-md-5"  style={{backgroundColor: "#CDCDCD"}}>
  <button className="btn btn-success" onClick={handleAgregarObjetivo}>Agregar Objetivo</button>
  <br /><br />
    <BarChart />
  <br /><br />
    <table className="table " style={{textAlignVertical: "center",textAlign: "center",}}>
      <thead style={{textAlignVertical: "center",textAlign: "center",}}>
        <tr>
          <th>Categoria</th>
          <th>Calorias a Quemar</th>
          <th>Mes y Año</th>
          <th> </th>
        </tr>
      </thead>
      <tbody style={{textAlignVertical: "center",textAlign: "center",}}>
        {filteredData.map(entrenamiento => {
          return(
          <tr key={entrenamiento.id}>
          <td>{entrenamiento.categoria.nombre}</td>
          <td><Timestamp date={entrenamiento.startTime} options={{ includeDay: false, twentyFourHour: true }} /></td>
          <td>{entrenamiento.duracion}</td>
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
    <Modal isOpen={modalInsertar}>
                <ModalHeader style={{display: 'block'}}>
                  <span style={{float: 'right'}} onClick={handleModalInsertar}>x</span>
                </ModalHeader>
                <ModalBody>
                  <div className="form-group">
                    <label htmlFor="categoria">Categoria</label>
                    <select className="form-control" name='categoria' id='categoria' required onChange={handleChange} value={form?form.categoria: ''}>
                    //<option disable>  </option>
                    {categorias.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                    ))}
                    </select>
                    <br />
                    <label htmlFor="description">Calorias a Quemar</label>
                    <input className="form-control" required type="number" name="description" id="description" maxLength="50" onChange={handleChange} value={form?form.description: ''}/>
                    <br />
                    <label htmlFor="fecha">En el Mes del Año:</label>
                    <input className="form-control" required type="month" name="fecha" id="fecha" onChange={handleChange} value={form?form.fecha: ''}/>
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
               Estás seguro que deseas eliminar el objetivo ?
            </ModalBody>
            <ModalFooter>
              <button className="btn btn-danger" onClick={peticionDelete}>Sí</button>
              <button className="btn btn-secundary" onClick={()=>setModalEliminar(false)}>No</button>
            </ModalFooter>
          </Modal>
  </div>
}
export default Objetivos;
