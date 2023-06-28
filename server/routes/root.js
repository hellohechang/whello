const express = require('express'),
  route = express.Router();

const _d = require('../data');
const { updateData, deleteData, queryData } = require('../sqlite');
const {
  writelog,
  _readFile,
  _writeFile,
  _readdir,
  _unlink,
  delDir,
  _success,
  _err,
  jwten,
  hdSearch,
  sliceLog,
} = require('../utils');

//拦截器
route.use((req, res, next) => {
  if (req._userInfo.account !== 'root') {
    _err(res, '没有权限操作');
  } else {
    next();
  }
});
//管理员处理
// 重置密码
route.get('/resetpass', async (req, res) => {
  try {
    let a = req.query.a;
    await updateData(
      'user',
      {
        password: '90089e402b00', //密码重置为空
        flag: parseInt(Date.now() / 1000),
      },
      `WHERE account=? AND state=?`,
      [a, '0']
    );
    await writelog(req, `重置[${a}]密码为空`);
    _success(res, '重置密码成功');
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
//获取用户列表
route.get('/userlist', async (req, res) => {
  try {
    let arr = await queryData('user', '*');
    arr = arr.map((item) => {
      return {
        ...item,
        online: Date.now() - item.time > 1000 * 30 ? 'n' : 'y',
      };
    });
    _success(res, 'ok', {
      logSaveDay: _d.logSaveDay,
      filepath: _d.filepath,
      registerstate: _d.registerstate,
      tokenKey: _d.tokenKey,
      list: arr
    });
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
//通过管理员注销账号
route.post('/deluser', async (req, res) => {
  try {
    let { ac, flag = '1' } = req.body;
    if (ac !== 'root') {
      await updateData(
        'user',
        {
          state: flag,
        },
        `WHERE account=?`,
        [ac]
      );
      if (flag == 0) {
        _success(res, '成功激活账号');
      } else {
        await deleteData('friends', `WHERE account = ? OR friend = ?`, [
          ac,
          ac,
        ]);
        _success(res, '成功关闭账号');
      }
      await writelog(req, `${flag == 0 ? '激活' : '关闭'} 账号[${ac}]`);
    } else {
      _err(res, '没有权限操作');
    }
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
//通过管理员注销账号
route.post('/delaccount', async (req, res) => {
  try {
    let { ac } = req.body;
    if (ac !== 'root') {
      await deleteData('user', `WHERE account=?`, [ac]);
      await delDir(`${_d.filepath}/logo/${ac}`);
      await writelog(req, `销毁账号[${ac}]`);
      _success(res, '成功销毁账号');
    } else {
      _err(res, '没有权限操作');
    }
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
//登录其他
route.post('/loginother', async (req, res) => {
  try {
    const ac = req.body.a;
    let token = jwten(ac);
    res.cookie('token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 3,
      httpOnly: true,
    });
    _success(res, 'ok');
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
// 清空upload
route.get('/clearup', async (req, res) => {
  try {
    let up = await _readdir(`${_d.filepath}/upload`);
    up.forEach(async (v) => {
      let p = `${_d.filepath}/upload/${v}`;
      let pys = `${_d.filepath}/uploadys/${v}`;
      delDir(p);
      delDir(pys);
    });
    await writelog(req, '清空upload目录');
    _success(res, '成功清空upload目录');
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
//日志处理
//搜索日志
route.get('/logsearch', async (req, res) => {
  try {
    let { page, context, showpage = 100 } = req.query,
      arr = [];
    arr = (await _readFile('./hello.log', true)).toString().split('\n');
    arr.pop();
    arr.reverse();
    if (context) {
      let sArr = [];
      arr.forEach((item) => {
        let searchArr = hdSearch(context, item);
        if (searchArr.length > 0) {
          sArr.push({
            item,
            sNum: searchArr.length,
          });
        }
      });
      sArr.sort((a, b) => b.sNum - a.sNum);
      arr = sArr.map((v) => v.item);
    }
    showpage > 200 ? showpage = 200 : null;
    let pagenum = Math.ceil(arr.length / showpage);
    page > pagenum ? (page = pagenum) : page <= 0 ? (page = 1) : null;
    let arr1 = arr.slice(showpage * (page - 1), showpage * page);
    _success(res, 'ok', {
      total: arr.length,
      totalPage: pagenum,
      pageNo: page,
      data: arr1,
    });
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
// 清空日志
route.post('/logclear', async (req, res) => {
  try {
    await _writeFile('./hello.log', '');
    await writelog(req, '清空日志');
    _success(res);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
// 删除多余聊天记录
route.get('/clearchatdata', async (req, res) => {
  try {
    await deleteData('chat', `WHERE state=?`, ['1']);
    await writelog(req, '清理已删除的聊天记录');
    _success(res);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
//删除多余歌曲文件
route.get('/delmusicfile', async (req, res) => {
  try {
    let musics = await queryData('musics', '*');
    let delarr = [];
    (await _readdir(`${_d.filepath}/music`)).forEach((item) => {
      let i = item.lastIndexOf('.');
      if (!musics.some((v) => `${v.artist}-${v.name}` === item.slice(0, i))) {
        _unlink(`${_d.filepath}/music/${item}`);
        delarr.push(item);
      }
      if (item.slice(i).toLowerCase() === '.mp4') {
        if (
          musics.some(
            (v) => `${v.artist}-${v.name}` === item.slice(0, i) && v.mv === ''
          )
        ) {
          _unlink(`${_d.filepath}/music/${item}`);
          delarr.push(item);
        }
      }
    });
    (await _readdir(`${_d.filepath}/musicys`)).forEach((item) => {
      let i = item.lastIndexOf('.');
      if (!musics.some((v) => `${v.artist}-${v.name}` === item.slice(0, i))) {
        _unlink(`${_d.filepath}/musicys/${item}`);
        delarr.push(item);
      }
    });
    await writelog(req, `删除歌曲文件 [${delarr.join(',')}]`);
    _success(res);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
//设置注册状态
route.post('/isregister', async (req, res) => {
  try {
    _d.registerstate = _d.registerstate == 'y' ? 'n' : 'y';
    await writelog(req, `${_d.registerstate === 'y' ? '开放' : '关闭'}注册`);
    _success(res, 'ok', _d.registerstate);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
})
route.post('/updatetoken', async (req, res) => {
  try {
    let { token } = req.body;
    _d.tokenKey = token;
    await writelog(req, `[更新tokenKey]`);
    _success(res);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
})
route.post('/updatefilepath', async (req, res) => {
  try {
    let { filepath } = req.body;
    _d.filepath = filepath;
    await writelog(req, `[更新filepath]`);
    _success(res);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
})
route.post('/logsaveday', async (req, res) => {
  try {
    let { day } = req.body;
    day = parseInt(day);
    if (isNaN(day) || day < 0) {
      _err(res);
      return;
    };
    _d.logSaveDay = day;
    await sliceLog(day);
    await writelog(req, `更新log保存时间[${day || '无限制'}]`);
    _success(res);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
})

module.exports = route;
