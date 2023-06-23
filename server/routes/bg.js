const express = require('express'),
  fs = require('fs'),
  { filepath } = require('../myconfig'),
  route = express.Router();
const { updateData } = require('../sqlite');
const {
  writelog,
  _readdir,
  _mkdir,
  _unlink,
  _success,
  _nologin,
  _nothing,
  _err,
  receiveFiles,
  mergefile,
  readMenu,
  isImgFile,
  delDir,
  _rename,
} = require('../utils');

//拦截器
route.use((req, res, next) => {
  if (req._userInfo.account) {
    next();
  } else {
    _nologin(res);
  }
});
// 随机壁纸
route.get('/randombg', async (req, res) => {
  try {
    let p = req.query.p,
      bgarr = await _readdir(`${filepath}/bg/${p}`),
      num = Math.round(Math.random() * (bgarr.length - 1 - 0) + 0);
    if (bgarr.length === 0) {
      _err(res, '壁纸库为空，请先上传壁纸');
      return;
    }
    _success(res, 'ok', {
      link: bgarr[num],
    });
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
// 更新壁纸
route.post('/updatabg', async (req, res) => {
  try {
    let account = req._userInfo.account,
      { flag, bg } = req.body,
      obj = {};
    obj[flag] = bg;
    await updateData('user', obj, `WHERE account=? AND state=?`, [
      account,
      '0',
    ]);
    _success(res);
    await writelog(req, `更换壁纸->[${bg}]`);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
// 壁纸获取
route.get('/getbg', async (req, res) => {
  try {
    let { flag, page, showpage = 40 } = req.query;
    showpage > 100 ? showpage = 100 : null;
    let bgarr = await readMenu(`${filepath}/bg/${flag}`),
      pagenum = Math.ceil(bgarr.length / showpage);
    // 创建时间排序
    bgarr.sort((a, b) => {
      return b.time - a.time;
    });
    bgarr = bgarr.map((item) => item.name);
    page > pagenum ? (page = pagenum) : page <= 0 ? (page = 1) : null;
    let arr = bgarr.slice(showpage * (page - 1), showpage * page);
    _success(res, 'ok', {
      total: bgarr.length,
      totalPage: pagenum,
      pageNo: page,
      data: arr,
    });
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
// 删除壁纸
route.post('/delbg', async (req, res) => {
  try {
    let account = req._userInfo.account;
    if (account !== 'root') {
      _err(res, '没有权限操作');
      return;
    }
    let url = req.body.url;
    _unlink(`${filepath}/bg/bg/${url}`);
    _unlink(`${filepath}/bg/bgxs/${url}`);
    _unlink(`${filepath}/bgys/bg/${url}`);
    _unlink(`${filepath}/bgys/bgxs/${url}`);
    await writelog(req, `删除壁纸[${url}]`);
    _success(res);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
// 上传壁纸
route.post('/up', async (req, res) => {
  try {
    let path = `${filepath}/tem/${req.query.HASH}`;
    await _mkdir(path);
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
    let { HASH, count, name, flag } = req.body;
    if (!isImgFile(name)) {
      _err(res);
      return;
    }
    await delDir(`${filepath}/bg/${flag}/${name}`);
    await delDir(`${filepath}/bgys/${flag}/${name}`);
    await _rename(
      `${filepath}/tem/${HASH}/_hello`,
      `${filepath}/bgys/${flag}/${name}`
    );
    await mergefile(
      --count,
      `${filepath}/tem/${HASH}`,
      `${filepath}/bg/${flag}/${name}`
    );
    await writelog(req, `上传壁纸[${name}]`);
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
    let { name, flag } = req.body;
    let u = `${filepath}/bg/${flag}/${name}`;
    let uys = `${filepath}/bgys/${flag}/${name}`;
    if (fs.existsSync(u) && fs.existsSync(uys)) {
      _success(res);
      return;
    }
    _nothing(res);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});

module.exports = route;
