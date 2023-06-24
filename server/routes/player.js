const express = require('express'),
  fs = require('fs'),
  { filepath } = require('../myconfig'),
  route = express.Router();
const { deepClone } = require('../utils');
const { insertData, updateData, queryData, deleteData } = require('../sqlite');
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
  getMusicObj,
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
    let sArr = await queryData('getshare', '*', `WHERE id=? AND type=?`, [id, 'music',]);
    if (sArr.length === 0) {
      _err(res, '分享已被取消');
      return;
    }
    let arr = JSON.parse(sArr[0].data);
    let mObj = getMusicObj((await queryData('musics', '*')));
    for (let i = 0; i < arr.length; i++) {
      if (mObj.hasOwnProperty(arr[i].id)) {
        arr[i] = mObj[arr[i].id];
      } else {
        arr.splice(i, 1);
        i--;
      }
    }
    if (arr.length == 0) {
      _err(res, '歌曲不存在')
      return;
    }
    _success(res, 'ok', {
      account: sArr[0].account,
      username: sArr[0].username,
      list: arr
    });
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
      ar = await queryData('musics', '*');
    ar.reverse();
    if (a) {
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
      ar = sArr.map(item => {
        delete item.sNum;
        return item;
      });
    }
    _success(res, 'ok', ar.slice(0, 100));
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
async function getMusicList(account) {
  let arr = await queryData('musicinfo', 'data', `WHERE account=?`, [account]);
  if (arr.length == 0) {
    arr = [
      { name: '播放历史', pic: 'img/history.jpg', item: [], id: 'history' },
      { name: '收藏', pic: 'img/music.jpg', item: [], id: 'favorites' },
    ];
    await insertData('musicinfo', [
      {
        account,
        data: JSON.stringify(arr),
      }
    ]);
    return arr;
  }
  return JSON.parse(arr[0].data);
}
//获取列表
route.get('/getlist', async (req, res) => {
  try {
    let account = req._userInfo.account,
      { id } = req.query,
      arr = await queryData('musics', '*'),
      mObj = getMusicObj(arr),
      uArr = await getMusicList(account);
    let flag = false;
    uArr.forEach((item) => {
      for (let i = 0; i < item.item.length; i++) {
        let y = item.item[i];
        if (mObj.hasOwnProperty(y.id)) {
          item.item[i] = mObj[y.id];
        } else {
          flag = true;
          item.item.splice(i, 1);
          i--;
        }
      }
    })
    if (flag) {
      let marr = deepClone(uArr);
      marr.forEach((item) => {
        item.item = item.item.map(y => ({ id: y.id }))
      })
      await updateData('musicinfo', {
        data: JSON.stringify(marr),
      }, `WHERE account=?`, [account]);
    }
    uArr.splice(2, 0, { id: 'all', item: arr.reverse(), name: '全部' })
    uArr = handleMusicList(uArr); //处理封面
    id ? null : (id = uArr[1].id);
    uArr = uArr.map((item, i) => {
      if (item.id !== id && i != 1) {
        delete item.item;
      }
      return item;
    });
    _success(res, 'ok', uArr);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
//更新当前播放歌曲进度
route.post('/updatemusicinfo', async (req, res) => {
  try {
    let account = req._userInfo.account;
    let obj = req.body;
    let r = await updateData('lastmusic', {
      data: JSON.stringify(obj),
    }, `WHERE account=?`, [account]);
    if (r.changes == 0) {
      await insertData('lastmusic', [{
        account,
        data: JSON.stringify(obj),
      },]);
    }
    // 增加播放历史记录
    let { lastplay, history } = obj;
    if (history === 'y') {
      let arr = await getMusicList(account);
      arr[0].item.unshift({ id: lastplay.id });
      arr[0].item = qucong(arr[0].item);
      await updateData('musicinfo', {
        data: JSON.stringify(arr),
      }, `WHERE account=?`, [account]);
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
    let lastm = await queryData('lastmusic', 'data', `WHERE account=?`, [account]);
    let obj = {
      currentTime: 0,
      duration: 0,
      lastplay: { id: 'xxx', name: 'xxx', artist: 'xxx', duration: 0, mv: '' }
    };
    if (lastm.length > 0) {
      obj = JSON.parse(lastm[0].data);
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
    let r = await updateData('playing', {
      data: JSON.stringify(req.body.data),
    }, `WHERE account=?`, [account]);
    if (r.changes == 0) {
      await insertData('playing', [{
        account, data: JSON.stringify(req.body.data),
      },]);
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
    if (arr.length > 0) {
      arr = JSON.parse(arr[0].data);
    }
    _success(res, 'ok', arr);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
// 歌单列表移动
route.post('/listmove', async (req, res) => {
  try {
    let account = req._userInfo.account;
    let { fromId, toId } = req.body,
      arr = await getMusicList(account);
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
    let { id } = req.body,
      arr = await getMusicList(account);
    let i = arr.findIndex((item) => item.id === id);
    if (i > 1) {
      let r = arr.splice(i, 1)[0];
      await updateData(
        'musicinfo',
        {
          data: JSON.stringify(arr),
        },
        `WHERE account=?`,
        [account]
      );
      await writelog(req, `删除歌单[${r.name}(${id})]`);
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
    let { id, name, des } = req.body,
      arr = await getMusicList(account);
    let i = arr.findIndex((item) => item.id === id);
    if (i > 1) {
      arr[i].name = name;
      arr[i].des = des;
      await updateData(
        'musicinfo',
        {
          data: JSON.stringify(arr),
        },
        `WHERE account=?`,
        [account]
      );
      await writelog(req, `修改歌单信息[=>${name}(${des})-(${id})]`);
      _success(res);
      return;
    }
    _err(res);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _err(res);
  }
});
// 歌单歌曲
route.post('/editsong', async (req, res) => {
  try {
    let account = req._userInfo.account;
    if (account !== 'root') {
      _err(res, '没有权限操作');
      return;
    }
    let { id, oldObj, newObj } = req.body;
    await _rename(`${filepath}/music/${oldObj.artist}-${oldObj.name}.mp3`, `${filepath}/music/${newObj.artist}-${newObj.name}.mp3`).catch(err => { });
    await _rename(`${filepath}/music/${oldObj.artist}-${oldObj.name}.mp4`, `${filepath}/music/${newObj.artist}-${newObj.name}.mp4`).catch(err => { });
    await _rename(`${filepath}/music/${oldObj.artist}-${oldObj.name}.jpg`, `${filepath}/music/${newObj.artist}-${newObj.name}.jpg`).catch(err => { });
    await _rename(`${filepath}/music/${oldObj.artist}-${oldObj.name}.lrc`, `${filepath}/music/${newObj.artist}-${newObj.name}.lrc`).catch(err => { });
    await _rename(`${filepath}/musicys/${oldObj.artist}-${oldObj.name}.jpg`, `${filepath}/musicys/${newObj.artist}-${newObj.name}.jpg`).catch(err => { });

    await updateData('musics', newObj, `WHERE id=?`, [id])
    await writelog(req, `编辑歌曲[${oldObj.artist}-${oldObj.name}=>${newObj.artist}-${newObj.name}]`);
    _success(res);
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
      _err(res, '没有权限操作');
      return;
    }
    let mArr = await queryData('musics', '*');
    let musicfilearr = await _readdir(`${filepath}/music`);
    let mp4arr = musicfilearr.filter((v) => {
      return extname(v)[1].toLowerCase() === 'mp4';
    });
    let hasArr = [],
      noArr = [];
    mArr.forEach((item) => {
      let { name, artist, id } = item;
      if (mp4arr.includes(`${artist}-${name}.mp4`)) {
        hasArr.push(id);
      } else {
        noArr.push(id)
      }
    })
    await updateData('musics', { mv: 'y' }, `WHERE id IN (${new Array(hasArr.length).fill('?').join(',')})`, [...hasArr]);
    await updateData('musics', { mv: '' }, `WHERE id IN (${new Array(noArr.length).fill('?').join(',')})`, [...noArr]);
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
    let { name, des } = req.body,
      arr = await getMusicList(account);
    let id = nanoid();
    arr.push({
      name,
      des,
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
    let { fid, tid, id } = req.body,
      arr = await getMusicList(account);
    let i = arr.findIndex((item) => item.id === id);
    if (i > 0) {
      let fIdx = arr[i].item.findIndex(item => item.id == fid),
        tIdx = arr[i].item.findIndex(item => item.id == tid);
      if (fIdx < 0 || tIdx < 0 || fIdx == tIdx) {
        _err(res);
        return;
      }
      arr[i].item.splice(tIdx, 0, ...arr[i].item.splice(fIdx, 1));
      await updateData('musicinfo', {
        data: JSON.stringify(arr),
      }, `WHERE account=?`, [account]);
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
      arr = await getMusicList(account);
    let add = ar.map(item => ({ id: item.id }));
    arr[1].item = [...add, ...arr[1].item];
    arr[1].item = qucong(arr[1].item);
    await updateData('musicinfo', {
      data: JSON.stringify(arr),
    }, `WHERE account=?`, [account]);
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
      arr = await getMusicList(account);
    arr[1].item = arr[1].item.filter((v) => v.id !== obj.id);
    await updateData('musicinfo', {
      data: JSON.stringify(arr),
    }, `WHERE account=?`, [account]);
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
    let { id, ar = [] } = req.body;
    if (ar.length == 0) {
      _err(res);
      return;
    }
    let strarr = ar.map((item) => {
      return `${item.artist}-${item.name}`;
    });
    if (id == 'all') {
      if (account !== 'root') {
        _err('没有权限操作')
        return;
      }
      let iArr = ar.map(item => item.id);
      await deleteData('musics', `WHERE id IN (${new Array(iArr.length).fill('?').join(',')})`, [...iArr]);
      await writelog(req, `删除(all)歌曲[${strarr.join(',')}]`);
    } else {
      let arr = await getMusicList(account);
      let i = arr.findIndex((item) => item.id === id);
      if (i >= 0) {
        arr[i].item = arr[i].item.filter(item => !ar.some(y => y.id == item.id));
        await updateData('musicinfo', { data: JSON.stringify(arr), }, `WHERE account=?`, [account]);
        await writelog(req, `删除(${arr[i].name})歌曲[${strarr.join(',')}]`);
      }
    }
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
    let { id, tid, ar } = req.body,
      arr = await getMusicList(account);
    let strarr = ar.map((item) => {
      return `${item.artist}-${item.name}`;
    });
    ar = ar.map(item => ({ id: item.id }));
    let i = arr.findIndex((item) => item.id === id),
      ii = arr.findIndex((item) => item.id === tid);
    if ((id == 'all' && ii > 1 && id !== tid) || (i >= 0 && i < 2 && ii > 1)) {
      arr[ii].item = [...ar, ...arr[ii].item];
      arr[ii].item = qucong(arr[ii].item);
      await updateData('musicinfo', {
        data: JSON.stringify(arr),
      }, `WHERE account=?`, [account]);
      let stext = id == 'all' ? `all=>${arr[ii].name}` : `${arr[i].name}=>${arr[ii].name}`;
      await writelog(req, `(${stext})[${strarr.join(',')}]`);
      _success(res);
      return;
    }
    if (i > 1 && ii > 1, id !== tid) {
      arr[i].item = arr[i].item.filter(item => !ar.some(y => y.id == item.id))
      arr[ii].item = [...ar, ...arr[ii].item];
      arr[ii].item = qucong(arr[ii].item);
      await updateData('musicinfo', {
        data: JSON.stringify(arr),
      }, `WHERE account=?`, [account]);
      let stext = `${arr[i].name}=>${arr[ii].name}`;
      await writelog(req, `(${stext})[${strarr.join(',')}]`);
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
      _err(res, '没有权限操作');
      return;
    }
    let { sobj } = req.body;
    await updateData('musics', { mv: '' }, `WHERE id=?`, [sobj.id])
    await writelog(req, `删除 MV [${sobj.artist}-${sobj.name}]`);
    _success(res);
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
      _err(res, '没有权限操作');
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
    await writelog(req, `分享歌曲[/sharemusic/#${id}]`);
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
      _err(res, '没有权限操作');
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
      _err(res, '没有权限操作');
      return;
    }
    let { HASH, count, name, duration } = req.body;
    if (!/(\.JPG|\.LRC|\.MP3|\.MP4)$/gi.test(name)) {
      _err(res);
      return;
    }
    await delDir(`${filepath}/music/${name}`);
    await delDir(`${filepath}/musicys/${name}`);
    if (isImgFile(name)) {
      await _rename(`${filepath}/tem/${HASH}/_hello`, `${filepath}/musicys/${name}`);
      --count;
    }
    await mergefile(count, `${filepath}/tem/${HASH}`, `${filepath}/music/${name}`);
    let [a, b] = extname(name);
    if (b.toLowerCase() == 'mp3') {
      let id = nanoid();
      let arr = a.split('-');
      await insertData('musics', [{
        id,
        artist: arr[0],
        name: arr[1],
        duration,
        mv: ''
      }])
      await writelog(req, `上传歌曲[${a}]`);
    }
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
      _err(res, '没有权限操作');
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
      _err(res, '没有权限操作');
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
route.get('/savesharesongs', async function (req, res) {
  try {
    const account = req._userInfo.account;
    let { id } = req.query;
    let arr = await queryData('share', 'data', `WHERE id=? AND type=?`, [id, 'music']);
    if (arr.length < 0) {
      _err(res);
      return;
    }
    arr = JSON.parse(arr[0].data);
    let uArr = await getMusicList(account);
    uArr.push({
      name: '新歌单',
      id: nanoid(),
      item: arr,
      des: ''
    })
    await updateData('musicinfo', { data: JSON.stringify(uArr) }, `WHERE account=?`, [account]);
    await writelog(req, `转存歌单[/sharemusic/#${id}]`)
    _success(res);
  } catch (error) {
    await writelog(req, `[${req._pathUrl}] ${error}`);
    _success(res, 'ok', []);
  }
})
module.exports = route;
