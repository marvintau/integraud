const path = require('path');
const DataStore = require('nedb-promise');

let confirmations = new DataStore({
    filename: path.resolve(__dirname, './confirmation.db'),
    autoload: true
})
confirmations.ensureIndex({fieldName: 'confirm_id', unique: true});

function create(confirm_id, project_name) {
    return confirmations.insert({confirm_id, project_name});
}

function remove(confirm_id){
    return confirmations.remove({confirm_id}, {});
}

function removeProject(project_name){
  return confirmations.remove({project_name}, {multi:true});
}

function recToDoc(record, project_name){
  let doc = {project_name};
  doc.confirm_status = {};
  doc.confirm_id = record.ID;
  doc.confirmee_info = {
    name: record.CompanyName,
    address: record.CompanyAddress,
    contact: record.CompanyContactName,
    phone: record.CompanyContactPhone
  }
  let {Subject, Amount, Reason} = record;
  console.log(record, {Subject, Amount, Reason});
  doc.confirmed_amount = {
    subject: Subject,
    amount: Amount,
    reason: Reason
  }
  return doc;
}

function insertProject(arr, project_name){
  
  let docArr = arr.map((e) => recToDoc(e, project_name));

  return confirmations.insert(docArr);
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
  console.log('modify-database', confirm_id, field, value); 
  return confirmations.update({confirm_id}, {$set: {[field]: value}, $push:{history: [field, value, Date()]}});
}

function list(project_name){
  return confirmations.find({project_name})
}

module.exports = {
  create,
  remove,
  removeProject,
  insertProject,
  modify,
  list
}

