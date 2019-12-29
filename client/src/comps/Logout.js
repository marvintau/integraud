import React, {useContext, useEffect} from 'react';
import {Redirect} from 'react-router-dom';

import {AuthContext} from '../context/auth';

export default function Logout(){

    const {logout} = useContext(AuthContext);

    console.log('logout');
    useEffect(() => {
        (async function(){
            logout()
        })()
    }, []);

    return <Redirect to={{pathname: '/'}} />
}
