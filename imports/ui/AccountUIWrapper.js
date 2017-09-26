import React, { Component } from 'react'
import { Template } from 'meteor/templating'
import { Blaze } from 'meteor/blaze'

export default class AccountUIWrapper extends Component {
  render() {
    return (
        <span ref={(accounts) => this.accounts = accounts}>

          </span>
    );
  }

  componentDidMount() {
    this.view = Blaze.render(Template.loginButtons, this.accounts)
  }

  componentWillUnmount() {
    Blaze.remove(this.view)
  }
}