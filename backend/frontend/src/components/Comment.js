import React, { useEffect, useState, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import getCookie from './helpers/csrftoken';

const Comment = () => {
    const { p_id, c_id} = useParams(); 
    const [comment, setComment] = useState({})
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState('');
    const [isReplying, setIsReplying] = useState(false);
    const [isEditingComment, setIsEditingComment] = useState('');
    const [commentContent, setCommentContent] = useState('');
    const commentRef = useRef(null);
    const navigate = useNavigate();
    const csrftoken = getCookie('csrftoken');

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

    const getComment = () => {
        fetch(`blog/post/${p_id}/comment/${c_id}/`)
        .then(response => {
            if (response.ok) {
                return response.json()
            }
            else {
                navigate(`/post/${p_id}`)
           }
        })
        .then(data => {
            setLoading(false);
            setComment(data)
        })
    }

    const createComment = (e, comment_id) => {
        e.preventDefault()
        const formData = {
          post: p_id,
          content : document.getElementById('id_content').value,
        }
        fetch(`blog/post/${p_id}/comment/${comment_id}/`, {
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
            getComment()
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
            getComment()
        })
    }

    //comment edit
    const handleCommentEdit = (e, comment_id) => {
        e.preventDefault()
        fetch(`blog/post/${p_id}/comment/${comment_id}/edit/`, {
        credentials: 'include',
        method: 'POST',
        mode: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        },
        body: JSON.stringify({
            'content': document.getElementById('id_content_comment').value,
            'post': p_id
        })
        })  
        .then(() => {
            getComment()
            setIsEditingComment('')
        })
    }

    //load comment
    useEffect(() => {
        getComment()
        getUser()
    }, [c_id])
    
    //autofocus
    useEffect(() => {
        if (isReplying && commentRef.current) {
        commentRef.current.focus();
        }
    }, [isReplying]);

  return (
    <main role="main" className="container">
      <div className="row">
        <div className="col-md-8">  
            {loading ? (
                <p>Loading...</p>
            ) : (
            <>
            <div className="card clickable">              
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
                                    <button className="btn btn-sm my-1" onClick={() => {setCommentContent(comment.content); setIsEditingComment(c_id)}}><i className="bi bi-pencil"></i></button>
                                    <button className="btn btn-danger btn-sm my-1" onClick={() => handleCommentDelete(p_id, c_id)}><i className="bi bi-trash"></i></button>
                                </div> 
                                )}
                            </div>         
                        </div>
                        {isEditingComment === c_id ? (
                        <div className="card-body d-flex align-items-center">
                            <form method="POST" onSubmit={(e) => handleCommentEdit(e, c_id)}>
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
                {isReplying && (
                <div className="card">
                    <div className="card-body d-flex align-items-center">
                        <form method="POST" onSubmit={(e) => createComment(e, c_id)}>
                        <fieldset className="form-group mb-2">
                            <div id="div_id_content" className="form-group"> 
                            <textarea name="content" cols="100" rows="2" className="textarea form-control" required="" id="id_content" maxLength="300" ref={commentRef}></textarea> 
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
            </div>

            {comment.replies && comment.replies.map(reply => (
            <div key={reply.id}>   
            <div className="card reply clickable">              
                <div className="card-body">
                    <div className="article-content">
                        <div className="d-flex align-items-center">
                            <Link className="post-click" to={`/${reply.author.username}`}>
                                <img className="rounded-circle article-img" src={reply.author.profile.image} alt=""/>
                            </Link>
                           <div className="ml-2 d-flex flex-column align-items-start">
                                < Link className="post-click" to={`/${reply.author.username}`}>
                                {reply.author.username}
                                </Link>
                                <small className="text-muted">{reply.created_at}</small>
                            </div>         
                        </div>                   
                        <Link className="post-click" to={`/post/${p_id}/comment/${reply.id}`}><p className="article-content">{reply.content}</p></Link>     
                    </div>
                </div>
                <div className="container text-center row pt-3">
                    <div className="col-md-2">
                        <Link className="post-click" to={`/post/${p_id}/comment/${reply.id}`}>
                        <i className="bi bi-filter-square-fill pr-4"/> TODO LENGTH
                        </Link>
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
            </div>
            ))}
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

export default Comment;