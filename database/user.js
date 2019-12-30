const path = require('path');
const DataStore = require('nedb-promise');

let user = new DataStore({
  filename: path.resolve(__dirname, './user.db'),
  autoload: true
});
user.ensureIndex({fieldName: 'user_name', unique: true});

function grantRole(user_name, overallRole){

  let roles = [
    'supreme',   // supreme system administrator (root)
    'governer',  // general adminstrator (sudoer)
    'manager',   // project wise manager
    'normal',    // peasants!
  ];

  let role = roles.includes(overallRole) ? overallRole : 'normal';
  console.log(user_name, overallRole, role);

  return user.update({user_name}, {$set: {role: role}})
}

function auth(user_name, password) {
  return user.findOne({user_name, password});
}

function create(user_name, password, nickname){    

  if(user_name.match(/^[.\-_a-zA-Z0-9]+$/) === null || user_name.length < 5){
    throw {
      errorType : 'invalidUsername',
      message: 'username invalid. A valid username should be longer than 5 characters, and only contain letters(a-zA-Z), number digits (0-9), underscore (_), and dot (.)'
    }
  }

  if(password.length < 8 || !password.match(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&,.])[A-Za-z\d@$!%*#?&,.]{1,}$/)){
    throw {
      errorType : 'invalidPassword',
      message: 'password invalid. A valid password should be no less than 8 characters, and contain small/capital letter, number, and symble at the same time.'
    }
  }

  return user.insert({user_name, password, nickname, role:'normal'})
}

function remove(user_name){
  return user.remove({user_name});
}

function list(user_name, role){

  const roleRange = {
    'supreme' : ['governer', 'manager', 'normal'],
    'governer': ['governer', 'manager', 'normal'],
    'manager': ['manager', 'normal'],
    'normal' :['manager', 'normal']
  }[role];

  console.log(user_name, role, roleRange);

  return user.find({$or: [{user_name}, {role: {$in: roleRange}}]});
}

module.exports = {
  auth,
  create,
  remove,
  list,
  grantRole,
}