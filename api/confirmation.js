var express = require('express');
var router = express.Router();

var {list, create, remove, modify} =  require('../database/confirmation');
// import bcrypt from 'bcrypt';

const DELAY = 50;

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

router.post('/list', (req, res) => {

  let {user:currUser, role:currRole} = req.body;
  console.log(currUser, currRole, 'role in request body')
  sleep(DELAY).then(() => {
    return list(currUser, currRole);
  }).then((result) => {
    console.log
    res.json(result);
  })
})

router.post('/remove', (req, res) => {
  sleep(DELAY).then(() => {
    let {confirmID} = req.body;
    return remove(confirmID)
  }).then((result) => {
    console.log(result);
    res.json({result: 'ok'});
  }).catch((err) => {
    console.log(err);
    res.json({result: 'error', reason: err});
  })
})

router.post('/create', (req, res) => {
  sleep(DELAY).then(() => {
    let {confirmID} = req.body;
    return create(confirmID, project);
  })
  .then((doc) => {
    console.log(doc);
    let {project_name:project} = doc;
    res.json({result: 'ok', project})
  })
  .catch((err) => {
    console.log(err);
    res.json({result: 'error', reason: err.errorType})
  })
})

router.post('/modify', (req, res) => {

    sleep(DELAY).then(() => {
        let {confirmID, field, value} = req.body;
        return modify(confirmID, field, value);
    })
    .then((doc) => {
        res.json({result: 'ok'})
    })
    .catch((err) => {
        console.log(err);
        res.json({result: 'error', reason: err.errorType})
    })
})

module.exports = router;