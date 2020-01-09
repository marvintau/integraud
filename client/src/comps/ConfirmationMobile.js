import React, {useState, useContext, useEffect} from 'react';
import {Col, FormGroup, Form, Input, Label, Button} from 'reactstrap';
import {Route, Link} from 'react-router-dom';

// import {AuthContext} from '../context/auth';


export default function (props) {

    return <Col md={{size: 4, offset:4}}>
        ho ho ho
        {props.match.location.search}
    </Col>
}