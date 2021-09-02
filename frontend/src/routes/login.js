import { Form, Col, Row, Button } from 'react-bootstrap';
import './styles.css';

export default function About() {
  return(
  <div className='container big'>
    <Form>
      <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
        <Form.Label column sm="2">
          Email
        </Form.Label>
        <Col sm="10">
          <Form.Control type='text' placeholder="email@example.com" />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
        <Form.Label column sm="2">
          Password
        </Form.Label>
        <Col sm="10">
          <Form.Control type="password" placeholder="Password" />
        </Col>
      </Form.Group>

      <Row>
      <Form.Group as={Row} className="mb-3" controlId="formLogin">
        <Button column sm="6" variant="primary" type="submit">
            Iniciar Sesion
        </Button>
        </Form.Group>
        </Row>
        <Row>
        <Col column sm="6">
          <a href='forget' style={{color: "red"}}><Form.Label type="password" placeholder="Password">
          Olvidaste tu contraseña?
          </Form.Label></a>
        </Col>
        </Row>
    </Form>
  </div>
  );
}