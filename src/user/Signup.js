import React, { Component } from 'react';
import {signup} from '../auth'

class Signup extends Component {
    constructor () {
        super()
        this.state = {
            name: '',
            email: '',
            password: '',
            error: '',
            successOpen: false,
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
        const {name, email, password} = this.state;
        const user = {
            name,
            email,
            password
        }
        signup(user)
        .then(data => {
            if (data.error) this.setState({
                error: data.error
            });
            else {this.setState({
                name: '',
                email: '',
                password: '',
                error: '',
                successOpen: true
            })}
        })
    }

    

    render() {
        const {name, email, password, error, successOpen} = this.state;
        return (
            <div className="container">
                <h1 className="mt-5 mb-5">Signup</h1>

                {/* {error ? <div className="alert alert-primary"></div> : ''} */}
                <div className="alert alert-danger" style={{display: error ? 'block' : 'none'}}>{error}</div>

                <div className="alert alert-primary" style={{display: successOpen ? 'block' : 'none'}}>Your account has been successfully created. Please sign in.</div> 

                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="signup-name" className="text-muted">Name</label>
                        <input type="text" className="form-control" id="signup-name" onChange={this.handleChange('name')} value={name}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="signup-email" className="text-muted">Email</label>
                        <input type="email" className="form-control" id="signup-email" onChange={this.handleChange('email')} value={email}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="signup-password" className="text-muted">Password</label>
                        <input type="password" className="form-control" id="signup-password" onChange={this.handleChange('password')} value={password}/>
                    </div>
                    <button type="submit" className="btn btn-raised btn-primary">Signup</button>
                </form>
            </div>
        );
    }
}


export default Signup;
