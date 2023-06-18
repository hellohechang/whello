const express = require('express'),
  fs = require('fs'),
  route = express.Router();
let myconfig = require('../myconfig');
const { _err, _nologin, writelog } = require('../utils');

route.get('*', async (req, res) => {
  try {
    let account = req._userInfo.account;
    let url = req.url.replace(/(\?|\#).*$/, '').replace(/\/$/, '');
    // 获取访问目录
    let flag = url.split('/')[1];
    // 过滤目录
    let publicArr = ['music', 'musicys', 'pic', 'picys', 'logo', 'font'];
    let verifyArr = ['bg', 'bgys', 'upload', 'uploadys'];
    if (publicArr.includes(flag)) {
    } else if (verifyArr.includes(flag)) {
      if (!account) {
        _nologin(res);
        return;
      }
    } else {
      _err(res, '文件不存在或已过期');
      return;
    }
    // 合并url
    let path = decodeURI(myconfig.filepath + url);
    if (!fs.existsSync(path)) {
      _err(res, '文件不存在或已过期');
      return;
    }
    res.sendFile(path);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});

module.exports = route;
