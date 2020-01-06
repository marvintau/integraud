import React, {useState, useContext, useCallback} from 'react';

import Address from './Address';
import ConfirmedAmount from './ConfirmedAmount';
import MaintainStatus from './MaintainStatus';
import Notes from './Notes';

import {ConfirmationContext} from '../../../context/confirmation';

export default function ConfirmationRow({index, data, style}){

    const [hovered, setHovered] = useState(false);
    const {modify} = useContext(ConfirmationContext);

    const {confirm_id, confirmee_info, confirmed_amount, confirm_status, notes, history} = data[index];

    const project = data[index].project_name;

    const rowStyle = {
        display:"flex",
        background: index % 2 ?'#E8E8E8': "#FFFFFF"
    }

    return <div style={{...rowStyle, ...style}}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
    >
        <div className="col-md-2">{confirm_id}</div>
        <div className="col-md-2"><Address {...{data:confirmee_info}}/></div>
        <div className="col-md-2"><ConfirmedAmount {...{data:confirmed_amount}}/></div>
        <div className="col-md-4"><MaintainStatus {...{hovered, project, confirm_id, confirm_status, modify}} /></div>
        <div className="col-md-2"><Notes {...{hovered, project, confirm_id, notes, modify}} /></div>
    </div>
}
