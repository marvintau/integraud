const fs = require('fs');
const path = require('path');
const DataStore = require('nedb-promise');
const QRCode = require('easyqrcodejs-nodejs');

const createDocs = require('docx-templates');
const archiver = require('archiver-promise');


// 存档警告

let confirmations = new DataStore({
    filename: path.resolve(__dirname, './confirmation.db'),
    autoload: true
})


const generateQR = async text => {

  const options = {
    text,
    width: 128,
    height: 128,
    colorDark : "#000000",
    colorLight : "transparent",
    correctLevel : QRCode.CorrectLevel.H, // L, M, Q, H
    dotScale: 1 // Must be greater than 0, less than or equal to 1. default is 1
  }

  try {
    let result = await (new QRCode(options)).toDataURL().then(res => res);
    return result;
  } catch (err) {
    console.log(err);
    return 'error';
  }
}

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

  // new created
  doc.notes = '';
  doc.confirm_status = {};

  // basic information
  doc.confirm_id = record.ConfirmID;
  doc.unit_name = record.CompanyName;
  doc.confirm_type = record.ConfirmType;

  // confirmee information
  const {
    ConfirmedCompany, ConfirmedAddress, ConfirmedContactName, ConfirmedPhone, BankAccount, AccountType
  } = record;

  doc.confirmee_info = {
    name: ConfirmedCompany,
    address: ConfirmedAddress,
    contact: ConfirmedContactName,
    phone: ConfirmedPhone,
  }


  let {Subject1, Amount1, Subject2, Amount2, Subject3, Amount3, Reason} = record;

  let amountEntries = [];
  if(Subject1 !== undefined){
    if (Array.isArray(Amount1) && Amount1.length > 0){
      if(Array.isArray(BankAccount)){
        for (let i = 0; i < BankAccount.length; i++){
          const accountType = Array.isArray(AccountType) ? AccountType[i] : AccountType;
          amountEntries.push([`${Subject1}-${accountType}`, {amount:Amount1[i], account:BankAccount[i]}]);
        }
      }
    } else {
      // in this case the amount is single, but it has bank account.
      if (typeof BankAccount === 'string'){
        console.log(BankAccount, AccountType, 'bank');
        amountEntries.push([`${Subject1}-${AccountType ? AccountType : '无户别'}`, {amount:Amount1, account:BankAccount}]);
      } else {
        amountEntries.push([Subject1, Amount1]);
      }
    }
  }
  if(Subject2 !== undefined){
    amountEntries.push([Subject2, Amount2]);
  }
  if (Subject3 !== undefined){
    amountEntries.push([Subject3, Amount3]);
  }

  let amountDict = {};
  for (let [sub, amount] of amountEntries){
    amountDict[sub] = amount;
  }

  doc.confirmed_amount = {
    contents: amountDict,
    reason: Reason
  }
  return doc;
}

function sumRec(recs){

  if (recs.length === 1){
    return recs[0];
  }

  let newRec = {};

  let first = recs[0];
  for (let col in first) if (recs.every((rec) => rec[col] === first[col])){
    newRec[col] = first[col];
  } else {
    newRec[col] = recs.map(e => e[col]);
  }

  return newRec;
}

function gripID(records){

  const dict = {};
  for (let rec of records){
    const {ConfirmID, ...restRec} = rec;
    if(dict[ConfirmID] === undefined){
      dict[ConfirmID] = [];
    }
    dict[ConfirmID].push(restRec);
  }

  for (let key in dict){
    dict[key] = sumRec(dict[key]);
  }

  return Object.entries(dict).map(([ConfirmID, rest]) => {
    return {ConfirmID, ...rest};
  })
}

function processArray(records){
  for (let i = 0; i < records.length; i++){
    if (records[i].Amount1 === undefined){
      records[i].Amount1 = 0;
    }
    if (records[i].Amount2 === undefined){
      records[i].Amount2 = 0;
    }
    if (records[i].Amount3 === undefined){
      records[i].Amount3 = 0;
    }
  }
  return records;
}

function insertProject(arr, project_name){

  arr = processArray(arr);
  let gripped = gripID(arr);
  // console.log(gripped);
  let docs = gripped.map((e) => recToDoc(e, project_name));

  return Promise.all(docs.map(async function(doc){
    let {project_name, confirm_id} = doc;
    doc.qrcode = await generateQR(`${project_name}<|<|>|>${confirm_id}`);
    return doc;
  })).then(resolvedDocs => {
    // console.log(resolvedDocs);
    return confirmations.insert(resolvedDocs);
  })
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

function get(project_name, confirm_id){
  return confirmations.find({project_name, confirm_id});
}

function generateDocs(project_name){

  const archive = archiver('zip', {
    zlib: { level: 5 }
  })

  return confirmations.find({project_name})
  .then(result => {

    let selected = result;

    // let templateList = fs.readdirSync('public/template/docx').map(e=>e.startsWith('TEMPLATE'));
    
    fs.mkdirSync(`generated/${project_name}`, {recursive: true});
    let archiveOutput = fs.createWriteStream(`generated/${project_name}/wrapped.zip`);
    archive.pipe(archiveOutput)

    return Promise.all(selected.map((rec) => {
      let {project_name, confirm_id, confirm_type, confirmed_amount} = rec;

      for (let key in confirmed_amount.contents){
        if (!isNaN(confirmed_amount.contents[key])){
          confirmed_amount.contents[key] = confirmed_amount.contents[key].toLocaleString('en-us', {maximumFractionDigits:2, minimumFractionDigits:2})
        }
      }

      const template = `public/template/docx/TEMPLATE.${confirm_type}.docx`;

      try {
        fs.accessSync(template);
      } catch (err) {
        template = `public/template/docx/TEMPLATE.其他.docx`;
      }

      const baseProps = {
        template,
        additionalJsContext: {
          qrCode: dataUrl => {
            const data = dataUrl.slice('data:image/gif;base64,'.length);
            return { width: 2, height: 2, data, extension: '.gif' };
          },
        }
      }
  
      let outputPath = `generated/${project_name}/RESULT.${project_name}-${confirm_id}.docx`;

      return createDocs({...baseProps,
        output: outputPath,
        data: rec,  
      }).then(() => {
        archive.file(outputPath, {name:`${project_name}-${confirm_id}.docx`})
      })
    })).then(() =>{
      return archive.finalize();
    }).then(() => {
      return project_name;
    })
  }).catch(err => {
    console.log(err);
  })
}

module.exports = {
  create,
  remove,
  removeProject,
  insertProject,
  modify,
  get,
  list,
  generateDocs
}

