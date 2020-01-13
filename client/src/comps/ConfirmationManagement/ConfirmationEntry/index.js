import React, {useState, useContext, useCallback} from 'react';

import Address from './Address';
import ConfirmedAmount from './ConfirmedAmount';
import MaintainStatus from './MaintainStatus';
import Notes from './Notes';

import {ConfirmationContext} from '../../../context/confirmation';

function QRCode ({hovered, qrcode}){
    return hovered
    ? <div style={{margin:'10px'}}><img src={qrcode}/></div>
    : <></>
}

export default function ConfirmationRow({index, data, style}){

    const [hovered, setHovered] = useState(false);
    const {modify} = useContext(ConfirmationContext);

    const {confirm_type, confirm_id, confirmee_info, confirmed_amount, confirm_status, notes, history, qrcode} = data[index];
    const project = data[index].project_name;

    const rowStyle = {
        display:"flex",
        background: hovered ? "#ffc107" : index % 2 ?'#E8E8E8': "#FFFFFF"
    }

    return <div style={{...rowStyle, ...style}}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
    >
        <div className="col-md-1" ><div style={{margin:'10px'}}>{confirm_type}</div></div>
        <div className="col-md-4" ><Address {...{data:confirmee_info}}/></div>
        <div className="col-md-2" ><ConfirmedAmount {...{data:confirmed_amount}}/></div>
        <div className="col-md-4" ><MaintainStatus {...{hovered, project, confirm_id, confirm_status, modify}} /></div>
        <div className="col-md-2" ><Notes {...{hovered, project, confirm_id, notes, modify}} /></div>
        <div style={{width:150}}><QRCode {...{hovered, qrcode}} /></div>
    </div>
}
