import './App.css';
// import Home from './components/Home';
import Navbar from './components/Navbar';
import About from './components/About';
import Detail from './components/ProductDetails';
import ProductByCategory from './components/ProductByCategory';
import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';
import Aside from './components/Aside';
import SignIn from './components/Account/SignIn/index';
import SignUp from './components/Account/SignUp/index';
import LogOut from './components/Account/LogOut';
import NewBookFilter from './components/Feature';
import CategoryManagement from './Admin/Category';
import ProductManagement from './Admin/Product';
import ProductGenerator from './Admin/Product/createNewUtil';
import ProductUpdater from './Admin/Product/UpdateProduct';
import UserManagement from './Admin/User';
import FilterByDiscount from './components/Feature/FilterByDiscount';
import Cart from './components/Cart';
import { getCookie, setCookie } from './components/CookieUtils';
import Checkout from './components/Checkout';
import UserOrders from './components/UserOrders';
import OrderDetail from './components/UserOrders/OrderDetail';
import ChangePassword from './components/Account/ChangePassword';
import ResetPassword from './components/Account/ResetPassword';
import UserDetails from './components/UserDetails';
import OrderManagement from './Admin/Order';
import OrderDetailForAdmin from './Admin/Order/OrderDetailForAdmin';
import BrandManagement from './Admin/Brand';
import ManufacturerManagement from './Admin/Manufacturer';
import FilterByTopView from './components/Feature/FilterByTopView';
import BestSelling from './components/Feature/BestSelling';
import BookSearching from './components/Searching';
import RatingManagement from './Admin/Rating.js';
import Home from './components/HomePage';

function App() {
  const [loginName, setloginName] = useState('')
  const [cartString, setCartString] = useState('');

  // Callback function for Navbar
  const getLoginName = (name) => {
    setloginName(name);
  }

  const addCartString = async (str) => {
    // check adding str is exist
    const cleanItemStr = str.split("|")[0];
    const itemId = cleanItemStr.split("-")[0];
    if (cartString !== "" && cartString.includes(itemId + "-")) {
      console.log("Item existed in cart");
      // updateItemQuantityInCart(str);
      const itemQuantity = cleanItemStr.split("-")[1];
      const refreshItemString = getRefreshItemInCart(itemId, itemQuantity);
      const strToReplace = getCartStringToReplace(itemId);
      if (refreshItemString !== "") {
        let newString = cartString.replace(strToReplace, refreshItemString);
        setCartString(newString);
      }
    }
    else
      setCartString(cartString + str)
  }

  const getRefreshItemInCart = (id, quantity) => {
    let itemList = cartString.split("|");
    for (let index = 0; index < itemList.length; index++) {
      let itemId = itemList[index].split("-")[0]
      if (id === itemId) {
        const newQuantity = parseInt(quantity) + parseInt(itemList[index].split("-")[1]);
        console.log("new quantity: " + newQuantity);
        const refreshItem = id + "-" + newQuantity + "|";
        console.log("Refresh item: " + refreshItem);
        return refreshItem;
      }
    }
    return "";
  }

  const getCartStringToReplace = (id) => {
    let itemList = cartString.split("|");
    for (let index = 0; index < itemList.length; index++) {
      let itemId = itemList[index].split("-")[0]
      if (id === itemId) {
        const oldQuantity = parseInt(itemList[index].split("-")[1]);
        const strToReplace = id + "-" + oldQuantity + "|";
        console.log("String to replace: " + strToReplace);
        return strToReplace;
      }
    }
    return "";
  }

  const fetchCookie = async () => {
    const cookieValue = getCookie("cart");
    if (cookieValue === null || cookieValue.trim() === '')
      return;

    await setCartString(cookieValue);
  }

  useEffect(() => {
    if (cartString === null || cartString.trim() === '') {
      fetchCookie();
    }
    if (cartString.trim() !== '') {
      setCookie("cart", cartString, 1);
      console.log("cart str: " + cartString);
    }
  }, [cartString]);

  return (
    <BrowserRouter>
      <div className="App">
        <header className="row">
          <h1 className="alert alert-info " align="center">
            <a href="/"><img alt="logo" width="100rem" height="100rem" src={window.location.origin + '/logo-book-store.jpg'} style={{ float: "left" }} /></a>
            HÃY NÓI THEO CÁCH CỦA BẠN</h1>
        </header>
        <Navbar name={loginName} />
        <Container>
          <Row>
            <Col sm="1" xs="4" lg="2" md="2" >
              <Aside />
            </Col>

            <Col md="10" sm="11">
              <Switch>
                <Route exact path="/">
                  <Home name={loginName} />
                </Route>

                <Route exact path="/detail/:id">
                  <Detail addCartString={addCartString} />
                </Route>

                <Route exact path="/about">
                  <About />
                </Route>

                <Route exact path="/products/search/:info">
                  <BookSearching />
                </Route>

                <Route exact path="/products/categoryId/:id">
                  <ProductByCategory />
                </Route>

                <Route exact path="/account/signin">
                  <SignIn getLoginName={getLoginName} />
                </Route>

                <Route exact path="/account/signup">
                  <SignUp />
                </Route>

                <Route exact path="/account/change-password/:username">
                  <ChangePassword />
                </Route>

                <Route exact path="/account/logout">
                  <LogOut />
                </Route>

                <Route exact path="/account/reset-password">
                  <ResetPassword />
                </Route>

                <Route exact path="/account/details">
                  <UserDetails />
                </Route>

                <Route exact path="/feature/new">
                  <NewBookFilter />
                </Route>

                <Route exact path="/feature/discount">
                  <FilterByDiscount />
                </Route>

                <Route exact path="/feature/top-view">
                  <FilterByTopView />
                </Route>

                <Route exact path="/feature/best-selling">
                  <BestSelling />
                </Route>

                <Route exact path="/admin/categories">
                  <CategoryManagement />
                </Route>

                <Route exact path="/admin/products">
                  <ProductManagement />
                </Route>

                <Route exact path="/admin/brands">
                  <BrandManagement />
                </Route>

                <Route exact path="/admin/manufacturers">
                  <ManufacturerManagement />
                </Route>

                <Route exact path="/admin/orders">
                  <OrderManagement />
                </Route>

                <Route exact path="/admin/order-detail/:id">
                  <OrderDetailForAdmin />
                </Route>

                <Route exact path="/admin/product/new">
                  <ProductGenerator />
                </Route>

                <Route exact path="/admin/product/detail/:id">
                  <ProductUpdater />
                </Route>

                <Route exact path="/admin/users">
                  <UserManagement />
                </Route>

                <Route exact path="/admin/ratings">
                  <RatingManagement />
                </Route>

                <Route exact path="/cart">
                  <Cart />
                </Route>

                <Route exact path="/cart/checkout">
                  <Checkout />
                </Route>

                <Route exact path="/checkout/userId/:userId">
                  <UserOrders />
                </Route>

                <Route exact path="/checkout/detail/:orderid">
                  <OrderDetail />
                </Route>

                <Route path='*' exact={true} render={() => <h1>Route Not  Found</h1>} />
              </Switch>
            </Col>


          </Row>

          <Row>

          </Row>
        </Container>
      </div>
    </BrowserRouter>
  );
}

export default App;