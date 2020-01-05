import React, {createContext, useState} from 'react';

import {post, postForm} from './fetch';

const ConfirmationContext = createContext({
  list:[],
  upload:() => {},
  create:() => {},
  remove:() => {},
  modify:() => {},
  listConfirmations: () => {}
})

const ConfirmationProvider = ({children}) => {
  const [status, setStatus] = useState('logged_out')
  const [msg, setMsg] = useState(undefined);
  const [list, setList] = useState([]);

  const upload = (file, project) => {

    (async function(){

      let formData = new FormData();
      formData.append('project', project);
      formData.append('confirmation_list', file);

      setStatus('upload');
      let {result, reason} = await postForm('/api/confirmation/upload', formData);
      if(result === 'ok'){
        setMsg(reason);
      }
      setStatus('ready');
      console.log('upload', result, status, reason);
    })();
  }

  const create = (confirm_id, project) => {
    (async function(){
      setStatus('create');
      let {result, reason} = await post('/api/confirmation/create', {confirm_id, project});
      if(result !== 'ok'){
        setMsg(reason);
      }
      setStatus('ready');
      console.log('create', result, status, reason);
    })();
  }

  const modify = (project, confirm_id, field, value) => {
    console.log('modify', project);
    (async function(){
      setStatus('modify');
      let {result, reason} = await post('/api/confirmation/modify', {confirm_id, field, value});
      if(result === 'ok'){
        setMsg(reason);
      }
      setStatus('ready');
      console.log('modify', result, status, reason);
    })();
  }

  const remove = (confirm_id) => {
    (async function(){
      setStatus('modify');
      let {result, reason} = await post('/api/confirmation/remove', {confirm_id});
      if(result === 'ok'){
        setMsg(reason);
      }
      setStatus('ready');
      console.log('remove', result, status, reason);
    })();
  }

  const listConfirmations = (project) => {
    (async function(){
      setStatus('modify');
      let {result, reason} = await post('/api/confirmation/list', {project});
      console.log(result, 'listing');
      if(result !== 'error'){
        setList(result)
      } else {
        setMsg(reason);
      }
      setStatus('ready');
      console.log('list', result, status, reason);
    })();
  }

  return <ConfirmationContext.Provider value={{status, msg, list, create, modify, remove, upload, listConfirmations}}>
    {children}
  </ConfirmationContext.Provider>
}

export {
  ConfirmationContext,
  ConfirmationProvider
}