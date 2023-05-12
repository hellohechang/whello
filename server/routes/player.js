const express = require('express'),
  fs = require('fs'),
  { filepath } = require('../myconfig'),
  route = express.Router();
const { insertData, updateData, queryData } = require('../sqlite');
const {
  handleMusicList,
  writelog,
  _readFile,
  _writeFile,
  _readdir,
  _mkdir,
  extname,
  qucong,
  _success,
  _nologin,
  _nothing,
  _err,
  receiveFiles,
  mergefile,
  nanoid,
  delDir,
  isImgFile,
  _rename,
  hdSearch,
} = require('../utils');

//获取歌词
route.get('/lrc', async (req, res) => {
  try {
    let { artist, name } = req.query,
      url = `${filepath}/music/${artist}-${name}.lrc`;
    if (fs.existsSync(url)) {
      let str = (await _readFile(url, true)).toString();
      let lrcs = str.split('\n'),
        rod = [];
      lrcs.forEach((item) => {
        let reg = /\[([0-9\:\.]+)\](.*)/,
          arr = item.match(reg);
        if (arr === null) return;
        let tarr = arr[1].split(':'),
          lrcp = arr[2].trim();
        if (lrcp === '') return;
        let fyarr = lrcp.split('<=>');
        rod.push({
          t: parseInt(tarr[0] * 60) + Math.round(tarr[1]),
          p: fyarr[0].trim(),
          fy: fyarr[1] ? fyarr[1].trim() : '',
        });
      });
      if (rod.length === 0) {
        _success(res, 'ok', [
          {
            t: 0,
            p: '未找到歌词',
            fy: '',
          },
        ]);
      } else {
        _success(res, 'ok', rod);
      }
    } else {
      _success(res, 'ok', [
        {
          t: 0,
          p: '未找到歌词',
          fy: '',
        },
      ]);
    }
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _success(res, 'ok', [
      {
        t: 0,
        p: '未找到歌词',
        fy: '',
      },
    ]);
  }
});
route.get('/musicshare', async (req, res) => {
  try {
    let id = req.query.id;
    let arr = await queryData('getshare', '*', `WHERE id=? AND type=?`, [
      id,
      'music',
    ]);
    if (arr.length === 0) {
      _err(res, '分享已被取消');
      return;
    }
    let obj = JSON.parse(arr[0].data);
    obj.account = arr[0].account;
    obj.username = arr[0].username;
    _success(res, 'ok', obj);
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
//搜索
route.get('/search', async (req, res) => {
  try {
    let { a } = req.query,
      arr = JSON.parse(
        (await queryData('musicinfo', 'data', `WHERE account=?`, ['root']))[0]
          .data
      ),
      ar = [];
    if (a) {
      arr.forEach((v, i) => {
        if (i < 2) return;
        v.item.forEach((y) => {
          ar.push(y);
        });
      });
      ar = qucong(ar);
      let sArr = [];
      ar.forEach((item) => {
        let { name, artist } = item;
        let str = `${name}|${artist}`;
        let searchArr = hdSearch(a, str);
        if (searchArr.length > 0) {
          sArr.push({
            ...item,
            sNum: searchArr.length,
          });
        }
      });
      sArr.sort((a, b) => {
        return b.sNum - a.sNum;
      });
      if (sArr.length === 0) {
        await writelog(req, `未搜索到歌曲[${a}]`);
      }
      ar = sArr;
    }
    _success(res, 'ok', ar.slice(0, 100));
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
//获取所有歌曲
route.get('/getall', async (req, res) => {
  try {
    let arr = JSON.parse(
      (await queryData('musicinfo', 'data', `WHERE account=?`, ['root']))[0]
        .data
    ),
      ar = [];
    arr.forEach((v, i) => {
      if (i < 2) return;
      v.item.forEach((y) => {
        ar.push(y);
      });
    });
    _success(res, 'ok', qucong(ar));
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
//获取列表
route.get('/getlist', async (req, res) => {
  try {
    let account = req._userInfo.account;
    let { id } = req.query;
    let arr = await queryData('musicinfo', '*', `WHERE account IN (?,?)`, [
      'root',
      account,
    ]);
    let rarr = JSON.parse(
      arr.filter((item) => item.account === 'root')[0].data
    );
    if (account !== 'root') {
      let aarr = JSON.parse(
        arr.filter((item) => item.account === account)[0].data
      );
      rarr = [...aarr.slice(0, 2), ...rarr.slice(2)];
    }
    rarr = handleMusicList(rarr); //处理封面
    id ? null : (id = rarr[0].id);
    rarr = rarr.map((item, i) => {
      if (item.id !== id && i != 1) {
        delete item.item;
      }
      return item;
    });
    _success(res, 'ok', rarr);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
//更新当前播放歌曲进度
route.post('/updatemusicinfo', async (req, res) => {
  try {
    let account = req._userInfo.account;
    let r = await updateData(
      'lastmusic',
      {
        data: JSON.stringify(req.body),
      },
      `WHERE account=?`,
      [account]
    );
    if (r.changes == 0) {
      await insertData('lastmusic', [
        {
          account,
          data: JSON.stringify(req.body),
        },
      ]);
    }
    // 增加播放历史记录
    let { lastplay, history } = req.body;
    if (history === 'y') {
      let arr = JSON.parse(
        (await queryData('musicinfo', 'data', `WHERE account=?`, [account]))[0]
          .data
      );
      arr[0].item.unshift(lastplay);
      arr[0].item = qucong(arr[0].item);
      await updateData(
        'musicinfo',
        {
          data: JSON.stringify(arr),
        },
        `WHERE account=?`,
        [account]
      );
    }
    _success(res);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
//获取最后播放记录
route.get('/getmusicinfo', async (req, res) => {
  try {
    let account = req._userInfo.account;
    let obj = await queryData('lastmusic', 'data', `WHERE account=?`, [
      account,
    ]);
    if (obj.length !== 0) {
      obj = JSON.parse(obj[0].data);
    } else {
      obj = {
        currentTime: 0,
        duration: 0,
      };
    }
    _success(res, 'ok', obj);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
//更新当前播放列表
route.post('/updateplaying', async (req, res) => {
  try {
    let account = req._userInfo.account;
    let r = await updateData(
      'playing',
      {
        data: JSON.stringify(req.body.data),
      },
      `WHERE account=?`,
      [account]
    );
    if (r.changes == 0) {
      await insertData('playing', [
        {
          account,
          data: JSON.stringify(req.body.data),
        },
      ]);
    }
    _success(res);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
//获取当前播放列表
route.get('/getplaying', async (req, res) => {
  try {
    let account = req._userInfo.account;
    let arr = await queryData('playing', 'data', `WHERE account=?`, [account]);
    if (arr.length !== 0) {
      arr = JSON.parse(arr[0].data);
    }
    _success(res, 'ok', arr);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
//歌单列表移动位置
// 歌单列表移动
route.post('/listmove', async (req, res) => {
  try {
    let account = req._userInfo.account;
    if (account !== 'root') {
      _err(res, '当前账号没有权限执行该操作');
      return;
    }
    let { fromId, toId } = req.body,
      arr = JSON.parse(
        (await queryData('musicinfo', 'data', `WHERE account=?`, [account]))[0]
          .data
      );
    let fid = arr.findIndex((item) => item.id === fromId),
      tid = arr.findIndex((item) => item.id === toId);
    if (fid > 1 && tid > 1 && fid !== tid) {
      arr.splice(tid, 0, ...arr.splice(fid, 1));
      await updateData(
        'musicinfo',
        {
          data: JSON.stringify(arr),
        },
        `WHERE account=?`,
        [account]
      );
      _success(res);
      return;
    }
    _err(res);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
// 删除歌单列表
route.post('/dellist', async (req, res) => {
  try {
    let account = req._userInfo.account;
    if (account !== 'root') {
      _err(res, '当前账号没有权限执行该操作');
      return;
    }
    let { id } = req.body,
      arr = JSON.parse(
        (await queryData('musicinfo', 'data', `WHERE account=?`, [account]))[0]
          .data
      );
    let i = arr.findIndex((item) => item.id === id);
    if (i > 1) {
      arr.splice(i, 1)[0];
      await updateData(
        'musicinfo',
        {
          data: JSON.stringify(arr),
        },
        `WHERE account=?`,
        [account]
      );
      await writelog(req, `删除歌单[${id}]`);
      _success(res);
      return;
    }
    _err(res);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
// 歌单编辑
route.post('/editlist', async (req, res) => {
  try {
    let account = req._userInfo.account;
    if (account !== 'root') {
      _err(res, '当前账号没有权限执行该操作');
      return;
    }
    let { id, name, index } = req.body,
      arr = JSON.parse(
        (await queryData('musicinfo', 'data', `WHERE account=?`, [account]))[0]
          .data
      );
    let i = arr.findIndex((item) => item.id === id);
    if (i > 1) {
      index < 2
        ? (index = 2)
        : index > arr.length - 1
          ? (index = arr.length - 1)
          : null;
      arr[i].name = name;
      arr.splice(index, 0, ...arr.splice(i, 1));
      await updateData(
        'musicinfo',
        {
          data: JSON.stringify(arr),
        },
        `WHERE account=?`,
        [account]
      );
      await writelog(req, `修改歌单名[${name}(${id})]`);
      _success(res);
      return;
    }
    _err(res);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
// 上传歌曲
route.post('/addsong', async (req, res) => {
  try {
    let account = req._userInfo.account;
    if (account !== 'root') {
      _err(res, '当前账号没有权限执行该操作');
      return;
    }
    let { id, arr: ar } = req.body,
      arr = JSON.parse(
        (await queryData('musicinfo', 'data', `WHERE account=?`, [account]))[0]
          .data
      );

    let i = arr.findIndex((item) => item.id === id);
    if (i > 1) {
      if (ar.length > 0) {
        arr[i].item = [...ar, ...arr[i].item];
        arr[i].item = qucong(arr[i].item);
      }
    }
    // 刷新歌曲数据
    let musicfilearr = await _readdir(`${filepath}/music`);
    let mp4arr = musicfilearr.filter((v) => {
      return extname(v)[1].toLowerCase() === 'mp4';
    });
    arr.forEach((v, i) => {
      if (i < 2) return;
      v.item.forEach((y) => {
        mp4arr.some((v) => `${y.artist}-${y.name}.mp4` == v)
          ? (y.mv = 'y')
          : (y.mv = '');
      });
    });
    let strarr = ar.map((item) => {
      return `${item.artist}-${item.name}`;
    });
    if (strarr.length > 0) {
      await writelog(req, `上传歌曲[${strarr.join(',')}]`);
    }
    await updateData(
      'musicinfo',
      {
        data: JSON.stringify(arr),
      },
      `WHERE account=?`,
      [account]
    );
    _success(res);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
    return;
  }
});
// 添加歌单
route.post('/addlist', async (req, res) => {
  try {
    let account = req._userInfo.account;
    if (account !== 'root') {
      _err(res, '当前账号没有权限执行该操作');
      return;
    }
    let { name } = req.body,
      arr = JSON.parse(
        (await queryData('musicinfo', 'data', `WHERE account=?`, [account]))[0]
          .data
      );
    let id = nanoid();
    arr.push({
      name,
      item: [],
      id,
    });
    await updateData(
      'musicinfo',
      {
        data: JSON.stringify(arr),
      },
      `WHERE account=?`,
      [account]
    );
    await writelog(req, `新增歌单[${name}(${id})]`);
    _success(res);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
// 歌曲移动位置
route.post('/songmove', async (req, res) => {
  try {
    let account = req._userInfo.account;
    if (account !== 'root') {
      _err(res, '当前账号没有权限执行该操作');
      return;
    }
    let { a, b, id } = req.body,
      arr = JSON.parse(
        (await queryData('musicinfo', 'data', `WHERE account=?`, [account]))[0]
          .data
      );
    let i = arr.findIndex((item) => item.id === id);
    if (i > 0) {
      arr[i].item.splice(b, 0, ...arr[i].item.splice(a, 1));
      await updateData(
        'musicinfo',
        {
          data: JSON.stringify(arr),
        },
        `WHERE account=?`,
        [account]
      );
      _success(res);
      return;
    }
    _err(res);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
// 收藏歌曲
route.post('/collectsong', async (req, res) => {
  try {
    let account = req._userInfo.account;
    let { ar } = req.body,
      arr = JSON.parse(
        (await queryData('musicinfo', 'data', `WHERE account=?`, [account]))[0]
          .data
      );
    arr[1].item = [...ar, ...arr[1].item];
    arr[1].item = qucong(arr[1].item);
    await updateData(
      'musicinfo',
      {
        data: JSON.stringify(arr),
      },
      `WHERE account=?`,
      [account]
    );
    let strarr = ar.map((item) => {
      return `${item.artist}-${item.name}`;
    });
    await writelog(req, `收藏歌曲[${strarr.join(',')}]`);
    _success(res, '收藏歌曲成功');
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
route.post('/closecollectsong', async (req, res) => {
  try {
    let account = req._userInfo.account;
    let obj = req.body,
      arr = JSON.parse(
        (await queryData('musicinfo', 'data', `WHERE account=?`, [account]))[0]
          .data
      );
    arr[1].item = arr[1].item.filter(
      (v) => v.artist + v.name !== obj.artist + obj.name
    );
    await updateData(
      'musicinfo',
      {
        data: JSON.stringify(arr),
      },
      `WHERE account=?`,
      [account]
    );
    await writelog(req, `移除收藏歌曲[${obj.artist}-${obj.name}]`);
    _success(res, '移除歌曲成功');
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
// 选中删除
route.post('/delsong', async (req, res) => {
  try {
    let account = req._userInfo.account;
    let { id, ar } = req.body,
      arr = JSON.parse(
        (await queryData('musicinfo', 'data', `WHERE account=?`, [account]))[0]
          .data
      );
    let i = arr.findIndex((item) => item.id === id);
    if (i >= 0) {
      if (account !== 'root' && i > 1) {
      } else {
        let strarr = [];
        ar.forEach((e) => {
          arr[i].item = arr[i].item.filter(
            (v) => v.name + v.artist !== e.name + e.artist
          );
          strarr.push(`${e.artist}-${e.name}`);
        });
        if (i == 1) {
          await writelog(req, `移除收藏歌曲[${strarr.join(',')}]`);
        } else if (i > 1) {
          await writelog(req, `删除歌曲[${strarr.join(',')}]`);
        }
      }
    }
    await updateData(
      'musicinfo',
      {
        data: JSON.stringify(arr),
      },
      `WHERE account=?`,
      [account]
    );
    _success(res);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
    return;
  }
});
// 音乐移动目录
route.post('/songtolist', async (req, res) => {
  try {
    let account = req._userInfo.account;
    if (account !== 'root') {
      _err(res, '当前账号没有权限执行该操作');
      return;
    }
    let { id, tid, ar } = req.body,
      arr = JSON.parse(
        (await queryData('musicinfo', 'data', `WHERE account=?`, [account]))[0]
          .data
      );
    let i = arr.findIndex((item) => item.id === id),
      ii = arr.findIndex((item) => item.id === tid);
    if (i > 1 && ii > 1) {
      ar.forEach((e) => {
        arr[i].item = arr[i].item.filter(
          (v) => v.name + v.artist !== e.name + e.artist
        );
      });
      arr[ii].item = [...ar, ...arr[ii].item];
      arr[ii].item = qucong(arr[ii].item);
      await updateData(
        'musicinfo',
        {
          data: JSON.stringify(arr),
        },
        `WHERE account=?`,
        [account]
      );
      _success(res);
      return;
    }
    _err(res);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
//删除mv
route.post('/delmv', async (req, res) => {
  try {
    const account = req._userInfo.account;
    if (account !== 'root') {
      _err(res, '当前账号没有权限执行该操作');
      return;
    }
    let { id, sobj } = req.body,
      arr = JSON.parse(
        (await queryData('musicinfo', 'data', `WHERE account=?`, [account]))[0]
          .data
      );
    let i = arr.findIndex((item) => item.id === id);
    if (i > 1) {
      arr[i].item.forEach((item) => {
        if (item.artist + item.name === sobj.artist + sobj.name) {
          item.mv = '';
        }
      });
      await updateData(
        'musicinfo',
        {
          data: JSON.stringify(arr),
        },
        `WHERE account=?`,
        [account]
      );
      await writelog(req, `删除 MV [${sobj.artist}-${sobj.name}]`);
      _success(res);
      return;
    }
    _err(res);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
// 编辑歌词
route.get('/getlrc', async (req, res) => {
  try {
    let { name, artist } = req.query,
      url = `${filepath}/music/${artist}-${name}.lrc`;
    if (fs.existsSync(url)) {
      let str = (await _readFile(url, true)).toString();
      _success(res, 'ok', str);
    } else {
      _writeFile(url, '');
      _success(res, 'ok', '');
    }
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
route.post('/editlrc', async (req, res) => {
  try {
    const account = req._userInfo.account;
    if (account !== 'root') {
      _err(res, '当前账号没有权限执行该操作');
      return;
    }
    let { name, artist, val } = req.body,
      url = `${filepath}/music/${artist}-${name}.lrc`;
    _writeFile(url, val);
    await writelog(req, `更新歌词[${artist}-${name}.lrc]`);
    _success(res, '更新成功');
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
// 歌曲分享
route.post('/musicshare', async (req, res) => {
  try {
    let account = req._userInfo.account;
    let id = nanoid();
    let obj = {
      id,
      data: JSON.stringify(req.body),
      account,
      type: 'music',
    };
    await insertData('share', [obj]);
    await writelog(req, `分享歌曲[/page/sharemusic/#${id}]`);
    _success(res, 'ok', { id });
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
// 歌曲上传
route.post('/up', async (req, res) => {
  try {
    let account = req._userInfo.account;
    if (account !== 'root') {
      _err(res, '当前账号没有权限执行该操作');
      return;
    }
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
    let account = req._userInfo.account;
    if (account !== 'root') {
      _err(res, '当前账号没有权限执行该操作');
      return;
    }
    let { HASH, count, name } = req.body;
    if (!/(\.JPG|\.LRC|\.MP3|\.MP4)$/gi.test(name)) {
      _err(res);
      return;
    }
    await delDir(`${filepath}/music/${name}`);
    await delDir(`${filepath}/musicys/${name}`);
    if (isImgFile(name)) {
      await _rename(
        `${filepath}/tem/${HASH}/_hello`,
        `${filepath}/musicys/${name}`
      );
      --count;
    }
    await mergefile(
      count,
      `${filepath}/tem/${HASH}`,
      `${filepath}/music/${name}`
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
    let account = req._userInfo.account;
    if (account !== 'root') {
      _err(res, '当前账号没有权限执行该操作');
      return;
    }
    let { HASH } = req.body,
      path = `${filepath}/tem/${HASH}`,
      arr = await _readdir(path);
    _success(res, 'ok', arr);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _success(res, 'ok', []);
  }
});
// 检查上传文件是否重复
route.post('/repeatfile', async (req, res) => {
  try {
    let account = req._userInfo.account;
    if (account !== 'root') {
      _err(res, '当前账号没有权限执行该操作');
      return;
    }
    let { name } = req.body;
    let u = `${filepath}/music/${name}`;
    if (/(\.MP3|\.MP4)$/gi.test(name) && fs.existsSync(u)) {
      _success(res);
      return;
    }
    _nothing(res);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _success(res, 'ok', []);
  }
});

module.exports = route;
