import React, {useState, useEffect, useContext} from 'react';
import {Col, Button} from 'reactstrap';
import {Link} from 'react-router-dom';

import ConfirmationTable from './ConfirmationTable';
import TemplateTable from './TemplateTable';

import {ConfirmationContext} from '../../context/confirmation';
import {SelectedProjectContext} from '../../context/selectedProject'
import {AuthContext} from '../../context/auth';

import '../../scroll-bar.css';

export default function(){
    
    const {user, role} = useContext(AuthContext);
    const {project, members} = useContext(SelectedProjectContext);
    const {status, list, getList, templateList, getTemplateList} = useContext(ConfirmationContext);

    console.log(project, members, 'selected prooject');

    useEffect(() => {
        (async () => {
            await getList(project);
            await getTemplateList();
        })();
    }, [])

    const headerStyle ={
        margin: '20px 0px',
        borderBottom:'1px solid #343a40'
    }

    return <Col>
        <h2 style={headerStyle}>函证控制</h2>
        <ConfirmationTable {...{project, status, data:list, user, role, members}} />
        <h2 style={headerStyle}>询证函模版管理</h2>
        <TemplateTable {...{list:templateList, user, role, members}} />
        <Link to={`/project/${project}`}><Button color="primary" style={{margin: '10px'}}>返回</Button></Link>
    </Col>
    
}