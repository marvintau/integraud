import React from 'react';
import {Col, Button, Row} from 'reactstrap';

export default function ({match}) {

  return <Col size="md-12">
    <Row><h2>{match.params.projectName}</h2></Row>
    <Button className="col-md-4" style={{margin: '10px'}} color="primary">函证控制</Button>
  </Col>
}