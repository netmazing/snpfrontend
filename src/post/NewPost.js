import React, { Component } from 'react';
import {isAuthenticated} from '../auth';
import {create} from './apiPost';
import { Redirect } from 'react-router-dom';
// import DefaultImage from '../images/avatar.png'

class NewPost extends Component {
    constructor() {
        super()
        this.state = {
            title: '',
            body: '',
            photo: '',
            fileSize: 0,
            error: '',
            user: {},
            loading: false,
            redirectToProfile: false,
        }
    }


    componentDidMount() {
        this.postData = new FormData();
        this.setState({
            user: isAuthenticated().user
        })
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
            const userId = isAuthenticated().user._id;
            const token = isAuthenticated().token;
            
            create(userId, token, this.postData)
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
        const {title, body, user, photo, error, loading, redirectToProfile } = this.state;
        if (redirectToProfile) {
            return <Redirect to={`/user/${user._id}`} />
        }

        // const imageUrl = id ? `${process.env.REACT_APP_API_URL}/user/photo/${id}?${new Date().getTime()}` : DefaultImage;

        return (
            <div className="container">
                <h1 className="mt-5 mb-5">Create a post</h1>

                <div className="alert alert-danger" style={{display: error ? 'block' : 'none'}}>{error}</div>

                {loading ?
                <div >
                    <p>Loading...</p>
                </div> 
                : 
                ''}

                {/* <img className="img-thumbnail" src={imageUrl} alt={name} style={{maxWidth: '200px', margin: '20px 0 50px'}}/> */}

                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="post-photo" className="text-muted">Photo</label>
                        <input type="file" accept="image/*" className="form-control" id="post-photo" onChange={this.handleChange('photo')}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="post-title" className="text-muted">Title</label>
                        <input type="text" className="form-control" id="post-title" onChange={this.handleChange('title')} value={title}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="post-body" className="text-muted">Body</label>
                        <textarea type="text" className="form-control" id="post-body" onChange={this.handleChange('body')} value={body}/>
                    </div>
                    <button type="submit" className="btn btn-raised btn-primary">Publish</button>
                </form>
                
            </div>
        );
    }
}

export default NewPost;
