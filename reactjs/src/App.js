import React from "react";
import "./App.css";

import { Container, Row, Col } from "react-bootstrap";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import NavigationBar from "./components/NavigationBar";
import Welcome from "./components/Welcome";
import Register from "./components/User/Register";
import Login from "./components/User/Login";
import Footer from "./components/Footer";
import Home from "./components/Home";
import ResetPassword from "./components/User/ResetPassword";
import Trainings from "./components/Activity/Trainings";
import Categorias from "./components/Activity/Categorias";
import ChangePassword from "./components/User/ChangePassword";
import Objetivos from "./components/Activity/Objetivos";

const App = () => {
  window.onbeforeunload = (event) => {
    const e = event || window.event;
    e.preventDefault();
    if (e) {
      e.returnValue = "";
    }
    return "";
  };

  return (
    <Router>
      <NavigationBar />
      <Container>
        <Row>
          <Col lg={12} className={"margin-top"}>
            <Switch>
              <Route path="/" exact component={Welcome} />
              <Route path="/home" exact component={Home} />
              <Route path="/register" exact component={Register} />
              <Route path="/login" exact component={Login} />
              <Route path="/resetpassword" exact component={ResetPassword} />
              <Route path="/changepassword" exact component={ChangePassword} />
              <Route path="/entrenamientos" exact component={Trainings} />
              <Route path="/categorias" exact component={Categorias} />
              <Route path="/objetivos" exact component={Objetivos} />
              <Route
                path="/logout"
                exact
                component={() => (
                  <Welcome message="User Logged Out Successfully." />
                )}
              />
            </Switch>
          </Col>
        </Row>
      </Container>
      <Footer />
    </Router>
  );
};

export default App;
