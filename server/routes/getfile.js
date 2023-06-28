const express = require('express'),
  fs = require('fs'),
  route = express.Router();
const _d = require('../data');
const { queryData } = require('../sqlite');
const { _err, _nologin, writelog } = require('../utils');

route.get('*', async (req, res) => {
  try {
    let { h } = req.query;
    let account = req._userInfo.account;
    let url = req.url.replace(/(\?|\#).*$/, '').replace(/\/$/, '');
    if (h) {
      let arr = await queryData('getshare', '*', `WHERE id=? AND type=?`, [h, 'music']);
      if (arr.length === 0) {
        _err(res, '文件不存在或已过期');
        return;
      }
    } else {
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
    }
    // 合并url
    let path = decodeURI(_d.filepath + url);
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
