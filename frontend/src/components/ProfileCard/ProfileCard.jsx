import React, { useContext } from 'react'
import {UserContext} from '../../App'
import './ProfileCard.css'

const ProfileCard = () => {

    const { userAuth, userAuth:{ access_token,profile_img,fullname,email,username } } = useContext(UserContext)

  return (
    <div className='profile'>
        <div className="profile-card">
            <img src={profile_img} width={200} alt="" />
            <h1>{fullname}</h1>
            <div className="text">
                <p>Email:-{email}</p>
                <p>Username:-{username}</p>
            </div>
        </div>
    </div>
  )
}

export default ProfileCard
