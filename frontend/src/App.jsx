import React, { createContext, useContext, useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Home from './Pages/Home/Home'
import UserAuth from './Pages/UserAuth/UserAuth'
import { lookInSession } from "./components/session";
import AnimationWrapper from './components/AnimationWrapper'
import Profile from './Pages/Profile/Profile'
import Cart from './Pages/Cart/Cart'
import Products from './Pages/Products/Products'
import ProductDetail from './components/ProductDetail/ProductDetail'
import Search from './Pages/Search/Search'
import OrderPage from './components/OrderPage/OrderPage'
import AddAddress from './components/AddAddress/AddAddress'
import ConfirmedOrder from './components/ConfirmedOrder/ConfirmedOrder'
import OrderHistory from './components/OrderHistory/OrderHistory'
import OrderTracking from './components/OrderTracking/OrderTracking'
import CustomerCare from './components/CustomerCare/CustomerCare'
import AboutUs from './components/AboutUs/AboutUs'
import Contactus from './components/Contactus/Contactus'
import SocialMedia from './components/SocialMedia/SocialMedia'
import Footer from './components/Footer/Footer'

export const UserContext = createContext({})

const App = ({type}) => {

  const [userAuth, setUserAuth] = useState({})
  const { userAuths } = useContext(UserContext);
  const userId = userAuths ? userAuths._id : null;

  useEffect (()=>{
    let userInSession = lookInSession("user");
    userInSession ? setUserAuth(JSON.parse(userInSession)) : setUserAuth({access_token: null})
  },[])

  return (
    <>
      <UserContext.Provider value={{userAuth,setUserAuth}}>
        <AnimationWrapper keyvalue={type}>
          <Routes>
            <Route path='/' element={<><Navbar/><Home/></>}/>
            <Route path="/signin" element={<UserAuth type="sign-in"/>}/>
            <Route path="/signup" element={<UserAuth type="sign-up"/>}/>
            <Route path='/profile' element={<Profile/> }/>
            <Route path='/cart' element={<><Navbar/><hr/><Cart/></> }/>
            <Route path='/product' element={<><Navbar/><hr style={{margin:0}}/><Products/><SocialMedia/><Footer/></> }/>
            <Route path='/products/:id' element={<><Navbar/><hr/><ProductDetail/></> }/>
            <Route path='/search' element={<Search/>} />
            <Route path='/order' element={<OrderPage/>} />
            <Route path='/customer-care' element={<><CustomerCare/></>} />
            <Route path='/aboutus' element={<><AboutUs/><SocialMedia/><Footer/></>} />
            <Route path='/contactus' element={<><Contactus/><SocialMedia/><Footer/></>} />
            <Route path='/confirmed-order' element={<ConfirmedOrder/>} />
            <Route path={`/orders-list`} element={<><Navbar/><hr/><OrderHistory/></>} />
            <Route path={`/order-tracking`} element={<><Navbar/><hr/><OrderTracking/></>} />
          </Routes>
        </AnimationWrapper>
      </UserContext.Provider>
    </>
    
  )
}

export default App
