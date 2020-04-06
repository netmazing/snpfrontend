import React from 'react';
import {Link, withRouter} from 'react-router-dom';
import {signout, isAuthenticated} from '../auth'

const isActive = (history, path) => {
    if(history.location.pathname === path) {
        return {color: '#222222'}
    } else {
        return {color: '#ffffff'}
    }
}

const Menu = ({history}) => {
    return (
        <div>
            <nav>
                {/* <ul className="nav nav-tabs bg-primary">
                    <li className="nav-item">
                        <Link className="nav-link" to="/" style={isActive(history, '/')}>Home</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/signup" style={isActive(history, '/signup')}>Signup</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/signin" style={isActive(history, '/signin')}>Signin</Link>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/signout" style={isActive(history, '/signout')} onClick={() => signout(() => history.push('/'))}>Signout</a>
                    </li>
                </ul> */}

                {isAuthenticated() ? 
                    <ul className="nav nav-tabs bg-primary">
                        <li className="nav-item">
                            <Link className="nav-link" to="/" style={isActive(history, '/')}>Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to='/post/create' style={isActive(history, '/post/create')}>Add post</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to={`/user/${isAuthenticated().user._id}`} style={isActive(history, `/user/${isAuthenticated().user._id}`)}>{isAuthenticated().user.name} profile</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/users" style={isActive(history, '/users')}>Users</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to={`/user/findpeople/${isAuthenticated().user._id}`} style={isActive(history, `/user/findpeople/${isAuthenticated().user._id}`)}>Find people</Link>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/signout" style={isActive(history, '/signout')} onClick={() => signout(() => history.push('/'))}>Signout</a>
                        </li>
                    </ul>
                    : 
                    <ul className="nav nav-tabs bg-primary">
                        <li className="nav-item">
                            <Link className="nav-link" to="/" style={isActive(history, '/')}>Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to='/post/create' style={isActive(history, '/post/create')}>Add post</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/signin" style={isActive(history, '/signin')}>Signin</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/signup" style={isActive(history, '/signup')}>Signup</Link>
                        </li>
                    </ul>
                    }
            </nav>
        </div>
    )
}

export default withRouter(Menu)
