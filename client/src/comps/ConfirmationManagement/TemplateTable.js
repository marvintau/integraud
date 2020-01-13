import React, {useContext, useState, useEffect} from 'react';
import FileSelect from './FileSelect';
import {Col, Input, Table, Button} from 'reactstrap';

import {ConfirmationContext} from '../../context/confirmation';

function UploadTemplate(){

    const [type, setType] = useState('');

    const {msg, uploadTemplate} = useContext(ConfirmationContext);

    return <div style={{display:'flex', margin:'5px', alignItems:'center'}}>
        <div className="col-md-2" style={{marginRight:'15px'}}><div>上传函证模版</div></div>
        <div className="col-md-2" style={{marginRight:'15px'}}>
            <Input placeholder='输入函证的类型' value={type} onChange={(e) => setType(e.target.value)}/>
        </div>
        <div className="col-md-8"><FileSelect {...{upload:uploadTemplate, form:{type}}}/></div>
        <div >{msg ?? <span>{msg}</span>}</div>
    </div>
}

export default function TemplateTable({list, user, role, members}){

    const {removeTemplate} = useContext(ConfirmationContext);

    const uploadTemplate = (['supreme', 'governer'].includes(role) || (members[user] && members[user] === 'manager'))
    ? <UploadTemplate />
    : undefined;

    const body = <div style={{height:'200px', width:'100%', overflowY:'scroll'}}><Table>
        <thead><tr style={{background:'#343a40', color:'#FFF', alignItems:'center'}}>
            <th style={{position:'sticky', top:'0'}}>类型</th>
            <th style={{position:'sticky', top:'0'}}>文件名</th>
            <th style={{position:'sticky', top:'0'}}>操作</th>
        </tr></thead>
        <tbody>
            {list.map((name, i) => {
                let type = name.split('.')[1];
                return <tr key={i}>
                    <td>{type}</td>
                    <td>{name}</td>
                    <td><Button color="warning" onClick={() => removeTemplate(type)}>删除</Button></td>
                </tr>
            })}
        </tbody>
    </Table></div>

    return <Col style={{width:'100%'}}>
        {uploadTemplate}
        {body}
    </Col>
}