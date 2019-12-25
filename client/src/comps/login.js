import React, {useState, useContext} from 'react';
import {Col, FormGroup, Form, Input, Label, Button} from 'reactstrap';
import {Route, Link} from 'react-router-dom';

import {AuthContext} from '../hooks/auth';

function useValid(validDict, msgDict){
    const [isValid, setValid] = useState(false);
    const [msg, setMsg] = useState('');

    const validInput = (input) => {
        for (let key in validDict) if (validDict[key](input)) {
            setValid(false);
            setMsg(msgDict[key]);
            return;
        }

        setValid(true);
        setMsg('');
    }

    return [isValid, msg, validInput];
}

function useValidInput(labelName, id, validDict, msgDict){
    const [content, setContent] = useState('');
    const [isValid, msg, validInput] = useValid(validDict, msgDict);

    const element = <FormGroup className={isValid ? ' has-error' : ''}>
        <Label for={id}>{labelName}</Label>
        <Input type="text" name={id} value={content} onChange={(e) => {
            setContent(e.target.value)
            validInput(e.target.value)
        }} />
        <div className="help-block">{msg}</div>
    </FormGroup>

    return {isValid, content, element};
}

function useUsername(){

    const msgDict = {
        'EMPTY' : '用户名为必填项',
        'LESS'  : '用户名应多于5个字母',
        'CHAR'  : '用户名应为大小写英文字母、数字及“.”、“_”符号的组合'
    }

    const validDict = {
        'EMPTY' : (username) => username.length === 0,
        'LESS'  : (username) => username.length < 5,
        'CHAR'  : (username) => !username.match(/^[\.\-_a-zA-Z0-9]+$/)
    }

    return useValidInput('用户名', 'username', validDict, msgDict);
}


function usePassword(){

    const msgDict = {
        'EMPTY' : '密码为必填项',
        'LESS'  : '密码应不少于8个字符',
        'CHAR'  : '密码应为大小写英文字母、数字及“.”、“_”符号的组合'
    }

    const validDict = {
        'EMPTY' : (password) => password.length === 0,
        'LESS'  : (password) => password.length < 8,
        'CHAR'  : (password) => password.match(/^[A-Za-z\d@$!%*#?&]+$/)
    }
    
    return useValidInput('密码', 'password', validDict, msgDict);
}

function usePassTwice(first){

    const msgDict = {
        'INCONSIS' : '两次密码不一致',
    }

    const validDict = {
        'INCONSIS' : (password) => password !== first,
    }

    return useValidInput('再次输入密码', 'password', validDict, msgDict);
}

function useNickname(){
    const msgDict = {
        'EMPTY': '昵称不能为空',
        'NOTHAN' : '昵称只能是中文',
    }

    const validDict = {
        'EMPTY' : (e) =>e.length === 0,
        'NOTHAN' : (nick) => !nick.match(/^\p{Script=Hani}+$/u)
    }

    return useValidInput('昵称', 'nickname', validDict, msgDict);
}

function Register(){

    const {isValid:usernameValid, content:user, element:usernameElement} = useUsername();
    const {isValid:passwordValid, content:pass, element:passwordElement} = usePassword();
    const {isValid:passTwiceValid, element:passTwiceElement} = usePassTwice(pass);
    const {isValid:nickValid, element:nickElement} = useNickname();

    const button = <Button color="primary">注册</Button>;

    const retButton = <Link to='/user-management'><Button outline color="info">算了</Button></Link>;

    return <>
        <h2 style={{margin: '50px 0px'}} >注册</h2>
        <Form onSubmit={() => {}}>
            {usernameElement}
            {passwordElement}
            {passTwiceElement}
            {nickElement}
            
            <FormGroup>
                {(usernameValid && passwordValid && passTwiceValid && nickValid) ? button : undefined}
                {retButton}
                <Link to='/login'><Button color="warning">去登录</Button></Link>
            </FormGroup>
        </Form>
    </>

}

function Login(props){

    const {role, status, msg, login} = useContext(AuthContext);

    const {isValid:usernameValid, content:user, element:usernameElement} = useUsername();
    const {isValid:passwordValid, content:pass, element:passwordElement} = usePassword();

    const button = <Button onClick={() => {
        login(user, pass);
        console.log(user, role);
        props.history.push("/");
    }} color="primary">登录</Button>;

    const retButton = <Link to='/'><Button outline color="info">算了</Button></Link>;

    return <>
        <h2 style={{margin: '50px 0px'}} >登录</h2>
        <Form onSubmit={() => {}}>
            {usernameElement}
            {passwordElement}
            <FormGroup>
                {(usernameValid && passwordValid) ? button : undefined}
                {retButton}
                <Link to='/register'><Button color="warning">去注册</Button></Link>
            </FormGroup>
        </Form>
        <div>{status} {msg}</div>
    </>

}


export default function (props) {

    return <Col md={{size: 4, offset:4}}>
        <Route path="/login"><Login {...props} /></Route>
        <Route path="/register"><Register {...props} /></Route>
    </Col>
}