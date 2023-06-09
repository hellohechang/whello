const fs = require('fs');
const _d = require('./data');
// token加密
const jwt = require('jsonwebtoken');
// 歌曲信息解析
const jsmediatags = require('jsmediatags');
// 接收上传文件
const formidable = require('formidable');
// 记录日志
async function writelog(req, str) {
  str = str + '';
  if (str.trim() === '') return;
  if (req) {
    let { username, account } = req._userInfo;
    str = `[${formatDate({ template: '{0}-{1}-{2} {3}:{4}' })}] - ${username || ''}${account ? `(${account})` : ''
      }(${req._ip}) - ${str} - ${req._os}\n`;
  } else {
    str = `[${formatDate({ template: '{0}-{1}-{2} {3}:{4}' })}] - ${str}\n`;
  }
  await _appendFile('./hello.log', str);
}
// 获取和保存文件
function _readFile(path, y) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      if (y) {
        resolve(result);
      } else {
        resolve(JSON.parse(result));
      }
    });
  });
}
function _writeFile(path, data) {
  data !== null && typeof data === 'object'
    ? (data = JSON.stringify(data))
    : null;
  typeof data !== 'string' ? (data += '') : null;
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
}
function _readdir(path) {
  return new Promise((resolve, reject) => {
    fs.readdir(path, (err, result) => {
      if (err) {
        resolve([]);
        return;
      }
      resolve(result);
    });
  });
}
function _mkdir(path) {
  return new Promise((resolve, reject) => {
    fs.mkdir(path, { recursive: true }, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
}
function _unlink(path) {
  if (!fs.existsSync(path)) return;
  return new Promise((resolve, reject) => {
    fs.unlink(path, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
}
function _appendFile(path, data) {
  return new Promise((resolve, reject) => {
    fs.appendFile(path, data, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
}
//复制文件
function _hdCopy(p1, p2) {
  return new Promise((resolve, reject) => {
    fs.cp(p1, p2, { recursive: true }, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}
// 移动文件
function _rename(p1, p2) {
  return new Promise((resolve, reject) => {
    fs.rename(p1, p2, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}
// 客户端ip获取
function getClientIp(req) {
  let ip = '';
  try {
    ip =
      req.headers['x-forwarded-for'] ||
      req.ip ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress ||
      '';
  } catch (error) {
    ip = '';
  }
  let reg =
    /((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/;
  ip = ip.match(reg);
  return ip ? ip[0] : '0.0.0.0';
}
// 删除目录
function delDir(path) {
  if (!fs.existsSync(path)) return;
  return new Promise((resolve, reject) => {
    fs.stat(path, function (err, status) {
      if (status.isDirectory()) {
        //是文件夹
        fs.readdir(path, function (err, file) {
          let res = file.map((item) => delDir(`${path}/${item}`));
          Promise.all(res).then(() => {
            //当所有的子文件都删除后就删除当前文件夹
            fs.rmdir(path, resolve);
          });
        });
      } else {
        fs.unlink(path, resolve);
      }
    });
  });
}
function formatDate(opt) {
  let { template = '{0}-{1}-{2} {3}:{4}:{5}', timestamp = Date.now() } = opt;
  let date = new Date(+timestamp);
  let year = date.getFullYear(),
    month = date.getMonth() + 1,
    day = date.getDate(),
    week = date.getDay(),
    hour = date.getHours(),
    minute = date.getMinutes(),
    second = date.getSeconds();
  let weekArr = ["日", "一", "二", "三", "四", "五", "六"],
    timeArr = [year, month, day, hour, minute, second, week];
  return template.replace(/\{(\d+)\}/g, function () {
    let key = arguments[1];
    if (key == 6) return weekArr[timeArr[key]];
    let val = timeArr[key] + '';
    if (val == 'undefined') return '';
    return val.length < 2 ? '0' + val : val;
  })
};
// 用户名长度限制
function userlenght(str) {
  let arr = str.split(''),
    num = 0;
  arr.forEach((v) => {
    num +=
      /[\u2E80-\u2FDF\u3040-\u318F\u31A0-\u31BF\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FFF\uA960-\uA97F\uAC00-\uD7FF]/.test(
        v
      )
        ? 2
        : 0.8;
  });
  if (num > 12) {
    return true;
  } else {
    return false;
  }
}
function isUserName(str) {
  let reg =
    /^[\u2E80-\u2FDF\u3040-\u318F\u31A0-\u31BF\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FFF\uA960-\uA97F\uAC00-\uD7FF\w -]+$/g;
  return reg.test(str);
}

// 获取扩展名
function extname(str) {
  let idx = str.lastIndexOf('.'),
    a = '',
    b = '';
  if (idx < 0) {
    a = str;
  } else {
    a = str.slice(0, idx);
    b = str.slice(idx + 1);
  }
  return [a, b];
}
// 用户密码二次加密
function encryption(str) {
  return str.slice(10, -10).split('').reverse().join('');
}
// 音乐去重
function qucong(arr) {
  var hash = {};
  arr = arr.reduce((item, next) => {
    hash.hasOwnProperty(next.id)
      ? ''
      : ((hash[next.id] = true), item.push(next));
    return item;
  }, []);
  return arr;
}
// 压缩图片
// function compressionImg(p1, p2, x, y) {
//   return new Promise((resolve, reject) => {
//     fs.readFile(p1, (err, result) => {
//       if (err) {
//         reject(err);
//         return;
//       }
//       sharp(result)
//         .resize(x, y)
//         .toFile(p2, (err, info) => {
//           resolve(info);
//         });
//     });
//   });
// }
//处理返回的结果
function _send(res, options) {
  res.status(200);
  res.type('application/json');
  res.send(
    Object.assign(
      {
        code: 0,
        codeText: 'OK',
        data: null,
      },
      options
    )
  );
}
function _success(res, codeText = '操作成功', data = null) {
  _send(res, {
    data,
    codeText,
  });
}
function _nologin(res) {
  _send(res, {
    code: 2,
    codeText: `当前未登录，请登录后再操作`,
  });
}
function _nothing(res, data = null) {
  _send(res, {
    code: 3,
    data
  });
}
function _err(res, codeText = '操作失败，请稍后再试', data = null) {
  _send(res, {
    code: 1,
    codeText,
  });
}
// 定时器
function _setTimeout(callback, time) {
  let timer = setTimeout(() => {
    clearTimeout(timer);
    timer = null;
    callback();
  }, time);
  return timer;
}
// 生成token
function jwten(account) {
  return jwt.sign(
    { exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 3, account },
    _d.tokenKey
  );
}
// 解密token
function jwtde(token) {
  try {
    let obj = jwt.verify(token, _d.tokenKey);
    return obj;
  } catch (error) {
    return {};
  }
}
//接收文件
function receiveFiles(req, path, filename) {
  return new Promise((resolve, reject) => {
    formidable({
      multiples: true,
      uploadDir: path, //上传路径
      keepExtensions: true, //包含原始文件的扩展名
      maxFileSize: 200 * 1024 * 1024, //限制上传文件的大小。
    }).parse(req, function (err, fields, files) {
      if (err) {
        reject();
      } else {
        let newPath = `${path}/${files.attrname.newFilename}`,
          originalPath = `${path}/${filename}`;
        fs.rename(newPath, originalPath, function (err) {
          if (err) {
            reject();
            return;
          }
          resolve();
        });
      }
    });
  });
}
// 合并切片
function mergefile(count, from, to) {
  return new Promise(async (resolve, reject) => {
    if (fs.existsSync(from)) {
      let list = await _readdir(from);
      if (list.length < count) {
        reject();
        return;
      }
      list.sort((a, b) => {
        a = a.split('_')[1];
        b = b.split('_')[1];
        return a - b;
      });
      async function hebing(num) {
        if (num >= list.length) {
          await delDir(from);
          resolve();
          return;
        }
        let u = `${from}/${list[num]}`;
        let a = await _readFile(u, true);
        await _appendFile(to, a);
        await delDir(u);
        num++;
        hebing(num);
      }
      hebing(0);
    } else {
      reject();
    }
  });
}
function nanoid() {
  return Date.now().toString(16) + Math.random().toString(16).slice(2);
}

// 音乐排序
function arrSortMinToMax(arr, property) {
  arr.sort((a, b) => {
    return mixedSort(a[property], b[property]);
  });
  return arr;
}
// 混合排序
function mixedSort(a, b) {
  if (/^\d+/.test(a) && /^\d+/.test(b)) {
    return /^\d+/.exec(a) - /^\d+/.exec(b);
  } else if (isChinese(a) && isChinese(b)) {
    return a.localeCompare(b, 'zh-CN');
  } else {
    return a.localeCompare(b, 'en');
  }
}
function isChinese(str) {
  if (
    /^[\u4E00-\u9FCC\u3400-\u4DB5\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\ud840-\ud868][\udc00-\udfff]|\ud869[\udc00-\uded6\udf00-\udfff]|[\ud86a-\ud86c][\udc00-\udfff]|\ud86d[\udc00-\udf34\udf40-\udfff]|\ud86e[\udc00-\udc1d]+/.test(
      str
    )
  ) {
    return true;
  } else {
    return false;
  }
}
// 更新歌单图
function handleMusicList(arr) {
  arr.forEach((v, i) => {
    if (i === 0) {
      v.pic = '/img/history.jpg'
      return
    };
    if (v.item.length != 0) {
      v.pic = encodeURI(`/musicys/${v.item[0].artist}-${v.item[0].name}.jpg`);
    } else {
      v.pic = '/img/music.jpg';
    }
  });
  return arr;
}
function bookSort(arr) {
  return arr.sort((a, b) => a.num - b.num);
}
// 判断网址
function isurl(url) {
  let reg =
    /^(?:(http|https|ftp):\/\/)((?:[\w-]+\.)+[a-z0-9]+)(:[0-9]+)?((?:\/[^/?#]*)+)?(\?[^#]+)?(#.+)?$/i;
  return reg.test(url);
}
// 获取url域名
function getHost(url) {
  let res = url.match(/\/\/([^/?#]+)/)[1]
  return res || 'hello.com';
}
// 读取目录文件
function readMenu(path) {
  return new Promise((resolve, reject) => {
    fs.readdir(path, (err, result) => {
      if (err) {
        resolve([]);
        return;
      }
      let arr = [];
      let arrp = result.map((item) => {
        return new Promise((resolve, reject) => {
          fs.stat(`${path}/${item}`, (err, s) => {
            if (err) {
              resolve(s);
              return;
            }
            if (s.isDirectory()) {
              obj = {
                type: 'dir',
                name: item,
                time: s.ctime.getTime(),
                size: 0,
              };
              arr.push(obj);
            } else {
              obj = {
                type: 'file',
                name: item,
                time: s.ctime.getTime(),
                size: s.size,
              };
              arr.push(obj);
            }
            resolve(s);
          });
        });
      });
      Promise.all(arrp)
        .then(() => {
          resolve(arr);
        })
        .catch((err) => {
          resolve([]);
        });
    });
  });
}
function isImgFile(name) {
  return /(\.JPG|\.PNG|\.GIF|\.JPEG)$/gi.test(name);
}
function hdSearch(searchVal, content) {
  let searchArr = searchVal.split(' ');
  searchArr = searchArr.filter((item) => item);
  let lowerContent = content.toLowerCase();
  let res = [];
  searchArr.forEach((item) => {
    let len = item.length;
    let lowerItem = item.toLowerCase();
    let idx = lowerContent.indexOf(lowerItem);
    if (idx < 0) return;
    let start = idx - 30 < 0 ? 0 : idx - 30;
    let before = content.slice(start, idx);
    let end = idx + len + 30 > content.length ? content.length : idx + len + 30;
    let center = content.slice(idx, idx + len);
    let after = content.slice(idx + len, end);
    res.push({
      before,
      center,
      after,
    });
  });
  return res;
}
function getMusicObj(arr) {
  return arr.reduce((total, item) => {
    total[item.id] = item;
    return total;
  }, {})
}
function deepClone(obj) {
  //判断传入对象为数组或者对象
  let result = Array.isArray(obj) ? [] : {};
  // for in遍历
  for (let key in obj) {
    // 判断是否为自身的属性值（排除原型链干扰）
    if (obj.hasOwnProperty(key)) {
      // 判断对象的属性值中存储的数据类型是否为对象
      if (typeof obj[key] === 'object') {
        // 有可能等于null
        if (obj[key] === null) {
          result[key] = null;
          continue;
        }
        // 递归调用
        result[key] = deepClone(obj[key]); //递归复制
      }
      // 不是的话直接赋值
      else {
        result[key] = obj[key];
      }
    }
  }
  // 返回新的对象
  return result;
}
async function sliceLog(day) {
  day = parseInt(day);
  if (isNaN(day) || day <= 0) return;
  let ms = day * 24 * 60 * 60 * 1000;
  let keyWord = '[' + formatDate({ template: '{0}-{1}-{2}', timestamp: Date.now() - ms });
  let logStr = (await _readFile('./hello.log', 1)).toString();
  let idx = logStr.indexOf(keyWord);
  if (idx < 0) return;
  let str = logStr.slice(idx);
  return _writeFile('./hello.log', str);
}
function getSongInfo(url) {
  return new Promise((resolve, reject) => {
    jsmediatags.read(url, {
      onSuccess: function (tag) {
        let { album, year } = tag.tags;
        resolve({
          album,
          year
        });
      },
      onError: function (error) {
        reject(error);
      }
    });
  })
}
function formartSongFilename(str) {
  if (/[^\-]+\-[^\-]+\.(jpg|mp3|lrc|mp4)$/i.test(str)) {
    const [fname, suffix] = str.split('.'),
      [name, artist] = fname.split('-');
    return name.trim() + '-' + artist.trim() + '.' + suffix.toLowerCase();
  }
  return false;
}
function isMusicFile(str) {
  return /\.(mp3)$/i.test(str);
}
module.exports = {
  isMusicFile,
  formartSongFilename,
  getSongInfo,
  sliceLog,
  deepClone,
  getMusicObj,
  hdSearch,
  _hdCopy,
  isImgFile,
  getHost,
  bookSort,
  readMenu,
  handleMusicList,
  arrSortMinToMax,
  writelog,
  _readFile,
  _writeFile,
  _readdir,
  _mkdir,
  _unlink,
  _appendFile,
  getClientIp,
  delDir,
  formatDate,
  userlenght,
  isUserName,
  extname,
  encryption,
  isurl,
  qucong,
  _send,
  _success,
  _nologin,
  _nothing,
  _err,
  _setTimeout,
  jwten,
  jwtde,
  receiveFiles,
  mergefile,
  nanoid,
  _rename,
};
