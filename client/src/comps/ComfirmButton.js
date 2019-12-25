import React, {useState} from 'react';
import {Button} from 'reactstrap';

export function ConfirmButton({hovered, name, action}){
    const [state, setState] = useState('ready');

    return !hovered
    ? []
    : state === 'ready'
    ? <Button color='warning' style={{width:'100%'}} onClick={() => setState('pending')}>{name}</Button>
    : <div style={{width:"100%", display:'flex', justifyContent:'space-between'}}>
        <Button color='danger' onClick={() => {
            action()
            setState('done')
        }}>确定</Button>
        <Button color='info' onClick={() => setState('ready')}>算了</Button>
      </div>
}