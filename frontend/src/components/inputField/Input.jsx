import React, { useState } from 'react'
import './Input.css'
import emailicon from '../../assets/email.png'
import passwordicon from '../../assets/lock.png'
import usernameicon from '../../assets/usericon.png'
import mobileicon from '../../assets/mobile.png'
import view from '../../assets/eye.png'
import notvisibleicon from '../../assets/hidden.png'

const Input = ({name,type, value, placeholder,icon,ref}) => {
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [visibleicon, setvisibileicon] = useState('false')
  return (
    <div className='inputs'>
        <div className={`${name} input`}>
            <div className="img">
                <img width={20} src={icon} alt="" />
            </div>
            <input name={name} placeholder={placeholder} type={type == "password" ? passwordVisible ? "text" : "password" : type} defaultValue={value} ref={ref}/>
            <div className="visibile">
            {
                type == "password" ? 
                <img 
                    className='visibility'
                    src={passwordVisible === false? notvisibleicon : view}
                    onClick={()=>setPasswordVisible(currentVal => !currentVal)}
                ></img>
                :""
            }
            </div>
        </div>
    </div>
  )
}

export default Input
