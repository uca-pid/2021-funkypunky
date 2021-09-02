import './App.css';
import { BrowserRouter as Router, Switch, Route, } from "react-router-dom";
import Home from './routes/home.js'
import Register from './routes/register.js'
import Login from './routes/login.js'
import Forget from './routes/forget.js'
import { Nav } from 'react-bootstrap';

export default function App() {
  return (
    <Router>
      <div>
        <Nav variant="tabs" defaultActiveKey="/home">
          <Nav.Item>
            <Nav.Link href="/">Home</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="/register">Register</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="/login">Login</Nav.Link>
          </Nav.Item>
        </Nav>

        <Switch>
          <Route path="/forget">
            <Forget />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}