import React, { useContext, useEffect, useRef, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import './AddAddress.css'
import axios from 'axios'
import { UserContext } from '../../App';

const AddAddress = ({ onSelectAddress }) => {

    const { userAuth, userAuth:{ _id } } = useContext(UserContext)

    console.log(_id)

    const addressForm = useRef();


    const userAuthTroughServer = (serverRoute, formData) =>{
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData).then(({data})=>{
            toast.success("Address Added successfully")
            window.location.reload()
        }).catch(({response})=>{
            toast.error(response.data.error)
        })
    }

    const handleSubmit = (e) => {
        let serverRoute = `/add-address/${_id}`;
        console.log(serverRoute)
        e.preventDefault();
        let form = new FormData(addressForm.current)
        let formData = {}

        for(let [key,value] of form.entries()){
            formData[key] = value
        }
        console.log(formData)

        let { name, mobileNumber, addressLine1, addressLine2, landmark,pincode,city,state } = formData;
        userAuthTroughServer(serverRoute, formData)
    }

  return (
    <div className="add-address">
        <Toaster reverseOrder/>
        <form className='address-form' ref={addressForm}>
            <input name='name' type="text" id='Name' placeholder='Name'/>
            <input name='mobileNumber' type="tel" id='mobilenumber' pattern='[0-9]{10}' placeholder='Mobile Number'/>
            <input name='addressLine1' type="text" id='address1' placeholder='Flat, House No., Building., Company.,Apartment.'/>
            <input name='addressLine2' type="text" id='address2' placeholder='Area.,Street.,Sector.,Village'/>
            <input name='landmark' type="text" id='Landmark' placeholder='Landmark'/>
            <input name='pincode' type="text" id='pincode' placeholder='Pincode'/>
            <input name='city' type="text" id='City' placeholder='City'/>
            <input name='state' type="text" id='State' placeholder='State'/>
            <button className='add-address-btns' onClick={handleSubmit}>Add Address</button>
        </form>
    </div>
  );
};

export default AddAddress;
