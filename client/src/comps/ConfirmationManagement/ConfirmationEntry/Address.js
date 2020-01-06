import React from 'react';

export default function Address({data={}}){

    const {name, address, contact, phone} = data;

    const lineStyle = {
        whiteSpace:'nowrap',
        margin: '3px'
    }

    return <div style={{overflowY:'hidden', overflowWrap:'normal'}} className="sleek-bar">
        <div style={lineStyle}><b>{name}</b></div>
        <div style={lineStyle}>{address}</div>
        <div style={{display:'flex',...lineStyle}}>
            <div>{contact}</div>
            <div style={{marginLeft:'5px'}} >{phone}</div>
        </div>
    </div>
}
