import React, {createContext, useState} from 'react';

import {post} from './fetch';

const ConfirmationContext = createContext({
  list:[],
  create:() => {},
  remove:() => {},
  modify:() => {},
  listConfirmations: () => {}
})

const ConfirmationProvider = ({children}) => {
  const [status, setStatus] = useState('logged_out')
  const [msg, setMsg] = useState(undefined);
  const [list, setList] = useState([]);

  const create = (confirmID) => {
    (async function(){
      setStatus('create');
      let {result, reason} = await post('/api/confirmation/create', {confirmID});
      if(result === 'ok'){
          setStatus('ready');
      } else {
          setStatus('create_failed');
          setMsg(reason);
      }
      console.log('log', result, status);
    })();
  }

  const modify = (confirmID, field, value) => {
    (async function(){
      setStatus('modify');
      let {result, reason} = await post('/api/confirmation/create', {confirmID, field, value});
      if(result === 'ok'){
        setStatus('ready');
      } else {
          setStatus('modify_failed');
          setMsg(reason);
      }
      console.log('log', result, status);
    })();
  }

  const remove = (confirmID) => {
    (async function(){
      setStatus('modify');
      let {result, reason} = await post('/api/confirmation/remove', {confirmID});
      if(result === 'ok'){
        setStatus('ready');
      } else {
          setStatus('modify_failed');
          setMsg(reason);
      }
      console.log('log', result, status);
    })();
  }

  const listConfirmations = (project) => {
    (async function(){
      setStatus('modify');
      let {result, reason} = await post('/api/confirmation/list', {project});
      if(result === 'ok'){
        setStatus('ready');
        setList(result)
      } else {
          setStatus('modify_failed');
          setMsg(reason);
      }
      console.log('log', result, status);
    })();
  }

  return <ConfirmationContext.Provider value={{status, msg, list, create, modify, remove, listConfirmations}}>
    {children}
  </ConfirmationContext.Provider>
}

export {
  ConfirmationContext,
  ConfirmationProvider
}