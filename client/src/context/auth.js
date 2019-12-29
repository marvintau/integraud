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
            let {result, role, nickname:nick, reason} = await post('/api/user/login', {user, pass});
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
    
    const logout = () => {
        setUser(undefined);
        setRole('visitor');
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
        (async function(){
            setStatus('registering');
            let {result, reason} = await post('/api/user/create', {user, pass, nick});
            if(result === 'ok'){
                setStatus('ready');
                setList(await post('/api/user/list', {role}));
            } else {
                setStatus('register_failed');
                setMsg(reason)
            }
        })();
        console.log(status, 'status');
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