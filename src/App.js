import logo from './logo.svg';
import './App.css';
import Home from './components/Home';
import Navbar from './components/Navbar';
import Contact from './components/Contact';
import HelloWord from './components/HelloWorld';
import { useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';
import Aside from './components/Aside';
import CartItem from './components/CardItem/index';

function App() {
  const [bootcamp, setBootcamp] = useState('Rookies')

  return (
    <BrowserRouter>
      <div className="App">
        <Navbar name={bootcamp} />
        <Container>
          <Row>
            <Col md="9" sm="6">
              <Switch>
                <Route exact path="/">
                  <Home name={bootcamp} />
                </Route>

                <Route exact path="/hello">
                  <HelloWord />
                </Route>

                <Route path="/hello/:username">
                  <HelloWord />
                </Route>

                <Route exact path="/contact">
                  <Contact />
                </Route>

                <Route path='*' exact={true} render={() => <h1>Route Not  Found</h1>} />


              </Switch>
              <CartItem />

            </Col>

            <Col sm="6" xs="6" lg="2">
              <Aside />
            </Col>
          </Row>
        </Container>


      </div>
    </BrowserRouter>
  );
}

export default App;
