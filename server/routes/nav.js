const express = require('express'),
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
  _success,
  _nologin,
  _err,
  nanoid,
  getHost,
} = require('../utils');

route.get('/share', async (req, res) => {
  try {
    let { id } = req.query;
    let arr = await queryData('share', '*', `WHERE id=? AND type=?`, [
      id,
      'bookmk',
    ]);
    if (arr.length === 0) {
      _err(res, '分享已被取消');
      return;
    }
    arr = JSON.parse(arr[0].data);
    _success(res, 'ok', arr);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
//拦截器
route.use((req, res, next) => {
  if (req._userInfo.account) {
    next();
  } else {
    _nologin(res);
  }
});
// 左侧书签处理
//获取列表
route.get('/getlist', async (req, res) => {
  try {
    let account = req._userInfo.account;
    let { id } = req.query;
    let it = bookSort(
      await queryData(
        'bookmk',
        'id,name,link,logo,num,des',
        `WHERE listid=? AND state=? AND account=?`,
        [id, '0', account]
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
    side = side.map((item) => {
      if (item.id === id) {
        item.item = it;
      }
      return item;
    });
    _success(res, 'ok', { side, home: [] });
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
// 列表移动
route.post('/listmove', async (req, res) => {
  try {
    let account = req._userInfo.account;
    let { fromId, toId } = req.body;
    let side = bookSort(
      await queryData('booklist', 'id,num', `WHERE account=? AND state=?`, [
        account,
        '0',
      ])
    );
    let fid = side.findIndex((item) => item.id === fromId),
      tid = side.findIndex((item) => item.id === toId);
    if (fid >= 0 && tid >= 0) {
      side.splice(tid, 0, ...side.splice(fid, 1));
      let ob = {
        where: 'id',
        key: 'num',
        data: [],
      };
      side.forEach((item, i) => {
        ob.data.push({
          id: item.id,
          num: i,
        });
      });
      await batchUpdateData('booklist', [ob]);
      _success(res);
      return;
    }
    _err(res);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
// 书签移动
route.post('/bmkmove', async (req, res) => {
  try {
    let account = req._userInfo.account;
    let { pid, fromId, toId } = req.body;
    let it = bookSort(
      await queryData(
        'bookmk',
        'id,num',
        `WHERE listid=? AND state=? AND account=?`,
        [pid, '0', account]
      )
    );
    let fid = it.findIndex((item) => item.id === fromId),
      tid = it.findIndex((item) => item.id === toId);
    if (fid >= 0 && tid >= 0) {
      it.splice(tid, 0, ...it.splice(fid, 1));
      let ob = {
        where: 'id',
        key: 'num',
        data: [],
      };
      it.forEach((item, i) => {
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
// 新建列表
route.post('/addlist', async (req, res) => {
  try {
    let account = req._userInfo.account;
    let { name } = req.body;
    let total =
      (
        await queryData('booklist', 'MAX(num)', `WHERE account=? AND state=?`, [
          account,
          '0',
        ])
      )[0]['MAX(num)'] || 0;
    let id = nanoid();
    await insertData('booklist', [
      {
        id,
        name,
        account,
        num: total + 1,
      },
    ]);
    await writelog(req, `新增书签列表[${name}(${id})]`);
    _success(res);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
// 删除列表
route.post('/dellist', async (req, res) => {
  try {
    let account = req._userInfo.account;
    let { id } = req.body;
    await updateData(
      'booklist',
      { state: '1' },
      `WHERE account=? AND id=? AND state=?`,
      [account, id, '0']
    );
    await writelog(req, `删除书签列表[${id}]`);
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
    let { pid, cid, purl } = req.body;
    await updateData(
      'bookmk',
      { logo: purl },
      `WHERE account=? AND id=? AND state=? AND listid=?`,
      [account, cid, '0', pid]
    );
    await writelog(req, `更换书签logo[${cid}(${purl})]`);
    _success(res);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
// 编辑列表
route.post('/editlist', async (req, res) => {
  try {
    let account = req._userInfo.account;
    let { id, name } = req.body;
    await updateData(
      'booklist',
      { name },
      `WHERE account=? AND state=? AND id=?`,
      [account, '0', id]
    );
    await writelog(req, `修改列表名[${name}(${id})]`);
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
    let { id, obj } = req.body;
    let total =
      (
        await queryData(
          'bookmk',
          'MAX(num)',
          `WHERE listid=? AND account=? AND state=?`,
          [id, account, '0']
        )
      )[0]['MAX(num)'] || 0;
    await insertData('bookmk', [
      {
        id: nanoid(),
        account,
        ...obj,
        num: total + 1,
        listid: id,
      },
    ]);
    await writelog(req, `新增书签[${obj.name}(${obj.link})]`);
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
    let { pid, cid, name, logo, link, des } = req.body;
    await updateData(
      'bookmk',
      { name, logo, link, des },
      `WHERE account=? AND state=? AND id=? AND listid=?`,
      [account, '0', cid, pid]
    );
    await writelog(req, `编辑书签[${cid}-${name}(${link})]`);
    _success(res);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
// 书签移动目录
route.post('/bmktolist', async (req, res) => {
  try {
    let account = req._userInfo.account;
    let { pid, arr, toid } = req.body;
    let total =
      (
        await queryData(
          'bookmk',
          'MAX(num)',
          `WHERE listid=? AND account=? AND state=?`,
          [toid, account, '0']
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
        listid: toid,
      });
    });
    await batchUpdateData(
      'bookmk',
      ob,
      `account="${account}" AND state="0" AND listid="${pid}"`
    );
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
    let { pid, arr } = req.body;
    await updateData(
      'bookmk',
      { state: '1' },
      `WHERE id IN (${new Array(arr.length)
        .fill('?')
        .join(',')}) AND state=? AND listid=? AND account=?`,
      [...arr, '0', pid, account]
    );
    await writelog(req, `删除书签[${arr.join(',')}]`);
    _success(res);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
//列表分享
route.post('/share', async (req, res) => {
  try {
    let account = req._userInfo.account;
    let r = nanoid(),
      { id } = req.body;
    let arr = bookSort(
      await queryData(
        'bookmk',
        '*',
        `WHERE listid=? AND state=? AND account=?`,
        [id, '0', account]
      )
    );
    if (arr.length === 0) {
      _err(res, '当前列表为空');
      return;
    }
    let obj = {
      id: r,
      data: JSON.stringify(arr),
      account,
      type: 'bookmk',
    };
    await insertData('share', [obj]);
    await writelog(req, `分享书签列表[/page/sharebm/#${r}]`);
    _success(res, 'ok', { id: r });
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
//收藏分享
route.get('/saveshare', async (req, res) => {
  try {
    let account = req._userInfo.account;
    let { id } = req.query;
    let arr = await queryData('share', '*', `WHERE id=? AND type=?`, [
      id,
      'bookmk',
    ]);
    if (arr.length === 0) {
      _err(res, '分享已被取消');
      return;
    }
    arr = JSON.parse(arr[0].data);
    let total =
      (
        await queryData('booklist', 'MAX(num)', `WHERE account=? AND state=?`, [
          account,
          '0',
        ])
      )[0]['MAX(num)'] || 0;
    let pid = nanoid();
    await insertData('booklist', [
      {
        id: pid,
        name: '新列表',
        account,
        num: total + 1,
      },
    ]);
    arr = arr.map((item) => {
      return {
        ...item,
        id: nanoid(),
        listid: pid,
        account,
        logo: '//' + getHost(item.link) + '/favicon.ico',
      };
    });
    await insertData('bookmk', arr);
    await writelog(req, `收藏书签分享[/page/sharebm/#${id}]`);
    _success(res);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});

module.exports = route;
