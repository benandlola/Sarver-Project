import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import getCookie from '../csrftoken';

const Header = () =>{
    const { authenticated, logout } = useAuth();
    const navigate = useNavigate();
    const csrftoken = getCookie('csrftoken');

    const handleLogout  =() => {
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
                logout()
                alert('You have logged out')
                navigate('/')
            } else {
                console.error('Logout failed');
            }
        })
        .catch(error => {
            console.error('Error during logout: ', error);
        });
    }

    return (
        <header className="site-header">
            <nav className="navbar navbar-expand-md navbar-dark bg-steel fixed-top">
                <div className="container">
                    <Link className="navbar-brand mr-4" to="/">Home</Link>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarToggle" aria-controls="navbarToggle" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarToggle">
                        <div className="navbar-nav mr-auto">
                        <Link className="nav-item nav-link" to='/'>Blog</Link>
                            <Link className="nav-item nav-link" to='/markets'>Markets</Link>
                        </div>
                        <div className="navbar-nav ms-auto">
                            {authenticated ? (
                                <>
                                <Link className="nav-item nav-link" to='/post_create'>Create Post</Link>
                                <Link className="nav-item nav-link" to='/profile'>Profile</Link>
                                <a className="nav-item nav-link" onClick={handleLogout}>Logout</a>
                                </>
                            ) : (
                                <>
                                    <Link className="nav-item nav-link" to='/register'>Register</Link>
                                    <Link className="nav-item nav-link" to='/login'>Login</Link>
                                </>                  
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Header;