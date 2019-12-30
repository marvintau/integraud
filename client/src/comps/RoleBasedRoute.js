import React, {useContext} from 'react';
import { Route, Redirect } from 'react-router-dom';

import {AuthContext} from '../context/auth';

export default ({component: Component, roles, ...rest}) => {

    let {user, role} = useContext(AuthContext);

    return <Route {...rest} render={props => {

        console.log('role conditino', roles, role);
        if (roles && !roles.includes(role)) {
            console.log('redirect!')
            return <Redirect to={{ pathname: '/login'}} />
        }

        // if (user === undefined){
        //     return <Redirect to={{ pathname: '/login'}} />     
        // }

        console.log('showing', Component.name);
        return <Component {...props} />
    }} />
}