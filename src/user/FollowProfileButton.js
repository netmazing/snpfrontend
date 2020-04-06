import React, { Component } from 'react';
import {follow, unfollow} from './apiUser';

class FollowProfileButton extends Component {
    followClick = () => {
        this.props.onButtonClick(follow)
    }
    unfollowClick = () => {
        this.props.onButtonClick(unfollow)
    }
    render() {
        return (
            <div className="d-inline-block">
                {this.props.following ? 
                (
                    <button className="btn btn-danger btn-raised mr-5" onClick={this.unfollowClick}>Unfollow</button>
                ) : (
                    <button className="btn btn-info btn-raised mr-5" onClick={this.followClick}>Follow</button>
                )}
            </div>
        );
    }
}

export default FollowProfileButton;
