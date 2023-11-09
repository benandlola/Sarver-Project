import React, { useLayoutEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import getCookie from '../csrftoken';

const Header = () =>{
    const [authenticated, setAuthenticated] = useState(false);
    const navigate = useNavigate();
    
    //check if logged in
    useLayoutEffect(() => {
        fetch('users/is_authenticated/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then(data => {
            setAuthenticated(data.authenticated)
        })  
    }, [])

    const csrftoken = getCookie('csrftoken');

    //log out
    const logout = () => {
        fetch('users/logout/', {
            credentials: 'include',
            method: 'POST',
            mode: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
        })
        .then(response => {
            if (response.ok) {
                setAuthenticated(false);
                alert('You have logged out')
                navigate('/');
            } else {
                console.error('Logout failed');
            }
        })
        .catch(error => {
            console.error('Error during logout: ', error);
        });
    };
    
    return (
        <header className="site-header">
            <nav className="navbar navbar-expand-md navbar-dark bg-steel fixed-top">
                <div className="container">
                    <a className="navbar-brand mr-4" href="/">Home</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarToggle" aria-controls="navbarToggle" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarToggle">
                        <div className="navbar-nav mr-auto">
                        <Link className="nav-item nav-link" to='/'>Blog</Link>
                            <Link className="nav-item nav-link" to='/markets'>Markets</Link>
                        </div>
                        <div className="navbar-nav">
                            {authenticated ? (
                                <React.Fragment>
                                <Link className="nav-item nav-link" to='/post_create'>Create Post</Link>
                                <Link className="nav-item nav-link" to='/profile'>Profile</Link>
                                <a className="nav-item nav-link" onClick={logout}>Logout</a>
                                </React.Fragment>
                            ) : (
                                <React.Fragment>
                                    <Link className="nav-item nav-link" to='/register'>Register</Link>
                                    <Link className="nav-item nav-link" to='/login'>Login</Link>
                                </React.Fragment>                  
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Header;