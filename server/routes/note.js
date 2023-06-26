const express = require('express'),
  route = express.Router();
const { insertData, updateData, queryData } = require('../sqlite');
const {
  writelog,
  _success,
  _nologin,
  _err,
  nanoid,
  hdSearch,
} = require('../utils');

route.get('/getnote', async (req, res) => {
  try {
    let account = req._userInfo.account;
    let { v: id } = req.query;
    let ntobj = (
      await queryData('getnote', '*', `WHERE state=? AND id=?`, ['0', id])
    )[0];
    await writelog(req, `访问笔记[/note/?v=${id}]`);
    if (ntobj) {
      let { username, share, name, data, account: acc } = ntobj;
      if (share === 'y' || acc === account) {
        let own = 'n';
        if (ntobj.account === account) {
          own = 'y';
        }
        _success(res, 'ok', {
          username,
          name,
          data,
          account: acc,
          own,
        });
      } else {
        _err(res, '当前笔记未公开');
      }
    } else {
      _err(res, '当前笔记不存在');
    }
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
// 笔记搜索处理
route.get('/allsearchlist', async (req, res) => {
  try {
    let { acc, a, page, showpage = 20 } = req.query,
      aa = await queryData(
        'getnote',
        '*',
        `WHERE state=? AND account = ?`,
        ['0', acc]
      );
    aa.reverse();
    if (a) {
      aa = aa.filter(item => item.share === 'y');
      let arr = [];
      aa.forEach((item) => {
        let { name, data, id, share } = item;
        let searchArr = hdSearch(a, data);
        let searchNameArr = hdSearch(a, name);
        if (searchNameArr.length > 0 || searchArr.length > 0) {
          arr.push({
            id,
            share,
            name,
            con: searchArr,
            tNum: searchNameArr.length,
            sNum: searchArr.length
          });
        }
      });
      if (arr.length > 0) {
        arr.sort((a, b) => {
          return b.sNum - a.sNum;
        });
        arr.sort((a, b) => {
          return b.tNum - a.tNum;
        });
      }
      aa = arr;
    }

    aa = aa.map((v) => {
      delete v.data;
      delete v.time;
      delete v.state;
      return v;
    });
    showpage > 200 ? showpage = 200 : null;
    let pagenum = Math.ceil(aa.length / showpage);
    page > pagenum ? (page = pagenum) : page <= 0 ? (page = 1) : null;
    let sdata = aa.slice(showpage * (page - 1), showpage * page);
    _success(res, 'ok', {
      total: aa.length,
      totalPage: pagenum,
      pageNo: page,
      data: sdata,
    });
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
// 笔记
// 公开和锁定笔记
route.post('/locking', async (req, res) => {
  try {
    const account = req._userInfo.account;
    let { arr = [], noteflag = 'n' } = req.body;
    await updateData(
      'note',
      { share: noteflag },
      `WHERE id IN (${new Array(arr.length)
        .fill('?')
        .join(',')}) AND account=? AND state=?`,
      [...arr, account, '0']
    );
    if (noteflag == 'n') {
      await writelog(req, `锁定笔记[${arr.join(',')}]`);
    } else {
      await writelog(req, `公开笔记[${arr.join(',')}]`);
    }
    _success(res);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
// 笔记搜索处理
route.get('/searchlist', async (req, res) => {
  try {
    let account = req._userInfo.account;
    let { a, page, showpage = 20 } = req.query,
      aa = await queryData('getnote', '*', `WHERE state=? AND account=?`, [
        '0',
        account,
      ]);
    aa.reverse()
    if (a) {
      let arr = [];
      aa.forEach((item) => {
        let { name, data, id, share } = item;
        let searchArr = hdSearch(a, data);
        let searchNameArr = hdSearch(a, name);
        if (searchNameArr.length > 0 || searchArr.length > 0) {
          arr.push({
            id,
            share,
            name,
            con: searchArr,
            tNum: searchNameArr.length,
            sNum: searchArr.length
          });
        }
      });
      if (arr.length > 0) {
        arr.sort((a, b) => {
          return b.sNum - a.sNum;
        });
        arr.sort((a, b) => {
          return b.tNum - a.tNum;
        });
      }
      aa = arr;
    }

    aa = aa.map((v) => {
      delete v.data;
      delete v.time;
      delete v.state;
      return v;
    });
    showpage > 200 ? showpage = 200 : null;
    let pagenum = Math.ceil(aa.length / showpage);
    page > pagenum ? (page = pagenum) : page <= 0 ? (page = 1) : null;
    let sdata = aa.slice(showpage * (page - 1), showpage * page);
    _success(res, 'ok', {
      total: aa.length,
      totalPage: pagenum,
      pageNo: page,
      data: sdata,
    });
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
// 删除笔记
route.post('/delnote', async (req, res) => {
  try {
    const account = req._userInfo.account;
    let { arr } = req.body;
    arr = arr.filter((item) => item !== 'about');
    await updateData(
      'note',
      { state: '1' },
      `WHERE id IN (${new Array(arr.length)
        .fill('?')
        .join(',')}) AND account=? AND state=?`,
      [...arr, account, '0']
    );
    await writelog(req, `删除笔记[${arr.join(',')}]`);
    _success(res);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
// 获取笔记内容
route.get('/geteditnote', async (req, res) => {
  try {
    const account = req._userInfo.account;
    let { id } = req.query;
    let noteobj = (
      await queryData('getnote', '*', `WHERE state=? AND id=?`, ['0', id])
    )[0];
    if (noteobj) {
      if (noteobj.share === 'y' || noteobj.account === account) {
        let name = noteobj.name;
        let data = noteobj.data;
        _success(res, 'ok', { name, data });
      } else {
        _err(res, '当前笔记未公开');
      }
    } else {
      _err(res, '当前笔记不存在');
    }
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
// 编辑笔记
route.post('/editnote', async (req, res) => {
  try {
    const account = req._userInfo.account;
    let { id, vn, vt } = req.body;
    let r = await updateData(
      'note',
      {
        name: vn,
        data: vt,
      },
      `WHERE id=? AND state=? AND account=?`,
      [id, '0', account]
    );
    if (r.changes == 0) {
      id = nanoid();
      await insertData('note', [
        {
          id,
          name: vn,
          data: vt,
          time: Date.now(),
          share: 'n',
          account,
        },
      ]);
      await writelog(req, `新增笔记[${vn}(${id})]`);
      _success(res, '新增笔记成功', { id });
    } else {
      await writelog(req, `更新笔记[${vn}(${id})]`);
      _success(res, '更新笔记成功');
    }
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});

module.exports = route;
