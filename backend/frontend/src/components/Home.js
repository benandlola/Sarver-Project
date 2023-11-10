import React, { useState, useEffect, useLayoutEffect } from 'react';
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
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBlog();
  }, [posts]);

  //check if logged in
  useLayoutEffect(() => {
      fetch('users/is_authenticated/', {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          },
      })
      .then(response => response.json())
      .then(data => {
          setAuthenticated(data.authenticated)
      })  
  }, [])

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

  //TODO
  const handleComment = (e) => {
    console.log('commented')
  }

  //show the posts
  const renderPost = (post) => {
    return (
      <div key={post.id}>
      <article className="media content-section">
        <Link className="nav-item nav-link" to={`/${post.author.username}`}><img className="rounded-circle article-img" src={post.author.profile.image} alt=""/></Link>
        <div className="media-body">
          <div className="article-metadata">
            <Link className="nav-item nav-link" to={`/${post.author.username}`}>{post.author.username}</Link>   
            <small className="text-muted">{post.created_at}</small>
          </div>
          <h2><Link className="nav-item nav-link" to={`/post/${post.id}`}>{post.title}</Link></h2>   
          <p className="article-content">{post.content}</p>
          {post.image && <img className="blog-img" src={post.image}/>}
          <div>
          {post.comments && post.comments.map((comment) => (
            <div key={comment.id}>
              {comment.content}
            </div>
          ))}
          </div>
        </div>
      </article>
      {authenticated && (
        <form method="post" onSubmit={handleComment}>
          <fieldset className="form-group">
            add comment
          </fieldset>
        <button type="submit">Comment</button>
        </form>)}
      </div>
    );
  };

  const renderHome = () => {
    return (
      <div>
        <main role="main" className="container">
          <div className="row">
            <div className="col-md-10">
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
      <React.Fragment>
      <Header />
      </React.Fragment>
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