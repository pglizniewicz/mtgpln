import React, { Component } from 'react'
import { Provider } from 'react-redux';
import ApplicationStore from '../store/ApplicationStore';
import LoginPage from './LoginPage';

export default class LoginPageRoute extends Component {
    render() {
        return (
            <Provider store={ApplicationStore}>
                <LoginPage />
            </Provider>
        )
    }

}
