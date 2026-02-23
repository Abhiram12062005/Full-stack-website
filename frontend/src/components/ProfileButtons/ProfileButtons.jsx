import React, { useContext } from 'react'
import  './ProfileButtons.css'
import { UserContext } from '../../App';
import { Link, Navigate } from 'react-router-dom'
import rightArrow from '../../assets/right-arrow.png'
import { removeFromSession } from '../session';

const ProfileButtons = () => {

  const { userAuth:{ username,access_token }, setUserAuth } = useContext(UserContext);
  const Signoutuser = () =>{
    removeFromSession("user")
    setUserAuth({access_token:null})
  }

  return (
    <div className='profile-buttons'>
        <hr className='left-hr'/>
        <div className="profile-button-links">
            <hr />
            <Link to='/orders-list' className='btn'>Orders History<img src={rightArrow} width={20} /></Link>
            <hr />
            <Link to='/order-tracking' className='btn'>Order Tracking<img src={rightArrow} width={20} /></Link>
            <hr />
            <Link to='/cart' className='btn'>Cart<img src={rightArrow} width={20} /></Link>
            <hr />
            <Link to='/customer-care' className='btn'>Customer Care Support<img src={rightArrow} width={20} /></Link>
            <hr />
            <Link to='/profile' className='btn'onClick={Signoutuser}>Sign Out<img src={rightArrow} width={20} /></Link>
            <hr />
        </div>
        {
          !access_token ? <Navigate to='/'/> : " "
        }
    </div>
  )
}

export default ProfileButtons
