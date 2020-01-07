import React, {useState} from 'react';
import {Button} from 'reactstrap';

import './file-input.css';

export default function FileSelect({upload, form}){

    let [file, setFile] = useState(undefined);
    
    const updateFile = (e) => {
        setFile(e.target.files[0]);
    }

    return <div style={{display:'flex', width:'100%', alignItems:'center'}}>
        <input className='file-input col-md-6' type="file" id="choose-backup-file" onChange={updateFile} />
        {file && <Button style={{marginLeft:'10px'}} onClick={()=>upload(file, form)}>上传</Button>}
    </div>
}
