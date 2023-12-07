import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import getCookie from './helpers/csrftoken';

const UserPosts = (props) => {
  const [posts, setPosts] = useState({});
  const { username } = useParams();
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [user, setUser] = useState('');
  const [viewer, setViewer] = useState('');
  const csrftoken = getCookie('csrftoken');

  useEffect(() => {
    viewUserPosts(username);
    getProfile();
  }, [username]);


  const getProfile = () => {
    fetch('users/get_user/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',}
    })
    .then(response => response.json())
    .then(data => {
      setUser(data.user)
      const followingUsers = data.user.profile.following.map(user => user.username);
      const isUserFollowing = followingUsers.includes(username);
      setIsFollowing(isUserFollowing);
    })
    .catch(error => {
      console.error('Error fetching user profile:', error);
    });
  }

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
        <div className="d-flex align-items-center article-metadata">
          <img className="rounded-circle article-img" src={post.author.profile.image} alt=""/>
          <div className="ml-2 d-flex flex-column align-items-start">
          {post.author.username}  
          <small className="text-muted">{post.created_at}</small>
          </div>
        </div>
        <Link className="post-click" to={`/post/${post.id}`}>
        <div className="media-body">
          <h2>{post.title}</h2>   
          <p className="article-content">{post.content}</p>
          {post.image && <img className="blog-img" src={post.image}/>}
        </div>
        </Link>
        <div className="container text-center row pt-3">
          <Link className="post-click col-md-2" to={`/post/${post.id}`}>
            <p className="pr-3"><i className="bi bi-filter-square-fill pr-4"/> {post.comments.length} </p>
          </Link>
          <div className="post-click col-md-2" onClick={() => handleLike(post.id)}>
            {post.likes.users.includes(user.username) ? ( 
            <p><i className="bi bi-heart-fill"/> {post.likes.count}</p>
            ): <p><i className="bi bi-heart"/>  {post.likes.count}</p>
            }
          </div>
          <div className="post-click col-md-2" onClick={() => handleBookmark(post.id)}>
            {post.bookmarks.includes(user.id) ? ( 
              <p><i className="bi bi-bookmark-fill"/></p>
            ): <p><i className="bi bi-bookmark"/></p>
            }
          </div>
        </div>    
      </article> 
      </div>
    );
  };

  //follow/unfollow
  const handleFollow = (user) => {
    fetch(`users/follow/${user}/`, {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken
      }
    })
    .then(response => response.json())
    .then(data => {
      setIsFollowing(data.success)
    })
    .catch(error => {
      console.error('Error fetching data: ', error);
    })
  }

  const handleLike = (postId) => {
    fetch('blog/like/', {
      credentials: 'include',
      method: 'POST',
      mode: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken
      },
      body: JSON.stringify({ post_id: postId })
    })
    .then(response => response.json())
    .then(viewUserPosts(username))
  }

  const handleBookmark = (postId) => {
    fetch('blog/bookmark/', {
      credentials: 'include',
      method: 'POST',
      mode: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken
      },
      body: JSON.stringify({post_id: postId})
    })
    .then(response => response.json())
    .then(viewUserPosts(username))
  }


  return (
        <main role="main" className="container">
          <div className="row">
            <div className="col-md-8">
              {loading ? (
                <p>Loading...</p>
              ) : (   
                <>
                <div className="grid text-center">
                  <h2>{posts[0].author.username}'s posts</h2> 
                  {username !== user.username && ( <button type="button" className="btn btn-dark" onClick={() => handleFollow(posts[0].author.username)}> 
                  {isFollowing ? 'Unfollow' : 'Follow'}</button>)}
                </div>
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
