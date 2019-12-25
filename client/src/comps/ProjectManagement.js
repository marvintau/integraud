import React, {useState, useEffect, useContext} from 'react';
import Select from 'react-select';

import {Input, Button, Col, Table} from 'reactstrap';
import {Spinner} from 'reactstrap';

import { Link } from 'react-router-dom';


import {AuthContext} from "../hooks/auth";
import {ProjectContext} from '../hooks/projects';

import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ConfirmButton } from './ComfirmButton';

function ProjectCreate(){
    const [project, setProject] = useState('');
    const {msg, createProject, removeProject} = useContext(ProjectContext);

    const butt = <Button
        color='success'
        onClick={() => {
            console.log('create!', createProject);
            createProject(project)
        }}
        style={{width: '100%'}}>
        创建项目
    </Button>

    return <tr className='d-flex'>
        <th className="col-md-3"><Input placeholder="项目名称" value={project} onChange={(e) => setProject(e.target.value)}/></th>
        <th className="col-md-2">{butt}</th>
        <th>{msg ?? <span>{msg}</span>}</th>
    </tr>
}


function ProjectRow({project, members}){

    const [hovered, setHovered] = useState(false);

    const [selMember, setSelMember] = useState(undefined);
    const [selRole, setSelRole] = useState(undefined);

    const {role, list:userList} = useContext(AuthContext);
    const {assignProjectMember, removeProjectMember, removeProject} = useContext(ProjectContext);

    const optionsList = userList.map(({user_name, nickname})=> ({label:nickname, value:user_name}));

    let roleList;
    if(['supreme', 'governer'].includes(role)){
        roleList = [{label:'负责人', value:'manager'}, {label:'成员', value:'member'}]
    } else {
        roleList = [{label:'成员', value:'member'}]
    }

    let userNameDict = Object.fromEntries(optionsList.map(({label, value}) => [value, label]));
    let memberList = Object.keys(members).map(key => ({label:userNameDict[key], value:key}));

    let memberSelect = <Select
        placeholder="选择成员"
        value={selMember}
        options={optionsList}
        onChange={(value) => {
            setSelMember(value);
        }}
    />

    let roleSelect = <Select
        placeholder="选择权限"
        value={selRole}
        isSearchable={false}
        options={roleList}
        onChange={(value) => {
            setSelRole(value);
        }}
    />

    let displaySelect = <Select isMulti isClearable={false} isOptionDisabled={true}
        placeholder="无"
        value={memberList}
        isSearchable={false}
        options={[]}
        onChange={(newValue, {action}) => {
            if(action==='remove-value'){
                let removed = memberList.filter(e => !newValue.includes(e))[0]
                removeProjectMember(project, removed.value);
            }
        }}
    />

    let setMember = () => {
        console.log('assign project memebr', project, selMember, selRole);
        assignProjectMember(project, selMember.value, selRole.value);
    }

    let assignSelect = <div>
        <div style={{width:"98%", margin:"0px 1%"}}>{displaySelect}</div>
        <div style={{display:'flex'}}>
            <div style={{width:"32%", margin:"5px 1%"}}>{memberSelect}</div>
            <div style={{width:"32%", margin:"5px 1%"}}>{roleSelect}</div>
            <Button style={{width:"32%", margin:'5px 1%'}} color="warning" disabled={!(selMember && selRole)} onClick={setMember}>确定</Button>
        </div>
    </div>

    let confirmedButton = <ConfirmButton {...{hovered, name:'刪除项目', action:()=>removeProject(project)}} />

    return <tr className="d-flex" style={{height: '100px'}}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}>
        <td className="col-md-3">{project}</td>
        <td className="col-md-2">{confirmedButton}</td>
        <td className="col-md-4">{assignSelect}</td>
    </tr>
}

export default function (props){

    const {user, role, listUsers} = useContext(AuthContext);
    const {status, list:projectListData, listProjects} = useContext(ProjectContext);

    console.log(projectListData);

    useEffect(() => {
        listProjects(user, role);
        listUsers();
    }, []);

    let projectList = [];
    for (let i = 0; i < projectListData.length; i++){
        let {project_name:project, members={}} = projectListData[i];
        projectList.push(<ProjectRow key={i} {...{project, members}} />);
    }
    
    return <Col>
        <Table><tbody>
            <ProjectCreate />
            {projectList}
        </tbody></Table>
        <div>{status !== 'ready' && projectList.length !== 0 ? <Spinner color="primary" size="xs" style={{margin:'10px'}} /> : undefined }</div>
        <Link to='/'><Button color="primary">返回</Button></Link>
    </Col>
}