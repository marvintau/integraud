const path = require('path');
const DataStore = require('nedb-promise');

let projects = new DataStore({
    filename: path.resolve(__dirname, './project.db'),
    autoload: true
})
projects.ensureIndex({fieldName: 'project_name', unique: true});


function list(user, role){

    if(['supreme', 'governer'].includes(role)){
        return projects.find({});
    } else {
        return projects.find({[`members.${user}`]: {$exists: true}})
    }
}

function create(project_name) {
    return projects.insert({project_name})
}

function remove(project_name){
    console.log({project_name});
    return projects.remove({project_name}, {});
}

function assignMember(project_name, user_name, role) {
    console.log(user_name, 'database', 'assign project member')
    return projects.update({project_name}, {$set: {[`members.${user_name}`]: role}})
}

function removeMember(project_name, user_name){
    console.log(project_name, user_name, 'database', 'remove project member')
    return projects.update({project_name}, {$unset: {[`members.${user_name}`]: true}});
}

projects.find({})
.then((doc) => {
    if (doc.length === 0){
        for (let i = 0; i < 50; i++){
            create(`测试(${i})公司`)
        }
    }
})
.catch(err => {
    console.log(err);
})


module.exports = {
    list,
    create,
    remove,
    assignMember,
    removeMember
}