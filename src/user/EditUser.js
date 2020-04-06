import React, { Component } from 'react';
import {isAuthenticated} from '../auth';
import {read, update, updateUser} from './apiUser';
import { Redirect } from 'react-router-dom';
import DefaultImage from '../images/avatar.png'

class EditUser extends Component {
    constructor() {
        super()
        this.state = {
            id: '',
            name: '',
            email: '',
            about: '',
            password: '',
            redirectToProfile: false,
            error: '',
            loading: false,
            fileSize: 0,
        }
    }

    init = userId => {
        const token = isAuthenticated().token
        read(userId, token)
        .then(data => {
            if (data.error) {
                this.setState({
                    // error: data.error,
                    redirectToProfile: true
                })
            } else {
                this.setState({
                    id: data._id,
                    name: data.name,
                    email: data.email,
                    about: data.about,
                })
            }
        })
    }

    componentDidMount() {
        this.userData = new FormData()
        const userId = this.props.match.params.userId;
        this.init(userId)
    }

    handleChange = type => e => {
        this.setState({error: '', loading: false})
        const value = type === 'photo' ? e.target.files[0] : e.target.value;
        const fileSize = type === 'photo' ? e.target.files[0].size : 0
        this.userData.set(type, value);
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
            const userId = this.props.match.params.userId;
            const token = isAuthenticated().token;
            update(userId, token, this.userData)
            .then(data => {
                if (data.error) this.setState({
                    error: data.error
                });
                else updateUser(data, () => {
                    this.setState({
                        redirectToProfile: true
                    })
                }) 
            })    
        }

    }

    isValid = () => {
        const {name, email, password, fileSize} = this.state;
        if(fileSize > 200000) {
            this.setState({
                error: 'Maximum file size is 200kb',
                loading: false
            })
            return false
        }
        if(name.length === 0) {
            this.setState({
                error: 'Name is required',
                loading: false
            })
            return false
        }
        if(name.length < 3) {
            this.setState({
                error: 'Name is too short',
                loading: false
            })
            return false
        }
        if(email.length < 6 || email.indexOf('@') === -1 || email.indexOf('.') === -1) {
            this.setState({
                error: 'Plese write correct email',
                loading: false
            })
            return false
        }
        if((password.length >= 1 && password.length < 6) || (password.length>=1 && !/\d/.test(password))) {
            this.setState({
                error: 'Password must contain at least 6 characters and one number',
                loading: false
            })
            return false
        }
        return true
    }

    
    render() {
        const {name, email, id, about, password, redirectToProfile, error, loading} = this.state;
        if (redirectToProfile) {
            return <Redirect to={`/user/${id}`} />
        }

        const imageUrl = id ? `${process.env.REACT_APP_API_URL}/user/photo/${id}?${new Date().getTime()}` : DefaultImage;

        return (
            <div className="container">
                <h1 className="mt-5 mb-5">Edit profile</h1>

                <div className="alert alert-danger" style={{display: error ? 'block' : 'none'}}>{error}</div>

                {loading ?
                <div >
                    <p>Loading...</p>
                </div> 
                : 
                ''}

                <img className="img-thumbnail" src={imageUrl} alt={name} style={{maxWidth: '200px', margin: '20px 0 50px'}}/>

                <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                        <label htmlFor="edit-photo" className="text-muted">Profile photo</label>
                        <input type="file" accept="image/*" className="form-control" id="edit-photo" onChange={this.handleChange('photo')}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="edit-name" className="text-muted">Name</label>
                        <input type="text" className="form-control" id="edit-name" onChange={this.handleChange('name')} value={name}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="edit-email" className="text-muted">Email</label>
                        <input type="email" className="form-control" id="edit-email" onChange={this.handleChange('email')} value={email}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="edit-about" className="text-muted">About</label>
                        <textarea type="text" className="form-control" id="edit-about" onChange={this.handleChange('about')} value={about}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="edit-password" className="text-muted">Password</label>
                        <input type="password" className="form-control" id="edit-password" onChange={this.handleChange('password')} value={password}/>
                    </div>
                    <button type="submit" className="btn btn-raised btn-primary">Update</button>
                </form>
            </div>
        );
    }
}

export default EditUser;
