import React, {createContext, useState, useContext} from 'react';
import {post} from './fetch';

import {AuthContext} from './auth';

const ProjectContext = createContext({list:[],
    createProject:()=>{},
    removeProject:() =>{},
    listProjects:()=>{},
    assignMember:()=>{},
    removeMember:()=>{}
});

const ProjectProvider = ({children}) => {

    const [list, setList] = useState([]);
    const [status, setStatus] = useState('');
    const [msg, setMsg] = useState(undefined);

    const {user, role} = useContext(AuthContext);

    const listProjects = () => {
        console.log('list projects', user, role);
        (async function(){
            setStatus('loading');
            setList(await post('/api/project/list', {user, role}));
            setStatus('ready');
        })()
    }
    
    const createProject = (project) => {
        (async function(){
            console.log('creating project', {project});
            setStatus('loading');
            let {result, reason} = await post('/api/project/create', {project});
            if(result === 'ok'){
                setStatus('added');
                setList(await post('/api/project/list', {user, role}));
            } else {
                setStatus('add_failed');
                setMsg(reason);
            }
        })()
    }

    const removeProject = (project) => {
        (async function(){
            setStatus('loading');
            let {result, reason} = await post('/api/project/remove', {project});
            console.log('remove project', result);
            if(result === 'ok'){
                setStatus('ready');
                setList(await post('/api/project/list', {user, role}));
            } else {
                setStatus('remove_failed');
                setMsg(reason);
            }
        })()
    }

    const assignProjectMember = (project, selUser, selRole) => {
        (async function(){
            console.log('assigning member');
            setStatus('loading');
            let {result, reason} = await post('/api/project/assign_member', {project, user:selUser, role:selRole});
            if(result === 'ok'){
                setStatus('ready');
                setList(await post('/api/project/list', {user, role}));
            } else {
                setStatus('assign_failed');
                setMsg(reason);
            }
        })()
    }

    const removeProjectMember = (project, removed) => {
        (async function(){
            setStatus('loading');
            let {result, reason} = await post('/api/project/remove_member', {project, user:removed});
            if(result === 'ok'){
                setStatus('ready');
                setList(await post('/api/project/list', {user, role}));
            } else {
                setStatus('remove_failed');
                setMsg(reason);
            }
        })()
    }

    return <ProjectContext.Provider value={{list, status, msg,
        listProjects,
        createProject,
        removeProject,
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
