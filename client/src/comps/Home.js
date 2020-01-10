import React, {useState, useContext} from 'react';
import {Link, useHistory} from 'react-router-dom';
import {Col, Button} from 'reactstrap';

import QRCodeScanner from './QRCodeScanner';

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

    const goto = url.searchParams.get('goto');
    const user = url.searchParams.get('user');

    if(goto !== 'confirmation'){
      setMessage('您可能扫描了错误的二维码。');
    } else {
      history.push(`/confirmation-mobile?user=${user}`);
    }    
  }

  return <>
    <Col size="md-12" style={{display:'flex', flexDirection:'column'}}>
        {userManage}
        {projectList}
    </Col>
  </>
}
  