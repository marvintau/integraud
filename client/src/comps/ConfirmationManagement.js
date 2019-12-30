import React, {useState, useEffect, useContext} from 'react';
import {Col, Button, Input, Table} from 'reactstrap';
import {Link} from 'react-router-dom';

import {ConfirmationContext} from '../context/confirmation';
import {SelectedProjectContext} from '../context/selectedProject'
import {AuthContext} from '../context/auth';

function ConfirmationItemCreate({project}){

    let [confirmID, setConfirmID] = useState('');

    const {msg, create} = useContext(ConfirmationContext);

    const butt = <Button
        color='success'
        onClick={() => {
            create(confirmID)
        }}
        style={{width: '100%'}}>
        创建询证函记录
    </Button>

    return <tr className='d-flex'>
        <th className="col-md-2"><Input placeholder="询证函编号" value={confirmID} onChange={(e) => setConfirmID(e.target.value)}/></th>
        <th className="col-md-2">{butt}</th>
        <th>{msg ?? <span>{msg}</span>}</th>
    </tr>
}

export default function(){
    
    const {user} = useContext(AuthContext);
    const {project, members} = useContext(SelectedProjectContext);
    const {status, list, listConfirmations} = useContext(ConfirmationContext);

    useEffect(() => {
        (async () => listConfirmations())();
    })

    const confirmationItemCreate = (members[user] && members[user] === 'manager')
    ? <Table><tbody><ConfirmationItemCreate /></tbody></Table>
    : undefined;

    return <Col>
        {confirmationItemCreate}
        <Link to={`/project/${project}`}><Button color="primary" style={{margin: '10px'}}>返回</Button></Link>
    </Col>
    
}