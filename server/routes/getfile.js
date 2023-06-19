const express = require('express'),
  fs = require('fs'),
  route = express.Router();
let myconfig = require('../myconfig');
const { queryData } = require('../sqlite');
const { _err, _nologin, writelog } = require('../utils');

route.get('*', async (req, res) => {
  try {
    let { v, t } = req.query;
    if (v && t) {
      let arr = await queryData('getshare', '*', `WHERE id=? AND type=?`, [v, 'music']);
      if (arr.length === 0) {
        _err(res, '文件不存在或已过期');
        return;
      }
      let obj = JSON.parse(arr[0].data);
      let path = '';
      if (t === 'pic') {
        path = 'jpg';
      } else if (t === 'url') {
        path = 'mp3';
      } else if (t === 'murl') {
        path = 'mp4';
      }
      if (path) {
        path = decodeURI(`${myconfig.filepath}/music/${obj.artist}-${obj.name}.${path}`)
        if (!fs.existsSync(path)) {
          _err(res, '文件不存在或已过期');
          return;
        }
        res.sendFile(path);
      } else {
        _err(res, '文件不存在或已过期');
      }
      return;
    }
    let account = req._userInfo.account;
    let url = req.url.replace(/(\?|\#).*$/, '').replace(/\/$/, '');
    // 获取访问目录
    let flag = url.split('/')[1];
    // 过滤目录
    let publicArr = ['pic', 'picys', 'logo', 'font'];
    let verifyArr = ['bg', 'bgys', 'upload', 'uploadys', 'music', 'musicys'];
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
