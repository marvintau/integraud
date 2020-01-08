import React, {useContext} from 'react';
import {FixedSizeList as List} from 'react-window';
import {Spinner, Button} from 'reactstrap';

import {ConfirmationContext} from '../../context/confirmation';

import FileSelect from './FileSelect';
import ConfirmationEntry from './ConfirmationEntry';
import {IndexFilter, AddressFilter, StatusFilter, NotesFilter} from './FilterableHeader';

function UploadTable({project}){

    const {msg, uploadSheet, generateDocs} = useContext(ConfirmationContext);

    return <div style={{display:'flex', margin:'5px', alignItems:'center'}}>
        <div className="col-md-2" style={{marginRight:'15px'}}><div>上传被函证单位的名录</div></div>
        <div className="col-md-6"><FileSelect {...{upload:uploadSheet, form:{project}}}/></div>
        <div className="col-md-2"><a href="template/xlsx/ConfirmSummaryTemplate.xlsx" download>下载一个示例</a></div>
        <div className="col-md-2"><Button color="primary" onClick={() => generateDocs(project)}>生成确认函文档</Button></div>
        <div >{msg ?? <span>{msg}</span>}</div>
    </div>
}

export default function({project, status, data, user, role, members}){

    const uploadTable = (['supreme', 'governer'].includes(role) || (members[user] && members[user] === 'manager'))
    ? <UploadTable {...{project}} />
    : undefined;
    
    const head = <div style={{display:'flex', background:'#343a40', color:'#FFF', alignItems:'center'}}>
        <div style={{padding:'15px'}} className="col-md-4"><AddressFilter /></div>
        <div style={{padding:'15px'}} className="col-md-2">函证金额</div>
        <div style={{padding:'15px'}} className="col-md-4"><StatusFilter /></div>
        <div style={{padding:'15px'}} className="col-md-2"><NotesFilter /></div>
    </div>
    
    let body;
    if(status !== 'ready'){
        body = <div style={{height:'580px', backgroundColor:'rgba(0, 0, 0, 0.1)'}}>
            <Spinner color="primary" size="xs" style={{margin:'10px'}} />
        </div>;
    } else {
        
        body = 
            <List
                style= {{borderTop: '1px solid black', borderBottom:'1px solid black'}}
                className="sleek-bar"
                height={580}
                itemCount={data.length}
                itemData={data}
                itemSize={150}
                itemKey={(index, data) => data[index].confirm_id}
                width={'100%'}
            >
                {ConfirmationEntry}
            </List>
    }

    return <div>
        {uploadTable}
        {head}
        {body}
    </div>
}
