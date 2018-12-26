import React, { Component } from 'react'
import { graphql } from "react-apollo";
import { Link } from "react-router-dom";
import gql from 'graphql-tag';

class PasswordResetForm extends Component {

    state = {
        password: '',
        confirm_password: '',
        error: '',
        success: ''
    }

    onSubmet = (e) => {
        e.preventDefault();

        const {confirm_password, password} = this.state
        const token = this.props.match.params.token;

        if (confirm_password === '' && password === '') {
            return this.setState({error: 'Password and Confirm Password are required!'})
        }

        if (password !== confirm_password) {
            return this.setState({error: 'Password and Confirm Password not match'})
        }

        this.props.passwordResetMutation({
            variables: {token, password}
        }).then((res) => {
            this.setState({password: '', confirm_password: '', error: '', success: 'Successfuly reset your password login now'})
            setTimeout(() => {
                this.props.history.push('/login')
            }, 3000);
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
                                    <h1>Reset Password</h1>
                                </div>
                                {this.state.success && (
                                <div className="alert alert-success alert-dismissible fade show mb-4" role="alert">
                                    <strong>{this.state.success}</strong>
                                    <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={() => this.setState({error: ''})}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                )}
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
                                        <input type="password" onChange={(e) => this.setState({password: e.target.value})} value={this.state.password} className="form-control" placeholder="new password"/>
                                    </div>
                                    <div className="form-group">
                                        <input type="password" onChange={(e) => this.setState({confirm_password: e.target.value})} value={this.state.confirm_password} className="form-control" placeholder="confirm password"/>
                                    </div>
                                    <button type="submit" className="btn btn-primary btn-block">Reset Password</button>
                                </form>
                                <div className="footer-text mt-3">
                                    <h6>Already have an account? <Link to="/login">Login Here.</Link></h6>
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

const PASSWORD_RESET_FORM = gql`
    mutation PasswordReset($token: String!, $password: String!){
        passwordReset(token: $token, password: $password){ id }
    }
`;

export default graphql(PASSWORD_RESET_FORM, {name: 'passwordResetMutation'})(PasswordResetForm)
