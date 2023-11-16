import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const UserPosts = (props) => {
  const [posts, setPosts] = useState({});
  const { username } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    viewUserPosts(username);
  }, [username]);

  const viewUserPosts = (username) => {
    fetch(`blog/${username}/`, {
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
          {post.image && <img className="blog-img" src={post.image}/>}
        </div>
        </Link>
      </article>
      {post.comments && (
        <>
        {post.comments.map((comment) => (
          <div className="card" key={comment.id}>
            <div className="card-body d-flex align-items-center">
              <Link className="post-click" to={`/${comment.author.username}`}>
                <img className="rounded-circle article-img" src={comment.author.profile.image} alt=""/>
              </Link>
              <div className="ml-2 d-flex flex-column align-items-start">
                <Link className="post-click" to={`/${comment.author.username}`}>
                  {comment.author.username}
                </Link>
                <small className="text-muted">{comment.created_at}</small>
                <p>{comment.content}</p>
              </div>
            </div>
          </div>
        ))}
        </>
        )}   
      </div>
    );
  };

  return (
        <main role="main" className="container">
          <div className="row">
            <div className="col-md-8">
              {loading ? (
                <p>Loading...</p>
              ) : (   
                <>
                <h2>{posts[0].author.username}'s posts</h2> <br></br>
                {Array.isArray(posts) ? posts.map((post) => renderPost(post)) : renderPost(posts)}
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
export default UserPosts;