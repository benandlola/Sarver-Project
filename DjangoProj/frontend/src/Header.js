import React from 'react';

export default function Header() {
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
                            <a className="nav-item nav-link" href="/">Blog</a>
                            <a className="nav-item nav-link" href="/markets">Markets</a>
                        </div>
                        <div className="navbar-nav">
                            FILL IN LATER
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}

/*
{% if user.is_authenticated %}
    <a class="nav-item nav-link" href="http://127.0.0.1:8000/blog/">Create Post</a>
    <a class="nav-item nav-link" href="http://127.0.0.1:8000/profile/">Profile</a>
    <a class="nav-item nav-link" href="http://127.0.0.1:8000/logout/">Logout</a>
{% else %}
    <a class="nav-item nav-link" href="http://127.0.0.1:8000/login/">Login</a>
    <a class="nav-item nav-link" href="http://127.0.0.1:8000/register">Register</a>
{% endif %}
*/