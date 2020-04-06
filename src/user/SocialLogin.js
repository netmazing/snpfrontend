import React, { Component } from "react";
import GoogleLogin from "react-google-login";
 
class SocialLogin extends Component {
    responseGoogle = response => {
        console.log(response);
    };
 
    render() {
        return (
            <div className="container">
                <GoogleLogin
                    clientId="168326289882-nkhs4gcm06jcl0v164if2f4u0fodn3vv.apps.googleusercontent.com"
                    buttonText="Login with Google"
                    onSuccess={this.responseGoogle}
                    onFailure={this.responseGoogle}
                />
            </div>
        );
    }
}
 
export default SocialLogin;