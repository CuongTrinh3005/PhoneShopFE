import './App.css';
import Home from './components/Home';
import Navbar from './components/Navbar';
import Contact from './components/Contact';
import HelloWord from './components/HelloWorld';
import Detail from './components/ProductDetails';
import BookByCategory from './components/BookByCategory';
import { useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';
import Aside from './components/Aside';
import CartItem from './components/CardItem/index';
import SignIn from './components/Account/SignIn/index';
import SignUp from './components/Account/SignUp/index';
import LogOut from './components/Account/LogOut';

function App() {
  const [loginName, setloginName] = useState('')
  const [categoryName, setCategoryName] = useState('');

  // Callback function for Navbar
  const getCategoryName = (categoryName) => {
    setCategoryName(categoryName)
  }

  const getLoginName = (name) => {
    setloginName(name);
  }

  return (
    <BrowserRouter>
      <div className="App">
        <Navbar name={loginName} getCategoryName={getCategoryName} />
        <Container>
          <Row>
            <Col md="9" sm="6">
              <Switch>
                <Route exact path="/">
                  <Home name={loginName} />
                  <CartItem categoryName="" />
                </Route>

                <Route exact path="/detail/:id">
                  <h3>BOOK DETAILS</h3>
                  <Detail />
                </Route>

                <Route exact path="/hello">
                  <HelloWord />
                </Route>

                <Route path="/hello/:username">
                  <HelloWord />
                </Route>

                <Route exact path="/books/category=:categoryName">
                  <BookByCategory />
                </Route>

                <Route exact path="/account/signin">
                  <SignIn getLoginName={getLoginName} />
                </Route>

                <Route exact path="/account/signup">
                  <SignUp />
                </Route>

                <Route exact path="/account/logout">
                  <LogOut />
                </Route>

                <Route path='*' exact={true} render={() => <h1>Route Not  Found</h1>} />
              </Switch>

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
