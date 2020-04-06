import React from 'react';
import Posts from '../post/Posts';

const Home = () => {
    return (
        <div style={{paddingBottom: '150px'}}>
            <div className="container">
                <h1 style={{textAlign: 'center', margin:'100px 0'}}>Awwsome Social Network Site</h1>
            </div>
            <Posts />
        </div>
    )
}

export default Home
