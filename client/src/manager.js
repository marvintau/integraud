import React, {useState, useEffect} from 'react';

import {useUserCreate, useUserRemove, useUsersFetch} from './hooks/user';

import 'bootstrap/dist/css/bootstrap.min.css';
import {Input, Button, Col, Table} from 'reactstrap';
import {Spinner} from 'reactstrap';

import {post} from './hooks/fetch';

import './App.css';

function HoveredSelect({hovered, value, options, action}){

    const optionsList = Object.entries(options).map(([val, desc], i) => {
        return <option key={i} value={val}>{desc}</option>
    })

    const input = <Input
        type='select'
        value={value}
        onChange={e => action(e.target.value)}>
            {optionsList}
        </Input>

    const desc = <div>{options[value]}</div>;

    return hovered ? input : desc;
}

function HoveredButton({hovered, button}){
    return hovered ? button : [];
}

function ConfirmButton({name, action}){
    const [confirming, setConfirming] = useState(false);

    return !confirming
    ? <Button color='warning' style={{width:'100%'}} onClick={() => setConfirming(true)}>{name}</Button>
    : <>
        <Button color='danger' style={{width: '48%', marginRight:"2%"}} onClick={action}>确定</Button>
        <Button color='info' style={{width: '48%'}} onClick={() => setConfirming(false)}>算了</Button>
      </>
}

function UserDisplay({user, nick, role, fetchUsers}){

    let options = {
        'governer':'系统管理员',
        'manager': '项目负责人',
        'normal':  '一般用户'
    };

    const [hovered, setHovered] = useState(false);
    const [errMsg, removeUser] = useUserRemove({user}, fetchUsers);
    console.log(errMsg);

    const grantRole = (newRole)=>{
        (async function(){
            let {status, reason} = await post('/api/grant_overall_role', {user, role:newRole});
            console.log('status', status);
            if(status === 'ok'){
                await fetchUsers();
            } else if (status === 'error'){
                console.log(reason);
            }
        })()
    }

    let button = <ConfirmButton style={{width: '100%'}} color="warning" name="删除用户" action={removeUser}></ConfirmButton>;

    return <tr className='d-flex'
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}>
        <td className="col-2">{user}</td>
        <td className="col-2">{nick}</td>
        <td className="col-2"><HoveredSelect {...{hovered, options, value:role, action:grantRole}} /></td>
        <td className="col-2"><HoveredButton {...{hovered, button}} /></td>
    </tr>
}

function UserCreate({fetchUsers}){
    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const [nick, setNick] = useState('');
    const [createErrMsg, createUser] = useUserCreate({user, pass, nick}, fetchUsers);

    const butt = <Button
        color='success'
        onClick={createUser}
        style={{width: '100%'}}>
        添加新用户
    </Button>

    return <tr className='d-flex'>
        <th className="col-2"><Input placeholder="用户" value={user} onChange={(e) => setUser(e.target.value)}/></th>
        <th className="col-2"><Input placeholder="密码" value={pass} onChange={(e) => setPass(e.target.value)}/></th>
        <th className="col-2"><Input placeholder="昵称" value={nick} onChange={(e) => setNick(e.target.value)}/></th>
        <th className="col-2">{butt}</th>
        <th>{createErrMsg ?? <span>{createErrMsg}</span>}</th>
    </tr>
}

export default function Manager(props){

    let [fetchStatus, userList, fetchUsers] = useUsersFetch();

    // console.log(userList);
    let list = userList.map(({user_name, password, nickname, role}, i) => {
        return <UserDisplay key={i} fetchUsers={fetchUsers} {...{user:user_name, nick:nickname, role}} />
    })

    return <Col><Table><tbody>
            <UserCreate fetchUsers={fetchUsers} />
            {list}
        </tbody></Table>
        {fetchStatus !== 'ready' && userList.length === 0 ? <Spinner color="primary" size="xs"/> : undefined }
        </Col>

}