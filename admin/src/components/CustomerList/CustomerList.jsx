import React, { useEffect, useState } from 'react'
import './CustomerList.css'
import { Link } from 'react-router-dom'


const CustomerList = ({CustomerData}) => {

  const [data, setData] =useState([])
  useEffect(()=>{
    fetch(import.meta.env.VITE_SERVER_DOMAIN +'customer-list',{
      method: 'GET',
    })
    .then((res) => res.json())
    .then((data)=>{
      console.log(data,"CustomerData")
      setData(data.data)
    })
  },[])


  return (
    <div className='customer-list'>
      <div className="Customer-list-title">
        <p>Name</p>
        <p>Email</p>
        <p>Registered</p>
        <p>Full Name</p>
        <p>Spent</p>
      </div>
      <hr />
      {data.map((e)=>{
        const date = new Date(e.joinedAt);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        let formattedDate = date.toLocaleDateString('en-US', options);
        return(
          <div>
            <div className="customer-format Customer-list-title">
              <Link className="name" to={`/customers/${e._id}`}>
                <img src={e.personal_info.profile_img} width={40} alt="" />
                <p>{e.personal_info.username}</p>
              </Link>
              <div className="email">
                <p>{e.personal_info.email}</p>
              </div>
              <div className="registered">
                <p>{formattedDate}</p>
              </div>
              <div className="fullname">
                <p>{e.personal_info.fullname}</p>
              </div>
              <div className="spent">
                <p>₹10000</p>
              </div>
            </div>
            <hr />
          </div>
        ) 
      })}
    </div>
  )
}

export default CustomerList
