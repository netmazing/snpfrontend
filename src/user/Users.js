import React, { Component } from 'react';
import {list} from './apiUser';
import {Link} from 'react-router-dom';
import DefaultImage from '../images/avatar.png'

class Users extends Component {
    constructor() {
        super()
        this.state = {
            users: []
        }
    }

    componentDidMount () {
        list()
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

    render() {
        const {users} = this.state 
        return (
            <div className='container'>
                <h1 className="mt-5 mb-5">Users</h1>
                
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
                                <p className="card-text">{`Joined: ${new Date(user.created).toDateString()}`}</p>
                                <Link to={`/user/${user._id}`} className="btn btn-raised btn-primary btn-sm">View profile</Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default Users;
