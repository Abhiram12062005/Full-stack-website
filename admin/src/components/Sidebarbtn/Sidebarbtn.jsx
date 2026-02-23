import React, { useState } from 'react'
import './Sidebarbtn.css'
import leftarrow from '../../assets/left-arrow.png'
import dashboard from '../../assets/dashboard.png'
import customer from '../../assets/rating.png'
import catalog from '../../assets/products.png'
import auth from '../../assets/lock.png'
import order from '../../assets/purchase-order.png'
import { Link } from 'react-router-dom';

const Sidebarbtn = ({icon,drop1,drop2,drop3,drop4,text,drop,dropto1,dropto2,dropto3,dropto4,to}) => {

    const [dropdown, setdropdown] = useState(false)

  return (
    <div className="sidebar-options">
        <div className="option">
            <Link to={to} onClick={()=>setdropdown(curr => !curr)}>
                <div className="sidebar-option" >
                    <div className="option-i" onClick={() => setdropdown({onclick})}>
                        <img src={icon} className='icon' alt="" />
                        <p>{text}</p>
                    </div>
                    {
                        drop ? <img src={leftarrow} className='left-arrow' alt="" /> :""
                    }
                </div>
            </Link>
            {
                drop ?
                <div className="drop">
                    {
                        dropdown ?
                        <div className="dropdown">
                            {
                                drop1 ? <Link to={dropto1}>{drop1}</Link>:''
                            }
                            {
                                drop2 ? <Link to={dropto2}>{drop2}</Link>:''
                            }
                            {
                                drop3 ? <Link to={dropto3}>{drop3}</Link>:''
                            }
                            {
                                drop4 ? <Link to={dropto4}>{drop4}</Link>:''
                            }
                        </div> :""
                    }
                </div> :''
            }
        </div>
    </div>
  )
}

export default Sidebarbtn
