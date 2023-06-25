const express = require('express'),
  fs = require('fs'),
  { filepath } = require('../myconfig'),
  route = express.Router();

const { insertData, updateData, queryData } = require('../sqlite');
const {
  newDate,
  writelog,
  _readdir,
  _mkdir,
  _success,
  _nologin,
  _nothing,
  _err,
  receiveFiles,
  mergefile,
  nanoid,
  isImgFile,
  delDir,
  _rename,
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
// 获取通知
route.get('/notice', async (req, res) => {
  try {
    let account = req._userInfo.account;
    let { acc } = req.query,
      carr = [];
    if (acc === 'chang') {
      carr = await queryData('getchat', '*', `WHERE flag=? AND state=?`, [
        'chang',
        '0',
      ]);
    } else {
      carr = await queryData(
        'getchat',
        '*',
        `WHERE flag in(?,?) AND state = ?`,
        [`${account}-${acc}`, `${acc}-${account}`, '0']
      );
    }
    carr = carr.map((item) => {
      delete item.state;
      return item;
    });
    _success(res, 'ok', carr.slice(-1));
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
//聊天处理
route.get('/getmsg', async (req, res) => {
  try {
    let account = req._userInfo.account;
    let { acc, stu, flag, val } = req.query;
    let carr = [];
    let sarr = [];
    let tt = Date.now();
    // 标记已读
    let r = await updateData(
      'friends',
      { islooK: 'y', time: tt },
      `WHERE friend=? AND account=?`,
      [acc, account]
    );
    if (r.changes == 0) {
      if (acc === 'chang') {
        await insertData('friends', [
          {
            account,
            friend: 'chang',
            time: tt,
            islooK: 'y',
          },
        ]);
      } else {
        let user = await queryData(
          'user',
          'account',
          `WHERE state = ? AND account = ?`,
          ['0', acc]
        );
        if (user.length > 0) {
          await insertData('friends', [
            {
              account,
              friend: acc,
              time: tt,
              islooK: 'y',
            },
            {
              account: acc,
              friend: account,
              time: tt,
              islooK: 'y',
            },
          ]);
        }
      }
    }
    //读取消息
    if (acc === 'chang') {
      carr = await queryData('getchat', '*', `WHERE flag=? AND state=?`, [
        'chang',
        '0',
      ]);
    } else {
      carr = await queryData(
        'getchat',
        '*',
        `WHERE flag in(?,?) AND state = ?`,
        [`${account}-${acc}`, `${acc}-${account}`, '0']
      );
    }
    if (val) {
      val = val.toLowerCase();
      carr = carr.filter((item) => {
        let { name, data, date } = item;
        let str = name + '|' + data + '|' + date;
        return hdSearch(val, str).length > 0;
      });
    }
    let flagStr = '';
    carr = carr.map((item) => {
      delete item.state;
      let d = item.date || newDate('{0}-{1}-{2}', item.time);
      if (d === flagStr) {
        item.showTime = 'n';
      } else {
        item.showTime = 'y';
      }
      flagStr = d;
      return item;
    });
    // 获取消息
    if (carr.length > 0) {
      if (+stu === 0) {
        //打开聊天框
        sarr = carr.slice(-50);
      } else if (+stu === 1) {
        //向上滚动
        let ci = carr.findIndex((v) => v.id === flag);
        if (ci < 0) {
          sarr = [];
        } else {
          let st = ci - 50 <= 0 ? 0 : ci - 50;
          sarr = carr.slice(st, ci);
        }
      } else if (+stu === 2) {
        //新消息
        let ci = carr.findIndex((v) => v.id === flag);
        if (carr.length - 1 == ci) {
          sarr = [];
        } else {
          sarr = carr.slice(ci + 1);
        }
      }
      _success(res, 'ok', sarr);
    } else {
      _success(res, 'ok', []);
    }
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
// 文件是否过期
route.get('/isexpired', (req, res) => {
  let name = req.query.name;
  if (fs.existsSync(`${filepath}${name}`)) {
    _success(res);
    return;
  }
  _nothing(res);
});
// 接收信息数据
route.post('/takemsg', async (req, res) => {
  try {
    let account = req._userInfo.account;
    let { obj } = req.body;
    if (obj._to !== 'chang') {
      let user = await queryData(
        'user',
        'account',
        `WHERE state = ? AND account = ?`,
        ['0', obj._to]
      );
      if (user.length === 0) {
        _err(res)
        return
      }
    }
    obj.flag = obj._to === 'chang' ? 'chang' : `${account}-${obj._to}`;
    obj.id = nanoid();
    obj.time = Date.now();
    obj.date = newDate('{0}-{1}-{2}', obj.time);
    obj.state = 0;
    await insertData('chat', [obj]);
    _success(res);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
// 查看是否有未读消息
route.get('/getnews', async (req, res) => {
  try {
    let account = req._userInfo.account;
    let a = req.query.a,
      arr = await queryData('friends', '*', `WHERE account=?`, [account]),
      i;
    if (a == 1) {
      //未读群聊消息
      i = arr.some((item) => item.friend === 'chang' && item.islook === 'n');
    } else if (a == 2) {
      //未读私聊消息
      i = arr.some((item) => item.friend !== 'chang' && item.islook === 'n');
    } else if (a == 3) {
      //有未读消息
      i = arr.some((item) => item.islook === 'n');
    }
    if (i) {
      //未读
      _nothing(res);
    } else {
      //已读
      _success(res);
    }
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
//删除消息
route.post('/delmsg', async (req, res) => {
  try {
    let { tt } = req.body;
    const account = req._userInfo.account;
    await updateData(
      'chat',
      { state: '1' },
      `WHERE id=? AND state=? AND _from=?`,
      [tt, '0', account]
    );
    await writelog(req, `撤回消息[${tt}]`);
    _success(res);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
//清空消息
route.post('/clearmsg', async (req, res) => {
  try {
    const account = req._userInfo.account;
    let { ac } = req.body;
    if (ac === 'chang') {
      if (account === 'root') {
        await updateData('chat', { state: '1' }, `WHERE _to=? AND state=?`, [
          'chang',
          '0',
        ]);
        _success(res);
      } else {
        _err(res);
      }
    } else {
      await updateData(
        'chat',
        { state: '1' },
        `WHERE flag in(?,?) AND state = ?`,
        [`${account}-${ac}`, `${ac}-${account}`, '0']
      );
      _success(res);
    }
    await writelog(req, `清空消息[${ac}]`);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
// 查看群成员
route.get('/getmember', async (req, res) => {
  try {
    const account = req._userInfo.account;
    let udata = [],
      farr = await queryData('friends', '*', `WHERE account=?`, [account]); //用户所在的所有聊天室
    let user = await queryData('user', '*', `WHERE state = ?`, ['0']);
    user.forEach((w) => {
      //遍历所有用户
      let { username, account: acc, time } = w;
      if (acc === account) return; //不包括自己
      let obj = {
        username,
        account: acc,
        logo: `/logo/${acc}/${acc}.png`,
        online: Date.now() - time > 1000 * 30 ? 'n' : 'y',
      };
      farr.forEach((y) => {
        if (y.friend === acc) {
          //拥有共同聊天室
          obj.islook = y.islook;
          obj.time = y.time;
        }
      });
      udata.push(obj);
    });
    _success(res, 'ok', udata);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
// 接收图片文件
route.post('/up', async (req, res) => {
  try {
    let { name, HASH } = req.query,
      path = `${filepath}/tem/${HASH}`;
    await _mkdir(path);
    await receiveFiles(req, path, name);
    _success(res);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
//接收语音
route.post('/upp', async (req, res) => {
  try {
    let path = `${filepath}/upload`;
    await receiveFiles(req, path, req.query.name);
    _success(res);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
//合并文件
route.post('/mergefile', async (req, res) => {
  try {
    let { HASH, count, name } = req.body;
    await delDir(`${filepath}/upload/${name}`);
    await delDir(`${filepath}/uploadys/${name}`);
    if (isImgFile(name)) {
      await _rename(
        `${filepath}/tem/${HASH}/_hello`,
        `${filepath}/uploadys/${name}`
      );
      --count;
    }
    await mergefile(
      count,
      `${filepath}/tem/${HASH}`,
      `${filepath}/upload/${name}`
    );
    _success(res);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
// 断点续传
route.post('/breakpoint', async (req, res) => {
  try {
    let { HASH } = req.body,
      path = `${filepath}/tem/${HASH}`,
      arr = await _readdir(path);
    _success(res, 'ok', arr);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
// 检查上传文件是否重复
route.post('/repeatfile', async (req, res) => {
  try {
    let { name } = req.body;
    let u = `${filepath}/upload/${name}`;
    let uys = `${filepath}/uploadys/${name}`;
    if (fs.existsSync(u)) {
      if (isImgFile(name)) {
        if (fs.existsSync(uys)) {
          _success(res);
          return;
        }
        _nothing(res);
      } else {
        _success(res);
      }
      return;
    }
    _nothing(res);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});

module.exports = route;
