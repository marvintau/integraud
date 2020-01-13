import React, {createContext, useState, useEffect} from 'react';
import {post} from './fetch';

const AuthContext = createContext({user:undefined, role:undefined, status:undefined, login:()=>{}, logout:() =>{}});

const AuthProvider = ({children}) => {

    let localUser = localStorage.getItem('user'),
        localRole = localStorage.getItem('role'),
        localNick = localStorage.getItem('nick');

    const [user, setUser] = useState(localUser);
    const [role, setRole] = useState(localRole ? localRole : 'visitor');
    const [nick, setNick] = useState(localNick);
    const [status, setStatus] = useState('logged_out')
    const [msg, setMsg] = useState(undefined);
    const [list, setList] = useState([]);

    const login = (user, pass) => {
        (async function(){
            setStatus('logging');
            let {result, role, nickname:nick, reason} = await post('/api/user/login', {user, pass});
            if(result === 'ok'){
                setStatus('ready');
                setUser(user);
                setRole(role);
                setNick(nick);
                localStorage.setItem('user', user)
                localStorage.setItem('role', role)
                localStorage.setItem('nick', nick)
            } else {
                setStatus('log_failed');
                setMsg(reason);
            }
            console.log('log', result, status);
        })();
    }
    
    const logout = () => {
        setUser(null);
        setRole('visitor');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        localStorage.removeItem('nick');
        setStatus('ready');
    }

    const listUsers = () => {
        console.log('update list with ', user, role);
        (async function(){
            setStatus('loading');
            setList(await post('/api/user/list', {user, role}));
            setStatus('ready');
        })()
    }
    
    const register = (user, pass, nick) => {
        let registerResult;
        (async function(){
            setStatus('registering');
            let {result, reason} = await post('/api/user/create', {user, pass, nick});
            if(result === 'ok'){
                registerResult = 'ok';
            } else {
                setStatus('register_failed');
                setMsg(reason)
                registerResult = reason;
            }
        })();
        console.log(status, 'status');
        return registerResult;
    }

    const changeRole = (user, role)=>{
        (async function(){
            console.log('changing', user, role);
            let {result, reason} = await post('/api/user/grant_role', {user, role});
            if(result === 'ok'){
                console.log('role changed')
                listUsers();
            } else if (result === 'error'){
                setMsg(reason);
            }
        })()
    }

    const remove = (user)=>{
        (async function(){
            let {result, reason} = await post('/api/user/remove', {user});
            console.log(result, user, 'remove');
            if(result === 'ok'){
                console.log('deleted')
                listUsers();
            } else if (result === 'error'){
                setMsg(reason);
            }
        })()
    }

    return <AuthContext.Provider value={{
            user, role, nick, status, msg, list,
            login, logout, register, listUsers, changeRole, remove
        }}>
        {children}
    </AuthContext.Provider>
}

export {
    AuthContext,
    AuthProvider
}