import React, {createContext, useState, useEffect} from 'react';

import {post, postForm} from './fetch';

const ConfirmationContext = createContext({
  origList:[],
  displayed:[],
  filters:[],
  upload:() => {},
  create:() => {},
  remove:() => {},
  modify:() => {},
  addFilter:() => {},
  removeFilter:() => {},
  getList: () => {}
})

const ConfirmationProvider = ({children}) => {
  const [status, setStatus] = useState('logged_out')
  const [msg, setMsg] = useState(undefined);
  const [origList, setOrigList] = useState([]);
  const [filters, setFilters] = useState([]);
  const [list, setList] = useState([]);

  const filterList = (filters, list) => {
    if(list === undefined){
      list = [...origList]
    }
    for (let {func:filterMethod} of filters){
      list = list.filter(filterMethod);
    }

    setList(list);
  }

  const uploadSheet = (file, project) => {

    (async function(){

      let formData = new FormData();
      formData.append('project', project);
      formData.append('confirmation_list', file);

      setStatus('upload');
      let {result, reason} = await postForm('/api/confirmation/uploadSheet', formData);
      if(result === 'ok'){
        setMsg(reason);
      }
      setStatus('ready');
      console.log('upload', result, status, reason);
    })();
  }

  const uploadTemplate = (file, project) => {

    (async function(){

      let formData = new FormData();
      formData.append('project', project);
      formData.append('confirmation_template', file);

      setStatus('upload');
      let {result, reason} = await postForm('/api/confirmation/uploadTemplate', formData);
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
    getList(project);
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

  const getList = (project) => {
    
    (async function(){
      setStatus('getList');
      let {result, reason} = await post('/api/confirmation/list', {project});
      if(result !== 'error'){
        setOrigList(result)
        
        filterList(filters, result);

      } else {
        setMsg(reason);
      }
      setStatus('ready');
    })();
  }

  const addFilter = ({key, func}) => {

    let newFilters = [...filters];

    let existing = newFilters.find(({key:existingKey}) => existingKey === key);
    if(existing){
      existing.func = func;
    } else {
      newFilters.push({key, func})
    }

    console.log(filters, 'addFilter');

    filterList(newFilters);
    setFilters(newFilters);
  };

  const removeFilter = (removedKey) => {
    let newFilters = filters.filter(({key}) => key !== removedKey);

    let list = [...origList];
    for (let {func:filterMethod} of newFilters){
      list = list.filter(filterMethod);
    }

    filterList(newFilters);
    setFilters(newFilters);
  }

  let value = {status, msg, list, create, modify, remove, uploadSheet, uploadTemplate, getList, addFilter, removeFilter };

  return <ConfirmationContext.Provider value={value}>
    {children}
  </ConfirmationContext.Provider>
}

export {
  ConfirmationContext,
  ConfirmationProvider
}