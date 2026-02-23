import React from 'react'
import './Footer.css'
import loc from '../../assets/maps-and-flags.png'
import email from '../../assets/email (1).png'
import phone from '../../assets/old-typical-phone.png'

const Footer = () => {
  return (
    <footer>
        <div className="footer">
            <div className="footer-content">
                <img src={loc} alt="" />
                <p>Sree Sai Industries PlotNo.62,TIF MSME Green Industrial Park, Dandumalkapur,Yadadri Bhuvanagiri Dt Telangana -508252</p>
            </div>
            <div className="footer-content">
                <img src={email} alt="" />
                <p>sresaiind@gmail.com</p>
            </div>
            <div className="footer-content">
                <img src={phone} alt="" />
                <p>+918008122556<br></br>+917093948999<br />+918008122557</p>
            </div>
        </div>
    </footer>
  )
}

export default Footer
