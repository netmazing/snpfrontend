import React, { Component } from 'react';
import {singlePost, update} from './apiPost';
import {isAuthenticated} from '../auth';
import {Redirect} from 'react-router-dom'

class EditPost extends Component {
    constructor () {
        super ()
        this.state = {
            id: '',
            title: '',
            body: '',
            redirectToProfile: false,
            error: '',
            fileSize: 0,
            loading: false,
            photo: false
        }
    }

    init = postId => {
        singlePost(postId)
        .then(data => {
            if (data.error) {
                this.setState({
                    // error: data.error,
                    redirectToProfile: true
                })
            } else {
                this.setState({
                    id: data._id,
                    title: data.title,
                    body: data.body,
                    error: '',
                    photo: data.photo ? data.photo : false
                })
            }
        })
    }

    componentDidMount() {
        this.postData = new FormData()
        const postId = this.props.match.params.postId;
        this.init(postId)
    }

    isValid = () => {
        const {title, body, fileSize} = this.state;
        if(fileSize > 200000) {
            this.setState({
                error: 'Maximum file size is 200kb',
                loading: false
            })
            return false
        }
        if(title.length === 0) {
            this.setState({
                error: 'Title is required',
                loading: false
            })
            return false
        }
        if(title.length < 3) {
            this.setState({
                error: 'Title must be between 3 and 200 characters',
                loading: false
            })
            return false
        }
        if(body.length < 10) {
            this.setState({
                error: 'Body of post must be between 10 and 2000 characters',
                loading: false
            })
            return false
        }
        return true
    }

    handleChange = type => e => {
        this.setState({error: '', loading: false})
        const value = type === 'photo' ? e.target.files[0] : e.target.value;
        const fileSize = type === 'photo' ? e.target.files[0].size : 0
        this.postData.set(type, value);
        this.setState({
            [type]: value,
            fileSize
        })
    }

    handleSubmit = e => {
        e.preventDefault();

        this.setState({
            loading: true
        })

        if (this.isValid()) {
            // const {name, email, password} = this.state;
            // console.log(user)
            const postId = this.state.id;
            const token = isAuthenticated().token;
            
            update(postId, token, this.postData)
            .then(data => {
                if (data.error) this.setState({
                    error: data.error
                });
                else {
                    this.setState({
                        loading: false,
                        title: '',
                        body: '',
                        photo: '',
                        redirectToProfile: true
                    })
                } 
            })    
        }

    }


    render() {
        const {title, body, redirectToProfile, error, loading, photo, id} = this.state;
        if (redirectToProfile) {
            return <Redirect to={`/user/${isAuthenticated().user._id}`} />
        }
        return (
            <div className="container">
                <h1 className="mt-5 mb-5">Edit post</h1>
                
                <div className="alert alert-danger" style={{display: error ? 'block' : 'none'}}>{error}</div>

                {loading ?
                <div >
                    <p>Loading...</p>
                </div> 
                : 
                ''}

                {photo ? 
                    <img
                        src={`${process.env.REACT_APP_API_URL}/post/photo/${id}?${new Date().getTime()}`} 
                        alt={title} 
                        style={{maxWidth: '70%', maxHeight: '600px', margin: '40px 0 20px', display: 'block'}}/>
                        :
                        ''
                }

                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="edit-post-photo" className="text-muted">Photo</label>
                        <input type="file" accept="image/*" className="form-control" id="edit-post-photo" onChange={this.handleChange('photo')}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="edit-post-title" className="text-muted">Title</label>
                        <input type="text" className="form-control" id="edit-post-title" onChange={this.handleChange('title')} value={title}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="edit-post-body" className="text-muted">Body</label>
                        <textarea type="text" className="form-control" id="edit-post-body" onChange={this.handleChange('body')} value={body}/>
                    </div>
                    <button type="submit" className="btn btn-raised btn-primary">Update post</button>
                </form>

            </div>
        );
    }
}

export default EditPost;
