import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './CustomerDetails.css';

const CustomerDetails = () => {
  const { id } = useParams();
  const [data, setData] =useState(null)
  useEffect(()=>{
    fetch(import.meta.env.VITE_SERVER_DOMAIN +`customer/${id}`,{
      method: 'GET',
    })
    .then((res) => res.json())
    .then((data)=>{
      console.log(data,"CustomerData")
      setData(data.data)
    })
  },[])

  if (!data) return <div>Loading...</div>;

  return (
    <div className="customer-details-container">
        <div className="customers">
            <h2>Customer Details</h2>
            <p><strong>Name:</strong> {data.personal_info.name}</p>
            <p><strong>Email:</strong> {data.personal_info.email}</p>
        </div>
    </div>
  );
};

export default CustomerDetails;
