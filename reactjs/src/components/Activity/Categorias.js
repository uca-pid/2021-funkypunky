import authToken from "../../utils/authToken";
import React, { Component } from 'react';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import jwt_decode from "jwt-decode";
import {BASE_DEV_URL} from "../../utils/constants.js";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';


const MySwal = withReactContent(Swal);

function swalAlert(texto){
    return MySwal.fire(texto)
}

class Categorias extends Component {
state={
  data:null,
  modalInsertar: false,
  modalEliminar: false,
  username: '',
  form:{
    id:'',
    nombre:'',
    calPerMin:'',
    user_mail: '',
  }
}




// +{auth.username} en .get -> consulta por user o all (para las fijas)
peticionGet= async () =>{
 await axios.get(BASE_DEV_URL + "rest/categorias/categoriaByUser?user_email="+this.state.username).then(response=>{
  this.setState({data: response.data});
  console.log(response.data)
  console.log(this.state.form)
}).catch(error=>{
  console.log(error.message);
})
}

peticionPost=async()=>{
 var bandera = 1;
 for(const obj of this.state.data){
    if(this.state.form.nombre == '' || this.state.form.calPerMin == ''){
        swalAlert("Hay campos vacios");
        console.log()
    }else{
    if (obj.nombre.toUpperCase() == this.state.form.nombre.toUpperCase()){
            bandera = 0;
            swalAlert("No puedes crear 2 categorias con el mismo nombre");
         }
    }

   }
 if(bandera){
  this.state.form.user_mail = this.state.username; // {auth.username}
  delete this.state.form.id;
    await axios.post(BASE_DEV_URL + 'rest/categorias/agregarCategoria',{'nombre': this.state.form.nombre, 'calPerMin': parseInt(this.state.form.calPerMin), 'user_mail': this.state.form.user_mail}).then(response=>{
        this.modalInsertar();
        this.peticionGet();
      }).catch(error=>{
        console.log(error.message);
      })
 }

}

peticionPut=()=>{
  axios.post(BASE_DEV_URL + 'rest/categorias/editarCategoria', {'nombre': this.state.form.nombre, 'calPerMin': parseInt(this.state.form.calPerMin), 'id': this.state.form.id}).then(response=>{
    this.modalInsertar();
    this.peticionGet();
  })
}

peticionDelete=()=>{
  axios.post(BASE_DEV_URL + 'rest/categorias/eliminarCategoria',{id:this.state.form.id}).then(response=>{
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
        user_mail:this.state.username, // {auth.username}
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

  componentDidMount() {

    if (localStorage.jwtToken) {
          authToken(localStorage.jwtToken);
          var token = localStorage.jwtToken
          var decoded = jwt_decode(token);
          this.state.username = decoded.sub;
          this.state.form.user_mail = decoded.sub;
    }
    this.peticionGet();
  }



  render(){
    const {form}=this.state;
    if (!this.state.data) {
                return (
                <div style={{color: 'white'}}>Cargando datos...</div>)
    }
  return (
    <div className="App py-3 px-md-5"  >
    <div style={{border: '5px solid rgb(33,37,41)',borderRadius: '10px', padding:'3%', color:'white'}}>
    <h2 style={{color: "white"}}>Categorias Fijas</h2>
  <br /><br />
    <table className="table " style={{textAlignVertical: "center",textAlign: "center",}}>
      <thead style={{textAlignVertical: "center",textAlign: "center",}}>
        <tr>
          <th style={{color: 'white'}}>Nombre</th>
          <th style={{color: 'white'}}>Calorias Por Minuto</th>
        </tr>
      </thead>
      <tbody style={{textAlignVertical: "center",textAlign: "center",}}>
        {this.state.data.map(categoria=>{
        if (categoria.is_editable == 'NOT_EDITABLE'){
          return(
            <tr>
          <td style={{color: 'white'}}>{categoria.nombre}</td>
          <td style={{color: 'white'}}>{categoria.calPerMin}</td>
          </tr>
          )
        }})}
      </tbody>
    </table>
    </div>
    <br /><br />
    <div style={{border: '5px solid rgb(33,37,41)',borderRadius: '10px', padding:'3%', color:'white'}}>
    <h2 style={{color: "white"}}>Categorias Personalizadas</h2>
    <br />
    <button className="btn btn-success" onClick={()=>{this.setState({ form:{id:'', nombre:'', calPerMin:'', user_mail: ''}, tipoModal: 'insertar'}); this.modalInsertar()}}>Agregar Categoria</button>
  <br /><br />
    <table className="table " style={{textAlignVertical: "center",textAlign: "center",}}>
      <thead style={{textAlignVertical: "center",textAlign: "center",}}>
        <tr>
          <th style={{color: 'white'}}>Nombre</th>
          <th style={{color: 'white'}}>Calorias Por Minuto</th>
          <th> </th>
        </tr>
      </thead>
      <tbody style={{textAlignVertical: "center",textAlign: "center",}}>
        {this.state.data.map(categoria=>{
        if (categoria.is_editable == 'EDITABLE'){
          return(
            <tr>
          <td style={{color: 'white'}}>{categoria.nombre}</td>
          <td style={{color: 'white'}}>{categoria.calPerMin}</td>
          <td style={{color: 'white'}}>
                <button className="btn btn-primary" onClick={()=>{this.seleccionarcategoria(categoria); this.modalInsertar()}}><FontAwesomeIcon icon={faEdit}/></button>
                {"   "}
                <button className="btn btn-danger" onClick={()=>{this.seleccionarcategoria(categoria); this.setState({modalEliminar: true})}}><FontAwesomeIcon icon={faTrashAlt}/></button>
                </td>
          </tr>
          )
        }})}
      </tbody>
    </table>
    </div>

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
            Al eliminar {form && form.nombre}, se eliminaran TODOS sus entrenamientos.
            <br/>
            <br/>
            Continuar?
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
export default Categorias;
