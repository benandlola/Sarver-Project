import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Header = () =>{
    const { authenticated, logout } = useAuth();
    
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