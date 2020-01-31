import React, {useContext} from 'react';
import { Route, Redirect } from 'react-router-dom';

import {AuthContext} from '../context/auth';

export default ({component: Component, roles, ...rest}) => {

    console.log(rest.path, 'path');

    let {user, role} = useContext(AuthContext);

    return <Route {...rest} render={props => {

        if (roles && !roles.includes(role)) {
            return <Redirect to={{ pathname: '/login'}} />
        }

        // if (user === undefined){
        //     return <Redirect to={{ pathname: '/login'}} />     
        // }

        return <Component {...props} />
    }} />
}