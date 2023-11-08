import React, { useEffect, useState } from 'react';
import Header from './Header';
import { Link, useParams } from 'react-router-dom';

const UserPosts = (props) => {
  const [posts, setPosts] = useState({});
  const { username } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    viewUserPosts(username);
  }, [username]);

  const viewUserPosts = (username) => {
    fetch(`http://127.0.0.1:8000/blog/${username}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',}
    })
    .then(response => response.json())
    .then(data => {
      setPosts(data);
      setLoading(false);
    })
    .catch(error => {
      console.error('Error getting profile ', error);
      setLoading(false);
    });
  }
    
  //show the posts
  const renderPost = (post) => {
    return (
      <article className="media content-section" key={post.id}>
        <Link className="nav-item nav-link" to={`/${post.author.username}`}><img className="rounded-circle article-img" src={post.author.profile.image} alt=""/></Link>
        <div className="media-body">
          <div className="article-metadata">
            <Link className="nav-item nav-link" to={`/${post.author.username}`}>{post.author.username}</Link>   
            <small className="text-muted">{post.created_at}</small>
          </div>
          <h2><Link className="nav-item nav-link" to={`/post/${post.id}`}>{post.title}</Link></h2>   
          <p className="article-content">{post.content}</p>
        </div>
      </article>
    );
  };

  return (
    <div>
        <Header />
        <main role="main" className="container">
          <div className="row">
            <div className="col-md-8">
              {loading ? (
                <p>Loading...</p>
              ) : (
                Array.isArray(posts) ? posts.map((post) => renderPost(post)) : renderPost(posts)
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
      </div>
  );
}
export default UserPosts;