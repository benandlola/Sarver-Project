import React, { useState, useEffect } from 'react';
import Header from './Header';
export default function Home() {
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

  //view based on profile
  const viewProfile = (username) => {
    fetch(`http://127.0.0.1:8000/blog/user/${username}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',}
    })
    .then(response => response.json())
    .then(data => setPosts(data))
    .catch(error => {
      console.error('Error getting profile ', error);
    });
  }

  const viewPost = (id) => {
    fetch(`http://127.0.0.1:8000/blog/post/${id}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',}
    })
    .then(response => {
      console.log(response)
      return response.json()
    })
    .then(data => setPosts(data))
    .catch(error => {
      console.error('Error getting post ', error);
    });
  }

  const renderPost = (post) => {
    return (
      <article className="media content-section" key={post.id}>
        <a onClick={() => viewProfile(post.author.username)}><img className="rounded-circle article-img" src={post.author.profile.image} alt=""/></a>
        <div className="media-body">
          <div className="article-metadata">
            <a className="mr-2" onClick={() => viewProfile(post.author.username)}>{post.author.username}</a>
            <small className="text-muted">{post.created_at}</small>
          </div>
          <h2><a className="article-title" onClick={() => viewPost(post.id)}>{post.title}</a></h2>
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
  );
}
