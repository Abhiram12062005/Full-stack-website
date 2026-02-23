import React, { useContext } from 'react'
import './Navbar.css'
import logo from '../../assets/logo1.png'
import user from '../../assets/user2.jpg';
import { UserContext } from '../../App';
import { removeFromSession } from '../session';
import { Link, Navigate } from 'react-router-dom';

const Navbar = () => {

  let {adminuserAuth: { profile_img, access_token,fullname, email }, setadminUserAuth} = useContext(UserContext)
  const Signoutuser = () =>{
    removeFromSession("user")
    setadminUserAuth({access_token:null})
  }

  return (
    !access_token ?
    <Navigate to={'/sign-in'}/>
    :
    <div className='navbar'>
      <img className='logo' width={100} src={logo} alt="" />
      <div className="nav-right">
        <img className='profile' width={45} src={profile_img} alt="" />
        <div className="info">
          <p>{fullname}</p>
          <p>{email}</p>
        </div>
        <button onClick={Signoutuser}>Sign Out</button>
      </div>
    </div>
  )
}

export default Navbar
