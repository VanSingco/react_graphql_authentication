import React, { Component } from 'react'
import { Link } from "react-router-dom";
import { Query } from "react-apollo";
import { req_user } from "../schema/user";

export default class NavBar extends Component {

    signOut = () => {
        localStorage.removeItem('token')
        window.location.reload();
    }

  render() {
  
    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-white">
            <a className="navbar-brand" href="#">Singco</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <Query 
                query={req_user}
                pollInterval={5}
                >
                {({ loading, error, data }) => {
                if (loading) return 'Loading...';
                if (error) return `Error! ${error.message}`;

                const req_user = !!data.req_user
                        
                return (
                    <div className="collapse navbar-collapse" id="navbarNavDropdown">
                        {req_user
                        ?
                        <ul className="navbar-nav flex-row ml-md-auto d-none d-md-flex mr-5">
                            <li className="nav-item active">
                                <Link className="nav-link" to="/">Home</Link>
                            </li>
                            <li className="nav-item dropdown">
                                <a className="nav-link" href="#" id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <div className="d-flex align-items-center">
                                        <span className="profile_letter mr-2">
                                            {data.req_user.username.slice(0,1).toUpperCase()}
                                        </span>
                                        <span>{data.req_user.username}</span>
                                    </div>
                                </a>
                                <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdownMenuLink">
                                    <a className="dropdown-item" href="#">Action</a>
                                    <a className="dropdown-item" href="#">Another action</a>
                                    <a className="dropdown-item" href="#" onClick={ this.signOut }>logout</a>
                                </div>
                            </li>
                        </ul>
                        :
                        <ul className="navbar-nav flex-row ml-md-auto d-none d-md-flex mr-5">
                            <li className="nav-item active">
                                <Link className="nav-link" to="/">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/login">Login</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/signup">Signup</Link>
                            </li>
                        </ul>
                        }
                    </div>
                    );
                }}
            </Query>
        </nav>
      
      </div>
    )
  }
}
