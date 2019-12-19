import React, {useState, useEffect, useContext} from 'react';

import {useUserCreate, useUserRemove, useUsersFetch} from './hooks/user';

import 'bootstrap/dist/css/bootstrap.min.css';
import {Input, Button, Col, Table} from 'reactstrap';
import {Spinner} from 'reactstrap';

import './App.css';

function HoveredSelect({hovered, initValue, options}){
    const [value, setValue] = useState(initValue);

    const optionsList = Object.entries(options).map(([val, desc], i) => {
        return <option key={i} value={val}>{desc}</option>
    })

    const input = <Input
        type='select'
        value={value}
        onChange={e => setValue(e.target.value)}>
            {optionsList}
        </Input>

    const desc = <div style={{color: value !== initValue ? '#845230': 'black'}}>{options[value]}</div>;

    return hovered ? input : desc;
}

function HoveredButton({hovered, button}){
    return hovered ? button : [];
}

function HoverTR({children}){
    const [hovered, setHovered] = useState(false);

    const hoveredChildren = React.Children.map(children, (child) => {
        React.cloneElement(child, {hovered});
    })

    return <tr className='d-flex'
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}>
            {hoveredChildren}
    </tr>
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

function UserDisplay({user, nick, fetchUsers}){
    const [removeStatus, errMsg, removeUser] = useUserRemove({user}, fetchUsers);

    let options = {
        'governer':'系统管理员',
        'manager': '项目负责人',
        'normal':  '一般用户'
    };

    let button = <ConfirmButton style={{width: '100%'}} color="warning" name="删除用户" action={removeUser}></ConfirmButton>;

    return <HoverTR>
        <td className="col-2">{user}</td>
        <td className="col-2">{nick}</td>
        <td className="col-2"><HoveredSelect {...{options, initValue:'normal'}} /></td>
        <td className="col-2"><HoveredButton {...{button}} /></td>
    </HoverTR>
}

function UserCreate({fetchUsers}){
    let [user, setUser] = useState(''),
        [pass, setPass] = useState(''),
        [nick, setNick] = useState(''),
        [createStatus, createErrMsg, createUser] = useUserCreate({user, pass, nick}, fetchUsers);

    const butt = <Button
        color='success'
        onClick={createUser}
        disabled={createStatus !== 'ready'}
        style={{width: '100%'}}>
        添加新用户
    </Button>

    let input = <tr className='d-flex'>
        <th className="col-2"><Input placeholder="用户" value={user} onChange={(e) => setUser(e.target.value)}/></th>
        <th className="col-2"><Input placeholder="密码" value={pass} onChange={(e) => setPass(e.target.value)}/></th>
        <th className="col-2"><Input placeholder="昵称" value={nick} onChange={(e) => setNick(e.target.value)}/></th>
        <th className="col-2">{butt}</th>
        <th>{createErrMsg ?? <span>{createErrMsg}</span>}</th>
    </tr>
    return input
}

export default function Manager(props){

    let [fetchStatus, userList, fetchUsers] = useUsersFetch();

    // console.log(userList);
    let list = userList.map(({user_name, password, nickname}, i) => {
        return <UserDisplay key={i} fetchUsers={fetchUsers} {...{user:user_name, nick:nickname}} />
    })

    return <Col><Table><tbody>
            <UserCreate fetchUsers={fetchUsers} />
            {list}
        </tbody></Table></Col>

}