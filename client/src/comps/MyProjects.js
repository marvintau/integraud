import React, {useEffect, useContext} from 'react';
import {Link} from 'react-router-dom';
import {Table, Col, Button} from 'reactstrap';

import {AuthContext} from '../context/auth';
import {ProjectContext} from '../context/projects';

export default function MyProjects(){

  const {user, role} = useContext(AuthContext);
  const {list:projectListData, listProjects} = useContext(ProjectContext);

  useEffect(() => {
    listProjects(user, role);
  }, [])


  let projectList = [];
  for (let i = 0; i < projectListData.length; i++){
      let {project_name:project} = projectListData[i];
      projectList.push(<tr key={i}><td>{project}</td></tr>);
  }

  return <Col>
    <Table><tbody>
      {projectList}
    </tbody></Table>
    <Link to='/'><Button color="primary">返回</Button></Link>
  </Col>
}