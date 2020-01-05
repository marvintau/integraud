var express = require('express');
var promisify = require('util').promisify;
var multer = require('multer');
var upload = multer().single('confirmation_list');
var xlsx = require('xlsx');


var router = express.Router();

var {list, create, remove, removeProject, insertProject, modify} =  require('../database/confirmation');
// import bcrypt from 'bcrypt';

const DELAY = 50;

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

router.post('/upload', upload, (req, res) => {

  const {project} = req.body;
  const {buffer} = req.file;

  console.log(req, req.body.project, project, 'project_name');

  const table = xlsx.read(buffer, {type:'buffer'});
  const firstSheet = table.Sheets[table.SheetNames[0]];
  
  const entries = xlsx.utils.sheet_to_json(firstSheet);

  (async function(){
    try{
      await removeProject(project);
      await insertProject(entries, project);
      res.json({result:'ok'})
    } catch (err) {
      console.log(err);
      res.json({result:'error', reason:err.errorType})
    }
  })()
})

router.post('/list', (req, res) => {

  let {project} = req.body;
  console.log('listinbg confirmation', project);
  sleep(DELAY).then(() => {
    return list(project);
  }).then((result) => {
    console.log('found result', result.length)
    res.json({result});
  }).catch((error) => {
    console.log(error);
    res.json({result:'error', reason:error});
  })
})

router.post('/remove', (req, res) => {
  sleep(DELAY).then(() => {
    let {confirm_id} = req.body;
    return remove(confirm_id)
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
    let {confirm_id, project} = req.body;
    return create(confirm_id, project);
  })
  .then((doc) => {
    console.log(doc, 'created');
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
        let {confirm_id, field, value} = req.body;
        console.log('modifying', confirm_id, field, value);
        return modify(confirm_id, field, value);
    })
    .then((doc) => {
      console.log('modified', doc);
      res.json({result: 'ok'})
    })
    .catch((err) => {
        console.log(err);
        res.json({result: 'error', reason: err.errorType})
    })
})

module.exports = router;