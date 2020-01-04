import React, {useState, useEffect, useContext} from 'react';
import {Col, Button, Input, Table, Spinner} from 'reactstrap';
import {Link} from 'react-router-dom';

import {FixedSizeList as List} from 'react-window';

import {SendPackageGroup, RecvPackageGroup, SubstituteGroup} from './IndicatedInput';

import {ConfirmationContext} from '../context/confirmation';
import {SelectedProjectContext} from '../context/selectedProject'
import {AuthContext} from '../context/auth';

import '../file-input.css';
import { ProjectContext } from '../context/projects';


function Address({data={}}){

    const {name, address, contact, phone} = data;

    const lineStyle = {
        whiteSpace:'nowrap',
        margin: '3px'
    }

    return <div style={{overflowY:'hidden', overflowWrap:'normal'}}>
        <div style={lineStyle}><b>{name}</b></div>
        <div style={lineStyle}>{address}</div>
        <div style={{display:'flex',...lineStyle}}>
            <div>{contact}</div>
            <div style={{marginLeft:'5px'}} >{phone}</div>
        </div>
    </div>
}

function ConfirmedAmount({data={}}){
    const {subject, amount=0, reason} = data;

    const lineStyle = {
        overflowY:'hidden',
        overflowWrap:"normal",
        whiteSpace:'nowrap',
        margin: '3px'
    }

    const displayedAmount = Number(amount).toLocaleString('en-us', {maximumFractionDigits:2, minimumFractionDigits:2})

    return <div>
        <div style={{display:'flex', justifyContent:"space-between",...lineStyle}}>
            <div>{subject}</div>
            <div style={{marginLeft:'5px', fontFamily:'Arial Narrow', fontWeight:'bold'}} >{displayedAmount}</div>
        </div>
    </div>
}

function ReceivePackage({project, confirm_id, confirm_status}){

    const [recvOption, setRecvOptions] = useState('0');

    const {recv_package_id, substitute_test_id} = confirm_status;

    const resendPackage = () => {}

    const substituteGroup = <SubstituteGroup {...{project, confirm_id, substitute_test_id}} />;
    const receivePackageGroup = <RecvPackageGroup {...{project, confirm_id, recv_package_id}} />;
    const resendButton = <Button style={{marginLeft:'5px'}} className="col-md-4" onClick={resendPackage}>确定重新发函</Button>;

    const recvStatusControl = {
        '0': receivePackageGroup,
        '1': resendButton,
        '2': substituteGroup
    };

    return substitute_test_id
        ? <div style={{marginTop:'3px'}}>{substituteGroup}</div>
        : recv_package_id
        ? <div style={{marginTop:'3px'}}>{receivePackageGroup}</div>
        : <div style={{display:'flex', width:'100%', marginTop:'3px'}}>
            <Input className="col-md-2" type="select" value={recvOption} onChange={(e) => setRecvOptions(e.target.value)}>
                <option value='0'>收到回函</option>
                <option value='1'>重新发函</option>
                <option value='2'>替代测试</option>
            </Input>
            {recvStatusControl[recvOption]}
        </div>
}

function MaintainConfirmStatus({project, confirm_id, confirm_status={}}){

    const {send_package_id} = confirm_status;

    return <div style={{margin: '4px'}}>
        <SendPackageGroup {...{project, confirm_id, send_package_id}} />
        {send_package_id && <ReceivePackage {...{project, confirm_id, confirm_status}} />}
    </div>
}

function FileSelect({upload}){
    const {project} = useContext(SelectedProjectContext);
    let [file, setFile] = useState(undefined);
    
    const updateFile = (e) => {
        setFile(e.target.files[0]);
    }

    return <div style={{display:'flex', width:'100%', alignItems:'center'}}>
        <div style={{marginRight:'15px'}}>上传被函证单位的名录</div>
        <input className='file-input col-md-6' type="file" id="choose-backup-file" onChange={updateFile} />
        {file && <Button style={{marginLeft:'10px'}} onClick={()=>upload(file, project)}>上传</Button>}
    </div>

}

function ConfirmationItemCreate(){

    const {msg, upload} = useContext(ConfirmationContext);

    return <tr className='d-flex'>
        <th className="col-md-8"><FileSelect upload={upload}/></th>
        <th>{msg ?? <span>{msg}</span>}</th>
    </tr>
}

function ConfirmationRow({index, data, style}){

    const [hovered, setHovered] = useState(false);
    const {project} = useContext(ProjectContext);

    const {confirm_id, confirmee_info, confirmed_amount, confirm_status} = data[index];
    console.log(confirm_status);
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
        <div className="col-md-6"><MaintainConfirmStatus {...{hovered, project, confirm_id, confirm_status}} /></div>
    </div>
}

export default function(){
    
    const {user, role} = useContext(AuthContext);
    const {project, members} = useContext(SelectedProjectContext);
    const {status, list:confirmationListData, listConfirmations} = useContext(ConfirmationContext);

    useEffect(() => {
        (async () => {
            await listConfirmations(project)
        })();
    }, [])

    console.log(project, members, 'has been defined');

    const confirmationItemCreate = (['supreme', 'governer'].includes(role) || (members[user] && members[user] === 'manager'))
    ? <Table><tbody><ConfirmationItemCreate /></tbody></Table>
    : undefined;

    let confirmationListElem;
    if(status !== 'ready'){
        confirmationListElem = <Spinner color="primary" size="xs" style={{margin:'10px'}} />;
    } else {

        let confirmationList = confirmationListData;

        confirmationListElem = <List
            style= {{borderTop: '1px solid black', borderBottom:'1px solid black', margin:'0px 10px'}}
            height={580}
            itemCount={confirmationList.length}
            itemData={confirmationList}
            itemSize={150}
            itemKey={(index, data) => data[index].confirm_id}
            width={'100%'}
        >
            {ConfirmationRow}
        </List>
    }

    return <Col>
        {confirmationItemCreate}
        {confirmationListElem}
        <Link to={`/project/${project}`}><Button color="primary" style={{margin: '10px'}}>返回</Button></Link>
    </Col>
    
}