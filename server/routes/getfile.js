const express = require('express'),
  fs = require('fs'),
  route = express.Router();
let myconfig = require('../myconfig');
const { _err, _nologin, writelog } = require('../utils');

route.get('*', async (req, res) => {
  try {
    let account = req._userInfo.account;
    // 去除url后的?参数
    let url = req.url.split('?')[0];
    // 合并url
    let path = myconfig.mediaurl.filepath + url;
    // 获取访问目录
    let flag = url.split('/')[1];
    // 解码
    path = decodeURI(path);
    if (!fs.existsSync(path)) {
      _err(res, '文件不存在或已过期~');
      return;
    }
    // 过滤目录
    if (
      flag === 'music' ||
      flag === 'musicys' ||
      flag === 'pic' ||
      flag === 'picys' ||
      flag === 'logo' ||
      flag === 'font'
    ) {
      //不用登录就可以获取的目录
    } else {
      if (!account) {
        _nologin(res);
        return;
      }
    }
    res.sendFile(path);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});

module.exports = route;
