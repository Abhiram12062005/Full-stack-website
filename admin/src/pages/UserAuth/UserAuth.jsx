import React, { useContext, useRef } from 'react'
import { Link } from 'react-router-dom'
import './UserAuth.css'
import { Toaster, toast } from 'react-hot-toast';
import { Navigate } from 'react-router-dom';
import verify from '../../assets/verify.png'
import axios from "axios";
import { storeInSession } from '../../components/session';
import { UserContext } from '../../App';

const UserAuth = ({type}) => {

    const adminauthform = useRef();
    console.log(adminauthform)
    let {adminuserAuth: {access_token}, setadminUserAuth} = useContext(UserContext)
    console.log(access_token)

    const userAuthTroughServer = (serverRoute, formData) =>{
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData).then(({data})=>{
            storeInSession("user",JSON.stringify(data))
            setadminUserAuth(data)
        }).catch(({response})=>{
            toast.error(response.data.error)
        })
    }

    const handleSubmit = (e) => {
        let serverRoute = type == "sign-in" ? "sign-in" : "sign-up";
        e.preventDefault();
        let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
        let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password
        let form = new FormData(adminauthform.current)
        let formData = {}

        for(let [key,value] of form.entries()){
            formData[key] = value
        }
        console.log(formData)

        let { fullname, email, password } = formData;
        
        
        if(!emailRegex.test(email)){
            return toast.error("Email is Invalid")
        }
        if(!passwordRegex.test(password)){
            return toast.error("Password should be 6 to 20 characters long with a numeric, 1 uppercase and 1 lowercase letters")
        }
        userAuthTroughServer(serverRoute, formData)
    }

  return (
    access_token?
    <>
    <Navigate to={'/dashboard'}/>
    <div className="users">
        <div className="user-auths">
            <img src={verify} alt="" />
            <h1>You're Already logged in </h1>
        </div>
        <div className='back'>
            <Link to={'/dashboard'}>Back to Dashboard</Link>
        </div>
    </div>
    </>
    
    : 
    <div className='user'>
        <div className="user-auth">
        <Toaster  reverseOrder/>
            <div className="user-auth-text">
                <h2>{type.replace('-',' ').replace('s','S')}</h2>
                <p>Fill out the form to create a new account.</p>
            </div>
            <form ref={adminauthform} className="user-auth-input">
                {
                    type === 'sign-up' ?
                    <div className="inputs">
                        <p>fullname</p>
                        <input name='fullname' type="text" required/>
                    </div> :""
                }
                <div className="inputs">
                    <p>Email Address</p>
                    <input name='email' type="email" required/>
                </div>
                <div className="inputs">
                    <p>Password</p>
                    <input name='password' type="password" required/>
                </div>
                <button onClick={handleSubmit}>{type.replace('-'," ")}</button>
            </form>
            <div className="or">
                <hr />
                OR 
                <hr />
            </div>
            <div className="user-auth-signup">
                {
                    type === "sign-up" ? <p>Already have an account? <Link className='btn' to={'/sign-in'} >Sign in</Link></p> : <p>Don't have an account? <Link className='btn'  to={'/sign-up'}>Sign up</Link></p>
                }
            </div>
        </div>
    </div>
  )
}

export default UserAuth
