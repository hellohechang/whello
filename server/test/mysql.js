const mysql = require('mysql2');

const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '4512591',
  database: 'hello',
});

function toMySQL(sql, params) {
  // return pool.promise().query(sql, params).then(res => {
  //   return Promise.resolve(res[0])
  // })
  return new Promise((resolve, reject) => {
    pool.query(sql, params, (err, res, fields) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(res);
    });
  });
}

function queryData(table, strItem, where = '') {
  let sql = 'SELECT ' + strItem + ' FROM ' + table + ' ' + where;
  return toMySQL(sql);
}

// 插入一条数据
function insertData(table, datas) {
  let arr = Object.keys(datas),
    valArr = [],
    sql = `INSERT INTO ${table} (${arr.join(',')}) VALUES (${new Array(
      arr.length
    )
      .fill('?')
      .join(',')})`;
  arr.forEach((item) => {
    valArr.push(datas[item]);
  });
  return toMySQL(sql, valArr);
}
// 更新一条数据
function updateData(table, sets, where = '') {
  let setArr = Object.keys(sets),
    valArr = [],
    skey = '';
  setArr.forEach((item, index) => {
    if (setArr.length === 1 || index === setArr.length - 1) {
      skey += item + ' = ?';
    } else {
      skey += item + ' = ?,';
    }
    valArr.push(sets[item]);
  });
  let sql = 'UPDATE ' + table + ' SET ' + skey + ' ' + where;
  return toMySQL(sql, valArr);
}
// 删除一条数据
function deleteData(table, where = '') {
  let sql = 'DELETE  FROM ' + table + '' + where;
  return toMySQL(sql);
}

module.exports = {
  toMySQL,
  insertData,
  updateData,
  deleteData,
  queryData,
};
