import React from 'react'
import './NavbarButton.css'
import refer from '../../assets/refer-arrow.svg'
import adduser from '../../assets/add-user.png'
import cart from '../../assets/shopping-cart.png'
import profile from '../../assets/user.png'
import { Link } from 'react-router-dom'

const NavbarButtons = ({name,icon,to}) => {
  return (
    <div>
        <Link to={to}>
            <button className="signin button">
                <img width="15" src={icon} alt="" />
                <p>{name}</p>
            </button>
        </Link>
    </div>
  )
}

export default NavbarButtons
