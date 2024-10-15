import React from 'react';
import './Navbar.css';
import logo from '../../assets/logo.png';
import nav_profile from '../../assets/nav-profile.png';

const Navbar = () => {
    return (
        <div className='navbar'>
            <img src={logo} alt="" className="nav-logo" />
            <img src={nav_profile} alt="" className="nav-profile" />
        </div>
    )
}

export default Navbar
