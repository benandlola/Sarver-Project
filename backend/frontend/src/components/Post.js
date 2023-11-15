import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import getCookie from '../csrftoken';

const Post = ({ getBlog }) => {
  const { id } = useParams(); 
  const [post, setPost] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState('');
  const navigate = useNavigate();

  const getUser = () => {
    fetch('users/get_user/', {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      },
      })
      .then(response => response.json())
      .then(data => {
          setUser(data.user)
      }) 
  }

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
      setPost(data);
      setLoading(false);
    })
    .catch(error => {
      console.error('Error getting post ', error);
      setLoading(false);
    });
  }

  useEffect(() => {
    getUser()
    getPost(id)
  }, [])

  const csrftoken = getCookie('csrftoken');

  //added callback
  const handleDelete = (id) => {
    fetch(`blog/post/${id}/delete/`, {
      credentials: 'include',
      method: 'DELETE',
      mode: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken
      },
    })  
    .then(() => {
      getBlog();
      navigate('/')
    })
  }

  return (
    <main role="main" className="container">
      <div className="row">
        <div className="col-md-8">
          {loading ? (
            <p>Loading...</p>
          ) : (
          <>
          <article className="media content-section mb-0">
            <div className="d-flex align-items-center article-metadata">
              <Link to={`/${post.author.username}`}><img className="rounded-circle article-img" src={post.author.profile.image} alt=""/></Link>
              <div className="ml-2">
              <Link className="nav-link" to={`/${post.author.username}`}>{post.author.username}</Link>   
              <small className="text-muted">{post.created_at}</small>
              {post.author.username === user.username && (
                  <div>
                  <button className="btn btn-sm my-1"><Link to={`/post_edit/${post.id}`}><i className="bi bi-pencil"></i></Link></button>
                  <button className="btn btn-danger btn-sm my-1" onClick={() => handleDelete(post.id)}><i className="bi bi-trash"></i></button>
                  </div> 
                )}
              </div>
            </div>
            <div className="media-body">
              <h2><Link className="nav-item nav-link" to={`/post/${post.id}`}>{post.title}</Link></h2>   
              <p className="article-content" style={{ wordWrap: 'break-word', maxWidth: '100%' }}>{post.content}</p>
              {post.image && <img className="blog-img" src={post.image}/>}
            </div>
          </article>  
          {post.comments && (
            <>
            {post.comments.map((comment) => (
              <div className="card">
                <div className="card-body" key={comment.id} >
                  <p>{comment.content}</p>
                </div>
              </div>
            ))}
            </>
            )}   
          </>
          )}  
        </div>
        <div className="col-md-4">
          <div className="content-section">
            <h3>Information</h3>
            <p className='text-muted'>Useful tidbits</p>
            <ul className="list-group">
              <li className="list-group-item list-group-item-light"><a href="https://www.nasdaq.com/market-activity/earnings" target="_blank">Earnings Calendar</a></li>
            </ul>
          </div>  
        </div>
      </div>
    </main>
  );
}

export default Post;