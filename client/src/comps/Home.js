import React, {useContext} from 'react';
import {Link} from 'react-router-dom';
import {Col, Button} from 'reactstrap';

import {AuthContext} from '../context/auth';

export default function Home(){

  const {user, nick, role} = useContext(AuthContext);
  
  let userManage, projectList;

  if(['governer', 'supreme', 'manager', 'normal'].includes(role)){
    projectList = <Link to="/project-management">
      <Button className="col-md-4" style={{margin: '10px'}} color="info">项目列表</Button>
    </Link>
  }

  if(['governer', 'supreme'].includes(role)){
    userManage = <Link to="/user-management">
      <Button className="col-md-4" style={{margin: '10px'}} color="primary">用户管理</Button>
    </Link>
  }

  return <Col size="md-12">
      {userManage}
      {projectList}
  </Col>
}
  