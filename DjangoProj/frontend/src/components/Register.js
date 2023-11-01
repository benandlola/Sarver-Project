import React, { useEffect, useState } from 'react';
import Header from './Header';
import CSRFToken from './Csrftoken';
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const navigate = useNavigate();
    
    //register the user
    const handleSubmit = (e) => {
      e.preventDefault();   
      const formData = {
        username: username,
        email: email,
        password1: password1,
        password2: password2,
      };
      fetch('http://127.0.0.1:8000/users/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                navigate('/login')
            }
        })
        .catch((error) => {
          console.log('Error registering ', error)
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
                            <CSRFToken />
                            <fieldset className="form-group">
                                <legend className="border-bottom mb-4">Join Today</legend>
                                <div id="div_id_username" className="form-group"> 
                                    <label htmlFor="id_username" className=" requiredField">
                                        Username
                                    <span className="asteriskField">*</span> 
                                    </label>
                                    <div> 
                                        <input type="text" name="username" maxLength="150" autoFocus="" className="textinput form-control" required="" id="id_username" value={username} onChange={(e) => setUsername(e.target.value)}/> 
                                        <small id="hint_id_username" className="form-text text-muted">Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.</small> 
                                    </div> 
                                </div> 
                                <div id="div_id_email" className="form-group"> 
                                    <label htmlFor="id_email" className=" requiredField">
                                        Email
                                    <span className="asteriskField">*</span> 
                                    </label> 
                                    <div> 
                                        <input type="email" name="email" maxLength="320" className="emailinput form-control" required="" id="id_email" value={email} onChange={(e) => setEmail(e.target.value)}/> 
                                    </div> 
                                </div> 
                                <div id="div_id_password1" className="form-group"> 
                                    <label htmlFor="id_password1" className=" requiredField">
                                        Password
                                    <span className="asteriskField">*</span> 
                                    </label> 
                                    <div> 
                                        <input type="password" name="password1" autoComplete="new-password" className="passwordinput form-control" required="" id="id_password1" value={password1} onChange={(e) => setPassword1(e.target.value)}/> 
                                        <small id="hint_id_password1" className="form-text text-muted">
                                            <ul>
                                                <li>Your password can’t be too similar to your other personal information.</li>
                                                <li>Your password must contain at least 8 characters.</li><li>Your password can’t be a commonly used password.</li>
                                                <li>Your password can’t be entirely numeric.</li>
                                            </ul>
                                        </small> 
                                    </div> 
                                </div> 
                                <div id="div_id_password2" className="form-group"> 
                                    <label htmlFor="id_password2" className=" requiredField">
                                        Password confirmation
                                    <span className="asteriskField">*</span> 
                                    </label> 
                                    <div> 
                                        <input type="password" name="password2" autoComplete="new-password" className="passwordinput form-control" required="" id="id_password2" value={password2} onChange={(e) => setPassword2(e.target.value)}/> 
                                        <small id="hint_id_password2" className="form-text text-muted">Enter the same password as before, for verification.</small> 
                                    </div> 
                                </div>
                            </fieldset>
                            <div className="form-group">
                                <button className="btn btn-outline-info" type="submit">Sign Up</button>
                            </div>
                        </form>
                        <div className="border-top pt-3">
                            <small className="text-muted">Already Have An Account?
                            <Link className="nav-item nav-link" to='/login'>Sign In</Link>
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        </main>
        </div>
    )
}