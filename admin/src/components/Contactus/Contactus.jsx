import React from 'react'
import './Contactus.css'
import { useEffect } from 'react'
import { useState } from 'react'

const Contactus = () => {
    const [data, setData] =useState([])
    useEffect(()=>{
        fetch(import.meta.env.VITE_SERVER_DOMAIN + 'get-contactus',{
        method: 'GET',
        })
        .then((res) => res.json())
        .then((data)=>{
        console.log(data,"contact us")
        setData(data.data)
        })
    },[])
    return (
        <div className='contact-us'>
            <table>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Mobile Number</th>
                    <th>Requirement Details</th>
                    <th>How Do They Know us</th>
                </tr>
                {
                    data.map((e)=>{
                        return(
                            <tr>
                                <td>{e.name}</td>
                                <td>{e.mobilenumber}</td>
                                <td>{e.email}</td>
                                <td>{e.requirement}</td>
                                <td>{e.knowus}</td>
                            </tr>
                        )
                    })
                }
            </table>
        </div>
    )
}

export default Contactus;
