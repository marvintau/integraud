import React, {useState, useContext} from 'react';
import {Button} from 'reactstrap';
import QRCodeScanner from './QRCodeScanner';

import {post} from '../context/fetch';

function ConfirmInfo({confirmInfo}){
    const {project_name, confirm_id, unit_name, confirmee_info} = confirmInfo;
    const {name, address} = confirmee_info;

    const lineStyle={
        marginBottom: '10px'
    }

    return <div style={{margin:'20px'}}>
        <div style={lineStyle}><b>{project_name}</b></div>
        <div style={lineStyle}><b>{unit_name}</b></div>
        <div style={lineStyle}><b>{confirm_id}</b></div>
        <div style={lineStyle}>{name}</div>
        <div style={lineStyle}>{address}</div>
    </div>
}

export default function (props) {
    const [confirmInfo, setConfirmInfo] = useState(undefined);
    const [scanType, setScanType] = useState('NONE');
    const [message, setMessage] = useState('');

    const reset = () => {
        setConfirmInfo(undefined);
        setScanType('NONE');
    }

    if(confirmInfo !== undefined && scanType === 'NONE'){
        return <div>
            <ConfirmInfo {...{confirmInfo}} />
            <div style={{margin:'20px'}}>
                <Button color="primary" onClick={() => setScanType('SEND')}>扫描发函快递单号</Button>
            </div>
            {confirmInfo.confirm_status.send_package_id && <div style={{margin:'20px'}}>
                <Button color="info" onClick={() => setScanType('RECV')}>扫描回函快递单号</Button>
            </div>}
            <div style={{margin:'20px'}}>
                <Button color="warning" onClick={reset}>返回</Button>
            </div>
        </div>
    } else
    
    if (confirmInfo !== undefined && scanType !== 'NONE') {

        console.log(scanType, 'scanType')

        const {confirm_id} = confirmInfo;

        const updateTrackNumber = (scanResult) => {
            const confirm_attr = {
                'SEND' : 'confirm_status.send_package_id',
                'RECV' : 'confirm_status.recv_package_id'
            }[scanType];

            console.log(scanResult, '扫描结果');

            post('/api/confirmation/modify', {confirm_id, field:confirm_attr, value:scanResult.text})
            .then(({result, reason}) => {
                if (result === 'ok'){
                    setMessage('已更新函证状态，请回到页面进行后续管理');
                } else {
                    setMessage(reason);
                }
            })
        }
        
        return <div style={{width:'100%', textAlign:'center'}}>
            <QRCodeScanner success={updateTrackNumber} buttonName={'扫描条形码'}/>
            <Button onClick={reset}>返回</Button>
            <div>{message}</div>
        </div>
    }
    
    if (confirmInfo === undefined){

        const checkConfirmID = (result) => {
            const [project, confirm_id] = result.text.split('<|<|>|>');
            post('/api/confirmation/get', {project, confirm_id})
            .then(({result, reason}) => {
                if (result !== 'error'){
                    if (result.length != 1){
                        setMessage('查找文档出现错误');
                    } else {
                        setConfirmInfo(result[0]);
                    }
                } else {
                    setMessage(reason);
                }
            })        
        }

        return <div style={{width:'100%', textAlign:'center'}}>
            <QRCodeScanner success={checkConfirmID} buttonName={'扫描函证二维码'}/>
            <div>{message}</div>
        </div>

    }
}