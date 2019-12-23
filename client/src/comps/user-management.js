import React, {useState, useEffect} from 'react';

import {post} from '../hooks/fetch';
import {useUserList} from '../hooks/user';

import {Input, Button, Col, Table} from 'reactstrap';
import {Spinner} from 'reactstrap';

import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function HoveredSelect({hovered, value, options, action}){

    const [val, setVal] = useState(value);

    const optionsList = Object.entries(options).map(([val, desc], i) => {
        return <option key={i} value={val}>{desc}</option>
    })

    const input = <Input type='select' value={val} onChange={(e) => {
        setVal(e.target.value);
        action(e.target.value);
    }}>
        {optionsList}
    </Input>

    const desc = <div>{options[val]}</div>;

    return hovered ? input : desc;
}

function RoleSelect({hovered, role, action}){

    let roles = {
        'governer':'系统管理员',
        'manager': '项目负责人',
        'normal':  '一般用户'
    };

    return HoveredSelect({hovered, value:role, options: roles, action});
}

function ConfirmButton({hovered, name, action}){
    const [state, setState] = useState('ready');

    const reset = () => {
        setState('ready');
    }

    return !hovered
    ? []
    : state === 'ready'
    ? <Button color='warning' style={{width:'100%'}} onClick={() => setState('pending')}>{name}</Button>
    : <div style={{width:"100%", display:'flex', justifyContent:'space-between'}}>
        <Button color='danger' onClick={() => {
            action()
            setState('done')
        }}>确定</Button>
        <Button color='info'   onClick={() => setState('ready')}>算了</Button>
      </div>
}

function UserDisplayRow({user, nick, role, fetchUsers}){

    const [hovered, setHovered] = useState(false);
    const [errMsg, setErrMsg] = useState(null);

    const changeRole = (role)=>{
        (async function(){
            let {status, reason} = await post('/api/grant_overall_role', {user, role});
            if(status === 'ok'){
                fetchUsers();
            } else if (status === 'error'){
                setErrMsg(reason);
            }
        })()
    }

    const remove = ()=>{
        (async function(){
            let {status, reason} = await post('/api/remove_user', {user});
            if(status === 'ok'){
                console.log('deleted')
                fetchUsers();
            } else if (status === 'error'){
                setErrMsg(reason);
            }
        })()
    }

    return <tr className='d-flex'
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}>
        <td className="col-2">{user}</td>
        <td className="col-2">{nick}</td>
        <td className="col-2"><RoleSelect {...{hovered, role, action:changeRole}} /></td>
        <td className="col-2"><ConfirmButton {...{hovered, name:'刪除用戶', action:remove}} /></td>
        <td className="col-2">{errMsg}</td>
    </tr>
}

function UserCreate({fetchUsers}){
    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const [nick, setNick] = useState('');
    const [errMsg, setErrMsg] = useState(undefined);

    const createUser = () => {
        (async function(){
            let {status, reason} = await post('/api/create_user', {user, pass, nick});
            if(status === 'ok'){
                await fetchUsers();
            } else if (status === 'error'){
                setErrMsg(reason);
            }
        })()
    }

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
        <th>{errMsg ?? <span>{errMsg}</span>}</th>
    </tr>
}

export default function Manager(props){

    let {status:fetchStatus, list:userListData, fetchUsers} = useUserList();
    
    useEffect(fetchUsers, []);

    let userList = [];
    for (let i = 0; i < userListData.length; i++){
        let {user_name, nickname, role} = userListData[i];
        console.log(user_name, nickname);
        userList.push(<UserDisplayRow key={i} {...{user:user_name, nick:nickname, role, fetchUsers}}/>);
    }

    return <Col>
        <Table><tbody>
            <UserCreate fetchUsers={fetchUsers} />
            {userList}
        </tbody></Table>
        {fetchStatus !== 'ready' && userList.length === 0 ? <Spinner color="primary" size="xs"/> : undefined }
    </Col>

}