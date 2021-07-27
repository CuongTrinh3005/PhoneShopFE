import './App.css';
import Home from './components/Home';
import Navbar from './components/Navbar';
import Contact from './components/Contact';
import HelloWord from './components/HelloWorld';
import Detail from './components/ProductDetails';
import BookByCategory from './components/BookByCategory';
import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';
import Aside from './components/Aside';
import ProductList from './components/ProductList/index';
import SignIn from './components/Account/SignIn/index';
import SignUp from './components/Account/SignUp/index';
import LogOut from './components/Account/LogOut';
import NewBookFilter from './components/Feature';
import CategoryManagement from './Admin/Category';
import BookManagement from './Admin/Book';
import BookGenerator from './Admin/Book/createNewUtil';
import BookUpdater from './Admin/Book/UpdateBook';
import UserManagement from './Admin/User';
import FilterByDiscount from './components/Feature/FilterByDiscount';
import Cart from './components/Cart';


function App() {
  const [loginName, setloginName] = useState('')
  const [categoryName, setCategoryName] = useState('');
  const [cart, setCart] = useState([]);
  const [cartString, setCartString] = useState('');

  // Callback function for Navbar
  const getCategoryName = (categoryName) => {
    setCategoryName(categoryName)
  }

  const getLoginName = (name) => {
    setloginName(name);
  }

  // const getCart = async (cart) => {
  //   await setCart(cart);
  //   console.log("cart: " + cart);
  // }

  const addCartString = async (str) => {
    await setCartString(getCookie("cart"));
    await setCartString(cartString + str)
  }

  const setCookie = (cname, cvalue, exdays) => {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
  }

  const getCookie = (cname) => {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1);
      if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
  }

  useEffect(() => setCookie("cart", cartString, 1), [cartString])

  // useEffect(() => {
  //   setCookie("cart", cartString, 1);
  //   window.sessionStorage.setItem("cart_SESS", cartString);
  // }, [cartString]);

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
                  <ProductList categoryName="" />
                </Route>

                <Route exact path="/detail/:id">
                  <h3>BOOK DETAILS</h3>
                  <Detail addCartString={addCartString} />
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

                <Route exact path="/feature/new">
                  <NewBookFilter />
                </Route>

                <Route exact path="/feature/discount">
                  <FilterByDiscount />
                </Route>

                <Route exact path="/admin/categories">
                  <CategoryManagement />
                </Route>

                <Route exact path="/admin/books">
                  <BookManagement />
                </Route>

                <Route exact path="/admin/book/new">
                  <BookGenerator />
                </Route>

                <Route exact path="/admin/book/detail/:id">
                  <BookUpdater />
                </Route>

                <Route exact path="/admin/users">
                  <UserManagement />
                </Route>

                <Route exact path="/cart">
                  <Cart />
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
