import React, {useState, useContext} from 'react';
import {Input, Button} from 'reactstrap';

import {ProjectContext} from '../../../context/projects';

export function CondFilterHeader({desc, column, conds}){

  const {addFilter} = useContext(ProjectContext);

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
  : <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
      <div> {desc} </div>
      <Button onClick={() => setEditing(true)}>筛选</Button>
    </div>
}

export function FilterableHeader({desc, column, options}){

  const {addFilter} = useContext(ProjectContext);

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
  : <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
      <div> {desc} </div>
      <Button onClick={() => setEditing(true)}>筛选</Button>
    </div>
}

export function ProjectNameFilter(){

  let desc = '项目名称',
      column = 'project_name';

  return <FilterableHeader {...{desc, column}} />
}
