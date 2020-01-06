import React from 'react';

export default function ConfirmedAmount({data={}}){
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
