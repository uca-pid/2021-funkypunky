import { Form, Col, Row, Button } from 'react-bootstrap';
import './styles.css';

export default function Home() {
  return (
    <div className='container big'>
    <Form>

    <h3>Enviaremos una nueva contraseña</h3>


      <Row className="mb-3">
        <Form.Group as={Col} controlId="formGridEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" placeholder="juanpepealfonso@gmail.com" />
        </Form.Group>
      </Row>

        <Form.Group as={Row} className="mb-3" controlId="formLogin">
          <Button column sm="12" variant="primary" type="submit">
            Restablecer contraseña
          </Button>
        </Form.Group>

    </Form>
    </div>
  );
}