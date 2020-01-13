import React from 'react';

export default function ConfirmedAmount({data={}}){
    const {contents, reason} = data;

    const subjects = Object.keys(contents).map((subject, i) => {
        return <div key={i} style={{overflowWrap:'normal', whiteSpace:'nowrap'}}>{subject}</div>
    })


    const amountStyle = {
        textAlign:'right',
        marginLeft:'5px',
        fontFamily:'Arial Narrow',
        fontWeight:'bold'
    }

    const amounts = Object.values(contents).map((value, i) => {
        let amount;
        if (value.amount !== undefined){
            amount = value.amount;
        } else if (isNaN(Number(value))){
            amount = value;
        } else {
            amount = Number(value).toLocaleString('en-us', {maximumFractionDigits:2, minimumFractionDigits:2});
        }
        return  <div key={i} style={amountStyle} >
            {amount}
        </div>
    })

    const style = {
        margin:'10px 0px',
        overflowY:'hidden',
        display:'flex',
        justifyContent:"space-between"
    }

    return <div style={style}>
        <div style={{overflowX:'scroll'}}  className="sleek-bar">{subjects}</div>
        <div>{amounts}</div>
    </div>
}
