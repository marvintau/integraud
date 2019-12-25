import React, {createContext, useState} from 'react';
import {post} from './fetch';

const AuthContext = createContext({user:undefined, role:undefined, status:undefined, login:()=>{}, logout:() =>{}});

const AuthProvider = ({children}) => {

    const [user, setUser] = useState(undefined);
    const [role, setRole] = useState('visitor');
    const [nick, setNick] = useState(undefined);
    const [status, setStatus] = useState('logged_out')
    const [msg, setMsg] = useState(undefined);
    const [list, setList] = useState([]);

    const login = (user, pass) => {
        (async function(){
            setStatus('logging');
            let {result, role, nickname:nick, reason} = await post('/api/login', {user, pass});
            if(result === 'ok'){
                setStatus('ready');
                setUser(user);
                setRole(role);
                setNick(nick);
            } else {
                setStatus('log_failed');
                setMsg(reason);
            }
            console.log('log', result, status);
        })();
    }
    
    const logout = (user) => {
        setUser(undefined);
        setRole('visitor');
        setStatus('ready');
    }

    const listUsers = () => {
        console.log(role, 'role before send');
        (async function(){
            setStatus('loading');
            setList(await post('/api/list_user', {role}));
            setStatus('ready');
        })()
    }
    
    const register = (user, pass, nick) => {
        (async function(){
            setStatus('registering');
            let {result, reason} = await post('/api/create_user', {user, pass, nick});
            if(result === 'ok'){
                setStatus('ready');
                setList(await post('/api/list_user', {role}));
            } else {
                setStatus('register_failed');
                setMsg(reason)
            }
        })();
        console.log(status, 'status');
    }

    return <AuthContext.Provider value={{user, role, nick, status, msg, list, login, logout, register, listUsers}}>
        {children}
    </AuthContext.Provider>
}

export {
    AuthContext,
    AuthProvider
}