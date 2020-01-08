import React, {createContext, useState} from 'react';

import {post, postForm, postFetchDownload} from './fetch';

const ConfirmationContext = createContext({
  origList:[],
  displayed:[],
  filters:[],
  uploadSheet:() => {},
  create:() => {},
  remove:() => {},
  modify:() => {},
  addFilter:() => {},
  removeFilter:() => {},
  getList: () => {},

  templateList:[],
  uploadTemplate:() => {},
  removeTemplate:() => {},
  getTemplateList: () => {},

  generateDocs: () => {}
})

const ConfirmationProvider = ({children}) => {
  const [status, setStatus] = useState('logged_out')
  const [msg, setMsg] = useState(undefined);
  const [origList, setOrigList] = useState([]);
  const [filters, setFilters] = useState([]);
  const [list, setList] = useState([]);

  const [templateList, setTemplateList] = useState([]);

  const filterList = (filters, list) => {
    if(list === undefined){
      list = [...origList]
    }
    for (let {func:filterMethod} of filters){
      list = list.filter(filterMethod);
    }

    setList(list);
  }

  const uploadSheet = (file, {project}) => {

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

  const uploadTemplate = (file, {type}) => {

    (async function(){

      let formData = new FormData();
      formData.append('template_type', type);
      formData.append('confirmation_template', file);
      console.log(formData.get('confirmation_template'));
      setStatus('upload');
      let {result, reason} = await postForm('/api/confirmation/uploadTemplate', formData);
      if(result === 'ok'){
        setMsg(reason);
      }
      setStatus('ready');
      console.log('upload', result, status, reason);
    })();
    getTemplateList();
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

  const removeTemplate = (template_type) => {
    console.log(template_type, 'removed');
    (async function(){
      setStatus('removed');
      let {result, reason} = await post('/api/confirmation/removeTemplate', {template_type});
      if(result === 'ok'){
        setMsg(reason);
      }
      setStatus('ready');
      console.log('remove', result, status, reason);
    })();
    getTemplateList();
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

  const getTemplateList = () => {
    (async function() {
      setStatus('getTemplateList');
      let {result, reason} = await post('api/confirmation/listTemplates', {});
      if(result !== 'error'){
        setTemplateList(result);
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

  const createDownloadable = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
    a.click();    
    a.remove();  //afterwards we remove the element again     
  }

  const generateDocs = (project) => {
    (async function() {
      setStatus('generating_docs');
      let archivedBlob = await postFetchDownload('api/confirmation/generateDocs', {project});
      createDownloadable(archivedBlob, `${project}.zip`);
      setStatus('ready');
    })();
  }

  let value = {
    status, msg, list, 
    create, modify, remove, uploadSheet, uploadTemplate, getList,
    addFilter, removeFilter,
    templateList, uploadTemplate, removeTemplate, getTemplateList,
    generateDocs
  };

  return <ConfirmationContext.Provider value={value}>
    {children}
  </ConfirmationContext.Provider>
}

export {
  ConfirmationContext,
  ConfirmationProvider
}