import React from 'react'
import './BannerImage.css'
import banner from '../../assets/casement-windows.jpg'

const BannerImage = () => {
  return (
    <div className='banner-imgae'>
      <img src={banner} alt="" />
      <div className="banner-opacity"></div>
    </div>
  )
}

export default BannerImage
