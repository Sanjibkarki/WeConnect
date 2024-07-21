import {Link } from 'react-router-dom';
import { Fragment } from 'react';


function Nav(){
    
    const isAuthenticated = false;
   

    const nav = (
        <div className="navbar-div1">
                    <ul className='navbar-nav1'>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/service">Service</Link>
                            
                        </li>
                        <li>
                            <Link to="/">About us</Link>
                        </li>
                    </ul>
                </div>
    )
    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">

                <div className='navbar-logo'>
                    <h1>WeCONNECT</h1>
                </div>
                <Fragment>{isAuthenticated ? nav : nav}</Fragment>
                
                <div className="navbar-div2">
                    <ul className='navbar-nav2'>
                        <li>
                            <Link to="/join">Join</Link>
                        </li>
                        <li>
                            <Link to="/host">Host</Link>
                        </li>
                        <li>
                            <Link to="/sign in">Signin</Link>
                        </li>
                    </ul>
                </div>
            </nav> 
            
        </>
    )
}
export default Nav;