import React, {useContext} from 'react';
import {Link} from 'react-router-dom';
import {Navbar, Nav, Button} from 'reactstrap';

import {AuthContext} from '../hooks/auth';

export default function Home(){

    const {user, nick, role} = useContext(AuthContext);
  
    return <>
      <ul>
        {['governer', 'supreme'].includes(role) ? <li style={{margin: '20px'}}><Link to="/user-management"><Button>用户控制</Button></Link></li> : undefined }
        {/* <li style={{margin: '20px'}}><Link to="/user-management"><Button>用户控制</Button></Link></li> */}
      </ul>
    </>
  }
  