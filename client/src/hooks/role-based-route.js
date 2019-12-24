import React, {useState, useContext} from 'react';
import { Route, Redirect } from 'react-router-dom';

import {AuthContext} from './auth';

export default ({component: Component, roles, ...rest}) => {

    let {user, role} = useContext(AuthContext);

    return <Route {...rest} render={props => {
        if (!user) {
            return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        }

        if (roles && !roles.includes(role)) {
            return <Redirect to={{ pathname: '/'}} />
        }

        return <Component {...props} />
    }} />
}