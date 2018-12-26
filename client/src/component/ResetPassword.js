import React, { Component } from 'react'
import { graphql } from "react-apollo";
import { Link } from "react-router-dom";
import gql from 'graphql-tag';

class ResetPassword extends Component {

    state = {
        email: '',
        error: '',
        success: ''
    }

    onSubmet = (e) => {
        e.preventDefault();
        const {email} = this.state

        if (email === '') {
            return this.setState({error: 'Email  are required!'})
        }

        this.props.sendPasswordResetMutation({
            variables: {email}
        }).then((res) => {
            this.setState({email: '', error: '', success: 'Password reset token succeessfuly send please check your email inbox'})

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
                                    <h2 className="mb-3">Forgot your password?</h2>
                                    <p>Enter your email address and we will send you instruction on how to reset your password.</p>
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
                                        <input type="email" onChange={(e) => this.setState({email: e.target.value})} value={this.state.email} className="form-control" placeholder="Email"/>
                                    </div>
                                    <button type="submit" className="btn btn-primary btn-block">Send Email</button>
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

const SEND_PASSWORD_RESET = gql`
    mutation SendPasswordReset($email: String!){
        sendPasswordReset(email: $email){ id }
    }
`;

export default graphql(SEND_PASSWORD_RESET, {name: 'sendPasswordResetMutation'})(ResetPassword)
