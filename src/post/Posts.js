import React, { Component } from 'react';
import {list} from './apiPost';
import {Link} from 'react-router-dom';
// import DefaultImage from '../images/avatar.png'

class Posts extends Component {
    constructor() {
        super()
        this.state = {
            posts: []
        }
    }

    componentDidMount () {
        list()
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

    renderPosts = posts => {
        return (
            <div className="row">
                    {posts.map((post, index) => {
                        const ellipsis = post.body.length > 100 ? '...' : '';
                        // console.log(post.body.length);
                        // console.log(ellipsis)
                        return (
                            <div key={index} className="card col-md-4">
                                {/* <img
                                src={`${process.env.REACT_APP_API_URL}/user/photo/${user._id}?${new Date().getTime()}`} 
                                onError={i => i.target.src = `${DefaultImage}`}
                                alt={user.name} 
                                style={{width: '50%', margin: '40px auto 20px'}}/> */}

                                <div className="card-body">
                                    <h3 className="card-title">{post.title}</h3>
                                    <p className="card-text">
                                        By: 
                                        <Link to={`/user/${post.postedBy._id}`}>{` ${post.postedBy.name} | `}</Link>
                                        On: {new Date(post.created).toDateString()}
                                    </p>

                                    {post.photo ? 
                                    <img
                                    src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}?${new Date().getTime()}`} 
                                    alt={post.title} 
                                    style={{width: '50%', margin: '40px 0 20px', display: 'block'}}/>
                                    :
                                    ''}

                                    <p className="card-text">{`${post.body.substring(0, 100)}${ellipsis}`}</p>
                                    
                                    <Link to={`/post/${post._id}`} className="btn btn-raised btn-primary btn-sm">Read more</Link>
                                </div>
                            </div>
                        )}
                    )}
                </div> )
    }

    render() {
        const {posts} = this.state 
        return (
            <div className='container'>
                <h2 className="mt-5 mb-5">Recent posts</h2>
                
                {this.renderPosts(posts)}

            </div>
        );
    }
}

export default Posts;
