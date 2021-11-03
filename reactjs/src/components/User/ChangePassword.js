import React, { useState } from "react";
import { useSelector } from "react-redux";
import authToken from "../../utils/authToken";
import axios from "axios";
import {BASE_DEV_URL} from "../../utils/constants";
import {
  InputGroup,
  FormControl,
  Button,
  Alert,
} from "react-bootstrap";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const ChangePassword = () => {
  if (localStorage.jwtToken) {
    authToken(localStorage.jwtToken);
  }

  const MySwal = withReactContent(Swal);

  const auth = useSelector((state) => state.auth);

  const [inputValue, setInputValue] = React.useState("");

  const username = auth.username

  const onChangeHandler = event => {
     setInputValue(event.target.value);
  };


  const changePassword = async () =>{
   await axios.post(BASE_DEV_URL + 'rest/user/changeUserPw', {'username': username, 'password': inputValue}).then(response=>{
    return MySwal.fire('Se ha modificado correctamente')

  }).catch(error=>{
    console.log(error.message);
  })
  }


  return (

    <Alert style={{ backgroundColor: "#343A40", color: "#ffffff80" }}>
      Introduzca nueva contraseña para {auth.username}<br/>
      <FormControl
        required
        autoComplete="off"
        type="password"
        name="email"
        value={inputValue}
        onChange={onChangeHandler}
        className={"bg-dark text-white"}
        placeholder="nueva contraseña"
      /> <br/>
      <Button
        size="sm"
        type="button"
        variant="success"
        onClick={changePassword}
        disabled={inputValue.length === 0}>
        Cambiar contraseña
      </Button>
    </Alert>

  );
};

export default ChangePassword;

