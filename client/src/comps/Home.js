import React, {useState, useContext} from 'react';
import {Link, useHistory} from 'react-router-dom';
import {Col, Button} from 'reactstrap';

import Scanner from './Scanner';

import {AuthContext} from '../context/auth';

export default function Home(){

  const [message, setMessage] = useState('');
  const {role} = useContext(AuthContext);
  const history = useHistory();
  
  let userManage, projectList;

  if(['governer', 'supreme', 'manager', 'normal'].includes(role)){
    projectList = <Link to="/project-management">
      <Button className="col-md-3" outline style={{margin: '10px'}} color="info">项目列表</Button>
    </Link>
  }

  if(['governer', 'supreme'].includes(role)){
    userManage = <Link to="/user-management">
      <Button className="col-md-3" outline style={{margin: '10px'}} color="primary">用户管理</Button>
    </Link>
  }

  const warpToConfirmManagement = (result) => {
    
    const url = new URL(result.text);
    const {user, goto} = url.searchParams;

    if(goto !== 'confirmation'){
      setMessage('您可能扫了错误的二维码。请继续扫一下您刚才扫过的二维码，完成登录');
    } else {
      history.push(`/confirmation-mobile?user=${user}`);
    }    
  }

  return <>
    <Col size="md-12" style={{display:'flex', flexDirection:'column'}}>
        {userManage}
        {projectList}
    </Col>
    <Scanner success={warpToConfirmManagement} />
    <Col style={{margin: '30px', width:'100%'}}>{message}</Col>
  </>
}
  