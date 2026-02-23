import React, { useContext, useState } from 'react'
import { UserContext } from '../../App';
import './Navbar.css'
import { Link } from 'react-router-dom'
import logo from '../../assets/logo1.png'
import refer from '../../assets/refer-arrow.svg'
import adduser from '../../assets/add-user.png'
import carts from '../../assets/shopping-cart.png'
import search from '../../assets/searchs.png'
import menuicon from '../../assets/list.png'
import MenuDropdown from '../MenuDropdown/MenuDropdown';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
    const [menu, setMenu] = useState("home");
    const { cart } = useCart();
    const [userNavPanel, setuserNavPanel] = useState(false);
    const { userAuth, userAuth: { access_token, profile_img } } = useContext(UserContext);

    const handleUserNavPanel = () => {
        setuserNavPanel(curr => !curr);
    };

    const handleNavBlur = () => {
        setTimeout(() => {
            setuserNavPanel(false);
        }, 200);
    };

    return (
        <div className='Navbar'>
            {/* Logo */}
            <div className="navbar-logo">
                <img src={logo} alt="Logo" />
            </div>

            {/* Desktop nav links */}
            <div className="navbar-left">
                <ul>
                    <li><Link to="/"          onClick={() => setMenu('home')}      className={menu === 'home'      ? 'active' : ''} id="home">Home</Link></li>
                    <li><Link to="/product"   onClick={() => setMenu('products')}  className={menu === 'products'  ? 'active' : ''}>Products</Link></li>
                    <li><Link to="/aboutus"   onClick={() => setMenu('aboutus')}   className={menu === 'aboutus'   ? 'active' : ''}>About us</Link></li>
                    <li><Link to="/contactus" onClick={() => setMenu('contactus')} className={menu === 'contactus' ? 'active' : ''}>Contact us</Link></li>
                    <li>
                        <a className="db" href="/Broucher.pdf" download="Broucher.pdf">
                            Download Brochure
                        </a>
                    </li>
                </ul>
            </div>

            {/* Hamburger (mobile) */}
            <div className="menu-drop" onClick={handleUserNavPanel} onBlur={handleNavBlur} tabIndex={0}>
                <img src={menuicon} alt="Menu" className='menu' />
                {userNavPanel && <MenuDropdown />}
            </div>

            {/* Right actions */}
            {access_token ? (
                <div className="navbar-right">
                    <Link to="/cart" className='cart-nav-btn button'>
                        <img width="16" src={carts} alt="Cart" />
                    </Link>
                    <Link to="/search" className='cart-nav-btn button'>
                        <img width="16" src={search} alt="Search" />
                    </Link>
                    <Link to="/profile">
                        <img src={profile_img} alt="Profile" className="profile-img" />
                    </Link>
                </div>
            ) : (
                <div className="navbar-right">
                    <Link to="/signin">
                        <button className="signin button">
                            <img width="15" src={refer} alt="" />
                            <p>Sign in</p>
                        </button>
                    </Link>
                    <Link to="/signup">
                        <button className="signup button">
                            <img width="15" src={adduser} alt="" />
                            <p>Sign up</p>
                        </button>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Navbar;