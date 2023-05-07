const express = require('express'),
  { mediaurl } = require('../myconfig'),
  route = express.Router();
const {
  batchUpdateData,
  insertData,
  updateData,
  queryData,
} = require('../sqlite');
const {
  bookSort,
  writelog,
  _mkdir,
  _unlink,
  _success,
  _nologin,
  _err,
  receiveFiles,
  nanoid,
} = require('../utils');

//拦截器
route.use((req, res, next) => {
  if (req._userInfo.account) {
    next();
  } else {
    _nologin(res);
  }
});

//主页书签处理
//获取列表
route.get('/getlist', async (req, res) => {
  try {
    let account = req._userInfo.account;
    let home = bookSort(
      await queryData(
        'bookmk',
        'id,name,link,logo,num',
        `WHERE listid=? AND state=? AND account=?`,
        ['home', '0', account]
      )
    );
    let side = bookSort(
      await queryData(
        'booklist',
        'id,name,num',
        `WHERE state=? AND account=?`,
        ['0', account]
      )
    );
    _success(res, 'ok', {
      home,
      side,
    });
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
// 书签移动
route.post('/move', async (req, res) => {
  try {
    let account = req._userInfo.account;
    let { fromId, toId } = req.body;
    let arr = bookSort(
      await queryData(
        'bookmk',
        'id,num',
        `WHERE listid=? AND state=? AND account=?`,
        ['home', '0', account]
      )
    );
    let fid = arr.findIndex((item) => item.id === fromId),
      tid = arr.findIndex((item) => item.id === toId);
    if (fid >= 0 && tid >= 0) {
      arr.splice(tid, 0, ...arr.splice(fid, 1));
      let ob = {
        where: 'id',
        key: 'num',
        data: [],
      };
      arr.forEach((item, i) => {
        ob.data.push({
          id: item.id,
          num: i,
        });
      });
      await batchUpdateData('bookmk', [ob]);
      _success(res);
      return;
    }
    _err(res);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
// 书签移动目录
route.post('/bmktolist', async (req, res) => {
  try {
    let account = req._userInfo.account;
    let { arr, nid } = req.body;
    let total =
      (
        await queryData(
          'bookmk',
          'MAX(num)',
          `WHERE listid=? AND account=? AND state=?`,
          [nid, account, '0']
        )
      )[0]['MAX(num)'] || 0;
    let ob = [
      {
        key: 'num',
        where: 'id',
        data: [],
      },
      {
        key: 'listid',
        where: 'id',
        data: [],
      },
    ];
    arr.forEach((item) => {
      total++;
      ob[0].data.push({
        id: item,
        num: total,
      });
      ob[1].data.push({
        id: item,
        listid: nid,
      });
    });
    await batchUpdateData(
      'bookmk',
      ob,
      `account="${account}" AND state="0" AND listid="home"`
    );
    _success(res);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
// 书签logo设置
route.post('/setlogo', async (req, res) => {
  try {
    let account = req._userInfo.account;
    let { id, purl } = req.body;
    await updateData(
      'bookmk',
      { logo: purl },
      `WHERE account=? AND state=? AND id=? AND listid=?`,
      [account, '0', id, 'home']
    );
    await writelog(req, `更换书签logo[${id}(${purl})]`);
    _success(res);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
// 编辑书签
route.post('/editbmk', async (req, res) => {
  try {
    let account = req._userInfo.account;
    let { id, name, link, logo } = req.body;
    await updateData(
      'bookmk',
      { name, logo, link },
      `WHERE account=? AND state=? AND id=? AND listid=?`,
      [account, '0', id, 'home']
    );
    await writelog(req, `编辑书签[${id}-${name}(${link})]`);
    _success(res);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
// 删除书签
route.post('/delbmk', async (req, res) => {
  try {
    let account = req._userInfo.account;
    let { arr } = req.body;
    await updateData(
      'bookmk',
      { state: '1' },
      `WHERE id IN (${new Array(arr.length)
        .fill('?')
        .join(',')}) AND state=? AND account=? AND listid=?`,
      [...arr, '0', account, 'home']
    );
    await writelog(req, `删除书签[${arr.join(',')}]`);
    _success(res);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
// 上传书签
route.post('/addbmk', async (req, res) => {
  try {
    let account = req._userInfo.account;
    let obj = req.body;
    let total =
      (
        await queryData(
          'bookmk',
          'MAX(num)',
          `WHERE listid=? AND account=? AND state=?`,
          ['home', account, '0']
        )
      )[0]['MAX(num)'] || 0;
    await insertData('bookmk', [
      {
        id: nanoid(),
        account,
        ...obj,
        num: total + 1,
        listid: 'home',
      },
    ]);
    await writelog(req, `新增书签[${obj.name}(${obj.link})]`);
    _success(res);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
// 上传书签logo
route.post('/bmklogo', async (req, res) => {
  try {
    let account = req._userInfo.account;
    let path = `${mediaurl.filepath}/logo/${account}`,
      purl = `/logo/${account}/${req.query.name}`;
    await _mkdir(path);
    await _unlink(`${path}/${req.query.name}`);
    await receiveFiles(req, path, req.query.name);
    _success(res, 'ok', { purl: purl });
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});

module.exports = route;
