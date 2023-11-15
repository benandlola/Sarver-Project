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
      <article className="media content-section mb-0 mt-3">
        <div className="d-flex align-items-center article-metadata">
          <Link to={`/${post.author.username}`}><img className="rounded-circle article-img" src={post.author.profile.image} alt=""/></Link>
          <div className="ml-2">
          <Link className="nav-link" to={`/${post.author.username}`}>{post.author.username}</Link>   
          <small className="text-muted">{post.created_at}</small>
          </div>
        </div>
        <div className="media-body">
          <h2><Link className="nav-link" to={`/post/${post.id}`}>{post.title}</Link></h2>   
          <p className="article-content" style={{ wordWrap: 'break-word', maxWidth: '100%' }}>{post.content}</p>
          {post.image && <img className="blog-img mx-auto" src={post.image}/>}
        </div>
        {post.comments && post.comments.length > 0 && (
          <p className="pr-3"><i className="bi bi-filter-square-fill pr-4"/> {post.comments.length} </p>
        )} 
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
            <div className="col-md-3" style={{position: 'fixed', right:'3rem' }}>
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
