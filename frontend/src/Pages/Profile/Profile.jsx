import React, { useContext } from 'react'
import './Profile.css'
import { removeFromSession } from '../../components/session'
import { UserContext } from '../../App';
import ProfileCard from '../../components/ProfileCard/ProfileCard';
import ProfileButtons from '../../components/ProfileButtons/ProfileButtons';

const Profile = () => {
    const { userAuth:{ username }, setUserAuth } = useContext(UserContext);
    const Signoutuser = () =>{
        removeFromSession("user")
        setUserAuth({access_token:null})
    }
  return (
    <div className='profiles'>
      <ProfileCard/>
      <ProfileButtons/>
    </div>
  )
}

export default Profile
