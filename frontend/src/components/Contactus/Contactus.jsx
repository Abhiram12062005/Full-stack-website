// Contactus.jsx
import React from 'react'
import CustomerCare from '../CustomerCare/CustomerCare'
import arrow from '../../assets/arrow (1).png'
import Navbar from '../Navbar/Navbar'
import { Link } from 'react-router-dom'
import './Contactus.css'

const Contactus = () => {
  return (
    <div className="contact-container">
      <Link to='/' className="back-link">
        <img src={arrow} alt="Back" className="back-arrow"/>
      </Link>
      <CustomerCare heading="Contact US" />
    </div>
  )
}

export default Contactus