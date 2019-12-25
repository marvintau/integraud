import React, {useContext} from 'react';
import {Link} from 'react-router-dom';
import {Navbar, Nav, Button} from 'reactstrap';

import {AuthContext} from '../hooks/auth';

export default function Home(){

    const {user, nick, role} = useContext(AuthContext);
  
    return <>
      <ul>
        {['governer', 'supreme'].includes(role) ? <li style={{margin: '20px'}}><Link to="/user-management"><Button>用户管理</Button></Link></li> : undefined }
        {['governer', 'supreme'].includes(role) ? <li style={{margin: '20px'}}><Link to="/project-management"><Button>项目管理</Button></Link></li> : undefined }
      </ul>
    </>
  }
  