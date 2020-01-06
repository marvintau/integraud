import React, {useState} from 'react';
import {Button, Input} from 'reactstrap';

import IndicatedInput from './IndicatedInput';
import ResendButton from './ResendButton';
import AdjustConfirmationControl from './AdjustConfirmationControl';

function RecvPackageGroup({project, confirm_id, recv_package_id, modify}) {

    const props = {
        width: 8,
        initValue:recv_package_id,
        placeholder: '回函快递单号',
        submitMethod: (packageID) => {
            modify(project, confirm_id, 'confirm_status.recv_package_id', packageID);
        }
    }
  
    return <IndicatedInput {...props} />
}
  
function SubstituteGroup({project, confirm_id, substitute_test_id, modify}) {

    const props = {
        width: 8,
        initValue:substitute_test_id,
        placeholder: '替代测试序号',
        submitMethod: (packageID) => {
            modify(project, confirm_id, 'confirm_status.substitute_test_id', packageID);
        }
    }

    return <IndicatedInput {...props} />
}
  
export default function ReceivePackageControl({project, confirm_id, confirm_status, modify}){

    const [recvOption, setRecvOptions] = useState('0');

    const {recv_package_id, substitute_test_id} = confirm_status;
    
    const substituteGroup = <SubstituteGroup {...{project, confirm_id, substitute_test_id, modify}} />;
    const receivePackageGroup = <RecvPackageGroup {...{project, confirm_id, recv_package_id, modify}} />;
    const resendButton = <ResendButton {...{project, confirm_id, modify}}/>;

    const recvStatusControl = {
        '0': receivePackageGroup,
        '1': resendButton,
        '2': substituteGroup
    };

    return substitute_test_id
        ? <div style={{marginTop:'3px'}}>{substituteGroup}</div>
        : recv_package_id
        ? <div style={{marginTop:'3px'}}>
            {receivePackageGroup}
            <AdjustConfirmationControl {...{project, confirm_id, confirm_status, modify}} />
        </div>
        : <div style={{display:'flex', width:'100%', marginTop:'3px'}}>
            <Input className="col-md-3" type="select" value={recvOption} onChange={(e) => setRecvOptions(e.target.value)}>
                <option value='0'>收到回函</option>
                <option value='1'>重新发函</option>
                <option value='2'>替代测试</option>
            </Input>
            <div className="col-md-8">
            {recvStatusControl[recvOption]}
            </div>
        </div>
}
