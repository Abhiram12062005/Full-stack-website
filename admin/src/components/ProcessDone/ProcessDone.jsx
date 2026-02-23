import React from 'react'
import verify from '../../assets/verify.png'
import './ProcessDone.css'


const ProcessDone = ({text, to}) => {
  return (
    <div className="users">
        <div className="user-auths">
            <img src={verify} alt="" />
            <h1>You're Already logged in </h1>
        </div>
        <div className='back'>
            <Link to={to}>Back to {to.replace('/','')}</Link>
        </div>
    </div>
  )
}

export default ProcessDone
