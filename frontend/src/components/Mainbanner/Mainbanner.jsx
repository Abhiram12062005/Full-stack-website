import React from 'react'
import './Mainbanner.css'
import banner from '../../assets/banner.jpg'
import Headerbutton from '../Headerbutton/Headerbutton'
import { Parallax } from 'react-parallax'

const Mainbanner = () => {
  return (
    <div className='main-banner'>
      <Parallax strength={50} bgImage={banner} bgClassName='banner-img' className='banner'>
        <div className="main-banner-text">
          <h1>uPVC Windows <br /> Profiles</h1>
          <p>Upgrade Your Home with Premium uPVC Windows</p>
          <Headerbutton className='header-button'/>
        </div>
      </Parallax>
      
    </div>
  )
}

export default Mainbanner
