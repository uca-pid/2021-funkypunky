import authToken from "../../utils/authToken";
import React, { Component } from 'react';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import jwt_decode from "jwt-decode";
import Timestamp from 'react-timestamp'
import {BASE_DEV_URL} from "../../utils/constants.js";


// {auth.username}`

class Trainings extends Component {
state={
  data:null,
  categorias: [],
  modalInsertar: false,
  modalEliminar: false,
  username:'',
  form:{
    id:'',
    usuario: '', // {auth.username}
    description:'',
    categoria:'',
    fecha:'',
    hora:'',
    duracion:'',
  }
}



peticionGet= async () =>{
 await axios.get(BASE_DEV_URL + "rest/entrenamiento/entrenamientoByUser?user_email="+this.state.username).then(response=>{
  this.setState({data: response.data});
}).catch(error=>{
  console.log(error.message);
})
 await axios.get(BASE_DEV_URL + "rest/categorias/categoriaByUser?user_email="+this.state.username).then(response=>{
  this.setState({categorias: response.data});
}).catch(error=>{
  console.log(error.message);
})
}

peticionPost=async()=>{
this.state.form.usuario = this.state.username; // {auth.username}
  delete this.state.form.id;
 await axios.post(BASE_DEV_URL + 'rest/entrenamiento/agregarEntrenamiento',{'id_categoria':parseInt(this.state.form.categoria),
                                                              'descripcion':this.state.form.description,
                                                              'duracion':parseInt(this.state.form.duracion),
                                                              'usuario': this.state.username,
                                                              'fecha':this.state.form.fecha}).then(response=>{
    this.modalInsertar();
    this.peticionGet();
  }).catch(error=>{
    console.log(error.message);
  })
}

peticionPut=()=>{
console.log(this.state.form)
  axios.post(BASE_DEV_URL + 'rest/entrenamiento/editarEntrenamiento', {'id':this.state.form.id,
                                                         'id_categoria':parseInt(this.state.form.categoria),
                                                         'descripcion':this.state.form.description,
                                                         'duracion':parseInt(this.state.form.duracion),
                                                         'usuario': this.state.username,
                                                         'fecha':this.state.form.fecha,}).then(response=>{
      this.modalInsertar();
      this.peticionGet();
    })
}

peticionDelete=()=>{
  console.log(this.state.form.id)
  axios.post(BASE_DEV_URL + 'rest/entrenamiento/eliminarEntrenamiento',{'id':this.state.form.id}).then(response=>{
    this.setState({modalEliminar: false});
    this.peticionGet();
  })
}

modalInsertar=()=>{
  this.setState({modalInsertar: !this.state.modalInsertar});
}

seleccionarentrenamiento=(entrenamiento)=>{
  this.setState({
    tipoModal: 'actualizar',
    form: {
        id:entrenamiento.id,
        usuario:this.state.username, // {auth.username}
        description:entrenamiento.description,
        categoria:entrenamiento.categoria.id,
        fecha:entrenamiento.startTime,
        hora:entrenamiento.endTime,
        duracion:entrenamiento.duracion,
        calorias: entrenamiento.categoria.calPerMin,
    }
  })
}

handleChange=async e=>{
e.persist();
await this.setState({
  form:{
    ...this.state.form,
    [e.target.name]: e.target.value
  }
});

}


  componentWillMount() {
  if (localStorage.jwtToken) {
        authToken(localStorage.jwtToken);
        var token = localStorage.jwtToken
        var decoded = jwt_decode(token);
        this.state.username = decoded.sub;
        this.state.form.usuario = decoded.sub;
  }
    this.peticionGet();
  }

  render(){
    const {form}=this.state;
        if (!this.state.data || !this.state.categorias) {
                    return (
                    <div style={{color: 'white'}}>Cargando datos...</div>)
        }else{

  return (
    <div className="App py-3 px-md-5"  style={{backgroundColor: "#CDCDCD"}}>

  <button className="btn btn-success" onClick={()=>{this.setState({form: null, tipoModal: 'insertar'}); this.modalInsertar()}}>Agregar entrenamiento</button>
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
        {this.state.data.map(entrenamiento=>{
          return(
          <tr key={entrenamiento.id}>
          <td>{entrenamiento.categoria.nombre}</td>
          <td>{entrenamiento.description}</td>
          <td><Timestamp date={entrenamiento.startTime} options={{ includeDay: false, twentyFourHour: true }} /></td>
          <td>{entrenamiento.duracion}</td>
          <td>{entrenamiento.categoria.calPerMin * entrenamiento.duracion}</td>
          <td>
                <button className="btn btn-primary" onClick={()=>{this.seleccionarentrenamiento(entrenamiento); this.modalInsertar()}}><FontAwesomeIcon icon={faEdit}/></button>
                {"   "}
                <button className="btn btn-danger" onClick={()=>{this.seleccionarentrenamiento(entrenamiento); this.setState({modalEliminar: true})}}><FontAwesomeIcon icon={faTrashAlt}/></button>
                </td>
          </tr>
          )
        })}
      </tbody>
    </table>


    <Modal isOpen={this.state.modalInsertar}>
                <ModalHeader style={{display: 'block'}}>
                  <span style={{float: 'right'}} onClick={()=>this.modalInsertar()}>x</span>
                </ModalHeader>
                <ModalBody>
                  <div className="form-group">
                    <label htmlFor="categoria">Categoria</label>
                    <select className="form-control" name='categoria' id='categoria' required onChange={this.handleChange} value={form?form.categoria: ''}>
                    <option disable>  </option>
                    {this.state.categorias.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                    ))}
                    </select>
                    <br />
                    <label htmlFor="description">Descripcion</label>
                    <input className="form-control" required type="text" name="description" id="description" maxLength="50" onChange={this.handleChange} value={form?form.description: ''}/>
                    <br />
                    <label htmlFor="fecha">Fecha y Hora de Inicio</label>
                    <input className="form-control" required type="datetime-local" name="fecha" id="fecha" onChange={this.handleChange} value={form?form.fecha: ''}/>
                    <br />
                    <label htmlFor="duracion">Duracion (en min.)</label>
                    <input className="form-control" required type="number" name="duracion" id="duracion" onChange={this.handleChange} value={form?form.duracion: ''}/>
                    <br />
                  </div>
                </ModalBody>

                <ModalFooter>
                  {this.state.tipoModal=='insertar'?
                    <button className="btn btn-success" onClick={()=>this.peticionPost()}>
                    Insertar
                  </button>: <button className="btn btn-primary" onClick={()=>this.peticionPut()}>
                    Actualizar
                  </button>
                  }
                    <button className="btn btn-danger" onClick={()=>this.modalInsertar()}>Cancelar</button>
                </ModalFooter>
          </Modal>


          <Modal isOpen={this.state.modalEliminar}>
            <ModalBody>
               Estás seguro que deseas eliminar al entrenamiento {form && form.description}
            </ModalBody>
            <ModalFooter>
              <button className="btn btn-danger" onClick={()=>this.peticionDelete()}>Sí</button>
              <button className="btn btn-secundary" onClick={()=>this.setState({modalEliminar: false})}>No</button>
            </ModalFooter>
          </Modal>
  </div>
  );}
}
}
export default Trainings;
