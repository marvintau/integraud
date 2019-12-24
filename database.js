const path = require('path');
const DataStore = require('nedb-promise');

let users = new DataStore({
    filename: path.resolve(__dirname, './passwords.db'),
    autoload: true
});
users.ensureIndex({fieldName: 'user_name', unique: true});

let projects = new DataStore({
    filename: path.resolve(__dirname, './projects.db'),
    autoload: true
})
projects.ensureIndex({fieldName: 'project_name', unique: true});

function createUser(user_name, password, nickname, role){    

    if(user_name.match(/^[.\-_a-zA-Z0-9]+$/) === null || user_name.length < 5){
        throw {
            errorType : 'invalidUsername',
            message: 'username invalid. A valid username should be longer than 5 characters, and only contain letters(a-zA-Z), number digits (0-9), underscore (_), and dot (.)'
        }
    }

    if(password.length < 5 || !password.match(/[a-z]+/) || !password.match(/[A-Z]+/) || !password.match(/[0-9]+/)){
        throw {
            errorType : 'invalidPassword',
            message: 'password invalid. A valid username should be no less than 6 characters, and contain small/capital letter, number at the same time.'
        }
    }

    return users.insert({user_name, password, nickname, role})
}

function removeUser(user_name){
    return users.remove({user_name});
}

function listAllUsers(){
    return users.find({});
}

function findUser(user_name){
    return users.findOne({user_name});
}

function userLogin(user_name, password) {
    return users.findOne({user_name, password});
}

function grantOverallRole(user_name, overallRole){

    let roles = [
        'supreme',   // supreme system administrator (root)
        'governer',  // general adminstrator (sudoer)
        'manager',   // project-wise administrator
        'normal',    // peasants!
    ];

    let role = roles.includes(overallRole) ? overallRole : 'normal';
    console.log(user_name, overallRole, role);

    return users.update({user_name}, {$set: {role: role}})
}

function createProject(project_name) {
    projects.insert({project_name})
}

function removeProject(project_name){
    projects.remvoe({project_name});
}

function assignUserProject(project_name, user_name, role) {
    projects.update({project_name}, {$set: {[`users.${user_name}`]: role}})
}

function removeUserProject(project_name, user_name){
    projects.update({project_name}, {$set: {[`users.${user_name}`]: role}})
}

findUser('quasi-lord')
.then((doc) => {
    if(doc === null){
        return createUser('quasi-lord', 'all4Jesus.', '管理员', 'supreme')
        .then(() => {
            grantOverallRole('quasi-lord', 'supreme')
        });
    }
})
.then((doc) => {
    console.log(doc);
    return ;
})

module.exports = {
    userLogin,
    createUser,
    removeUser,
    listAllUsers,
    grantOverallRole
}