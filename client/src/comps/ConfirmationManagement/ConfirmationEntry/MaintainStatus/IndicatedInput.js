import React, {useState} from 'react';
import {Input, Button} from 'reactstrap';

const indicatorStyle = {
  fontFamily: '"Arial Narrow", "Avenir Next Condensed"',
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

export default function IndicatedInput ({initValue, placeholder, submitMethod, width='4'}) {

  const [inputValue, setInputValue] = useState(initValue);

  const inputGroup = <div style={{display:'flex'}}>
    <Input
      placeholder={placeholder}
      className={`col-md-${width}`}
      value={inputValue ? inputValue : ''}
      onChange={(e) => setInputValue(e.target.value)}
    />
    <Button disabled={!inputValue} style={{marginLeft:'5px'}} color='primary' onClick={() => submitMethod(inputValue)}>确定</Button>
  </div>

  const indicator = <div
    style={indicatorStyle}
    className={`col-md-${width}`}
    >{placeholder}：<b>{initValue}</b>
  </div>

  return initValue === undefined
  ? inputGroup
  : indicator
}