import React, { useContext, useRef } from 'react';
import './UserAuth.css';
import leftArrow from '../../assets/left-arrow.png';
import banner from '../../assets/loginimg.png';
import banner2 from '../../assets/banner2.png';
import emailicon from '../../assets/email.png';
import { Toaster, toast } from 'react-hot-toast';
import passwordicon from '../../assets/lock.png';
import usernameicon from '../../assets/usericon.png';
import mobileicon from '../../assets/mobile.png';
import googleicon from '../../assets/search.png';
import { Link, Navigate } from 'react-router-dom';
import { UserContext } from "../../App";
import Input from '../../components/inputField/Input';
import axios from "axios";
import AnimationWrapper from '../../components/AnimationWrapper';
import { storeInSession } from '../../components/session';
import { authWithGoogle } from '../../components/Firebase'

const UserAuth = ({ type }) => {

    const authform = useRef();
    console.log(authform)
    let {userAuth: {access_token}, setUserAuth} = useContext(UserContext)
    console.log(access_token)

    const userAuthTroughServer = (serverRoute, formData) =>{
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData).then(({data})=>{
            storeInSession("user",JSON.stringify(data))
            setUserAuth(data)
        }).catch(({response})=>{
            toast.error(response.data.error)
        })
    }

    const handleSubmit = (e) => {
        let serverRoute = type == "sign-in" ? "/signin" : "/signup";
        e.preventDefault();
        let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
        let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password
        let form = new FormData(authform.current)
        let formData = {}

        for(let [key,value] of form.entries()){
            formData[key] = value
        }
        console.log(formData)

        let { username, fullname, email, password } = formData;
        
        
        if(!emailRegex.test(email)){
            return toast.error("Email is Invalid")
        }
        if(!passwordRegex.test(password)){
            return toast.error("Password should be 6 to 20 characters long with a numeric, 1 uppercase and 1 lowercase letters")
        }
        userAuthTroughServer(serverRoute, formData)
    }

    const handleGoogleAuth = (e) => {

        e.preventDefault();
        authWithGoogle().then(user => {
            let serverRoute = '/google-auth';
            let formatData = {
                access_token: user.accessToken
            }
            userAuthTroughServer(serverRoute, formatData)
        }).catch(err =>{
            toast.error("trouble login through google")
            return console.log(err)
        })

    }

    return (   
        access_token?
        <Navigate to='/'/>
        : 
        <AnimationWrapper keyvalue={type}>
            <div className='user-auth'>
                <Toaster containerStyle={{height:'3vw',margin:"0 40%" ,backgroundColor:'transparent'}} toastOptions={{style:{
                    width:'280px',
                    backgroundColor:'black',
                    color:'white',
                    fontSize:'10px',
                    textOverflow:'clip',
                    whiteSpace:'now'
                }}} reverseOrder/>
                <Link to='/' className='arrow'>
                    <img src={leftArrow} width="25" className='back-arrow' alt="Back"/>
                </Link>
                <div className="user-auth-container">

                    {type === 'sign-in' ?
                        <img width='250' src={banner} className='banner-img' alt="Sign In Banner" />
                        :
                        <img width='250' src={banner2} className='banner-img' alt="Sign Up Banner" />
                    }
                    <form ref={authform} className='input-fields' autoComplete='on'>
                        {type === 'sign-up' ? <Input name="username" type="text" placeholder="Enter Username" id="input" icon={usernameicon} /> : ""}
                        {type === 'sign-up' ? <Input name="fullname" type="text" placeholder="Enter Fullname" id="input" icon={usernameicon} /> : ""}
                        <Input name="email" type="email" placeholder="Enter Email" id="input" icon={emailicon} />
                        <Input name="password" type="password" placeholder="Enter Password" id="input" icon={passwordicon} />
                        <button className="signin-btn" type="submit" onClick={handleSubmit}>{type.replace('-', ' ')}</button>
                    </form>

                    {type === 'sign-in' ?
                        <p className='Signup-text'>Don't have an Account? <Link to='/signup' className='Signup-btn'>Sign up</Link></p>
                        :
                        <p className='Signup-text'>Don't have an Account? <Link to='/signin' className='Signup-btn'>Sign in</Link></p>
                    }
                    <div className="or">
                        <hr />
                        <p>or</p>
                        <hr />
                    </div>
                    <button className='google' onClick={handleGoogleAuth}><img src={googleicon} width={30} alt="Google Icon" /> Continue with Google</button>
                </div>
            </div>
        </AnimationWrapper>
    );
};

export default UserAuth;
