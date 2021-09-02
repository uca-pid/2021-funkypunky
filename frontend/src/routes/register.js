import { Form, Col, Row, Button } from 'react-bootstrap';
import './styles.css';

export default function Register() {
  return (
  <div className='container big'>
  <Form>
      <Form.Group className="mb-3" controlId="formGridName">
        <Form.Label>Nombre y Apellido</Form.Label>
        <Form.Control placeholder="Juan Ramon Ramirez" />
      </Form.Group>

    <Row className="mb-3">
      <Form.Group as={Col} controlId="formGridEmail">
        <Form.Label>Email</Form.Label>
        <Form.Control type="email" placeholder="juanpepealfonso@gmail.com" />
      </Form.Group>

      <Form.Group as={Col} controlId="formGridPassword">
        <Form.Label>Contraseña</Form.Label>
        <Form.Control type="password" placeholder="**********" />
      </Form.Group>
    </Row>

    <Form.Group className="mb-3" controlId="formGridAddress">
      <Form.Label>Direccion</Form.Label>
      <Form.Control placeholder="Av. Alicia Moreau de Justo 1300" />
    </Form.Group>

    <Row className="mb-3">
      <Form.Group as={Col} controlId="formGridCity">
        <Form.Label>Ciudad</Form.Label>
        <Form.Select defaultValue="Ciudad Autonoma de Buenos Aires">
          <option>Ciudad Autonoma de Buenos Aires</option>
          <option>Buenos Aires</option>
          <option>Cordoba</option>
        </Form.Select>
      </Form.Group>

      <Form.Group as={Col} controlId="formGridZip">
        <Form.Label>Codigo Postal</Form.Label>
        <Form.Control />
      </Form.Group>
    </Row>

      <Form.Group as={Row} className="mb-3" controlId="formLogin">
        <Button column sm="12" variant="primary" type="submit">
          Registrarse
        </Button>
      </Form.Group>

  </Form>
  </div>
  );
}