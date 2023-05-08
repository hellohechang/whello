const express = require('express'),
  route = express.Router();
const { insertData, updateData, deleteData, queryData } = require('../sqlite');
const {
  writelog,
  _success,
  _nologin,
  _err,
  nanoid,
  hdSearch,
} = require('../utils');

//拦截器
route.use((req, res, next) => {
  if (req._userInfo.account) {
    next();
  } else {
    _nologin(res);
  }
});

//搜索历史处理
// 搜索搜索历史
route.get('/history', async (req, res) => {
  try {
    const account = req._userInfo.account;
    let { a, page, showpage = 80 } = req.query,
      arr = await queryData('history', '*', `WHERE state=? AND account=?`, [
        '0',
        account,
      ]);
    if (a) {
      let sArr = [];
      arr.forEach((v) => {
        let { data } = v;
        let searchArr = hdSearch(a, data);
        if (searchArr.length > 0) {
          sArr.push({
            ...v,
            flag: searchArr.length,
          });
        }
      });
      if (sArr.length > 0) {
        sArr.sort((a, b) => {
          return b.flag - a.flag;
        });
      }
      arr = sArr;
    } else {
      arr = arr.reverse();
    }
    arr = arr.map((item) => {
      delete item.state;
      delete item.flag;
      return item;
    });
    let pagenum = Math.ceil(arr.length / showpage);
    page > pagenum ? (page = pagenum) : page <= 0 ? (page = 1) : null;
    let sdata = arr.slice(showpage * (page - 1), showpage * page);
    _success(res, 'ok', {
      total: arr.length,
      totalPage: pagenum,
      pageNo: page,
      data: sdata,
    });
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
// 保存搜索历史
route.post('/add', async (req, res) => {
  try {
    const account = req._userInfo.account;
    let a = req.body.a;
    await deleteData('history', `WHERE account=? AND data=?`, [account, a]);
    await insertData('history', [
      {
        id: nanoid(),
        data: a,
        account,
      },
    ]);
    await writelog(req, `搜索内容[${a}]`);
    _success(res);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
// 搜索 搜索历史 笔记 书签
route.get('/getsearchdata', async (req, res) => {
  try {
    const account = req._userInfo.account;
    let { a } = req.query,
      se = await queryData('history', '*', `WHERE state=? AND account=?`, [
        '0',
        account,
      ]); //搜索历史
    if (!a) {
      _success(res, 'ok', se.reverse().slice(0, 10));
      return;
    }
    let arr = [],
      arr1 = [],
      note = await queryData('note', '*', `WHERE state=? AND account=?`, [
        '0',
        account,
      ]), //笔记
      bmk = await queryData('bookmk', '*', `WHERE state=? AND account=?`, [
        '0',
        account,
      ]);

    note.forEach((item) => {
      //笔记名包含搜索词的笔记
      let { name, id } = item;
      let searchArr = hdSearch(a, name);
      if (searchArr.length > 0) {
        arr1.push({ name, id, type: 'note', sNum: searchArr.length });
      }
    });

    if (arr1.length > 0) {
      arr1.sort((a, b) => {
        return b.sNum - a.sNum;
      });
      arr = [...arr1.slice(0, 5)];
    }

    arr1 = [];
    bmk.forEach((item) => {
      //包含搜索词的书签
      let { name, link, des } = item,
        n = `${name}|${link}|${des || ''}`;
      let searchArr = hdSearch(a, n);
      if (searchArr.length > 0) {
        arr1.push({
          name: name,
          link: link,
          type: 'bmk',
          sNum: searchArr.length,
        });
      }
    });

    if (arr1.length > 0) {
      arr1.sort((a, b) => {
        return b.sNum - a.sNum;
      });
      arr = [...arr, ...arr1.slice(0, 5)];
    }

    arr1 = [];
    se.forEach((v) => {
      //包含搜索词的历史记录
      let { id, data } = v;
      let searchArr = hdSearch(a, data);
      if (searchArr.length > 0) {
        arr1.push({ name: data, id, type: 'ss', sNum: searchArr.length });
      }
    });
    if (arr1.length > 0) {
      arr1.sort((a, b) => {
        return b.sNum - a.sNum;
      });
      arr = [...arr, ...arr1.slice(0, 5)];
    }
    arr.sort((a, b) => {
      return b.sNum - a.sNum;
    });
    if (arr.length > 0) {
      _success(res, 'ok', arr);
    } else {
      _success(res, 'ok', []);
    }
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
// 删除搜索历史记录
route.post('/del', async (req, res) => {
  try {
    const account = req._userInfo.account;
    let { arr } = req.body;
    await updateData(
      'history',
      { state: '1' },
      `WHERE id IN (${new Array(arr.length)
        .fill('?')
        .join(',')}) AND account=? AND state=?`,
      [...arr, account, '0']
    );
    await writelog(req, `删除搜索历史[${arr.join(',')}]`);
    _success(res);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});

module.exports = route;
