import React, {useState, useEffect, useContext} from 'react';

import {post} from '../hooks/fetch';

import {Input, Button, Col, Table} from 'reactstrap';
import {Spinner} from 'reactstrap';
import {ConfirmButton} from './ComfirmButton';

import {AuthContext} from '../hooks/auth';

import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

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

function UserDisplayRow({user, nick, role}){

    const [hovered, setHovered] = useState(false);
    const [errMsg, setErrMsg] = useState(null);

    const {listUsers} = useContext(AuthContext);

    const changeRole = (role)=>{
        (async function(){
            let {status, reason} = await post('/api/grant_overall_role', {user, role});
            if(status === 'ok'){
                listUsers();
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
                listUsers();
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

function UserCreate(){
    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const [nick, setNick] = useState('');

    const {msg, register} = useContext(AuthContext);

    const butt = <Button
        color='success'
        onClick={() => register(user, pass, nick)}
        style={{width: '100%'}}>
        添加新用户
    </Button>

    return <tr className='d-flex'>
        <th className="col-2"><Input placeholder="用户" value={user} onChange={(e) => setUser(e.target.value)}/></th>
        <th className="col-2"><Input placeholder="密码" value={pass} onChange={(e) => setPass(e.target.value)}/></th>
        <th className="col-2"><Input placeholder="昵称" value={nick} onChange={(e) => setNick(e.target.value)}/></th>
        <th className="col-2">{butt}</th>
        <th>{msg ?? <span>{msg}</span>}</th>
    </tr>
}

export default function (props){

    let {status:fetchStatus, list:userListData, listUsers} = useContext(AuthContext);
    
    useEffect(listUsers, []);

    let userList = [];
    for (let i = 0; i < userListData.length; i++){
        let {user_name, nickname, role} = userListData[i];
        console.log(user_name, nickname);
        userList.push(<UserDisplayRow key={i} {...{user:user_name, nick:nickname, role}}/>);
    }

    return <Col>
        <Table><tbody>
            <UserCreate />
            {userList}
        </tbody></Table>
        {fetchStatus !== 'ready' && userList.length === 0 ? <Spinner color="primary" size="xs"/> : undefined }
        <Link to='/'><Button color="primary">返回</Button></Link>
    </Col>
}