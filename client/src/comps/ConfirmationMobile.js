import React, {useState, useContext, useEffect} from 'react';
import {Col, FormGroup, Form, Input, Label, Button} from 'reactstrap';
import {Route, Link} from 'react-router-dom';
import QRCodeScanner from './QRCodeScanner';

// import {AuthContext} from '../context/auth';


export default function (props) {
    const [confirmInfo, setConfirmInfo] = useState(undefined);
    const [message, setMessage] = useState('');

    const checkConfirmID = (result) => {
        setMessage(result.text);
    }

    return <div style={{width:'100%', textAlign:'center'}}>
        <QRCodeScanner success={checkConfirmID} />
        <div>{message}</div>
    </div>
}