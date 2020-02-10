import React, {useContext, useState, useEffect, createRef} from 'react';
import {AuthContext} from '../context/auth';
import {Navbar, Nav, Button} from 'reactstrap';
import ReactTooltip from 'react-tooltip'

import {useHistory, useLocation} from 'react-router-dom';

import * as QRCode from 'easyqrcodejs';

function LogButton({type}){
  console.log(type, 'LogButton')
  const history = useHistory();
  const {logout} = useContext(AuthContext);

  const handleClick = () => {
    history.push(type === 'login' ? '/login' : '/');
    console.log('going to ', type)
    if (type === 'logout'){
      (async () => {
        logout()
      })();
    }
  }

  let text = type === 'login' ? '登录' : '登出'

  return <Button color="info" onClick={handleClick}>{text}</Button>
}

export default () => {

  const qrcode = createRef();

  const {user, role, nick} = useContext(AuthContext);

  const [isMobile, setMobile] = useState(false);

  useEffect(() => {
    if(user){
      console.log('acruallly runned')
      new QRCode(qrcode.current, {
        text: `https://www.stewardship.tech:3000/confirmation-mobile`,
        width: 256,
        height: 256,
      });
    }
  }, [user])

  const location = useLocation();
  useEffect(() => {
    console.log(location);
    if(location.pathname.includes('confirmation-mobile')){
      console.log('mobile1');
      setMobile(true);
    }
  }, [location])

  const roleName = {
    supreme: '最高管理员',
    governer: '超级管理员',
    manager:'项目管理员',
    normal:'一般用户'
  }[role]

  const type = user ? 'logout' : 'login';

  const navbar =  <Navbar color="light" light expand="md">
    <div> {user === null ? '' : `您好, ${nick}(${roleName})`}</div>
    {user && <Nav id="show-qr-code" className="ml-auto">
      <Button data-tip data-for="qrcode-toggle" color="info">显示手机登录二维码</Button>
      <ReactTooltip id='qrcode-toggle' effect="solid" type='light' place='bottom'>
        <div ref={qrcode}></div>
      </ReactTooltip>
    </Nav>}
    <Nav className="ml-auto">
      <LogButton type={type} />
    </Nav>
  </Navbar>

  return isMobile ? <div></div> : navbar;
}