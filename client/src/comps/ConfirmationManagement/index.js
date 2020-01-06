import React, {useState, useEffect, useContext} from 'react';
import {Col, Button, Spinner} from 'reactstrap';
import {Link} from 'react-router-dom';

import {FixedSizeList as List} from 'react-window';

import ConfirmationEntry from './ConfirmationEntry';

import {IndexFilter, AddressFilter, StatusFilter, NotesFilter} from './FilterableHeader';

import {ConfirmationContext} from '../../context/confirmation';
import {SelectedProjectContext} from '../../context/selectedProject'
import {AuthContext} from '../../context/auth';

import '../../file-input.css';
import '../../scroll-bar.css';

function FileSelect({upload}){
    const {project} = useContext(SelectedProjectContext);
    let [file, setFile] = useState(undefined);
    
    const updateFile = (e) => {
        setFile(e.target.files[0]);
    }

    return <div style={{display:'flex', width:'100%', alignItems:'center'}}>
        <input className='file-input col-md-6' type="file" id="choose-backup-file" onChange={updateFile} />
        {file && <Button style={{marginLeft:'10px'}} onClick={()=>upload(file, project)}>上传</Button>}
    </div>

}

function ConfirmationItemCreate(){

    const {msg, uploadSheet} = useContext(ConfirmationContext);

    return <div style={{display:'flex', margin:'5px', alignItems:'center'}}>
        <div className="col-md-2" style={{marginRight:'15px'}}><div>上传被函证单位的名录</div></div>
        <div className="col-md-8"><FileSelect {...{upload:uploadSheet}}/></div>
        <div >{msg ?? <span>{msg}</span>}</div>
    </div>
}

function UploadTemplate(){

    const {msg, UploadTemplate} = useContext(ConfirmationContext);

    return <div style={{display:'flex', margin:'5px', alignItems:'center'}}>
        <div className="col-md-2" style={{marginRight:'15px'}}><div>上传函证模版</div></div>
        <div className="col-md-8"><FileSelect {...{upload:UploadTemplate}}/></div>
        <div >{msg ?? <span>{msg}</span>}</div>
    </div>
}


export default function(){
    
    const {user, role} = useContext(AuthContext);
    const {project, members} = useContext(SelectedProjectContext);
    const {status, list:confirmationListData, getList} = useContext(ConfirmationContext);

    useEffect(() => {
        (async () => {
            await getList(project)
        })();
    }, [])

    const confirmationItemCreate = (['supreme', 'governer'].includes(role) || (members[user] && members[user] === 'manager'))
    ? <ConfirmationItemCreate />
    : undefined;

    const confirmationListHeader = <div style={{display:'flex', background:'#343a40', color:'#FFF', alignItems:'center'}}>
        <div style={{padding:'15px'}} className="col-md-2"><IndexFilter /></div>
        <div style={{padding:'15px'}} className="col-md-2"><AddressFilter /></div>
        <div style={{padding:'15px'}} className="col-md-2">函证金额</div>
        <div style={{padding:'15px'}} className="col-md-4"><StatusFilter /></div>
        <div style={{padding:'15px'}} className="col-md-2"><NotesFilter /></div>
    </div>

    let confirmationListElem;
    if(status !== 'ready'){
        confirmationListElem = <div style={{height:'580px', backgroundColor:'rgba(0, 0, 0, 0.1)'}}>
            <Spinner color="primary" size="xs" style={{margin:'10px'}} />
        </div>;
    } else {

        let confirmationList = confirmationListData;

        confirmationListElem = 
            <List
                style= {{borderTop: '1px solid black', borderBottom:'1px solid black'}}
                className="sleek-bar"
                height={580}
                itemCount={confirmationList.length}
                itemData={confirmationList}
                itemSize={150}
                itemKey={(index, data) => data[index].confirm_id}
                width={'100%'}
            >
                {ConfirmationEntry}
            </List>
    }

    const uploadTemplate = (['supreme', 'governer'].includes(role) || (members[user] && members[user] === 'manager'))
    ? <UploadTemplate />
    : undefined;

    return <Col>
        {confirmationItemCreate}
        {confirmationListHeader}
        {confirmationListElem}
        {uploadTemplate}
        <Link to={`/project/${project}`}><Button color="primary" style={{margin: '10px'}}>返回</Button></Link>
    </Col>
    
}