import React, {useContext} from 'react';
import {AuthContext} from '../hooks/auth';
import {Navbar, Nav, Button} from 'reactstrap';
import {Link} from 'react-router-dom';

export default () => {

  const {user, role, nick} = useContext(AuthContext);

  const roleName = {
    supreme: '至高管理员',
    governer: '超级管理员',
    manager:'项目管理员',
    normal:'一般用户'
  }[role]

  return <Navbar color="light" light expand="md">
    <div> {user === undefined ? '' : `您好, ${nick}(${roleName})`}</div>
    <Nav className="ml-auto">
      <Link to={user ? '/logout' : "/login"}><Button color="info">{user ? '登出' : '登录'}</Button></Link>
    </Nav>
  </Navbar>
}