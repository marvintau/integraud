const path = require('path');
const DataStore = require('nedb-promise');

let confirmations = new DataStore({
    filename: path.resolve(__dirname, './confirmation.db'),
    autoload: true
})
confirmations.ensureIndex({fieldName: 'project_name', unique: true});

function create(confirm_id, project_name) {
    return confirmations.insert({confirm_id, project_name});
}

function remove(confirm_id){
    return confirmations.remove({confirm_id}, {});
}

/**
 * Modify
 * When creating the record, only serial number is filled in as the record ID. Other
 * columns are filled in with modify. For confirmation letter, the valid field name
 * includes: 
 * 
 * Serial Number
 * 
 * Address related:
 * ----------------
 * Sender's Name: the compnary name of project, or its subsidaries.
 * Receiver's name: the company that being inquired.
 * Receiver's Address and Contact (including its name/phone number/or email address)
 * 
 * confirmation letter related:
 * ----------------------------
 * reply status:
 * sample reason: (余额较大/账龄较长/贷方余额/非预期的零余额/年内转销重大账户/异常交易/关联方/其它（备注）)
 * sending date:
 * replying date:
 * sending method: (mail / email)
 * sending status: (已发函且未收回/已收回函证)
 * 
 * amount related:
 * ---------------
 * condition: test if we have received number
 * ledged amount:
 * confirmed amount:
 * 
 * condition: test if confirmed amout not equal to ledged amount
 * Modified amount: (wrong number given by ledge)
 * Adjusted amount: (calculation problem in statement)
 * unsettled amount: should not appear
 * 
 * condition: 
 * 
 */

function modify(confirm_id, field, value){
  return confirmations.update({confirm_id}, {$set: {[field]: value}});
}

function list(project_name){
  return confirmations.find({project_name})
}

module.exports = {
  create,
  remove,
  modify,
  list
}

