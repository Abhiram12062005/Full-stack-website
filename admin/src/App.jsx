import AnimationWrapper from './components/AnimationWrapper'
import { lookInSession } from './components/session'
import { Route, Routes, useParams } from 'react-router-dom'
import UserAuth from './pages/UserAuth/UserAuth'
import { createContext, useEffect, useState } from 'react'
import Dashboard from './components/Dashboard/Dashboard'
import Home from './pages/Home/Home'
import Sidebar from './components/Sidebar/Sidebar'
import Navbar from './components/Navbar/Navbar'
import ProductList from './components/ProductList/ProductList'
import CustomerList from './components/CustomerList/CustomerList'
import ProductAdd from './components/ProductAdd/ProductAdd'
import Category from './components/Category/Category'
import CategoryList from './components/CategoryList/CategoryList'
import CustomerDetails from './components/CustomerDetails/CustomerDetails'
import OrderList from './components/OrderList/OrderList'
import OrderTracking from './components/OrderTracking/OrderTracking'
import Query from './components/Querys/Query'
import Contactus from './components/Contactus/Contactus'
import UpdateProduct from './components/UpdateProduct/UpdateProduct'

export const UserContext = createContext({})
export const CategoryContext = createContext({})

const App = ({type}) => {

  const [adminuserAuth, setadminUserAuth] = useState({})
  const [categoryCon, setCategoryCon] = useState({})

  useEffect (()=>{
    let userInSession = lookInSession("user");
    userInSession ? setadminUserAuth(JSON.parse(userInSession)) : setadminUserAuth({access_token: null})
  },[])

  return (
    <AnimationWrapper keyvalue={type}>
      <UserContext.Provider value={{adminuserAuth,setadminUserAuth}}>

      <Routes>
        <Route path='/' element={<Home></Home>}>
          <Route path='dashboard' element={<Dashboard/>} />
          <Route path='product-list' element={<ProductList/>} />  
          <Route path='customer-list' element={<CustomerList/>}/>
          <Route path='category-list' element={<CategoryList/>}/>
          <Route path='addcategory' element={<Category/>}/>
          <Route path='product' element={<ProductAdd/>} />
          <Route path='update-product/:id' element={<UpdateProduct/>} />
          <Route path='querys' element={<Query/>} />
          <Route path='contactus' element={<Contactus/>} />
          <Route path='orders-list' element={<OrderList/>} />
          <Route path='order-tracking' element={<OrderTracking/>} />
          <Route path="/customers/:id" element={<CustomerDetails />} />
        </Route>
        <Route path='/sign-in' element={<UserAuth type="sign-in"/>}/>
        <Route path='/sign-up' element={<UserAuth type="sign-up"/>}/>
      </Routes>
    </UserContext.Provider>
    </AnimationWrapper>
  ) 
}

export default App
