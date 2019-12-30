import React from 'react';
import {Col, Button, Row} from 'reactstrap';
import {Link} from 'react-router-dom';

export default function ({match}) {

  return <Col size="md-12">
    <Row><h2 style={{margin: '20px'}}>{match.params.projectName}</h2></Row>
    <Link to={`/confirmations/${match.params.projectName}`}><Button className="col-md-4" style={{margin: '10px'}} color="primary">函证控制</Button></Link>
  </Col>
}