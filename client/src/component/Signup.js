import React, { Component } from 'react'
import { graphql } from "react-apollo";
import gql from 'graphql-tag';
import { Link } from "react-router-dom";

class Signup extends Component {

    state = {
        username: '',
        name: '',
        email: '',
        password: '',
        error: ''
    }

    onSubmit = (e) => {
        e.preventDefault();

        const {username, email, name, password} = this.state

        if (username === '', email === '', name === '', password === '') {
            return this.setState({error: 'All fields are required!'})
        }
        this.props.createUserMutation({
            variables: {username, name, email, password}
        }).then((res) => {
            localStorage.setItem('token', res.data.createUser.token)
            this.setState({email: '', password: '', username:  '', name: '', error: ''})
            window.location.reload();
        }).catch((err) => {
            const error = err.message.split(':')[1]
            this.setState({error})
        });
    }


  render() {
    return (
      <div>
        <div className="d-flex m-0">
            <div className="col-lg-6 p-0">
                <div className="bg-login-signup"></div>
            </div>
            <div className="col-lg-6 p-0">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="login_form col-lg-7 mt-5">
                            <div className="mb-5 text-center mt-5">
                                <h1>SignUp</h1>
                            </div>
                            {this.state.error && (
                                <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
                                <strong>{this.state.error}</strong>
                                <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={() => this.setState({error: ''})}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                                </div>
                            )}
                            <form onSubmit={this.onSubmit}>
                                <div className="form-group">
                                    <input type="text" onChange={e => this.setState({username: e.target.value})} value={this.state.username}  className="form-control" placeholder="Username"/>
                                </div>
                                <div className="form-group">
                                    <input type="text" onChange={e => this.setState({name: e.target.value})} value={this.state.name}  className="form-control" placeholder="Fullname"/>
                                </div>
                                <div className="form-group">
                                    <input type="email" onChange={e => this.setState({email: e.target.value})} value={this.state.email}  className="form-control" placeholder="Email"/>
                                </div>
                                <div className="form-group">
                                    <input type="password" onChange={e => this.setState({password: e.target.value})} value={this.state.password}  className="form-control" placeholder="Password"/>
                                </div>
                                <button type="submit" className="btn btn-primary btn-block">Signup</button>
                            </form>
                            <div className="footer-text mt-3">
                                <div className="d-flex justify-content-between">
                                    <h6>Already have an account? <Link to="/login">Login.</Link></h6>
                                    <h6><Link to="/">Forgot account?</Link></h6>
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

const CREATE_USER_MUTATION = gql`
    mutation CreateUserMutation($username: String!, $name: String!, $email: String!, $password: String!){
        createUser(data: {
            username: $username,
            name: $name,
            email: $email,
            password: $password
        }){
            user{
                id
            }
            token
        }
    }
`;

export default graphql(CREATE_USER_MUTATION, {name: 'createUserMutation'})(Signup)
