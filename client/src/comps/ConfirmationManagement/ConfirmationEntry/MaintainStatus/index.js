import React from 'react';
import {Badge} from 'reactstrap';

import IndicatedInput from './IndicatedInput';
import ReceivePackageControl from './ReceivePackageControl';

function SendPackageGroup({project, confirm_id, send_package_id, resended, modify}) {
  
    const props = {
        width: 8,
        initValue:send_package_id,
        placeholder: '发函快递单号',
        submitMethod: (packageID) => {
          modify(project, confirm_id, 'confirm_status.send_package_id', packageID);
        }
    }
  
    return <div>
      {resended && <Badge style={{margin: '3px'}} color='warning'>二次发函</Badge>}
      <IndicatedInput {...props} />
    </div>
}
    

export default function MaintainStatus({project, confirm_id, confirm_status={}, modify}){

    const {resended, send_package_id} = confirm_status;

    return <div className="sleek-bar" style={{height:'150px', overflowY:'scroll'}}><div style={{margin:'10px'}}>
        <SendPackageGroup {...{project, confirm_id, send_package_id, resended, modify}} />
        {send_package_id && <ReceivePackageControl {...{project, confirm_id, confirm_status, modify}} />}
    </div></div>
}
