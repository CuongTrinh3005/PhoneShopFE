import './App.css';
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
import Cart from './components/Cart';
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
import BookSearching from './components/Searching';
import RatingManagement from './Admin/Rating.js';
import Home from './components/HomePage';

function App() {
  const [loginName, setloginName] = useState('')

  // Callback function for Navbar
  const getLoginName = (name) => {
    setloginName(name);
  }

  return (
    <BrowserRouter>
      <div className="App">
        <header className="row">
          <h1 className="alert alert-info " align="center">
            <a href="/">
              <img alt="logo" width="100rem" height="100rem" src={window.location.origin + '/giuse-church-inside.jpg'}
                style={{ float: "left" }} />
            </a>
            GIÁO XỨ THÁNH GIUSE - QUẢN LÝ THIẾU NHI</h1>
        </header>
        <Navbar name={loginName} />
        <Container>
          <Switch>
            <Route exact path="/">
              <Home name={loginName} />
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
        </Container>
      </div>
    </BrowserRouter>
  );
}

export default App;