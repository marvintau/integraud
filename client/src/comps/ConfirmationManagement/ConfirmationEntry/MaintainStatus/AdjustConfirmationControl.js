import React, {useState, useContext} from 'react';
import {Button, Input} from 'reactstrap';

import IndicatedInput from './IndicatedInput';
import ResendButton from './ResendButton';

export function ConfirmationDoneButton({project, confirm_id, reason, width, modify}){

    const submitMethod = () => {
        modify(project, confirm_id, 'confirm_status.confirm_done', true);
    }
  
    return <Button className={`col-md-${width}`} color='success' onClick={submitMethod}>
        {'确定回函金额相符'}
    </Button>
}
  

function AdjustAmountGroup({project, confirm_id, adjusted_amount, modify}) {
  
    const props = {
      width: 8,
      initValue: adjusted_amount,
      placeholder: '回函金额不符-调整后金额',
      submitMethod: (adjustedAmount) => {
        modify(project, confirm_id, 'confirm_status.adjusted_amount', adjustedAmount);
      }
    }
  
    return <IndicatedInput {...props} />
  }
  

export default function AdjustConfirmationControl({project, confirm_id, confirm_status, modify}){

    const [result, setResult] = useState('0');

    const {confirm_done, adjusted_amount, substitute_test_id} = confirm_status;

    if (confirm_done){
        return <div style={{marginTop:'3px'}}>
            <IndicatedInput {...{initValue:'函证程序结束', placeholder:'回函相符', width:8}}/>
        </div>
    } else if (adjusted_amount !== undefined){
        return <div style={{marginTop:'3px'}}>
            <AdjustAmountGroup {...{adjusted_amount}}/>
        </div>
    }

    const adjustConfirmationTypes = {
        '0' : <ConfirmationDoneButton {...{project, confirm_id, modify}}/>,
        '1' : <AdjustAmountGroup {...{project, confirm_id, modify}} />,
        '2' : <ResendButton {...{project, confirm_id, modify}}/>
    }

    return <div style={{display:'flex', width:'100%', marginTop:'3px'}}>
        <Input className="col-md-4" type="select" value={result} onChange={(e) => setResult(e.target.value)}>
            <option value='0'>回函金额相符</option>
            <option value='1'>回函金额不符-调节后一致</option>
            <option value='2'>回函金额不符-须重新发函</option>
        </Input>
        <div className='col-md-8'>
            {adjustConfirmationTypes[result]}
        </div>
    </div> 
}
