import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Feed = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
  
    useEffect(() => {
      getFeed();
    }, []);
  
    //grab blog data
    const getFeed = () => {
      fetch('users/feed/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',}
      })
        .then(response => response.json())
        .then(data => {
          if (Array.isArray(data) && data.length === 0) {
            navigate('/'); 
          }
          if (JSON.stringify(data) !== JSON.stringify(posts)) {
            setPosts(data);
            setLoading(false);
          }
        })
        .catch(error => {
          console.error('Error fetching data: ', error);
          setLoading(true);
        });
    }
  
    //show the posts
    const renderPost = (post) => {
      return (
        <div key={post.id}>
        <article className="media content-section mb-0 mt-3 clickable">
          <Link className="post-click" to={`/${post.author.username}`}>
          <div className="d-flex align-items-center article-metadata">
            <img className="rounded-circle article-img" src={post.author.profile.image} alt=""/>
            <div className="ml-2 d-flex flex-column align-items-start">
            {post.author.username} 
            <small className="text-muted">{post.created_at}</small>
            </div>  
          </div>
          </Link>  
          <Link className="post-click" to={`/post/${post.id}`}>
          <div className="media-body">      
            <h2>{post.title}</h2>   
            <p className="article-content">{post.content}</p>
            {post.image && <img className="blog-img mx-auto" src={post.image}/>}
          </div>
          </Link>
          <div className="container text-center row pt-3">
            <Link className="post-click col-md-2" to={`/post/${post.id}`} state={{ isReply: true}}>
              <p className="pr-3"><i className="bi bi-filter-square-fill pr-4"/> {post.comments.length} </p>
            </Link>
            <div className="col-md-2">
              <p>T2</p>
            </div>
            <div className="col-md-2">
              <p>T3</p>
            </div>
            <div className="col-md-2">
              <p>T4</p>
            </div>
            <div className="col-md-2">
              <p>T5</p>
            </div>
          </div>    
        </article>
        </div>
      );
    };
  
    return (
        <div>
        <main role="main" className="container">
          <div className="row">
            <div className="col-md-9">
            {loading ? (
            <p>Loading...</p>
              ) : (
                Array.isArray(posts) ? posts.map((post) => renderPost(post)) : renderPost(posts)
            )}
            </div>
            <div className="col-md-3">
              <div className="content-section">
                <h3>Information</h3>
                <p className='text-muted'>Useful tidbits</p>
                <ul className="list-group">
                  <li className="list-group-item list-group-item-light">Nothing yet</li>
                </ul>
              </div>  
            </div>
          </div>
        </main>
      </div>
    );
  }
  
  export default Feed;
  