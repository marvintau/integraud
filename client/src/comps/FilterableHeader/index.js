import React, {useState, useContext} from 'react';
import {Input, Button} from 'reactstrap';

import {ConfirmationContext} from '../../context/confirmation';

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
  : <div> {desc} <Button onClick={() => setEditing(true)}>编辑</Button> </div>
}

export function IndexFilter(){

  let desc = '询证函索引',
      column = 'confirm_id';

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