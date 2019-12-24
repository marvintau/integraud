import React, {useContext, useEffect} from 'react';
import {Redirect} from 'react-router-dom';

import {AuthContext} from '../hooks/auth';

export default function Logout(){
    const {logout} = useContext(AuthContext);

    useEffect(logout, []);

    return <Redirect to={{pathname: '/'}} />
}
