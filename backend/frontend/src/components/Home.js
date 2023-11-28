import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Header from './Header';
import Register from './Register';
import Login from './Login';
import PostCreate from './PostCreate';
import UserPosts from './UserPosts';
import Post from './Post';
import Profile from './Profile';
import Markets from './Markets';
import PostEdit from './PostEdit';
import Comment from './Comment';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBlog();
  }, [posts]);

  //grab blog data
  const getBlog = () => {
    fetch('blog/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',}
    })
      .then(response => response.json())
      .then(data => {
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

  const renderHome = () => {
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
    )
  }

  return (
    <Router>
      <>
      <Header />
      </>
      <Routes>
        <Route path="post/:p_id/comment/:c_id" element={<Comment/>}/>
        <Route path="/markets" element={<Markets/>}/>
        <Route path="/profile" element={<Profile getBlog={getBlog}/>}/>
        <Route path="/post/:id" element={<Post getBlog={getBlog}/>}/>
        <Route path="/:username" element={<UserPosts/>}/>
        <Route path="/post_create" element={<PostCreate getBlog={getBlog}/>}/>
        <Route path="/post_edit/:id" element={<PostEdit getBlog={getBlog}/>} />
        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/" element={renderHome()}/>
      </Routes>
    </Router>
  );
}

export default Home;
