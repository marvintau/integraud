import React from 'react';
import {Button} from 'reactstrap';

export default function ResendButton({project, confirm_id, reason, width, modify}){

    const submitMethod = () => {
        console.log('resend', confirm_id);
        modify(project, confirm_id, 'confirm_status', {resended: true});
    }

    return <Button className={`col-md-${width}`} color='warning' onClick={submitMethod}>
        {'确定重新发函'}
    </Button>
}
