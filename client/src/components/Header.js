import React from 'react';
// import Login from './Login.js';
import NuLogin from './NuLogin.js';
import {Link} from 'react-router-dom';
import './styles/Header.css';


export default function Header() {

    return (
        <div id="header-div">
            <Link to={'/'} replace><h2 className="title">Under 5</h2></Link>
            <NuLogin />
        </div>
    );
}