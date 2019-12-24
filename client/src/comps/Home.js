import React, {useContext} from 'react';
import {Link} from 'react-router-dom';
import {Button} from 'reactstrap';

import {AuthContext} from '../hooks/auth';

export default function Home(){

    const {user, nick, role} = useContext(AuthContext);
  
    return <>
      <div>Yo, welcome home. {user === undefined ? undefined : `You are ${nick} as ${role}`}</div>
      <ul>
        <li style={{margin: '20px'}}><Link to={user ? '/logout' : "/login"}><Button>{user ? '登出' : '登录'}</Button></Link></li>
        {['governer', 'supreme'].includes(role) ? <li style={{margin: '20px'}}><Link to="/user-management"><Button>用户控制</Button></Link></li> : undefined }
      </ul>
    </>
  }
  