var express = require('express');
var router = express.Router();

var {create, remove, list, assignMember, removeMember} =  require('../database/project');
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
        let {project} = req.body;
        return remove(project)
    }).then((result) => {
        console.log(result);
        res.json({result: 'ok'});
    }).catch((err) => {
        console.log(err);
        res.json({result: 'error', reason: err});
    })
})

router.post('/create', (req, res) => {

    console.log(req.body, 'creating project');

    sleep(DELAY).then(() => {
        let {project} = req.body;
        return create(project);
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

router.post('/assign_member', (req, res) => {

    sleep(DELAY).then(() => {
        let {project, user, role} = req.body;
        return assignMember(project, user, role);
    })
    .then((doc) => {
        let {project_name:project, user_name:user, role} = doc;
        res.json({result: 'ok', project, user, role})
    })
    .catch((err) => {
        console.log(err);
        res.json({result: 'error', reason: err.errorType})
    })
})

router.post('/remove_member', (req, res) => {

    sleep(DELAY).then(() => {
        let {project, user} = req.body;
        return removeMember(project, user);
    })
    .then((doc) => {
        if (doc === 0){
            return res.json({result:'error', reason: 'notFound'});
        }
        res.json({result: 'ok'})
    })
    .catch((err) => {
        console.log(err);
        res.json({result: 'error', reason: err.errorType})
    })
})

module.exports = router;