import React, {useContext} from 'react';
import {AuthContext} from '../hooks/auth';
import {Navbar, Nav, Button} from 'reactstrap';
import {Link} from 'react-router-dom';

export default () => {

  const {user, role, nick} = useContext(AuthContext);

  return <Navbar color="light" light expand="md">
    <div> {user === undefined ? '请先' : `You are ${nick} as ${role}`}</div>
    <Nav className="ml-auto">
      <Link to={user ? '/logout' : "/login"}><Button>{user ? '登出' : '登录'}</Button></Link>
    </Nav>
  </Navbar>
}