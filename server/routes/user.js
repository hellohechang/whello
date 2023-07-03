const _d = require('../data');

const express = require('express'),
  fs = require('fs'),
  route = express.Router();

let {
  writelog,
  _mkdir,
  _unlink,
  userlenght,
  isUserName,
  encryption,
  _success,
  _nologin,
  _nothing,
  _err,
  _setTimeout,
  jwten,
  receiveFiles,
  nanoid,
  _appendFile,
  formatDate,
  _readFile,
  _readdir,
} = require('../utils'),
  {
    insertData,
    updateData,
    deleteData,
    queryData,
    runSqlite,
  } = require('../sqlite'),
  landingerr = {}, //多次密码错误IP临时存放
  realTimeData = {}; //同步数据存放
// 前端错误记录
route.post('/panelerror', async (req, res) => {
  try {
    await writelog(req, req.body.err);
    _success(res);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
//获取字体
route.get('/getfont', async (req, res) => {
  try {
    let arr = await _readdir(`${_d.filepath}/font`);
    _success(res, 'ok', arr);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
route.get('/isregister', async (req, res) => {
  try {
    _success(res, 'ok', _d.registerstate)
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
})
queryData('user', 'account').then(() => { }).catch(async () => {
  try {
    await runSqlite(`CREATE TABLE booklist (
    state   TEXT DEFAULT (0) 
                 NOT NULL,
    id      TEXT NOT NULL
                 UNIQUE
                 PRIMARY KEY,
    account TEXT NOT NULL,
    num     INT  NOT NULL,
    name    TEXT NOT NULL
);
`);
    await runSqlite(`CREATE TABLE bookmk (
    state   TEXT DEFAULT (0) 
                 NOT NULL,
    num     INT  NOT NULL,
    id      TEXT NOT NULL
                 UNIQUE
                 PRIMARY KEY,
    listid  TEXT NOT NULL,
    account TEXT NOT NULL,
    name    TEXT NOT NULL,
    link    TEXT NOT NULL,
    logo    TEXT NOT NULL,
    des     TEXT NOT NULL
                 DEFAULT ('') 
);
`);
    await runSqlite(`CREATE TABLE chat (
    state TEXT DEFAULT (0) 
               NOT NULL,
    id    TEXT NOT NULL
               UNIQUE
               PRIMARY KEY,
    _from TEXT NOT NULL,
    _to   TEXT NOT NULL,
    flag  TEXT NOT NULL,
    time  TEXT NOT NULL,
    date  TEXT NOT NULL,
    data  TEXT NOT NULL,
    isrc  TEXT NOT NULL
               DEFAULT (''),
    size  TEXT NOT NULL
               DEFAULT ('') 
);
`);
    await runSqlite(`CREATE TABLE friends (
    account TEXT NOT NULL,
    friend  TEXT NOT NULL,
    islook  TEXT DEFAULT y
                 NOT NULL,
    time    TEXT NOT NULL
);
`);
    await runSqlite(`CREATE TABLE history (
    state   TEXT DEFAULT (0) 
                 NOT NULL,
    id      TEXT NOT NULL
                 UNIQUE
                 PRIMARY KEY,
    account TEXT NOT NULL,
    data    TEXT NOT NULL
);
`);
    await runSqlite(`CREATE TABLE lastmusic (
    state   TEXT DEFAULT (0) 
                 NOT NULL,
    account TEXT NOT NULL
                 UNIQUE
                 PRIMARY KEY,
    data    TEXT NOT NULL
);
`);
    await runSqlite(`CREATE TABLE musicinfo (
    account TEXT NOT NULL
                 UNIQUE
                 PRIMARY KEY,
    data    TEXT NOT NULL
);
`);
    await runSqlite(`CREATE TABLE musics (
    id            TEXT UNIQUE
                       NOT NULL
                       PRIMARY KEY,
    name          TEXT NOT NULL,
    artist        TEXT NOT NULL,
    duration      TEXT NOT NULL,
    mv            TEXT DEFAULT ('') 
                       NOT NULL,
    collect_count TEXT DEFAULT (0) 
                       NOT NULL,
    play_count    TEXT DEFAULT (0) 
                       NOT NULL,
    album         TEXT NOT NULL
                       DEFAULT (''),
    year          TEXT NOT NULL
                       DEFAULT (''),
    creat_time    TEXT NOT NULL
                       DEFAULT ('') 
);
`);
    await runSqlite(`CREATE TABLE note (
    state       TEXT DEFAULT (0) 
                     NOT NULL,
    id          TEXT NOT NULL
                     UNIQUE
                     PRIMARY KEY,
    account     TEXT NOT NULL,
    name        TEXT NOT NULL,
    share       TEXT DEFAULT n
                     NOT NULL,
    data        TEXT NOT NULL,
    time        TEXT NOT NULL,
    visit_count TEXT NOT NULL
                     DEFAULT (0) 
);
`);
    await runSqlite(`CREATE TABLE playing (
    account TEXT NOT NULL
                 UNIQUE
                 PRIMARY KEY,
    data    TEXT NOT NULL
);
`);
    await runSqlite(`CREATE TABLE share (
    type    TEXT DEFAULT (0) 
                 NOT NULL,
    id      TEXT NOT NULL
                 UNIQUE
                 PRIMARY KEY,
    account TEXT NOT NULL,
    data    TEXT NOT NULL
);
`);
    await runSqlite(`CREATE TABLE user (
    state    TEXT DEFAULT (0) 
                  NOT NULL,
    account  TEXT NOT NULL
                  UNIQUE
                  PRIMARY KEY,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    time     TEXT NOT NULL,
    bg       TEXT NOT NULL,
    bgxs     TEXT NOT NULL,
    dailybg  TEXT DEFAULT n
                  NOT NULL,
    flag     TEXT DEFAULT (0) 
                  NOT NULL
);
`);
    await runSqlite(`CREATE VIEW getchat AS
    SELECT u.username name,
           c.state,
           c._from,
           c.id,
           c._to,
           c.flag,
           c.time,
           c.date,
           c.data,
           c.isrc,
           c.size
      FROM chat AS c
           LEFT JOIN
           user AS u ON u.account = c._from;
`);
    await runSqlite(`CREATE VIEW getnote AS
    SELECT u.username,
          n.visit_count,
          n.state,
          n.id,
          n.account,
          n.name,
          n.time,
          n.data,
          n.share
    FROM note AS n
          LEFT JOIN
          user AS u ON u.account = n.account;
`);
    await runSqlite(`CREATE VIEW getshare AS
    SELECT u.username,
           s.id,
           s.account,
           s.type,
           s.data
      FROM share AS s
           LEFT JOIN
           user AS u ON u.account = s.account;
`);
    await insertData('user', [
      {
        username: 'root',
        account: 'root',
        time: Date.now(),
        bg: '',
        bgxs: '',
        dailybg: 'n',
        flag: '0',
        password: '90089e402b00',
      }
    ]);
    await _mkdir(`${_d.filepath}/logo/root`); //创建书签图标目录
    fs.copyFileSync(
      `admin.jpg`,
      `${_d.filepath}/logo/root/root.png`
    );
    await insertData('note', [
      {
        id: 'about',
        name: 'About',
        data: (await _readFile('./default_about.md', 1)).toString(),
        time: Date.now(),
        share: 'y',
        account: 'root',
      },
    ]);
  } catch (error) {
    let str = `[${formatDate({ template: '{0}-{1}-{2} {3}:{4}' })}] - ${error}\n`;
    await _appendFile('./hello.log', str);
  }
});
// 注册
route.post('/register', async (req, res) => {
  try {
    if (_d.registerstate === 'n') {
      _err(res)
      return
    }
    let { username, password } = req.body;
    // 验证昵称格式
    if (userlenght(username) || !isUserName(username)) {
      _err(res, '昵称格式错误');
      return;
    }
    // 写入用户数据
    let account = nanoid();
    let now = Date.now();
    await insertData('user', [
      {
        username,
        account,
        time: now,
        password: encryption(password),
        bg: '',
        bgxs: '',
        dailybg: 'n',
        flag: '0',
      },
    ]);
    await _mkdir(`${_d.filepath}/logo/${account}`); //创建书签图标目录
    fs.copyFileSync(`admin.jpg`, `${_d.filepath}/logo/${account}/${account}.png`);
    await writelog(req, `注册账号[${username}(${account})]`);
    // 生成token
    let token = jwten(account);
    res.cookie('token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 3,
      httpOnly: true,
    });
    _success(res, '注册账号成功', account);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
//登录
route.post('/login', async (req, res) => {
  try {
    let account = req.body.account,
      password = req.body.password,
      _ip = req._ip;
    // 过滤登录密码三次错误的登录IP地址
    if (!landingerr.hasOwnProperty(_ip) || landingerr[_ip] < 3) {
      //验证用户名和账号是否存在
      let ruser = await queryData(
        'user',
        '*',
        `WHERE (account = ? OR username =?) AND state = ?`,
        [account, account, '0']
      );
      if (ruser.length === 0) {
        _err(res, '账号不存在');
        return;
      }
      //验证密码
      let _userinfo = ruser.find(
        (item) => item.password === encryption(password)
      );

      if (_userinfo) {
        let token = jwten(_userinfo.account);
        res.cookie('token', token, {
          maxAge: 1000 * 60 * 60 * 24 * 3,
          httpOnly: true,
        });
        await writelog(
          req,
          `[${_userinfo.username}(${_userinfo.account})]登录成功`
        );
        _success(res, '登录成功', _userinfo.account);
        if (landingerr.hasOwnProperty(_ip)) delete landingerr[_ip];
      } else {
        _err(res, '登录密码错误，请重新输入');
        landingerr.hasOwnProperty(_ip)
          ? landingerr[_ip]++
          : (landingerr[_ip] = 1);
        if (landingerr[_ip] === 3) {
          _setTimeout(() => {
            delete landingerr[_ip];
          }, 1000 * 60 * 10);
        }
        ruser.forEach((item) => {
          writelog(req, `[${item.username}(${item.account})]登录密码错误`);
        });
      }
    } else {
      _err(res, '登录密码多次错误，请10分钟后再试');
    }
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
// 修改密码
route.post('/changepass', async (req, res) => {
  try {
    let account = req._userInfo.account,
      { oldpassword, newpassword } = req.body;
    //对比原密码
    if (encryption(oldpassword) === req._userInfo.password) {
      await updateData(
        'user',
        {
          password: encryption(newpassword)
        },
        `WHERE account=? AND state=?`,
        [account, '0']
      );
      _success(res, '修改密码成功');
      await writelog(req, `修改密码`);
    } else {
      _err(res, '原密码错误，请重新输入');
      await writelog(req, `修改密码失败`);
    }
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
// 退出登录
route.get('/signout', async (req, res) => {
  try {
    let account = req._userInfo.account,
      { all } = req.query;
    if (all === 'y') {
      //退出所有登录设备
      await updateData(
        'user',
        {
          flag: parseInt(Date.now() / 1000),
        },
        `WHERE account=? AND state=?`,
        [account, '0']
      );
    }
    res.clearCookie('token');
    _success(res, '退出成功');
    writelog(req, `退出登录`);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
// 修改用户名
route.post('/changeusername', async (req, res) => {
  try {
    let account = req._userInfo.account,
      usname = req.body.username;
    // 验证昵称格式
    if (!isUserName(usname)) {
      _err(res, '昵称格式错误，请重新输入');
      await writelog(req, '修改昵称失败');
      return;
    }
    await updateData(
      'user',
      {
        username: usname,
      },
      `WHERE account=? AND state=?`,
      [account, '0']
    );
    await writelog(req, '修改昵称');
    _success(res, '修改昵称成功');
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
    return;
  }
});
// 注销账号
route.post('/delaccount', async (req, res) => {
  try {
    let account = req._userInfo.account;
    if (account === 'root') {
      _err(res, '没有权限操作');
    } else {
      await updateData(
        'user',
        {
          state: '1',
        },
        `WHERE account=?`,
        [account]
      );
      await deleteData('friends', `WHERE account = ? OR friend = ?`, [
        account,
        account,
      ]);
      await writelog(req, `关闭账号`);
      res.clearCookie('token');
      _success(res, '注销账号成功');
    }
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
//获取配置数据
route.get('/getuserinfo', async (req, res) => {
  try {
    delete req._userInfo.flag;
    delete req._userInfo.state;
    delete req._userInfo.password;
    delete req._userInfo.time;
    _success(res, 'ok', req._userInfo);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
// 上传头像
route.post('/upuserlogo', async (req, res) => {
  try {
    let account = req._userInfo.account,
      path = `${_d.filepath}/logo/${account}`;
    await _mkdir(path);
    await _unlink(`${path}/${account}.png`);
    receiveFiles(req, path, `${account}.png`)
      .then(async () => {
        _success(res, '更新头像成功');
        await writelog(req, '更新头像');
      })
      .catch(async () => {
        _err(res);
        await writelog(req, '更新头像失败');
      });
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
//每日更新壁纸
route.get('/dailybg', async (req, res) => {
  try {
    let account = req._userInfo.account,
      ff;
    if (!req._userInfo.dailybg || req._userInfo.dailybg === 'n') {
      ff = 'y';
      await writelog(req, `开启每日自动更新壁纸`);
      _success(res, '成功开启');
    } else {
      ff = 'n';
      await writelog(req, `关闭每日自动更新壁纸`);
      _success(res, '成功关闭');
    }
    await updateData(
      'user',
      {
        dailybg: ff,
      },
      `WHERE account=? AND state=?`,
      [account, '0']
    );
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
// token续期
route.get('/renewal', (req, res) => {
  let account = req._userInfo.account,
    token = jwten(account);
  res.cookie('token', token, {
    maxAge: 1000 * 60 * 60 * 24 * 3,
    httpOnly: true,
  });
  _success(res, 'ok');
});
// 数据同步
route.get('/realtime', async (req, res) => {
  try {
    let account = req._userInfo.account;
    let { flag, id } = req.query; //标识和设备ID
    if (!realTimeData.hasOwnProperty(account)) {
      //如果没有，创建指令对象
      realTimeData[account] = {
        id: '',
        flag: Math.random().toFixed(10).slice(-10)
      };
    }
    // 更新在线时间
    await updateData(
      'user',
      {
        time: Date.now(),
      },
      `WHERE account=? AND state=?`,
      [account, '0']
    );
    flag == 0 ? (flag = realTimeData[account].flag) : null; //初始化指令标识
    let num = 0
    let timer = setInterval(() => {
      try {
        num++
        if (num >= 30) {
          if (timer) {
            clearInterval(timer);
            timer = null;
          }
          _nothing(res, { flag })
          return
        }
        let sendObj = realTimeData[account];
        if (!sendObj.id || sendObj.id == id || sendObj.flag == flag) return; //过滤当前设备并验证标识
        if (timer) {
          clearInterval(timer);
          timer = null;
        }
        _success(res, 'ok', sendObj);
      } catch (error) {
        if (timer) {
          clearInterval(timer);
          timer = null;
        }
        writelog(req, `[${req._pathUrl}] ${error}`);
        _err(res);
      }
    }, 1000);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
//接收指令
route.post('/realtime', async (req, res) => {
  try {
    let account = req._userInfo.account;
    let { data, id } = req.body; //指令内容和登录设备ID
    let users = await queryData('user', '*', `WHERE state = ?`, ['0']);
    data.from = account
      ? {
        //标记指令来源用户
        account,
        username: users.find((item) => item.account === account).username,
      }
      : {};
    //如果是更新数据和远程操作指令，只通知登录同一账号的设备
    if (data.type === 'updatedata' || data.type === 'yc') {
      data.to = account;
    }
    let todata = {
      //生成指令对象
      data,
      id,
      flag: Math.random().toFixed(10).slice(-10), //指令是否已接收标识
    };
    //聊天指令
    if (data.type == 'chat') {
      // 标记消息为未读状态
      if (data.flag === 'addmsg') {
        //如果是发送的新消息
        let t = Date.now() + '';
        if (data.to === 'chang') {
          //群消息
          await updateData(
            'friends',
            { islooK: 'n', time: t },
            `WHERE friend=?`,
            ['chang']
          );
        } else {
          await updateData(
            'friends',
            { islooK: 'n', time: t },
            `WHERE account=? AND friend=?`,
            [data.to, account]
          );
        }
      }
      if (data.to === 'chang') {
        //发送群消息
        users.forEach((item) => {
          //通知所有用户
          realTimeData[item.account] = todata;
        });
      } else {
        //通知指定人
        realTimeData[data.to] = todata;
        realTimeData[account] = todata; //同账号多设备同步聊天记录
      }
    } else {
      realTimeData[data.to] = todata;
    }
    _success(res);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
// 分享列表
route.post('/deleteshare', async (req, res) => {
  try {
    let account = req._userInfo.account;
    let { id } = req.body;
    if (id) {
      await deleteData('share', `WHERE id=? AND account=?`, [id, account]);
      await writelog(req, `删除分享[${id}]`);
      _success(res, '删除分享成功');
    } else {
      await deleteData('share', `WHERE account=?`, [account]);
      await writelog(req, `清空分享列表`);
      _success(res, '清空分享列表成功');
    }
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
route.get('/sharelist', async (req, res) => {
  try {
    let account = req._userInfo.account;
    let arr = await queryData('share', 'id,type', `WHERE account=?`, [account]);
    _success(res, 'ok', arr);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
// 回收站
route.get('/getrecycle', async (req, res) => {
  try {
    let { type, page, showpage = 20 } = req.query,
      account = req._userInfo.account,
      str = 'id,name';
    if (type === 'bookmk') {
      str = 'id,name,link';
    } else if (type === 'history') {
      str = 'id,data';
    }
    let arr = await queryData(type, str, `WHERE account=? AND state=?`, [
      account,
      '1',
    ]);
    arr.reverse();
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
// 删除回收站内容
route.post('/deleterecycle', async (req, res) => {
  try {
    let { arr, type } = req.body,
      account = req._userInfo.account;
    await deleteData(type, `WHERE id IN (${new Array(arr.length).fill('?').join(',')}) AND account=? AND state=?`,
      [...arr, account, '1']
    );
    if (type === 'booklist') {
      await deleteData('bookmk', `WHERE listid IN (${new Array(arr.length)
        .fill('?')
        .join(',')}) AND account=?`, [...arr, account])
    }
    await writelog(req, `删除回收站(${type})[${arr.join(',')}]`);
    _success(res, '删除成功');
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
// 恢复回收站内容
route.post('/recoverrecycle', async (req, res) => {
  try {
    let { arr, type } = req.body,
      account = req._userInfo.account;
    await updateData(
      type,
      { state: '0' },
      `WHERE id IN (${new Array(arr.length)
        .fill('?')
        .join(',')}) AND account=? AND state=?`,
      [...arr, account, '1']
    );
    await writelog(req, `恢复回收站(${type})[${arr.join(',')}]`);
    _success(res, '恢复成功');
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});

module.exports = route;
