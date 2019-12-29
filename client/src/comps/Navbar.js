import React, {useContext} from 'react';
import {AuthContext} from '../context/auth';
import {Navbar, Nav, Button} from 'reactstrap';
import {useHistory} from 'react-router-dom';

function LogButton({type}){

  const history = useHistory();
  const {logout} = useContext(AuthContext);

  const handleClick = () => {
    history.push(type === 'login' ? '/login' : '/');

    if (type === 'logout'){
      (async () => {
        logout()
      })();
    }
  }

  let text = type === 'login' ? '登录' : '登出'

  return <Button color="info" onClick={handleClick}>{text}</Button>
}

export default () => {

  const {user, role, nick} = useContext(AuthContext);

  const roleName = {
    supreme: '最高管理员',
    governer: '超级管理员',
    manager:'项目管理员',
    normal:'一般用户'
  }[role]

  const type = user ? 'logout' : 'login';

  return <Navbar color="light" light expand="md">
    <div> {user === undefined ? '' : `您好, ${nick}(${roleName})`}</div>
    <Nav className="ml-auto">
      <LogButton type={type} />
    </Nav>
  </Navbar>
}