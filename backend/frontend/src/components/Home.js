import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Header from './Header';
import Register from './Register';
import Login from './Login';
import PostCreate from './PostCreate';
import UserPosts from './UserPosts';
import Post from './Post';
import Profile from './Profile';

const Home = () => {
  const [posts, setPosts] = useState([]);

  //grab blog data
  useEffect(() => {
    fetch('http://127.0.0.1:8000/blog/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',}
    })
      .then(response => response.json())
      .then(data => {
        if (JSON.stringify(data) !== JSON.stringify(posts)) {
          setPosts(data);
        }
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
      });
  }, []);

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

  const renderHome = () => {
    return (
      <div>
        <Header />
        <main role="main" className="container">
          <div className="row">
            <div className="col-md-8">
              {Array.isArray(posts) ? posts.map((post) => renderPost(post)) : renderPost(posts)}
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
    )
  }

  return (
    <Router>
      <Routes>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/post/:id" element={<Post/>}/>
        <Route path="/:username" element={<UserPosts/>}/>
        <Route path="/post_create" element={<PostCreate/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/" element={renderHome()}/>
      </Routes>
    </Router>
  );
}

export default Home;