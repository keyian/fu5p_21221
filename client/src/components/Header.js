import React from 'react';
import Login from './Login.js';
import {Link} from 'react-router-dom';
import './styles/Header.css';


export default function Header(props) {
    const {login, setLogin, 
    userData, setUserData, 
    picture, setPicture} = props.hooks;

    return (
        <div id="header-div">
            <Link to={'/'} replace><h2 className="title">Under 5</h2></Link>
            <Login hooks={props.hooks} />
        </div>
    );
}