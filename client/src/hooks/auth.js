import React, {createContext, useState} from 'react';

import {post} from './fetch';


const AuthContext = createContext({user:undefined, role:undefined, status:undefined, login:()=>{}, logout:() =>{}});

const AuthProvider = ({children}) => {

    const [user, setUser] = useState(undefined);
    const [role, setRole] = useState('visitor');
    const [nick, setNick] = useState(undefined);
    const [status, setStatus] = useState('logged_out')
    const [msg, setMsg] = useState(undefined);

    const login = (user, pass) => {
        (async function(){
            setStatus('logging');
            let {result, role, nickname:nick, reason} = await post('/api/login', {user, pass});
            if(result === 'ok'){
                setStatus('logged');
                setUser(user);
                setRole(role);
                setNick(nick);
            } else {
                setStatus('log_failed');
                setMsg(reason);
            }
            console.log('log', result);
        })();
    }
    
    const logout = (user) => {
        setUser(undefined);
        setRole('visitor');
        setStatus('logged_out');
    }
    
    return <AuthContext.Provider value={{user, role, nick, status, msg, login, logout}}>
        {children}
    </AuthContext.Provider>
}

export {
    AuthContext,
    AuthProvider
}