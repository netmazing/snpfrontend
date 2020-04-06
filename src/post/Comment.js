import React, { Component } from 'react';
import {comment, uncomment} from './apiPost';
import {isAuthenticated} from '../auth';
import {Link} from 'react-router-dom';
import DefaultImage from '../images/avatar.png'

class Comment extends Component {
    constructor () {
        super ()
        this.state = {
            text: '',
            error: ''
        }
    }

    isValid = () => {
        const {text} = this.state;
        if(!text.length > 0 || text.length > 1000) {
            this.setState({
                error: 'Comment can not be empty and should by less by 1000 characters'
            });
            return false
        }
        return true
    }

    addComment = e => {
        e.preventDefault();

        if(!isAuthenticated()) {
            this.setState({
                error: "You must be log in to leave a comment"
            });
            return false
        }

        if(this.isValid()) {
            const userId = isAuthenticated().user._id;
            const token = isAuthenticated().token;
            const postId = this.props.postId;
            const commentText = {text: this.state.text}

            comment(userId, token, postId, commentText)
            .then(data => {
                if(data.error) {
                    console.log(data.error)
                } else {
                    this.setState({
                        text: ''
                    })
                    this.props.updateComments(data.comments)
                    }
                })
            }
    }

    handleChange = e => {
        this.setState({
            text: e.target.value,
            error: ''
        })
    }

    deleteConfirmed = (comment) => {
        let answer = window.confirm("Are you sure you want to delete this comment?");
        if (answer) {
            this.deleteComment(comment)
        }
    }

    deleteComment = (comment) => {
            const userId = isAuthenticated().user._id;
            const token = isAuthenticated().token;
            const postId = this.props.postId;

            uncomment(userId, token, postId, comment)
            .then(data => {
                if(data.error) {
                    console.log(data.error)
                } else {
                    this.props.updateComments(data.comments)
                    }
                })
    }

    render() {
        const {commentsUnsorted} = this.props;
        const {error, text} = this.state
        const comments = commentsUnsorted.reverse()

        // console.log(comments.length)
        return (
            <div>
                <h2 className="mt-5 mb-5">Leave a comment</h2>

                <div className="alert alert-danger" style={{display: error ? 'block' : 'none'}}>{error}</div>

                <form onSubmit={this.addComment} style={{marginBottom: '100px'}}>
                    <div className="form-group">
                        <input placeholder="Wrtie something..." className="form-control" style={{width: '70%'}} type="text" onChange={this.handleChange} value={text}/>
                    </div>
                    <button type="submit" className="btn btn-primary btn-raised">Publish</button>
                </form>

                <div className="">
                    <h2 style={{margin: '0 0 50px 0'}} className="text-primary">{comments.length} Comments</h2>
                    {comments.map((comment, i) => (
                        <div key={i} style={{margin: '60px 0'}}>
                            <div style={{margin: '0 50px 0 0', display: 'flex'}} className="">
                                <div style={{display: 'flex', alignItems: 'center'}}>
                                    <img onError={i => i.target.src = `${DefaultImage}`} className="mb-3" height="30px" src={`${process.env.REACT_APP_API_URL}/user/photo/${comment.postedBy._id}?${new Date().getTime()}`} alt={comment.postedBy.name} />
                                    <div style={{marginLeft: '10px'}} className="">
                                        <p>By <Link to={`/user/${comment.postedBy._id}`}>{comment.postedBy.name}</Link> | On {comment.created}</p>
                                    </div>
                                </div>
                            </div>
                            <p>{comment.text}</p>
                            {
                                isAuthenticated().user && isAuthenticated().user._id === comment.postedBy._id && (
                                    <>
                                        <button className="btn btn-danger" onClick={() => this.deleteConfirmed(comment)} >Delete comment</button>
                                    </>
                                )
                            }
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default Comment;
