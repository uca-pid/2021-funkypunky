import authToken from "../../utils/authToken";
import React, { Component } from 'react';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import jwt_decode from "jwt-decode";


const url="";

// {auth.username}`

class Trainings extends Component {
state={
  data:[{id:1, categoria:'Pelopincho', descripcion:'123qa00000000000000sdasdasdas', fecha:'12/30/11', hora:'12:00', usuario:'asd', duracion:40, calorias:100,},
  {id:2, categoria:'JuanCarlos', descripcion:'qwdfas1', fecha:'01/02/11', hora:'16:00', usuario:'pete', duracion:10, calorias:100,},
  {id:3, categoria:'Carpincho', descripcion:'768asd', fecha:'05/05/17', hora:'19:00', usuario:'qqq', duracion:14, calorias:100, },
  ],
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



peticionGet=()=>{
axios.get(url+this.state.username).then(response=>{
  this.setState({data: response.data});
}).catch(error=>{
  console.log(error.message);
})
}

peticionPost=async()=>{
this.state.form.usuario = this.state.username; // {auth.username}
console.log(this.state.form)
  delete this.state.form.id;
 await axios.post(url,this.state.form).then(response=>{
    this.modalInsertar();
    this.peticionGet();
  }).catch(error=>{
    console.log(error.message);
  })
}

peticionPut=()=>{
  console.log(this.state.form);
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
        descripcion:entrenamiento.descripcion,
        categoria:entrenamiento.categoria,
        fecha:entrenamiento.fecha,
        hora:entrenamiento.hora,
        duracion:entrenamiento.duracion,
        calorias: entrenamiento.calorias,
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


  componentDidMount() {
  if (localStorage.jwtToken) {
        authToken(localStorage.jwtToken);
        var token = localStorage.jwtToken
        console.log(localStorage.jwtToken);
        var decoded = jwt_decode(token);
        this.state.username = decoded.sub;
        this.state.form.usuario = decoded.sub;
  }
  /*
    if (localStorage.jwtToken) {
      authToken(localStorage.jwtToken);
    }
    const auth = useSelector((state) => state.auth);
    */
    //this.peticionGet();
  }

  render(){
    const {form}=this.state;
  return (
    <div className="App py-3 px-md-5"  style={{backgroundColor: "#CDCDCD"}}>

  <button className="btn btn-success" onClick={()=>{this.setState({form: null, tipoModal: 'insertar'}); this.modalInsertar()}}>Agregar entrenamiento</button>
  <br /><br />
    <table className="table " style={{textAlignVertical: "center",textAlign: "center",}}>
      <thead style={{textAlignVertical: "center",textAlign: "center",}}>
        <tr>
          <th>Categoria</th>
          <th>Descripcion</th>
          <th>Fecha</th>
          <th>Hora Inicio</th>
          <th>Duracion (min)</th>
          <th>Calorias Quemadas</th>
          <th> </th>
        </tr>
      </thead>
      <tbody style={{textAlignVertical: "center",textAlign: "center",}}>
        {this.state.data.map(entrenamiento=>{
          return(
            <tr key={entrenamiento.id}>
          <td>{entrenamiento.categoria}</td>
          <td>{entrenamiento.descripcion}</td>
          <td>{entrenamiento.fecha}</td>
          <td>{entrenamiento.hora}</td>
          <td>{entrenamiento.duracion}</td>
          <td>{entrenamiento.calorias}</td>
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
                    <input className="form-control" required type="text" name="categoria" id="categoria" onChange={this.handleChange} value={form?form.categoria: ''}/>
                    <br />
                    <label htmlFor="descripcion">Descripcion</label>
                    <input className="form-control" required type="text" name="descripcion" id="descripcion" maxLength="50" onChange={this.handleChange} value={form?form.descripcion: ''}/>
                    <br />
                    <label htmlFor="fecha">Fecha</label>
                    <input className="form-control" required type="date" name="fecha" id="fecha" onChange={this.handleChange} value={form?form.fecha: ''}/>
                    <br />
                    <label htmlFor="hora">Hora Inicio</label>
                    <input className="form-control" required type="time" name="hora" id="hora" onChange={this.handleChange} value={form?form.hora:''}/>
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
  );
}
}
export default Trainings;
