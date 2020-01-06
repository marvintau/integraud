import React, {useState, useEffect, useContext} from 'react';
import {Button} from 'reactstrap';

export default function Notes({hovered, notes='', project, confirm_id, modify}){
    const [isEditing, setEditing] = useState(false);
    const [text, setText] = useState(notes);

    useEffect(() => {
        setText(notes);
    },[notes])

    const view = <div>
        <div style={{margin: '3px'}}>{text}</div>
        {hovered && <Button size="sm" color="primary" style={{margin: '3px'}} onClick={()=>setEditing(true)}>编辑备注</Button>}
    </div>

    const saveNotes = () => {
        setEditing(false);
        setText(text);
        setText(text);
        console.log(text, notes, 'save')
        modify(project, confirm_id, 'notes', text);
    }

    const edit = <div>
        <input className="form-control" style={{margin:'3px'}} value={text} onChange={(e) => setText(e.target.value)} />
        <Button size="sm" color="primary" style={{margin: '3px'}} onClick={()=>saveNotes()}>保存</Button>
    </div>

    return isEditing ? edit : view;
}
