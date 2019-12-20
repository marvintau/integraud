import {useState, useEffect} from 'react';
import {get, post} from './fetch';

export function useUsersFetch(){
    const [userList, setUserList] = useState([]);
    const [status, setStatus] = useState('loading');

    const fetchUsers = () => {
        (async function(){
            setStatus('loading');
            setUserList(await get('/api/list_user'));
            setStatus('ready');
        })()
    }

    useEffect(fetchUsers, []);

    return [status, userList, fetchUsers];
}

export function useUserRemove({user}, fetchUsers){
    const [errMsg, setErrMsg] = useState(undefined);

    const removeUser = () => {
        (async function(){
            let {status, reason} = await get('/api/remove_user', {user});
            if(status === 'ok'){
                await fetchUsers();
            } else if (status === 'error'){
                setErrMsg(reason);
            }
        })()
    }

    return [errMsg, removeUser];
}

export function useUserCreate({user, pass, nick}, fetchUsers){

    const [errMsg, setErrMsg] = useState(undefined);

    const createUser = () => {
        (async function(){
            let {status, reason} = await post('/api/create_user', {user, pass, nick});
            if(status === 'ok'){
                await fetchUsers();
            } else if (status === 'error'){
                setErrMsg(reason);
            }
        })()
    }

    return [errMsg, createUser];
}
