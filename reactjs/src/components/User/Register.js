import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Row,
  Col,
  Card,
  Form,
  InputGroup,
  FormControl,
  Button,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faEnvelope,
  faLock,
  faUndo,
  faUserPlus,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { registerUser } from "../../services/index";
import MyToast from "../MyToast";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

function swalAlert(texto){
    MySwal.fire(texto);
}

const Register = (props) => {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");

  const initialState = {
    name: "",
    email: "",
    password: "",
    mobile: "",
  };

  const [user, setUser] = useState(initialState);

  const userChange = (event) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const dispatch = useDispatch();

  const saveUser = () => {
  if(user.name == '' || user.email == '' || user.password == '' || user.mobile == '' ){
    swalAlert("Hay campos vacios");
  }else{
    if(user.password.length < 7 || user.mobile.length < 7){
        swalAlert("La contraseña y el numero de celular debe tener al menos 7 caracteres");
    }else{
    if(user.mobile < 0){
            swalAlert("El celular no puede ser negativo");
    }else{
         dispatch(registerUser(user))
               .then((response) => {
                 setShow(true);
                 setMessage(response.message);
                 resetRegisterForm();
                 setTimeout(() => {
                   setShow(false);
                   props.history.push("/login");
                 }, 2000);
               })
               .catch((error) => {
                 swalAlert("Ya existe un usuario registrado con ese mail");
                 //console.log(error);
               });
       }
       }
  }
  };

  const resetRegisterForm = () => {
    setUser(initialState);
  };

  return (
    <div>
      <div style={{ display: show ? "block" : "none" }}>
        <MyToast show={show} message={message} type={"success"} />
      </div>
      <Row className="justify-content-md-center">
        <Col xs={5}>
          <Card className={"border border-dark bg-dark text-white"}>
            <Card.Header>
              <FontAwesomeIcon icon={faUserPlus} /> Register
            </Card.Header>
            <Card.Body>
              <Form.Row>
                <Form.Group as={Col}>
                  <InputGroup>
                    <InputGroup.Prepend>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faUser} />
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      autoComplete="off"
                      type="text"
                      name="name"
                      value={user.name}
                      onChange={userChange}
                      className={"bg-dark text-white"}
                      placeholder="Enter Name"
                    />
                  </InputGroup>
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col}>
                  <InputGroup>
                    <InputGroup.Prepend>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faEnvelope} />
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      required
                      autoComplete="off"
                      type="text"
                      name="email"
                      value={user.email}
                      onChange={userChange}
                      className={"bg-dark text-white"}
                      placeholder="Enter Email Address"
                    />
                  </InputGroup>
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col}>
                  <InputGroup>
                    <InputGroup.Prepend>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faLock} />
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      required
                      autoComplete="off"
                      type="password"
                      name="password"
                      value={user.password}
                      onChange={userChange}
                      className={"bg-dark text-white"}
                      placeholder="Enter Password"
                    />
                  </InputGroup>
                  <div>La contraseña debe tener al menos 7 caracteres </div>
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col}>
                  <InputGroup>
                    <InputGroup.Prepend>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faPhone} />
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      autoComplete="off"
                      type="text"
                      name="mobile"
                      value={user.mobile}
                      onChange={userChange}
                      className={"bg-dark text-white"}
                      placeholder="Enter Mobile Number"
                      type="number"
                    />
                  </InputGroup>
                </Form.Group>
              </Form.Row>
            </Card.Body>
            <Card.Footer style={{ textAlign: "right" }}>
              <Button
                size="sm"
                type="button"
                variant="success"
                onClick={saveUser}
                disabled={user.email.length === 0 || user.password.length === 0}
              >
                <FontAwesomeIcon icon={faUserPlus} /> Register
              </Button>{" "}
              <Button
                size="sm"
                type="button"
                variant="info"
                onClick={resetRegisterForm}
              >
                <FontAwesomeIcon icon={faUndo} /> Reset
              </Button>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Register;
