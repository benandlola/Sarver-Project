import React, { useState } from 'react';
import Header from './Header';
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    const csrftoken = getCookie('csrftoken');

    //Log the User in
    const handleSubmit = (e) => {
      e.preventDefault();   
      const formData = {
        username: username,
        password: password,
      };
      fetch('http://127.0.0.1:8000/users/login/', {
        credentials: 'include',
        method: 'POST',
        mode: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                navigate('/')
            }
            else {
                alert(data.error)
            }
        })
        .catch((error) => {
          console.log('Error logging in ', error)
        });
    };

    return (
        <div>
        <Header />
        <main role="main" className="container">
            <div className="row">
                <div className="col-md-8">    
                    <div className="content-section">
                        <form method="POST" onSubmit={handleSubmit}>
                            <fieldset className="form-group">
                                <legend className="border-bottom mb-4">Login</legend>
                                <div id="div_id_username" className="form-group"> 
                                    <label htmlFor="id_username" className=" requiredField">
                                        Username<span className="asteriskField">*</span> 
                                    </label> 
                                    <div> 
                                        <input type="text" name="username" autoFocus="" autoCapitalize="none" autoComplete="username" maxLength="150" className="textinput form-control" required="" id="id_username" value={username} onChange={(e) => setUsername(e.target.value)}/> 
                                    </div> 
                                </div> 
                                <div id="div_id_password" className="form-group"> 
                                    <label htmlFor="id_password" className=" requiredField">
                                        Password<span className="asteriskField">*</span> 
                                    </label> 
                                    <div> 
                                        <input type="password" name="password" autoComplete="current-password" className="passwordinput form-control" required="" id="id_password" value={password} onChange={(e) => setPassword(e.target.value)}/> 
                                    </div> 
                                </div>
                            </fieldset>
                            <div className="form-group">
                                <button className="btn btn-outline-info" type="submit">Login</button>
                                <small className="text-muted ml-2">
                                    <a href="#">Forgot Password?</a>
                                </small>
                            </div>
                        </form>
                        <div className="border-top pt-3">
                            <small className="text-muted">Need An Account?<Link className="nav-item nav-link" to='/register'>Sign Up</Link>
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        </main>
        </div>
    )
}

export default Login;