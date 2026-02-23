import React, { useState } from 'react'
import './Sidebar.css'
import dashboard from '../../assets/dashboard.png'
import customer from '../../assets/rating.png'
import catalog from '../../assets/products.png'
import auth from '../../assets/lock.png'
import order from '../../assets/purchase-order.png'
import Sidebarbtn from '../Sidebarbtn/Sidebarbtn'
import { Link, Route } from 'react-router-dom'
import { Outlet } from 'react-router-dom'


const Sidebar = () => {

  const [onclick, setonclick] = useState("")

  return (
    <>
    <div className='sidebar'>
      <Sidebarbtn icon={dashboard} text={'Dashboard'} drop={false} to={'/dashboard'}/>
      <Sidebarbtn icon={catalog} text={'Catalog'} drop={true} drop1={"Product List"} dropto1={'/product-list'} drop2={'Add Product'} dropto2={'/product'} drop3={'Category List'} dropto3={'/category-list'} drop4={'Category'} dropto4={'/addcategory'}/>
      <Sidebarbtn icon={customer} text={'Customer'} drop={true} drop1={"Customer List"} dropto1={'/customer-list'}/>
      <Sidebarbtn icon={order} text={'Orders'} drop={true} drop1={"Orders List"} dropto1={'/orders-list'} drop2={'Order Tracking'} dropto2={'/order-tracking'} />
      <Sidebarbtn icon={dashboard} text={'Query'} drop={false} to={'/querys'}/>
      <Sidebarbtn icon={auth} text={'Authentication'} drop={true} drop1={"Sign In"} dropto1={'/sign-in'} drop2={'Sign Up'} dropto2={'/sign-up'} drop3={'Forgot Password'} dropto3={'/forgot-password'} drop4={'Reset Password'} dropto4={'/reset-password'}/>
    </div>
    <Outlet/>
    </>

  )
}

export default Sidebar
