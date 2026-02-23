import React from 'react'
import './Headerbutton.css'
import { useNavigate } from 'react-router-dom';

const Headerbutton = () => {
  const navigate = useNavigate();
  const explore = () =>{
    navigate('/product')
  }

  return (
    <div className='header-button'>
      <button className='exp-btn' onClick={explore}>Explore Menu</button>
    </div>
  )
}

export default Headerbutton
