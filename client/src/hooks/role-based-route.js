import React, {useContext} from 'react';
import { Route, Redirect } from 'react-router-dom';

import {AuthContext} from './auth';

export default ({component: Component, roles, ...rest}) => {

    let {role} = useContext(AuthContext);

    return <Route {...rest} render={props => {

        if (roles && !roles.includes(role)) {
            console.log('redirect!')
            return <Redirect to={{ pathname: '/'}} />
        }

        return <Component {...props} />
    }} />
}