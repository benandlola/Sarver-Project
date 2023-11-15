import React, { useState, useLayoutEffect } from 'react';
import { useNavigate } from "react-router-dom";
import getCookie from '../csrftoken';

const Profile = ({ getBlog }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [image, setImage] = useState('');
    const [imageFile, setImageFile] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    //get user data
    useLayoutEffect(() => {
        fetch('users/get_user/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then(data => {
            setUsername(data.user.username);
            setEmail(data.user.email);
            setImage(data.user.profile.image)
            setLoading(false);
        })  
    }, [])

    const csrftoken = getCookie('csrftoken');

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            const file = e.target.files[0];
            setImage(URL.createObjectURL(file));
            setImageFile(file);
        }
    };

    //update profile 
    const handleProfileUpdate = (e) => {
        e.preventDefault();   
        const formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);
        formData.append('image', imageFile);
        fetch('users/profile/update/', {
            credentials: 'include',
            method: 'POST',
            mode: 'same-origin',
            headers: {
                'X-CSRFToken': csrftoken
            },
            body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
              if (data.success) {
                    getBlog();
                    navigate('/')
              }
              else {
                  alert(data.error)
              }
          })
          .catch((error) => {
              console.log('Error updating profile ', error)
          });
    };

    return (
        <main role="main" className="container">
            <div className="row">
                <div className="col-md-8">  
                {loading ? ( <p>Loading...</p> ) 
                : (      
                    <div className="content-section">
                        <div className="media">
                            <img src={image} className="rounded-circle account-img"/>
                            <div className="media-body">
                                <h2 className="account-heading">{username}</h2>
                                <p className="text-secondary">{email}</p>
                            </div>
                        </div>
                        <form method="POST" encType="multipart/form-data" onSubmit={handleProfileUpdate}>
                            <fieldset className="form-group">
                                <legend className="border-bottom mb-4">Profile Info</legend>
                                <div id="div_id_username" className="form-group"> 
                                    <label htmlFor="id_username" className=" requiredField">
                                        Username<span className="asteriskField">*</span> 
                                    </label> 
                                    <div> 
                                        <input type="text" name="username" value={username} maxLength="150" className="textinput form-control" required="" id="id_username" onChange={(e) => setUsername(e.target.value)}/> 
                                        <small id="hint_id_username" className="form-text text-muted">Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.</small> 
                                    </div> 
                                </div> 
                                <div id="div_id_email" className="form-group"> 
                                    <label htmlFor="id_email" className=" requiredField">
                                        Email<span className="asteriskField">*</span> 
                                    </label> 
                                    <div> 
                                        <input type="email" name="email" value={email} maxLength="320" className="emailinput form-control" required="" id="id_email" onChange={(e) => setEmail(e.target.value)}/> 
                                    </div> 
                                </div>
                                <div id="div_id_image" className="form-group"> 
                                    <label htmlFor="id_image" className=" requiredField">
                                        Image<span className="asteriskField">*</span> 
                                        <br/>
                                        <i className="bi bi-file-image"></i><input type="file" name="image" accept="image/*" className="clearablefileinput form-control-file" id="id_image" style={{ display: 'none' }} onChange={handleImageChange}/> 
                                    </label>  
                                </div>
                            </fieldset>
                            <div className="form-group">
                                <button className="btn btn-outline-info" type="submit">Update</button>
                            </div>
                        </form>
                    </div>
                    )}  
                </div>
                <div className="col-md-4">
                    <div className="content-section">
                        <h3>Information</h3>
                        <p className="text-muted">Useful tidbits</p>
                        <ul className="list-group">
                            <li className="list-group-item list-group-item-light"><a href="https://www.nasdaq.com/market-activity/earnings" target="_blank">Earnings Calendar</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Profile;