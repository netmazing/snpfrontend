import React, { Component } from 'react';
import {singlePost, remove, like, unlike} from './apiPost';
import {Link, Redirect} from 'react-router-dom';
import {isAuthenticated} from '../auth';
import Comment from './Comment';

class SinglePost extends Component {
    constructor () {
        super()
        this.state = {
            title: '',
            body: '',
            _id: '',
            created: '',
            postedByName: '',
            postedById: '',
            photo: false,
            redirectToHome: false,
            redirectToSignin: false,
            likes: 0,
            like: false,
            comments: []
        }
    }

    checkLike = (likes) => {
        const userId = isAuthenticated() && isAuthenticated().user._id;
        let match = likes.indexOf(userId) !== -1;
        return match
    }

    componentDidMount = () => {
        const postId = this.props.match.params.postId
        singlePost(postId)
        .then(data => {
            if (data.error) {
                console.log(data.error)
            } else {
                // console.log(data.postedBy.name)
                console.log(data)
                this.setState({
                    comments: data.comments,
                    title: data.title,
                    body: data.body,
                    _id: data._id,
                    created: data.created,
                    postedByName: data.postedBy.name,
                    postedById: data.postedBy._id,
                    likes: data.likes.length,
                    photo: data.photo ? data.photo : false,
                    like: this.checkLike(data.likes),
                })
            }
        })
    }

    updateComments = comments => {
        this.setState({
            comments
        })
    }

    handleLike = () => {
        if (!isAuthenticated()) {
            this.setState({
                redirectToSignin: true
            })
            return false
        }

        let callApi = this.state.like ? unlike : like;

        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;
        const postId = this.state._id;

        callApi(userId, token, postId)
        .then (data => {
            if (data.error) {
                console.log(data.error)
            } else {
                this.setState({
                    like: !this.state.like,
                    likes: data.likes.length
                })
            }
        })
    }

    deleteConfirmed = () => {
        let answer = window.confirm("Are you sure you want to delete this post?");
        if (answer) {
            this.deletePost()
        }
    }

    deletePost = () => {
        const postId = this.props.match.params.postId;
        const token = isAuthenticated().token;
        remove(postId, token)
        .then(data => {
            if (data.error) {
                console.log(data.error)
            } else {
                this.setState({
                    redirectToHome: true
                })
            }
        })
    }


    render() {
        const {title, body, created, _id, postedById, postedByName, photo, redirectToHome, redirectToSignin, likes, like, comments} = this.state;
        // const postedBy = post.postedBy;
        // console.log(post.postedBy)
        // console.log(likkes.length)
        if (redirectToHome) {
            return <Redirect to="/" />
        } else if (redirectToSignin) {
            return <Redirect to="/signin" />
        }
        return (
            <div className="container">
                <h1 style={{margin: '50px 0 20px'}}>{title}</h1>
                <p>
                    By: 
                    <Link to={`/user/${postedById}`}>{` ${postedByName} | `}</Link>
                     On: {new Date(created).toDateString()}
                </p>
                

                {like ? (
                    <p onClick={this.handleLike}>{likes}  Like <i className="fa fa-thumbs-up text-success"></i></p>
                ) : (
                    <p onClick={this.handleLike}>{likes} Like  <i className="fa fa-thumbs-up text-info"></i></p>
                )}

                {photo ? 
                    <img
                        src={`${process.env.REACT_APP_API_URL}/post/photo/${_id}?${new Date().getTime()}`} 
                        alt={title} 
                        style={{maxWidth: '70%', maxHeight: '600px', margin: '40px 0 20px', display: 'block'}}/>
                        :
                        ''
                }

                <p style={{margin: '30px 0'}}>{body}</p>

                <div className="d-inline=block">
                    <Link className="btn btn-raised btn-primary mt-5 mr-5" to="/">Back to the posts</Link>

                    {
                        isAuthenticated().user && isAuthenticated().user._id === postedById && (
                            <>
                                <Link to={`/post/edit/${_id}`} className="btn btn-raised btn-info mt-5 mr-5" >Edit post</Link>
                                <button className="btn btn-raised btn-danger mt-5" onClick={this.deleteConfirmed} >Delete post</button>
                            </>
                        )
                    }
                    
                </div>

                <Comment postId={_id} commentsUnsorted={comments} updateComments={this.updateComments} />

            </div>
        );
    }
}

export default SinglePost;
