const express = require('express'),
  route = express.Router();
const { queryData, updateData, deleteData, insertData } = require('../sqlite');
const { _nologin, writelog, _err, _success, nanoid } = require('../utils');
//拦截器
route.use((req, res, next) => {
  if (req._userInfo.account) {
    next();
  } else {
    _nologin(res);
  }
});
route.get('/list', async (req, res) => {
  try {
    const account = req._userInfo.account;
    let arr = await queryData('todo', '*', `WHERE account=?`, [account]);
    arr.sort((a, b) => {
      return b.time - a.time;
    })
    _success(res, 'ok', arr);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
})
route.post('/add', async (req, res) => {
  try {
    const { data } = req.body;
    const account = req._userInfo.account;
    await insertData('todo', [{
      id: nanoid(),
      account,
      data,
      time: Date.now(),
      state: 0
    }])
    await writelog(req, `添加待办事项[${data}]`);
    _success(res, `添加待办事项成功`);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
})
route.get('/del', async (req, res) => {
  try {
    const { id } = req.query;
    const account = req._userInfo.account;
    if (id) {
      if (id == 'all') {
        await deleteData('todo', `WHERE account=?`, [account]);
      } else {
        await deleteData('todo', `WHERE id=?`, [id]);
      }
    } else {
      await deleteData('todo', `WHERE account=? AND state=?`, [account, '1']);
    }
    await writelog(req, `${id ? (id == 'all' ? '清空' : '删除') : '清除已完成'}待办事项`);
    _success(res, `操作成功`);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
})
route.get('/state', async (req, res) => {
  try {
    const { id, flag } = req.query;
    let obj = {};
    if (flag) {
      obj = {
        state: '0',
        time: Date.now()
      }
    } else {
      obj = { state: '1' }
    }
    await updateData('todo', obj, `WHERE id=?`, [id]);
    _success(res, `${flag ? '已标记为未完成' : '已标记为完成'}`);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
})
route.post('/edit', async (req, res) => {
  try {
    const { id, data } = req.body;
    await updateData('todo', { data, time: Date.now() }, `WHERE id=?`, [id]);
    await writelog(req, `编辑待办事项[${data}]`);
    _success(res, '操作成功');
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
})

module.exports = route;