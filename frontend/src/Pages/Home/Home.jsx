import React, { useState } from 'react'
import './Home.css'
import Mainbanner from '../../components/Mainbanner/Mainbanner'
import Features from '../../components/Features/Features'
import BannerImage from '../../components/BannerImage/BannerImage'
import HomeProduct from '../../components/HomeProduct/HomeProduct'
import HomeReview from '../../components/HomeReview/HomeReview'
import CustomerCare from '../../components/CustomerCare/CustomerCare'
import SocialMedia from '../../components/SocialMedia/SocialMedia'
import Footer from '../../components/Footer/Footer'

const Home = () => {


  return (
    <div className='home'>
      <Mainbanner />
      <Features />
      {/* <BannerImage /> */}
      <HomeProduct />
      {/* <HomeReview /> */}
      {/* <div className="cc">
      <CustomerCare />
      </div> */}
      <SocialMedia/>
      <Footer />
    </div>
  )
}

export default Home
