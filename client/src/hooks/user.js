import {useState, useEffect} from 'react';
import {get, post} from './fetch';

export function useUserList(){
    const [list, setList] = useState([]);
    const [status, setStatus] = useState('loading');

    const fetchUsers = () => {
        (async function(){
            setStatus('loading');
            setList(await get('/api/list_user'));
            setStatus('ready');
        })()
    }

    return {status, list, fetchUsers};
}

export function useLogin(){

    const [user, setUser] = useState(localStorage.getItem('user'));
    const [role, setRole] = useState(localStorage.getItem('role'));
    const [status, setStatus] = useState('logout');

    const login = (user, pass) => {
        (async function(){
            setStatus('logging');
            let {result, role} = await post('/api/login', {user, pass});
            if(result === 'ok'){
                setStatus('logged');
                setUser(user);
                setRole(role);
                localStorage.setItem('user', user);
                localStorage.setItem('role', role);
            } else {
                setStatus('log_failed');
            }
        })();
    }

    const logout = (user) => {
        setUser(undefined);
        setRole(undefined);
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        setStatus('logout');
    }

    const getUser = () => {
        return {user, role};
    }

    return {
        status,
        login,
        logout,
        getUser
    }
}