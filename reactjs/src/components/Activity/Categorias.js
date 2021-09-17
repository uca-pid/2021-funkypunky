import authToken from "../../utils/authToken";
import React, { Component } from 'react';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import jwt_decode from "jwt-decode";

const url="";


class Trainings extends Component {
state={
  data:null,
  categorias: [],
  modalInsertar: false,
  modalEliminar: false,
  username: '',
  form:{
    id:'',
    nombre:'',
    calPerMin:'',
    user: '',
  }
}
// +{auth.username} en .get -> consulta por user o all (para las fijas)
peticionGet= async () =>{
 await axios.get("http://localhost:8081/rest/categorias/categoriaByUser?user_email="+this.state.username).then(response=>{
  this.setState({data: response.data});
}).catch(error=>{
  console.log(error.message);
})
}

peticionPost=async()=>{
this.state.form.user = this.state.username; // {auth.username}
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

seleccionarcategoria=(categoria)=>{
  this.setState({
    tipoModal: 'actualizar',
    form: {
        id:categoria.id,
        nombre:categoria.nombre,
        calPerMin:categoria.calPerMin,
        user:this.state.username, // {auth.username}
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
          //console.log(localStorage.jwtToken);
          var decoded = jwt_decode(token);
          this.state.username = decoded.sub;
          this.state.form.user = decoded.sub;
    }
    this.peticionGet();
  }


  render(){
    const {form}=this.state;
    if (!this.state.data) {
                return (
                <div>No hay categorias</div>)
    }
  return (
    <div className="App py-3 px-md-5"  style={{backgroundColor: "#CDCDCD"}}>
    <h2 style={{color: "white"}}>Categorias Fijas</h2>
  <br /><br />
  {console.log(this.state.data)}
    <table className="table " style={{textAlignVertical: "center",textAlign: "center",}}>
      <thead style={{textAlignVertical: "center",textAlign: "center",}}>
        <tr>
          <th>Nombre</th>
          <th>Calorias Por Minuto</th>
        </tr>
      </thead>
      <tbody style={{textAlignVertical: "center",textAlign: "center",}}>
        {this.state.data.map(categoria=>{
        if (categoria.is_editable == 'NOT_EDITABLE'){
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
    <button className="btn btn-success" onClick={()=>{this.setState({form: null, tipoModal: 'insertar'}); this.modalInsertar()}}>Agregar Categoria</button>
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
        {this.state.data.map(categoria=>{
        if (categoria.is_editable == 'EDITABLE'){
          return(
            <tr>
          <td>{categoria.nombre}</td>
          <td>{categoria.calPerMin}</td>
          <td>
                <button className="btn btn-primary" onClick={()=>{this.seleccionarcategoria(categoria); this.modalInsertar()}}><FontAwesomeIcon icon={faEdit}/></button>
                {"   "}
                <button className="btn btn-danger" onClick={()=>{this.seleccionarcategoria(categoria); this.setState({modalEliminar: true})}}><FontAwesomeIcon icon={faTrashAlt}/></button>
                </td>
          </tr>
          )
        }})}
      </tbody>
    </table>


    <Modal isOpen={this.state.modalInsertar}>
                <ModalHeader style={{display: 'block'}}>
                  <span style={{float: 'right'}} onClick={()=>this.modalInsertar()}>x</span>
                </ModalHeader>
                <ModalBody>
                  <div className="form-group">
                    <label htmlFor="nombre">Nombre de la Categoria</label>
                    <input className="form-control" type="text" name="nombre" id="nombre" onChange={this.handleChange} value={form?form.nombre: ''}/>
                    <br />
                    <label htmlFor="calPerMin">Calorias Por Minuto</label>
                    <input className="form-control" type="number" name="calPerMin" id="calPerMin" onChange={this.handleChange} value={form?form.calPerMin: ''}/>
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
               Estás seguro que deseas eliminar a la categoria {form && form.nombre}
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
