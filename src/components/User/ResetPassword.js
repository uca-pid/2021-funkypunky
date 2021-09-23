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
  Alert,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignInAlt,
  faEnvelope,
  faLock,
  faUndo,
} from "@fortawesome/free-solid-svg-icons";
import {authenticateUser, updateUserPw} from "../../services/index";
import {Link} from "react-router-dom";
import MyToast from "../MyToast";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

function swalAlert(){
    MySwal.fire({
      title: <p>Hello Funky Punky</p>,
      footer: 'Copyright 2021',
      didOpen: () => {
        MySwal.clickConfirm()
      }
    }).then(() => {
      return MySwal.fire(<p>Se ha enviado correctamente</p>)
    })
}

const ResetPassword = (props) => {
  const [error, setError] = useState();
  const [show, setShow] = useState(true);
  const [message, setMessage] = useState("");

  const initialState = {
    email: "",
  };

  const [user, setUser] = useState(initialState);

  const credentialChange = (event) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const saveUserPw = () => {
    dispatch(updateUserPw(user))
        .then((response) => {
          setShow(true);
          setMessage(response.message);
          swalAlert();
          setTimeout(() => {
            setShow(false);
            props.history.push("/resetpassword");
          }, 2000);
        })
        .catch((error) => {
          console.log(error);
        });
  };

  const sendPassword = () => {
    saveUserPw();
  }

  const dispatch = useDispatch();

  return (
    <Row className="justify-content-md-center">
      <Col xs={5}>
        {show && props.message && (
          <Alert variant="success" onClose={() => setShow(false)} dismissible>
            {props.message}
          </Alert>
        )}
        {show && error && (
          <Alert variant="danger" onClose={() => setShow(false)} dismissible>
            {error}
          </Alert>
        )}
        <Card className={"border border-dark bg-dark text-white"}>
          <Card.Header>
            <FontAwesomeIcon icon={faSignInAlt} /> Reset Password
          </Card.Header>
          <Card.Body>
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
                    onChange={credentialChange}
                    className={"bg-dark text-white"}
                    placeholder="Enter Email Address"
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
              onClick={sendPassword}
              disabled={user.email.length === 0}
            >
              <FontAwesomeIcon icon={faSignInAlt} /> Send New Password
            </Button>
          </Card.Footer>
        </Card>
      </Col>
    </Row>
  );
};

export default ResetPassword;
