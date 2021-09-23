import authToken from "../../utils/authToken";
import React, { useState, useEffect } from 'react';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import jwt_decode from "jwt-decode";
import CategoriesSelector from './CategoriesSelector.js';

const Trainings = () => {

const [data, setData] = useState(null);
//const [categorias, setCategorias] = useState([]);
const [modalInsertar, setModalInsertar] = useState(false);
const [modalEliminar, setModalEliminar] = useState(false);
const [username, setUsername] = useState('');
const [form, setForm] = useState({id:'', nombre:'', calPerMin:'', user: '' })
const [tipoModal, setTipoModal] = useState();

// +{auth.username} en .get -> consulta por user o all (para las fijas)
const peticionGet = async () => {
 await axios.get("/rest/categorias/categoriaByUser?user_email=" + username).then(response =>
  setData(response.data)).catch(error=>{
  console.log(error.message);
})}

const peticionPost = async () => {
setForm({ ...form, user: username}); // {auth.username}
  delete form.id;
 await axios.post("/rest/categorias/agregarCategoria", form).then(response=>{
    setModalInsertar(!modalInsertar);
    peticionGet();
  }).catch(error => {
    console.log(error.message);
  })
}

const peticionPut = () => {
  axios.put(form.id, form).then(response=>{
    setModalInsertar(!modalInsertar);
    peticionGet();
  })
}

const peticionDelete = () => {
  axios.delete("/rest/categorias/eliminarCategoria", form.id).then(response=>{
    setModalEliminar(false);
    peticionGet();
  })
}

const seleccionarCategoria = categoria => {
  setTipoModal('actualizar');
  setForm({ id: categoria.id, nombre: categoria.nombre, calPerMin: categoria.calPerMin, user: username /*{auth.username}*/});
  };

const handleChange = async e => {
e.persist();
setForm({
    ...form,
    [e.target.name]: e.target.value
  });
}

 useEffect(() => {
    if (localStorage && localStorage.jwtToken) {
          authToken(localStorage.jwtToken);
          var token = localStorage.jwtToken
          var decoded = jwt_decode(token);
          setUsername(decoded.sub);
          setForm({ ...form, user: decoded.sub});
    }
    peticionGet();
    //console.log(categorias, 'categorias')
  }, [form, peticionGet]);

const handleAgregarCategoria = () => {
setForm({form: null, tipoModal: 'insertar'});
setModalInsertar(!modalInsertar);
}

const handleEliminarCategoria = categoria => {
seleccionarCategoria(categoria);
setModalEliminar(true);
}

const handleModificarCategoria = categoria => {
seleccionarCategoria(categoria);
setModalInsertar(!modalInsertar);
}

  return data ?
    <div className="App py-3 px-md-5"  style={{backgroundColor: "#CDCDCD"}}>
    <h2 style={{color: "white"}}>Categorias Fijas</h2>
    <CategoriesSelector />
  <br /><br />
  {console.log(data, 'data')}
    <table className="table " style={{textAlignVertical: "center",textAlign: "center",}}>
      <thead style={{textAlignVertical: "center",textAlign: "center",}}>
        <tr>
          <th>Nombre</th>
          <th>Calorias Por Minuto</th>
        </tr>
      </thead>
      <tbody style={{textAlignVertical: "center",textAlign: "center",}}>
        {data.map(categoria=>{
        if (categoria.is_editable === 'NOT_EDITABLE'){
          return(
            <tr>
          <td>{categoria.nombre}</td>
          <td>{categoria.calPerMin}</td>
          </tr>
          )
        }})}
      </tbody>
    </table>

    <br /><br />

    <h2 style={{color: "white"}}>Categorias Personalizadas</h2>
    <br />
    <button className="btn btn-success" onClick={handleAgregarCategoria}>Agregar Categoria</button>
  <br /><br />
    <table className="table " style={{textAlignVertical: "center",textAlign: "center",}}>
      <thead style={{textAlignVertical: "center",textAlign: "center",}}>
        <tr>
          <th>Nombre</th>
          <th>Calorias Por Minuto</th>
          <th> </th>
        </tr>
      </thead>
      <tbody style={{textAlignVertical: "center",textAlign: "center",}}>
        {data.map(categoria =>{
        if (categoria.is_editable === 'EDITABLE'){
          return(
            <tr>
          <td>{categoria.nombre}</td>
          <td>{categoria.calPerMin}</td>
          <td>
                <button className="btn btn-primary" onClick={handleModificarCategoria(categoria)}><FontAwesomeIcon icon={faEdit}/></button>
                {"   "}
                <button className="btn btn-danger" onClick={handleEliminarCategoria(categoria)}><FontAwesomeIcon icon={faTrashAlt}/></button>
                </td>
          </tr>
          )
        }})}
      </tbody>
    </table>
    <Modal isOpen={modalInsertar}>
                <ModalHeader style={{display: 'block'}}>
                  <span style={{float: 'right'}} onClick={()=>  setModalInsertar(!modalInsertar)}>x</span>
                </ModalHeader>
                <ModalBody>
                  <div className="form-group">
                    <label htmlFor="nombre">Nombre de la Categoria</label>
                    <input className="form-control" type="text" name="nombre" id="nombre" onChange={handleChange} value={form?form.nombre: ''}/>
                    <br />
                    <label htmlFor="calPerMin">Calorias Por Minuto</label>
                    <input className="form-control" type="number" name="calPerMin" id="calPerMin" onChange={handleChange} value={form ? form.calPerMin : ''}/>
                    <br />
                  </div>
                </ModalBody>
                <ModalFooter>
                  {tipoModal ==='insertar'?
                    <button className="btn btn-success" onClick={()=> peticionPost()}>
                    Insertar
                  </button>: <button className="btn btn-primary" onClick={()=> peticionPut()}>
                    Actualizar
                  </button>
                    }
                    <button className="btn btn-danger" onClick={()=>  setModalInsertar(!modalInsertar)}>Cancelar</button>
                </ModalFooter>
          </Modal>
          <Modal isOpen={modalEliminar}>
            <ModalBody>
               Estás seguro que deseas eliminar a la categoria {form && form.nombre}
            </ModalBody>
            <ModalFooter>
              <button className="btn btn-danger" onClick={()=> peticionDelete()}>Sí</button>
              <button className="btn btn-secundary" onClick={()=> setModalEliminar(false)}>No</button>
            </ModalFooter>
          </Modal>
  </div> : <div>No hay categorias</div>;

}
export default Trainings;
