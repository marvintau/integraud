import React, {createContext, useState, useContext} from 'react';
import {post} from './fetch';

import {AuthContext} from './auth';

const ProjectContext = createContext({
    list:[],
    createProject:()=>{},
    removeProject:() =>{},
    addFilter:() => {},
    removeFilter:() => {},
    listProjects:()=>{},
    assignMember:()=>{},
    removeMember:()=>{}
});

const ProjectProvider = ({children}) => {

    const [status, setStatus] = useState('');
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

    const {user, role} = useContext(AuthContext);

    const listProjects = () => {
        console.log('list projects', user, role);
        (async function(){

            let list = await post('/api/project/list', {user, role});
            list.sort(({project_name:P1}, {project_name:P2}) => P1 < P2 ? -1 : P1 > P2 ? 1 : 0);

            setStatus('loading');
            setOrigList(list);
            filterList(filters, list)
            setStatus('ready');
        })()
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
    

    const createProject = (project) => {
        (async function(){
            console.log('creating project', {project});
            setStatus('loading');
            let {result, reason} = await post('/api/project/create', {project});
            if(result === 'ok'){
                setStatus('created');
            } else {
                setStatus('create_failed');
                setMsg(reason);
            }
            listProjects();
        })()
    }

    const removeProject = (project) => {
        (async function(){
            setStatus('loading');
            let {result, reason} = await post('/api/project/remove', {project});
            console.log('remove project', result);
            if(result === 'ok'){
                setStatus('removed');
            } else {
                setStatus('remove_failed');
                setMsg(reason);
            }
            listProjects();
        })()
    }

    const assignProjectMember = (project, selUser, selRole) => {
        (async function(){
            console.log('assigning member');
            setStatus('loading');
            let {result, reason} = await post('/api/project/assign_member', {project, user:selUser, role:selRole});
            if(result === 'ok'){
                setStatus('assigned');
            } else {
                setStatus('assign_failed');
                setMsg(reason);
            }
            listProjects();
        })()
    }

    const removeProjectMember = (project, removed) => {
        (async function(){
            setStatus('loading');
            let {result, reason} = await post('/api/project/remove_member', {project, user:removed});
            console.log(result, reason, 'remove member');
            if(result === 'ok'){
                setStatus('removed');
            } else {
                setStatus('remove_failed');
                setMsg(reason);
            }
            listProjects();
        })()
    }

    return <ProjectContext.Provider value={{list, status, msg,
        listProjects,
        createProject,
        removeProject,
        addFilter,
        removeFilter,
        assignProjectMember,
        removeProjectMember
    }}>
        {children}
    </ProjectContext.Provider>
}

export {
    ProjectContext,
    ProjectProvider
}
