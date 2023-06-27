const fs = require('fs');

const os = require('os');

//Cookie
const cookieParser = require('cookie-parser');

const express = require('express');

const app = express();

const bodyParser = require('body-parser');

// 获取访问设备信息
const UAParser = require('ua-parser-js');

// 操作SQLite数据库
let { updateData, queryData } = require('./sqlite.js');
// 配置
let { filepath, port } = require('./myconfig');
let {
  writelog,
  _readdir,
  getClientIp,
  delDir,
  formatDate,
  _err,
  jwtde,
  _mkdir,
  readMenu,
  _readFile,
  sliceLog,
} = require('./utils');

if (fs.existsSync(filepath)) {
  app.listen(port, () => {
    let arr = getLocahost().map(
      (item) => `http://${item}${port == 80 ? '' : `:${port}`}`
    );
    console.log(`服务开启成功，访问地址为：\n${arr.join('\n')}`);
  });
  _mkdir(`${filepath}/music`);
  _mkdir(`${filepath}/musicys`);
  _mkdir(`${filepath}/bg/bg`);
  _mkdir(`${filepath}/bg/bgxs`);
  _mkdir(`${filepath}/bgys/bg`);
  _mkdir(`${filepath}/bgys/bgxs`);
  _mkdir(`${filepath}/upload`);
  _mkdir(`${filepath}/uploadys`);
  _mkdir(`${filepath}/pic`);
  _mkdir(`${filepath}/picys`);
  _mkdir(`${filepath}/logo`);
  _mkdir(`${filepath}/font`);
  _mkdir(`${filepath}/tem`);
} else {
  console.log(`请在myconfig.js文件中设置正确的文件存放目录`);
}

//Cookie
app.use(cookieParser());
//设置bodyParser
app.use(bodyParser.json({ limit: '50mb', parameterLimit: 1000000 }));
app.use(
  bodyParser.urlencoded({
    limit: '50mb',
    parameterLimit: 1000000,
    extended: false,
  })
);

let ipobj = {};
//访问拦截
app.use(async (req, res, next) => {
  try {
    let _token = req.cookies.token, //读取token
      uobj = {},
      obj = jwtde(_token); //解密token
    let userinfo = await queryData(
      'user',
      '*',
      `WHERE state = ? AND account = ?`,
      ['0', obj.account]
    );
    if (userinfo.length > 0) {
      if ((userinfo[0].flag || 0) < obj.iat) {
        //对比token生成的时间
        uobj = userinfo[0];
      }
    }
    req._userInfo = uobj;
    req._ip = getClientIp(req);
    req._pathUrl = req.url.split('?')[0];
    let _clientConfig = new UAParser(req.headers['user-agent']).getResult(); //获取访问设备信息
    req._os =
      (_clientConfig.os.name || 'other') +
      (_clientConfig.device.vendor
        ? `(${_clientConfig.device.vendor || ''} ${_clientConfig.device.model || ''
        })`
        : '');
    if (!uobj.account) {
      if (!ipobj[req._ip]) {
        ipobj[req._ip] = 'y';
        await writelog(req, `[${req.headers['user-agent']}]`);
      }
    }
    next();
  } catch (error) {
    await writelog(req, `[app.use] ${error}`);
    _err(res);
  }
});

app.use('/api/user', require('./routes/user'));
app.use('/api/bg', require('./routes/bg'));
app.use('/api/pic', require('./routes/pic'));
app.use('/api/root', require('./routes/root'));
app.use('/api/player', require('./routes/player'));
app.use('/api/nav', require('./routes/nav'));
app.use('/api/home', require('./routes/home'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/search', require('./routes/search'));
app.use('/api/note', require('./routes/note'));
app.use('/api/getfile', require('./routes/getfile'));

app.use(express.static(__dirname + '/static'));
app.get('*', (req, res) => {
  res.sendFile(__dirname + '/404.html');
});
// 每天零点执行
let _timer = setInterval(async () => {
  try {
    if (formatDate({ template: '{3}{4}{5}' }) === '000000') {
      ipobj = {};
      //删除upload超20天的文件
      let upload = await readMenu(`${filepath}/upload`);
      let now = Date.now();
      upload.forEach(async (v) => {
        let { name, time } = v;
        let p = `${filepath}/upload/${name}`;
        let pys = `${filepath}/uploadys/${name}`;
        if (now - time >= 20 * 24 * 60 * 60 * 1000) {
          await delDir(p);
          await delDir(pys);
        }
      });
      //每日切换壁纸
      let bgarr = await _readdir(`${filepath}/bg/bg`),
        bgxsarr = await _readdir(`${filepath}/bg/bgxs`);
      let num = Math.round(Math.random() * (bgarr.length - 1 - 0) + 0),
        xsnum = Math.round(Math.random() * (bgxsarr.length - 1 - 0) + 0);

      updateData(
        'user',
        { bg: bgarr[num] || '', bgxs: bgxsarr[xsnum] || '' },
        `WHERE dailybg=? AND state=?`,
        ['y', '0']
      );

      let { logSaveDay } = await _readFile('./config.json');
      await sliceLog(logSaveDay);
    }
  } catch (error) {
    clearInterval(_timer)
    _timer = null
    await writelog(false, `[/app/setInterval] ${error}`);
  }
}, 1000);
function getLocahost() {
  let obj = os.networkInterfaces();
  let arr = [];
  Object.keys(obj).forEach((item) => {
    let value = obj[item];
    if (Object.prototype.toString.call(value).slice(8, -1) === 'Array') {
      arr = [
        ...arr,
        ...value
          .filter((item) => item.family == 'IPv4')
          .map((item) => item.address),
      ];
    }
  });
  return arr;
}
