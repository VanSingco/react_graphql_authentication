import React, { Component } from 'react'
import NavBar from './NavBar';

export default class Home extends Component {
  render() {
    const token = !!localStorage.getItem('token')
    return (
      <div>
        <NavBar />
        {token 
        ?
            <h1>You are loggin</h1>
        :
            <h1>Hello world</h1>
        }
      </div>
    )
  }
}
