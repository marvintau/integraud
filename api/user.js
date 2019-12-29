var express = require('express');
var router = express.Router();

var {create, auth, remove, list, grantRole} =  require('../database/user');

const DELAY = 50;

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

router.post('/login', (req, res) => {
  sleep(DELAY).then(() => {
      console.log('login', req.body);
      let {user, pass} = req.body;
      return auth(user, pass);
  }).then((result) => {
      if(result === null){
        console.log(result);
          res.json({result:'error', reason:'notFound'})
      } else {
          res.json({result:'ok', ...result});
      }
  }).catch(err => {
      console.log(err);
      res.json({result:'error', reason: err.message});
  })
})

router.post('/list', (req, res) => {

  let {user, role:currRole} = req.body;
  console.log(user, currRole, 'role in request body')
  sleep(DELAY).then(() => {
      return list(user, currRole);
  }).then((result) => {
      console.log('list', user, currRole, result);
      res.json(result);
  })
})

router.post('/remove', (req, res) => {
  sleep(DELAY).then(() => {
      let {user} = req.body;
      console.log('removing', user);
      return remove(user);
  }).then((result) => {
      console.log(result, 'remove result')
      res.json({result: 'ok'});
  }).catch((err) => {
      res.json({result: 'error', reason: err});
  })
})

router.post('/grant_role', (req, res) => {
  sleep(DELAY).then(() => {
      let {user, role} = req.body;
      return grantRole(user, role);
  }).then((result) => {
      console.log(result, 'grant role result');
      res.json({result: 'ok'});
  }).catch((err) => {
      console.log(err);
      res.json({result: 'error', reason: err});
  })
})

router.post('/create', (req, res) => {

  console.log(req.body);

  sleep(DELAY).then(() => {
      let {user, pass, nick} = req.body;
      return create(user, pass, nick);
  })
  .then((doc) => {
      let {user_name, nickname} = doc;
      res.json({result: 'ok', user:user_name, nick: nickname})
  })
  .catch((err) => {
      console.log(err);
      res.json({result: 'error', reason: err.errorType})
  })
})

module.exports = router;