import React, { useEffect, useState } from 'react';
import './ConfirmedOrder.css';
import { useNavigate } from 'react-router-dom';

const ConfirmedOrder = () => {
  const [animate, setAnimate] = useState(false);
  const navigate = useNavigate();

  const onclickbtn = () =>{
    navigate('/')
  }

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <div className={`confirmed-order ${animate ? 'animate' : ''}`}>
      <svg
        className='tick'
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 130.2 130.2"
      >
        <circle
          className="path circle"
          fill="none"
          stroke="#73AF55"
          strokeWidth="6"
          strokeMiterlimit="10"
          cx="65.1"
          cy="65.1"
          r="62.1"
        />
        <polyline
          className="path checks"
          fill="none"
          stroke="#73AF55"
          strokeWidth="6"
          strokeLinecap="round"
          strokeMiterlimit="10"
          points="100.2,40.2 51.5,88.8 29.8,67.5 "
        />
      </svg>
      <p className="success">Order Successfully Completed</p>
      <button className='contiue-shopping' onClick={onclickbtn}>Continue Shopping</button>
    </div>
  );
};

export default ConfirmedOrder;
