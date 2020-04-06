import React, { Component } from 'react';
import {Link, Redirect} from 'react-router-dom';
import {signin, authenticate} from '../auth';
// import SocialLogin from './SocialLogin'

class Signin extends Component {
    constructor () {
        super()
        this.state = {
            email: '',
            password: '',
            error: '',
            redirectToReferer: false,
            loading: false,
        }
    }

    handleChange = type => e => {
        this.setState({
            error: ''
        })
        this.setState({
            [type]: e.target.value
        })
    }

    handleSubmit = e => {
        e.preventDefault();
        this.setState({
            loading: true
        })
        const {email, password} = this.state;
        const user = {
            email,
            password
        }
        signin(user)
        .then(data => {
            if (data.error) this.setState({
                error: data.error,
                loading: false
            });
            else {
                authenticate(data, () => {
                    this.setState({redirectToReferer: true})
                })
            }
        })
    }

    render() {
        const {email, password, error, redirectToReferer, loading} = this.state;
        if(redirectToReferer) {
            return <Redirect to="/"/>
        }
        return (
            <div className="container">
                <h1 className="mt-5 mb-5">Signin</h1>

                {/* <SocialLogin /> */}

                <div className="alert alert-danger" style={{display: error ? 'block' : 'none'}}>{error}</div>

                {loading ?
                <div >
                    <p>Loading...</p>
                </div> 
                : 
                ''}

                <form onSubmit={this.handleSubmit}>
                    <div className="form-group mt-5">
                        <label htmlFor="signin-email" className="text-muted">Email</label>
                        <input type="email" className="form-control" id="signin-email" onChange={this.handleChange('email')} value={email}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="signin-password" className="text-muted">Password</label>
                        <input type="password" className="form-control" id="signin-password" onChange={this.handleChange('password')} value={password}/>
                    </div>
                    <button type="submit" className="btn btn-raised btn-primary">Signin</button>
                </form>
                <p>
                    <Link to="/forgot-password" className="btn btn-info btn-raised">
                        {" "}
                        Forgot Password
                    </Link>
                </p>
            </div>
        );
    }
}


export default Signin;
