import React, { Component } from 'react';
import {findPeople, follow} from './apiUser';
import {Link} from 'react-router-dom';
import DefaultImage from '../images/avatar.png';
import {isAuthenticated} from '../auth'

class FindPeople extends Component {
    constructor() {
        super()
        this.state = {
            users: [],
            error: '',
            open: false,
            followMessage: ''
        }
    }

    componentDidMount () {
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;
        findPeople(userId, token)
        .then(data => {
            if (data.error) {
                console.log(data.error)
            } else {
                this.setState({
                    users: data
                })
            }
        })
    }

    handleFollow = (user, index) => {
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;

        follow(userId, token, user._id)
        .then(data => {
            if (data.error) {
                this.setState({
                    error: data.error
                })
            } else {
                let toFollow = this.state.users;
                toFollow.splice(index, 1);
                this.setState({
                    users: toFollow,
                    open: true,
                    followMessage: `Following ${user.name}`
                })
            }
        })
    }

    render() {
        const {users, open, followMessage} = this.state 
        return (
            <div className='container'>
                <h1 className="mt-5 mb-5">Find people</h1>
                
                {open && <div className="alert alert-success">
                        <p>{followMessage}</p>
                    </div>}

                <div className="row">
                    {users.map((user, index) => (
                        <div key={index} className="card col-md-4">
                            {/* <img src={DefaultAvatar} alt="profile avatar" className="card-img-top" style={{width: '60%', margin: '0 auto'}}/>
                             */}

                            <img
                            src={`${process.env.REACT_APP_API_URL}/user/photo/${user._id}?${new Date().getTime()}`} 
                            onError={i => i.target.src = `${DefaultImage}`}
                            alt={user.name} 
                            style={{width: '50%', margin: '40px auto 20px'}}/>

                            <div className="card-body">
                                <h2 className="card-title">{user.name}</h2>
                                <Link to={`/user/${user._id}`} className="btn btn-raised btn-primary btn-sm">View profile</Link>
                                <button onClick={() => this.handleFollow(user, index)} to={`/user/${user._id}`} className="btn btn-raised btn-info btn-sm float-right">Follow</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default FindPeople;
