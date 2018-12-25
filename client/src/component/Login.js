import React, { Component } from 'react'
import { graphql } from "react-apollo";
import { Link } from "react-router-dom";
import gql from 'graphql-tag';
import { req_user } from "../schema/user";

class Login extends Component {

    state = {
        email: '',
        password: '',
        error: ''
    }

    onSubmet = (e) => {
        e.preventDefault();
        console.log(this.props)
        const {email, password} = this.state

        if (email === '' && password === '') {
            return this.setState({error: 'Email and Password are required!'})
        }

        this.props.loginUserMutation({
            variables: {email, password}
        }).then((res) => {
            localStorage.setItem('token', res.data.loginUser.token)
            this.setState({email: '', password: '', error: ''})
            window.location.reload();
        }).catch((err) => {
            const error = err.message.split(':')[1]
            this.setState({error})
        });

    }
  render() {
    return (
      <div>
        <div className="login_signup">
            <div className="d-flex m-0">
                <div className="col-lg-6 p-0">
                    <div className="bg-login-signup"></div>
                </div>
                <div className="col-lg-6 p-0">
                <div className="container">
                    <div className="row justify-content-center ">
                        <div className="login_form col-lg-7 mt-5">
                                <div className="mb-5 text-center mt-5">
                                    <h1>Login</h1>
                                </div>
                                {this.state.error && (
                                <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
                                    <strong>{this.state.error}</strong>
                                    <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={() => this.setState({error: ''})}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                )}
                                <form onSubmit={this.onSubmet}>
                                    <div className="form-group">
                                        <input type="email" onChange={(e) => this.setState({email: e.target.value})} value={this.state.email} className="form-control" placeholder="Email"/>
                                    </div>
                                    <div className="form-group">
                                        <input type="password" onChange={(e) => this.setState({password: e.target.value})} value={this.state.password} className="form-control" placeholder="Password"/>
                                    </div>
                                    <button type="submit" className="btn btn-primary btn-block">Login</button>
                                </form>
                                <div className="footer-text mt-3">
                                    <h6>Don't have an account? <Link to="/signup">Signup Here.</Link></h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    )
  }
}

const LOGIN_USER_MUTATION = gql`
    mutation LoginUserMutation($email: String!, $password: String!){
        loginUser(data: {
            email: $email, 
            password:$password
        }){
            user{
                id
            }
            token
        }
    }
`;

export default graphql(LOGIN_USER_MUTATION, {name: 'loginUserMutation'})(Login)
