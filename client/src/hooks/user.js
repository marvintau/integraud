import {useState} from 'react';
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


export function useRegister(){

    const [status, setStatus] = useState('logout');

    const register = (user, pass, nick) => {
        (async function(){
            setStatus('registering');
            let {result} = await post('/api/register', {user, pass, nick});
            if(result === 'ok'){
                setStatus('registered');
            } else {
                setStatus('register_failed');
            }
        })();
    }

    return {
        status,
        register
    }
}