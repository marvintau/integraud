import React, {useState, useContext} from 'react';
import {Input, Button} from 'reactstrap';

import {ConfirmationContext} from '../../context/confirmation';

const indicatorStyle = {
  display: 'inline-block',
  color: '#212529',
  verticalAlign: 'middle',
  userSelect: 'none',
  backgroundColor: 'transparent',
  border: '1px solid gray',
  borderRadius: '.25rem',
  padding: '.375rem .75rem',
  fontSize: '1rem',
  lineHeight: '1.5',
}

function IndicatedInput ({initValue, placeholder, submitMethod, width='4'}) {

  console.log(initValue, 'indicate');

  const [inputValue, setInputValue] = useState(initValue);

  const inputGroup = <div style={{display:'flex'}}>
    <Input
      placeholder={placeholder}
      className={`col-md-${width}`}
      value={inputValue ? inputValue : ''}
      onChange={(e) => setInputValue(e.target.value)}
    />
    <Button style={{marginLeft:'5px'}} color='primary' onClick={() => submitMethod(inputValue)}>确定</Button>
  </div>

  const indicator = <div
    style={indicatorStyle}
    className="col-md-6"
    >{placeholder}：<b>{initValue}</b>
  </div>

  return initValue === undefined
  ? inputGroup
  : indicator
}


function ConfirmationButton({placeholder, submitMethod, width}){
  return <Button className={`col-md-${width}`} onClick={submitMethod}>
    {placeholder}
  </Button>
}

export function ResendConfirmButton({reason, width}){

  const props = {
    placeholder: '确定重新发函',
    submitMethod:() => {},
    width
  }

  return <ConfirmationButton {...props}/>
}

export function ConfirmationDoneButton({reason, width}){

  const props = {
    placeholder: '确定回函金额相符',
    submitMethod:() => {},
    width
  }

  return <ConfirmationButton {...props}/>
}

export function AdjustAmountGroup({project, confirm_id, send_package_id}) {

  const {modify} = useContext(ConfirmationContext);

  const props = {
      width: 6,
      initValue:send_package_id,
      placeholder: '调整后金额',
      submitMethod: (adjustedAmount) => {
          modify(project, confirm_id, 'confirm_status.adjusted_amount', adjustedAmount);
      }
  }

  console.log(props);

  return <IndicatedInput {...props} />
}


export function SendPackageGroup({project, confirm_id, send_package_id}) {

  const {modify} = useContext(ConfirmationContext);

  const props = {
      width: 6,
      initValue:send_package_id,
      placeholder: '发函快递单号',
      submitMethod: (packageID) => {
          modify(project, confirm_id, 'confirm_status.send_package_id', packageID);
      }
  }

  console.log(props);

  return <IndicatedInput {...props} />
}

export function RecvPackageGroup({project, confirm_id, recv_package_id}) {

  const {modify} = useContext(ConfirmationContext);

  const props = {
      width: 6,
      initValue:recv_package_id,
      placeholder: '回函快递单号',
      submitMethod: (packageID) => {
          modify(project, confirm_id, 'confirm_status.send_package_id', packageID);
      }
  }

  return <IndicatedInput {...props} />
}

export function SubstituteGroup({project, confirm_id, substitute_test_id}) {

  const {modify} = useContext(ConfirmationContext);

  const props = {
      width: 6,
      initValue:substitute_test_id,
      placeholder: '替代测试序号',
      submitMethod: (packageID) => {
          modify(project, confirm_id, 'confirm_status.substitute_test_id', packageID);
      }
  }

  return <IndicatedInput {...props} />

}

