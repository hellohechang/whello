const express = require('express'),
  fs = require('fs'),
  { mediaurl } = require('../myconfig'),
  route = express.Router();
const {
  writelog,
  _readdir,
  _mkdir,
  _unlink,
  _success,
  _nothing,
  _err,
  receiveFiles,
  mergefile,
  readMenu,
  isImgFile,
  _rename,
  delDir,
} = require('../utils');

//拦截器
route.use((req, res, next) => {
  if (req._userInfo.account === 'root') {
    next();
  } else {
    _err(res, '当前账号没有权限执行该操作~');
  }
});
// 图床
// 获取
route.get('/getlist', async (req, res) => {
  try {
    let { page, showpage = 40 } = req.query,
      bgarr = await readMenu(`${mediaurl.filepath}/pic`),
      pagenum = Math.ceil(bgarr.length / showpage);
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
// 删除
route.post('/delpic', async (req, res) => {
  try {
    let url = req.body.url;
    _unlink(`${mediaurl.filepath}/pic/${url}`);
    _unlink(`${mediaurl.filepath}/picys/${url}`);
    _success(res);
    await writelog(req, `删除图片[${url}]`);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
// 上传
route.post('/up', async (req, res) => {
  try {
    let path = `${mediaurl.filepath}/tem/${req.query.HASH}`;
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
    let { HASH, count, name } = req.body;
    if (!isImgFile(name)) {
      _err(res);
      return;
    }
    await delDir(`${mediaurl.filepath}/picys/${name}`);
    await delDir(`${mediaurl.filepath}/pic/${name}`);
    await _rename(
      `${mediaurl.filepath}/tem/${HASH}/_hello`,
      `${mediaurl.filepath}/picys/${name}`
    );
    await mergefile(
      --count,
      `${mediaurl.filepath}/tem/${HASH}`,
      `${mediaurl.filepath}/pic/${name}`
    );
    await writelog(req, `上传图片[${name}]`);
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
      path = `${mediaurl.filepath}/tem/${HASH}`,
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
    let u = `${mediaurl.filepath}/pic/${name}`;
    let uys = `${mediaurl.filepath}/picys/${name}`;
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
