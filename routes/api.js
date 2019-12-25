var express = require('express');
var router = express.Router();

var {createUser, removeUser, grantOverallRole, listUsers, userLogin} =  require('../database');
var {createProject, removeProject, listProjects, assignProjectMember, removeProjectMember} =  require('../database');
// import bcrypt from 'bcrypt';

const DELAY = 50;

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

router.post('/login', (req, res) => {
    sleep(DELAY).then(() => {
        let {user, pass} = req.body;
        return userLogin(user, pass);
    }).then((result) => {
        if(result === null){
            res.json({result:'error', reason:'notFound'})
        } else {
            console.log(result);
            res.json({result:'ok', ...result});
        }
    }).catch(err => {
        res.json({result:'error', reason: err.message});
    })
})
  
router.post('/list_user', (req, res) => {

    let {role:currRole} = req.body;
    console.log(currRole, 'role in request body')
    sleep(DELAY).then(() => {
        return listUsers(currRole);
    }).then((result) => {
        res.json(result);
    })
})

router.post('/remove_user', (req, res) => {
    sleep(DELAY).then(() => {
        let {user} = req.body;
        return removeUser(user);
    }).then(() => {
        res.json({result: 'ok'});
    }).catch((err) => {
        res.json({result: 'error', reason: err});
    })
})

router.post('/grant_overall_role', (req, res) => {
    sleep(DELAY).then(() => {
        let {user, role} = req.body;
        return grantOverallRole(user, role);
    }).then((result) => {
        console.log(result, 'result');
        res.json({result: 'ok'});
    }).catch((err) => {
        console.log(err);
        res.json({result: 'error', reason: err});
    })
})

router.post('/create_user', (req, res) => {

    console.log(req.body);

    sleep(DELAY).then(() => {
        let {user, pass, nick} = req.body;
        return createUser(user, pass, nick);
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

router.post('/list_projects', (req, res) => {

    let {user:currUser, role:currRole} = req.body;
    console.log(currUser, currRole, 'role in request body')
    sleep(DELAY).then(() => {
        return listProjects(currUser, currRole);
    }).then((result) => {
        console.log
        res.json(result);
    })
})

router.post('/remove_project', (req, res) => {
    sleep(DELAY).then(() => {
        let {project} = req.body;
        return removeProject(project)
    }).then((result) => {
        console.log(result);
        res.json({result: 'ok'});
    }).catch((err) => {
        console.log(err);
        res.json({result: 'error', reason: err});
    })
})

router.post('/create_project', (req, res) => {

    console.log(req.body, 'creating project');

    sleep(DELAY).then(() => {
        let {project} = req.body;
        return createProject(project);
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

router.post('/assign_project_member', (req, res) => {

    sleep(DELAY).then(() => {
        let {project, user, role} = req.body;
        return assignProjectMember(project, user, role);
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

router.post('/remove_project_member', (req, res) => {

    sleep(DELAY).then(() => {
        let {project, user} = req.body;
        return removeProjectMember(project, user);
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