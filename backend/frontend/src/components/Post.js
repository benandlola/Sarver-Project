import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Header from './Header';

const Post = () => {
  const { id } = useParams(); 
  const [post, setPost] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState('');
  const navigate = useNavigate();

  const getUser = () => {
    fetch('http://127.0.0.1:8000/users/get_user/', {
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
    fetch(`http://127.0.0.1:8000/blog/post/${id}/`, {
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

  //TODO incorporate callback
  const deletePost = (id) => {
    fetch(`http://127.0.0.1:8000/blog/post/${id}/delete/`, {
      credentials: 'include',
      method: 'DELETE',
      mode: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken
      },
    })  
    .then(() => navigate('/'))
  }

  return (
    <div>
    <Header />
    <main role="main" className="container">
      <div className="row">
        <div className="col-md-8">
          {loading ? (
            <p>Loading...</p>
          ) : (
          <article className="media content-section" key={post.id}>
            <Link className="nav-item nav-link" to={`/${post.author.username}`}><img className="rounded-circle article-img" src={post.author.profile.image} alt=""/></Link>
            <div className="media-body">
              <div className="article-metadata">
                <Link className="nav-item nav-link" to={`/${post.author.username}`}>{post.author.username}</Link>   
                <small className="text-muted">{post.created_at}</small>
                {post.author.username === user.username && (
                  <div>
                  <button className="btn btn-danger btn-sm my-1" onClick={() => deletePost(post.id)}>Delete Post</button>
                  </div> 
                )}
              </div>
              <h2><Link className="nav-item nav-link" to={`/post/${post.id}`}>{post.title}</Link></h2>   
              <p className="article-content">{post.content}</p>
            </div>
          </article>
          ) }
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
  </div>
  );
}

export default Post;