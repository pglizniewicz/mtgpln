import React from 'react';
import {
    BrowserRouter as Router,
    Redirect,
    Route
} from 'react-router-dom';
import LoginPageRoute from './login-page/LoginPageRoute';



const Routes = () => (
    <Router>
        <div>
            <Route exact path="/" component={LoginPageRoute} />
        </div>
    </Router>
);

export default Routes;
