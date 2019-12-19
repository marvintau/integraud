var express = require('express');
var router = express.Router();

var {createUser, listAllUsers} =  require('../database');
// import bcrypt from 'bcrypt';

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }
  
router.get('/list_user', (req, res) => {
    sleep(100).then(() => {
        return listAllUsers();
    }).then((result) => {
        res.json(result);
    })
})

router.get('/remove_user', (req, res) => {
    sleep(100).then(() => {
        let {user} = req.body;
        return removeUser(user);
    }).then(() => {
        res.json({status: 'ok'});
    }).catch((err) => {
        res.json({status: 'error', err});
    })
})

router.post('/create_user', (req, res) => {

    console.log(req.body);

    sleep(100).then(() => {
        let {user, pass, nick} = req.body;
        return createUser(user, pass, nick);
    })
    .then((doc) => {
        let {user_name, nickname} = doc;
        res.json({status: 'ok', user:user_name, nick: nickname})
    })
    .catch((err) => {
        if(err.errorType === 'uniqueViolated'){
            res.json({status: 'error', reason: 'EXISTS'})
        }
    })
})

module.exports = router;