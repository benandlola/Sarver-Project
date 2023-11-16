import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import getCookie from '../csrftoken';

const PostEdit = ({ getBlog }) => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageFile, setImageFile] = useState('');
    const [image, setImage] = useState('');

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            const file = e.target.files[0];
            setImage(URL.createObjectURL(file));
            setImageFile(file);
        }
    };

    const csrftoken = getCookie('csrftoken');

    const getPost = (id) => {
        fetch(`blog/post/${id}/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',}
        })
    
        .then(response => {
          return response.json()
        })
        .then(data => {
          setTitle(data.title);
          setContent(data.content);
          setImage(data.image);
        })
        .catch(error => {
          console.error('Error getting post ', error);
        });
      }

    useEffect(() => {
        getPost(id)
      }, [])

    const handleEdit = (e) => {
        e.preventDefault();   
        const formData = new FormData();
        formData.append('title', document.getElementById('id_title').value);
        formData.append('content',  document.getElementById('id_content').value);
        if (imageFile) {
            formData.append('image', imageFile);
        }

        fetch(`blog/post/${id}/edit/`, {
        credentials: 'include',
        method: 'POST',
        mode: 'same-origin',
        headers: {
            'X-CSRFToken': csrftoken
        },
        body: formData,
        })
        .then(() => {
            getBlog();
            navigate('/')
        })
    };

    return (
    <main role="main" className="container">
        <div className="row">
            <div className="col-md-8">             
                <div className="content-section">
                    <form method="POST" onSubmit={handleEdit}>
                        <fieldset className="form-group">
                            <legend className="border-bottom mb-4">Blog Post</legend>
                            <div id="div_id_title" className="form-group"> 
                                <label htmlFor="id_title" className="requiredField">
                                    Title
                                    <span className="asteriskField">*</span> 
                                </label> 
                                <div> 
                                    <input type="text" name="title" maxLength="100" className="textinput form-control" required="" id="id_title" value={title} onChange={(e) => setTitle(e.target.value)}/> 
                                </div> 
                            </div> 
                            <div id="div_id_content" className="form-group"> 
                                <label htmlFor="id_content" className=" requiredField">
                                    Content
                                    <span className="asteriskField">*</span> 
                                </label> 
                                <div> 
                                    <textarea name="content" cols="40" rows="10" className="textarea form-control" required="" id="id_content" value={content} onChange={(e) => setContent(e.target.value)}></textarea> 
                                </div> 
                            </div>
                            <div id="div_id_image" className="form-group"> 
                                    <label htmlFor="id_image" className=" requiredField">
                                        Image<span className="asteriskField">*</span> 
                                        <br/>
                                        <i className="bi bi-file-image"></i><input type="file" name="image" accept="image/*" className="clearablefileinput form-control-file" id="id_image" onChange={handleImageChange}/> 
                                    </label> 
                                    <div>
                                    <img className="blog-img mb-1" src={image}/>
                                    </div> 
                                </div>
                        </fieldset>
                        <div className="form-group">
                            <button className="btn btn-outline-info" type="submit">Edit</button>
                        </div>
                    </form>
                </div>
            </div>
            <div className="col-md-4">
                <div className="content-section">
                    <h3>Information</h3>
                    <p className="text-muted">Useful tidbits</p>
                    <ul className="list-group">
                        <li className="list-group-item list-group-item-light"><a href="https://www.nasdaq.com/market-activity/earnings" target="_blank">Earnings Calendar</a></li>
                    </ul>
                    <p></p>
                </div>
            </div>
        </div>
    </main>
    )
}

export default PostEdit;