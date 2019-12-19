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

function createUser(user_name, password, nickname){    
    return users.insert({user_name, password, nickname})
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

function findMatchedUser(user_name, password) {
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
    projects.update({user_name}, {$set: {role}})
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
        return createUser('quasi-lord', 'all4Jesus.', '管理员')
        .then(() => {
            grantOverallRole('supreme')
        });
    }
})
.then((doc) => {
    console.log(doc);
    return ;
})

module.exports = {
    createUser,
    removeUser,
    listAllUsers
}