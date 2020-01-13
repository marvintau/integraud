import React, { useContext } from 'react';
import {Button, Row} from 'reactstrap';
import {useHistory} from 'react-router-dom';

import {SelectedProjectContext} from '../context/selectedProject';

export default function () {

  const {project} = useContext(SelectedProjectContext);
  const history = useHistory();

  console.log(project, 'should have been defined');

  const handleLinkConfirmation = (e) => {
    history.push(`/confirmation-management`)
  }

  const handleAlert = (e) => {
    alert('功能正在实现中，再去催催程序员');
  }

  const handleBack = (e) => {
    history.push(`/project-management`);
  }

  const style = {
    marginTop:'20px'
  }


  return <div className='col-md-12' style={{display:'flex', flexDirection:'column'}}>
    <Row><h2 style={{margin: '20px'}}>{project}</h2></Row>
    <Button outline onClick={handleAlert} className="col-md-3" style={style} color="dark">基本信息 (开发中)</Button>
    <Button outline onClick={handleLinkConfirmation} className="col-md-3" style={style} color="info">函证控制</Button>
    <Button outline onClick={handleAlert} className="col-md-3" style={style} color="warning"   >报表管理 (开发中)</Button>
    <Button outline onClick={handleAlert} className="col-md-3" style={style} color="primary">底稿管理 (开发中)</Button>
    <Button onClick={handleBack} className="col-md-3" style={style} color="primary">返回</Button>
  </div>
}