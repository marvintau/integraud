import React, {useState, useEffect, useContext} from 'react';

import {Input, Button, Col, Table} from 'reactstrap';
import {Spinner} from 'reactstrap';
import {FixedSizeList as List} from 'react-window';
import AssignSelect from './AssignSelect';

import {Link, useHistory } from 'react-router-dom';

import {AuthContext} from "../context/auth";
import {ProjectContext} from '../context/projects';
import {SelectedProjectContext} from '../context/selectedProject';

import { ConfirmButton } from './ComfirmButton';

function ProjectCreate(){
    const [project, setProject] = useState('');
    const {msg, createProject} = useContext(ProjectContext);

    const butt = <Button
        color='success'
        onClick={() => {createProject(project)}}
        style={{width: '100%'}}>
        创建项目
    </Button>

    return <tr className='d-flex'>
        <th className="col-md-3"><Input placeholder="项目名称" value={project} onChange={(e) => setProject(e.target.value)}/></th>
        <th className="col-md-2">{butt}</th>
        <th>{msg ?? <span>{msg}</span>}</th>
    </tr>
}

function EnterProjectButton({project, members}){

    const {setProject, setMembers} = useContext(SelectedProjectContext);
    const history = useHistory();

    const handleLinkProject = () => {
        setProject(project);
        setMembers(members);
        history.push(`/project`)
    }
    
    return <Button color="dark" style={{width: '98%'}} outline onClick={handleLinkProject}>{project}</Button>
}

function RemoveProjectButton({hovered, project}){

    const {role} = useContext(AuthContext);
    const {removeProject} = useContext(ProjectContext);

    if(['supreme', 'governer'].includes(role)){
        return <ConfirmButton {...{hovered, name:'刪除项目', action:()=>removeProject(project)}} />
    } else {
        return <></>
    }

}

function ProjectRow({index, style, data}){

    const {project, members} = data[index];

    const [hovered, setHovered] = useState(false);

    return <div style={{display:'flex', alignItems:'center', height:'100px', padding:"10px", background: index % 2 ?'#E8E8E8': "#FFFFFF", ...style}}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
    >
        <div className="col-4"><EnterProjectButton {...{project, members}} /></div>
        <div className="col-2"><RemoveProjectButton  {...{hovered, project}} /></div>
        <div className="col-6"><AssignSelect {...{project, members}} /></div>
    </div>
}

export default function (props){

    const {status:authStatus, user, role, listUsers} = useContext(AuthContext);
    const {status:projStatus, list:projectListData, listProjects} = useContext(ProjectContext);

    useEffect(() => {
        (async function(){
            try{
                await listProjects(user, role);
                await listUsers();
            } catch (err){
                console.log(err);
            }
        })()
    }, []);

    const projectCreate = ['supreme', 'governer'].includes(role)
        ? <Table><tbody><ProjectCreate /></tbody></Table>
        : undefined;

    let projectListElem;
    if(projStatus !== 'ready'){
        projectListElem = <Spinner color="primary" size="xs" style={{margin:'10px'}} />;
    } else {

        let projectList = projectListData.map(({project_name, members={}}) => ({project:project_name, members}));

        projectListElem = <List
            style= {{borderTop: '1px solid black', borderBottom:'1px solid black', margin:'0px 10px'}}
            height={580}
            itemCount={projectList.length}
            itemData={projectList}
            itemSize={100}
            itemKey={(index, data) => data[index].project}
            width={'100%'}
        >
            {ProjectRow}
        </List>
    }

    return <Col>
        <h2>项目列表</h2>
        {projectCreate}
        {projectListElem}
        <Link to='/'><Button color="primary" style={{margin: '10px'}}>返回</Button></Link>
    </Col>
}