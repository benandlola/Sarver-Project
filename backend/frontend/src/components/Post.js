import React, { useEffect, useState, useRef } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import getCookie from './helpers/csrftoken';

const Post = ({ getBlog }) => {
  const { id } = useParams(); 
  const { isReply } = useLocation().state || false
  const [post, setPost] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState('');
  const [isReplying, setIsReplying] = useState(isReply);
  const [isEditingComment, setIsEditingComment] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const commentRef = useRef(null);
  const navigate = useNavigate();

  const getUser = () => {
    fetch('users/get_user/', {
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
    fetch(`blog/post/${id}/`, {
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

  //load necessary
  useEffect(() => {
    getUser()
    getPost(id)
  }, [])
  
  //autofocus
  useEffect(() => {
    if (isReplying && commentRef.current) {
      commentRef.current.focus();
    }
  }, [isReplying]);

  const csrftoken = getCookie('csrftoken');

  //added callback
  const handleDelete = (id) => {
    fetch(`blog/post/${id}/delete/`, {
      credentials: 'include',
      method: 'DELETE',
      mode: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken
      },
    })  
    .then(() => {
      getBlog();
      navigate('/')
    })
  }

  //create comment
  const createComment = (e) => {
    e.preventDefault()
    const formData = {
      post: id,
      content : document.getElementById('id_content').value,
    }
    fetch(`blog/post/${id}/comment/`, {
      credentials: 'include',
      method: 'POST',
      mode: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken
      },
      body: JSON.stringify(formData)
    })
    .then(() => {
      getPost(id)
    })
    setIsReplying(false)
  }

  //comment delete
  const handleCommentDelete = (post_id, comment_id) => {
    fetch(`blog/post/${post_id}/comment/${comment_id}/delete/`, {
      credentials: 'include',
      method: 'DELETE',
      mode: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken
      },
    })  
    .then(() => {
      getPost(id);
    })
  }

  //comment edit
  const handleCommentEdit = (e, comment_id) => {
    e.preventDefault()
    fetch(`blog/post/${id}/comment/${comment_id}/edit/`, {
      credentials: 'include',
      method: 'POST',
      mode: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken
      },
      body: JSON.stringify({
        'content': document.getElementById('id_content_comment').value,
        'post': id
      })
    })  
    .then(() => {
      getPost(id);
      setIsEditingComment('')
    })
  }

  return (
    <main role="main" className="container">
      <div className="row">
        <div className="col-md-8">
          {loading ? (
            <p>Loading...</p>
          ) : (
          <>
          <h2>{post.title}</h2> <br></br>
          <article className="media content-section mb-0">
            <div className="d-flex align-items-center article-metadata">
              <Link className="post-click" to={`/${post.author.username}`}>
              <img className="rounded-circle article-img" src={post.author.profile.image} alt=""/>
              </Link>
              <div className="ml-2 d-flex flex-column align-items-start">
              <Link className="post-click" to={`/${post.author.username}`}>
                {post.author.username}
              </Link>
              <small className="text-muted">{post.created_at}</small>

              {post.author.username === user.username && (
                  <div>
                  <button className="btn btn-sm my-1"><Link to={`/post_edit/${post.id}`}><i className="bi bi-pencil"></i></Link></button>
                  <button className="btn btn-danger btn-sm my-1" onClick={() => handleDelete(post.id)}><i className="bi bi-trash"></i></button>
                  </div> 
                )}
              </div>
            </div>  
            <div className="media-body"> 
              <p className="article-content">{post.content}</p>
              {post.image && <img className="blog-img" src={post.image}/>}
            </div>
            <div className="container text-center row pt-3">
              <div className="col-md-2">
                <i className="bi bi-reply create-comment" onClick={() => setIsReplying(true)}></i>  
              </div>           
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
          {isReplying && (
            <div className="card">
              <div className="card-body d-flex align-items-center">
                <form method="POST" onSubmit={createComment}>
                  <fieldset className="form-group mb-2">
                    <div id="div_id_content" className="form-group"> 
                      <textarea name="content" cols="100" rows="2" className="textarea form-control" required="" id="id_content" ref={commentRef}></textarea> 
                    </div>
                  </fieldset>
                  <div className="form-group">
                    <button className="btn btn-outline-warning" onClick={() => setIsReplying(false)}><i className="bi bi-x"></i> </button>
                    <button className="btn btn-outline-info" type="submit">Comment</button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {post.comments && (
            <>
            {post.comments.map((comment) => (
              <div className="card" key={comment.id}>              
                <div className="card-body">
                  <div className="article-content">
                    <div className="d-flex align-items-center">
                      <Link className="post-click" to={`/${comment.author.username}`}>
                        <img className="rounded-circle article-img" src={comment.author.profile.image} alt=""/>
                      </Link>
                      <div className="ml-2 d-flex flex-column align-items-start">
                        <Link className="post-click" to={`/${comment.author.username}`}>
                          {comment.author.username}
                        </Link>
                        <small className="text-muted">{comment.created_at}</small>
                        {comment.author.username === user.username && (
                          <div>
                            <button className="btn btn-sm my-1" onClick={() => {setCommentContent(comment.content); setIsEditingComment(comment.id)}}><i className="bi bi-pencil"></i></button>
                            <button className="btn btn-danger btn-sm my-1" onClick={() => handleCommentDelete(post.id, comment.id)}><i className="bi bi-trash"></i></button>
                          </div> 
                        )}
                      </div>
                    </div>
                    {isEditingComment === comment.id ? (
                      <div className="card-body d-flex align-items-center">
                        <form method="POST" onSubmit={(e) => handleCommentEdit(e, comment.id)}>
                          <fieldset className="form-group mb-2">
                            <div id="div_id_content" className="form-group"> 
                              <textarea name="content" cols="100" rows="2" className="textarea form-control" required="" id="id_content_comment" value={commentContent} onChange={(e) => setCommentContent(e.target.value)}></textarea> 
                            </div>
                          </fieldset>
                          <div className="form-group">
                            <button className="btn btn-outline-warning" onClick={() => setIsEditingComment('')}><i className="bi bi-x"></i> </button>
                            <button className="btn btn-outline-info" type="submit">Edit</button>
                          </div>
                        </form>
                      </div>
                    ) : 
                    <p className="article-content">{comment.content}</p>
                    }           
                  </div>
                </div>
                <div className="container text-center row pt-3">
                  <div className="col-md-2">
                    <i className="bi bi-reply create-comment" onClick={() => setIsReplying(true)}></i>  
                  </div>           
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
              </div>
            ))}
            </>
            )}   
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

export default Post;