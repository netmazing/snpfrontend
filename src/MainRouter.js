import React from 'react';
import {Route, Switch} from 'react-router-dom';
import Home from './core/Home';
import Menu from './core/Menu';
import Signup from './user/Signup';
import Signin from './user/Signin';
import Profile from './user/Profile';
import Users from './user/Users';
import EditUser from './user/EditUser';
import FindPeople from './user/FindPeople'
import NewPost from './post/NewPost';
import EditPost from './post/EditPost';
import SinglePost from './post/SinglePost';
import ForgotPassword from "./user/ForgotPassword";
import ResetPassword from "./user/ResetPassword";

import PrivateRoute from './auth/PrivateRoute';

const MainRouter = () => {
    return (
        <>
            <Menu/>
            <Switch>
                <Route exact path="/" component={Home}/>
                <Route exact path="/signup" component={Signup}/>
                <Route exact path="/signin" component={Signin}/>
                <PrivateRoute exact path="/user/edit/:userId" component={EditUser}/>
                <PrivateRoute exact path="/user/:userId" component={Profile}/>
                <PrivateRoute exact path="/user/findpeople/:userId" component={FindPeople}/>
                <Route exact path="/users" component={Users}/>
                <PrivateRoute exact path="/post/create" component={NewPost}/>
                <Route exact path="/post/:postId" component={SinglePost} />
                <Route exact path="/post/edit/:postId" component={EditPost} />
                <Route exact path="/forgot-password" component={ForgotPassword} />
                <Route
                    exact
                    path="/reset-password/:resetPasswordToken"
                    component={ResetPassword}
                />
            </Switch>   
        </>
    )
}

export default MainRouter
