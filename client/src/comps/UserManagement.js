import React, {useState, useEffect, useContext} from 'react';

import {Table, Input, Button, Col} from 'reactstrap';
import {FixedSizeList as List} from 'react-window';

import {Spinner} from 'reactstrap';
import {ConfirmButton} from './ComfirmButton';

import {AuthContext} from '../context/auth';

import { Link } from 'react-router-dom';

function HoveredSelect({hovered, value, options, action}){

    const [val, setVal] = useState(value);

    const optionsList = Object.entries(options).map(([val, spec], i) => {
        let {desc} = spec;
        return <option key={i} value={val}>{desc}</option>
    })

    const input = <Input type='select' value={val} onChange={(e) => {
        setVal(e.target.value);
        action(e.target.value);
    }}>
        {optionsList}
    </Input>

    const desc = <div style={options[val].style}>{options[val].desc}</div>;

    return hovered ? input : desc;
}

function RoleSelect({hovered, role, action}){

    let roles = {
        supreme:{desc: '最高管理员',style:{color:'#ffc107'}},
        governer:{desc: '系统管理员',style:{color:'#dc3545'}},
        manager: {desc: '项目负责人',style:{color:'#6f42c1'}},
        normal:  {desc: '一般用户　',style:{color:'#007bff'}},
    };

    return HoveredSelect({hovered, value:role, options: roles, action});
}

function UserDisplayRow({index, style, data}){

    let {user, nick, role} = data[index];

    const [hovered, setHovered] = useState(false);

    const {remove, changeRole} = useContext(AuthContext);

    const cellStyle = {margin:'10px', display:'table-cell', verticalAlign:'middle'}

    return <div style={{display:'flex', height:'80px', background: index % 2 ?'#E8E8E8': "#FFFFFF", ...style}}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}>
        <div className="col-2" style={cellStyle}>{user}</div>
        <div className="col-2" style={cellStyle}>{nick}</div>
        <div className="col-2" style={cellStyle}><RoleSelect {...{hovered, role, action:(newRole) =>changeRole(user, newRole)}} /></div>
        <div className="col-2" style={cellStyle}><ConfirmButton {...{hovered, name:'删除用户', action: () => remove(user)}} /></div>
    </div>
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

    let userList = userListData.map(({user_name, nickname, role}) => ({user:user_name, nick:nickname, role}));
    userList.sort((prev, next) => prev.user > next.user ? 1 : -1);
    console.log(userList);

    return <Col>
        <Table><tbody>
            <UserCreate />
        </tbody></Table>
        <List
            style= {{borderTop: '1px solid black', borderBottom:'1px solid black', margin:'0px 10px', padding:'0px 10px'}}
            height={600}
            itemCount={userList.length}
            itemData={userList}
            itemSize={60}
            itemKey={(index, data) => data[index].user}
            width={'90%'}
        >
            {UserDisplayRow}
        </List>
        {fetchStatus !== 'ready' && userList.length === 0 ? <Spinner color="primary" size="xs"/> : undefined }
        <Link to='/'><Button color="primary" style={{margin:'10px'}}>返回</Button></Link>
    </Col>
}