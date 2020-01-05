import React, {useState, useContext} from 'react';
import {Input, Button} from 'reactstrap';

import {ConfirmationContext} from '../../context/confirmation';

export function CondFilterHeader({desc, column, conds}){

  const {addFilter} = useContext(ConfirmationContext);

  const [isEditing, setEditing] = useState(false);
  const [option, setOption] = useState('0');

  const setFilter = (option) => {
    setEditing(false);
    addFilter({
      key:column,
      func: option === '0' ? () => true : conds[option].func
    })
  }

  return isEditing
  ? <div>
      <Input type='select' value={option} onChange={(e) => setOption(e.target.value)} >
        <option value='0'>无</option>
        {Object.entries(conds).map(([key, {desc}]) => <option key={key} value={key}>{desc}</option>)}
      </Input>
      <Button onClick={() => setFilter(option)}>确定</Button>
    </div>
  : <div> {desc} <Button onClick={() => setEditing(true)}>筛选</Button> </div>

}

export function StatusFilter(){
  let desc = '函证状态管理',
      column = 'confirm_status',
      conds = {
        not_sent: {
          desc: '未发出',
          func: ({confirm_status}) => {
            const {resended, send_package_id} = confirm_status;
            return send_package_id === undefined && resended === undefined;
          }
        },
        not_resend: {
          desc: '重发函未发出',
          func: ({confirm_status}) => {
            const {resended, send_package_id} = confirm_status;
            return send_package_id === undefined && resended !== undefined;
          }
        },
        not_recv: {
          desc: '未收到回函',
          func: ({confirm_status}) => {
            const {send_package_id, recv_package_id} = confirm_status;
            return send_package_id !== undefined && recv_package_id === undefined}
        },
        not_confirm: {
          desc: '已收到/未确认回函',
          func: ({confirm_status}) => {
            const {recv_package_id} = confirm_status;
            return recv_package_id !== undefined;
          }
        },
        confirmed: {
          desc: '已确认相符的回函',
          func: ({confirm_status}) => {
            const {confirm_done} = confirm_status;
            return confirm_done;
          }
        },
        adjusted: {
          desc: '金额不符并经调节的回函',
          func: ({confirm_status}) => {
            const {adjusted_amount} = confirm_status;
            return adjusted_amount !== undefined;
          }
        },
        substituted: {
          desc: '已进入替代测试的回函',
          func: ({confirm_status}) => {
            const {substitute_test_id} = confirm_status;
            return substitute_test_id !== undefined;
          }
        }
      }
  return <CondFilterHeader {...{desc, column, conds}} />
}

export function FilterableHeader({desc, column, options}){

  const {addFilter} = useContext(ConfirmationContext);

  const [isEditing, setEditing] = useState(false);
  const [text, setText] = useState('');

  const setFilter = (text) => {
    setEditing(false);
    if (text.startsWith(':')){
      const [keyOption, pattern] = text.split(' ');
      const option = keyOption.slice(1);

      const func = (entry) => {

        let data = entry[column];

        if(typeof data === 'string')
          return data.includes(pattern);
        else if(options !== undefined && data[options[option]] !== undefined){
          return data[options[option]].toString().includes(pattern);
        } else {
          return Object.values(data).some(datum => datum.toString().includes(pattern));
        }
      }
      addFilter({key:column, func});
    } else if (text === undefined || text === null || text.length === 0){
      addFilter({key:column, func:() => true})
    } else {
      const func = (entry) => {
        
        let data = entry[column];

        if(typeof data === 'string')
          return data.includes(text);
        else {
          console.log(data, text);
          return Object.values(data).some(datum => datum.toString().includes(text));
        }
      }
      addFilter({key:column, func});
    }
  }

  return isEditing
  ? <div>
      <Input placeholder="输入查询内容" value={text} onChange={(e) => setText(e.target.value)} />
      <Button onClick={() => setFilter(text)}>确定</Button>
    </div>
  : <div> {desc} <Button onClick={() => setEditing(true)}>筛选</Button> </div>
}

export function IndexFilter(){

  let desc = '询证函索引',
      column = 'confirm_id';

  return <FilterableHeader {...{desc, column}} />
}

export function NotesFilter(){

  let desc = '备注',
      column = 'notes';

  return <FilterableHeader {...{desc, column}} />
}

export function AddressFilter(){

  let desc = '被函证单位信息',
      column = 'confirmee_info',
      options= {
        '公司' : 'name',
        '地址' : 'address',
        '联系人': 'contact',
        '电话': 'phone'
      };

  return <FilterableHeader {...{desc, column, options}} />

}