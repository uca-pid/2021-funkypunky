import authToken from "../../utils/authToken";
import React, { Component } from 'react';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import jwt_decode from "jwt-decode";
import Timestamp from 'react-timestamp'


const url="";

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
    descripcion:'',
    categoria:'',
    fecha:'',
    hora:'',
    duracion:'',
  }
}



peticionGet= async () =>{
 await axios.get("https://funky-punky-web-app.herokuapp.com/rest/entrenamiento/entrenamientoByUser?user_email="+this.state.username).then(response=>{
  this.setState({data: response.data});
  console.log(this.state.data)
}).catch(error=>{
  console.log(error.message);
})
 await axios.get("https://funky-punky-web-app.herokuapp.com/rest/categorias/categoriaByUser?user_email="+this.state.username).then(response=>{
  this.setState({categorias: response.data});
}).catch(error=>{
  console.log(error.message);
})
}

peticionPost=async()=>{
this.state.form.usuario = this.state.username; // {auth.username}
//console.log(this.state.form)
  delete this.state.form.id;
 await axios.post(url,this.state.form).then(response=>{
    this.modalInsertar();
    this.peticionGet();
  }).catch(error=>{
    console.log(error.message);
  })
}

peticionPut=()=>{
  //console.log(this.state.form);
  axios.put(url+this.state.form.id, this.state.form).then(response=>{
      this.modalInsertar();
      this.peticionGet();
    })
}

peticionDelete=()=>{
  axios.delete(url+this.state.form.id).then(response=>{
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
        descripcion:entrenamiento.name,
        categoria:entrenamiento.categoria.nombre,
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
//console.log(this.state.form);
}


  componentWillMount() {
  if (localStorage.jwtToken) {
        authToken(localStorage.jwtToken);
        var token = localStorage.jwtToken
        //console.log(localStorage.jwtToken);
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
                    <div style={{color: 'white'}}>Debe iniciar sesion para ver sus entrenamientos.</div>)
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
                    {this.state.categorias.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                    ))}
                    </select>
                    <br />
                    <label htmlFor="descripcion">Descripcion</label>
                    <input className="form-control" required type="text" name="descripcion" id="descripcion" maxLength="50" onChange={this.handleChange} value={form?form.descripcion: ''}/>
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
               Estás seguro que deseas eliminar a la entrenamiento {form && form.categoria}
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
