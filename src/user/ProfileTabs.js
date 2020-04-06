import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import DefaultImage from '../images/avatar.png'

class ProfileTabs extends Component {
    render() {
        const {followers, following, posts} = this.props;
        return (
            <div style={{margin: '50px 0'}} className="row">
                <div className="col-md-4">
                    <h2 style={{margin: '0 0 30px 0'}} className="text-primary">Followers</h2>
                    {followers.map((person, i) => (
                        <div key={i}>
                            <div style={{margin: '50px 0'}} className="row">
                                <Link to={`/user/${person._id}`}>
                                    <img className="" height="50px" onError={i => i.target.src = `${DefaultImage}`} src={`${process.env.REACT_APP_API_URL}/user/photo/${person._id}`} alt={person.name}/>
                                    <div className="">
                                        <h3>{person.name}</h3>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="col-md-4">
                    <h2 style={{margin: '0 0 30px 0'}} className="text-primary">Following</h2>
                    {following.map((person, i) => (
                        <div key={i}>
                            <div style={{margin: '50px 0'}} className="row">
                                <Link to={`/user/${person._id}`}>
                                    <img onError={i => i.target.src = `${DefaultImage}`} className="mb-3" height="50px" src={`${process.env.REACT_APP_API_URL}/user/photo/${person._id}?${new Date().getTime()}`} alt={person.name} />
                                    <div className="">
                                        <h3>{person.name}</h3>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="col-md-4">
                    <h2 style={{margin: '0 0 30px 0'}} className="text-primary">Posts</h2>
                    {/* {JSON.strigify(posts)} */}
                    {posts.map((post, i) => {
                        return (
                            <Link key={i} to={`/post/${post._id}`}>
                            <h3 >{post.title}</h3>
                            </Link>
                            
                        )
                    })}
                </div>
            </div>
        );
    }
}

export default ProfileTabs;
