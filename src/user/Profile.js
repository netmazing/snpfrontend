import React, { Component } from 'react';
import {isAuthenticated} from '../auth'
import { Redirect, Link } from 'react-router-dom';
import {read} from './apiUser';
import {listByUser} from '../post/apiPost';
import DefaultImage from '../images/avatar.png'
import DeleteUser from './DeleteUser';
import FollowProfileButton from './FollowProfileButton';
import ProfileTabs from './ProfileTabs';

class Profile extends Component {
    constructor() {
        super()
        this.state = {
            user: {
                following: [],
                followers: []
            },
            posts: [],
            redirectToSignin: false,
            following: false,
            error: ''
        }
    }

    checkFollow = user => {
        const jwt = isAuthenticated();
        const match = user.followers.find(follower => {
            return follower._id === jwt.user._id
        })
        return match
    }

    handleFollowButton = callApi => {
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;
        // const {user, following} = this.state

        callApi(userId, token, this.state.user._id)
        .then(data => {
            if(data.error) {
                this.setState({
                    error: data.error
                })
            } else {
                this.setState({
                    user: data,
                    following: !this.state.following
                })
            }
        })
    }

    init = userId => {
        const token = isAuthenticated().token
        read(userId, token)
        .then(data => {
            if (data.error) {
                this.setState({
                    redirectToSignin: true
                })
            } else {
                let following = this.checkFollow(data);
                this.setState({
                    user: data,
                    following
                });
                this.loadPosts(data._id)
            }
        })
    }

    loadPosts = userId => {
        const token = isAuthenticated().token;
        listByUser(userId, token)
        .then(data => {
            if (data.error) {
                console.log(data.error)
            } else {
                this.setState({
                    posts: data
                })
            }
        })
    }

    componentDidMount() {
        const userId = this.props.match.params.userId;
        this.init(userId)
    }

    componentWillReceiveProps(props) {
        const userId = props.match.params.userId;
        this.init(userId)
    }

    render() {
        const {user, posts, redirectToSignin} = this.state;
        // const imageUrl = user._id ? `${process.env.REACT_APP_API_URL}/user/photo/${user._id}?${new Date().getTime()}` : DefaultImage;
        if(redirectToSignin) return <Redirect to='/signin' />
        return (
            <div className="container">
               <h1 className="mt-5 mb-5">Profile</h1>
               <div className="row" style={{margin: '20px 0 50px'}}>
               
                    <div className="col-md-4">
                        <img className="img-thumbnail" src={`${process.env.REACT_APP_API_URL}/user/photo/${user._id}?${new Date().getTime()}`} onError={i => i.target.src = `${DefaultImage}`} alt={user.name} style={{maxWidth: '200px'}}/>
                    </div>

                    <div className="col-md-8">
                        <p>{user.name}</p>
                        <p>{user.email}</p>
                        <p>{`Joined: ${new Date(user.created).toDateString()}`}</p>
                        {isAuthenticated().user && isAuthenticated().user._id === user._id ?
                            (
                                <div className="d-inline-block mt-5">
                                    <Link to={`/user/edit/${user._id}`} className="btn btn-raised btn-primary mr-5">Edit Profile</Link>
                                    <DeleteUser userId={user._id} />
                                </div>
                            ) 
                            :
                            (
                                <FollowProfileButton following={this.state.following} onButtonClick={this.handleFollowButton} />
                            )
                        }
                    </div>
               </div>
               
               

               <div className="d-inline mt-10 mb-10">
                   <p style={{padding: '10px 0', borderTop: '2px solid #777777', borderBottom: '2px solid #777777'}}>{user.about}</p>
               </div>

                <ProfileTabs followers={user.followers} following={user.following} posts={posts} />
                

            </div>
            
        );
    }
}

export default Profile;
