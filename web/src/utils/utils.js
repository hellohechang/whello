import $ from "jquery";
import SparkMD5 from "spark-md5";
import { serverURL, LevelObj, _d } from "../config";

import { _err, _success } from "../plugins/message";
import { _loadingBar } from '../plugins/loadingBar';
// 解析url
export function queryURLParams(url) {
  let obj = {};
  url.replace(/([^?=&#]+)=([^?=&#]+)/g, (...[, $1, $2]) => (obj[$1] = $2));
  url.replace(/#([^?=&#]+)/g, (...[, $1]) => (obj['HASH'] = $1));
  return obj;
}
export function myOpen(url, _blank) {
  if (!_blank && !url) return window.location.href;
  let a = document.createElement('a');
  a.href = url;
  _blank && (a.target = '_blank');
  document.body.appendChild(a);
  a.click();
  a.remove();
}
// 本地储存
export function _setData(key, data) {
  data = JSON.stringify({ data });
  localStorage.setItem('hello_' + key, encodeURIComponent(data));
}
//本地读取
export function _getData(key) {
  let d = localStorage.getItem('hello_' + key);
  if (d === null) {
    return _d.localStorageDefaultData[key];
  }
  return JSON.parse(decodeURIComponent(d)).data;
}
export function _delData(key) {
  if (key) {
    localStorage.removeItem('hello_' + key);
  } else {
    localStorage.clear();
  }
}
// 定时器
export function _setTimeout(callback, time) {
  let timer = setTimeout(() => {
    clearTimeout(timer);
    timer = null;
    callback();
  }, time);
  return timer;
}
// 获取文件后缀
export function extname(str) {
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
//节流
export function throttle(callback, wait) {
  let timer = null,
    pretime = 0,
    res = null;
  return function (...args) {
    if (timer) clearTimeout(timer);
    let now = Date.now(),
      tt = wait - (now - pretime);
    if (tt <= 0) {
      res = callback.call(this, ...args);
      pretime = now;
    } else {
      timer = setTimeout(() => {
        timer = null;
        res = callback.call(this, ...args);
        pretime = now;
      }, tt);
    }
    return res;
  };
}
//防抖
export function debounce(callback, wait, immedia) {
  let timer = null,
    res = null;
  return function (...args) {
    if (timer) {
      clearTimeout(timer);
    } else {
      if (immedia) res = callback.call(this, ...args);
    }
    timer = setTimeout(() => {
      timer = null;
      if (!immedia) res = callback.call(this, ...args);
    }, wait);
    return res;
  };
}
// 提示音
export function playSound(src) {
  let sound = document.createElement('audio');
  sound.src = src;
  sound.play();
  sound.onended = function () {
    sound.onended = null;
    sound = null;
  };
}
// 随机数
export function randomNum(x, y) {
  return Math.round(Math.random() * (y - x) + x);
}
// 随机颜色
export function randomColor() {
  return `rgb(${randomNum(0, 256)},${randomNum(0, 256)},${randomNum(0, 256)})`;
}
// 获取选中文本
export function getSelectText() {
  return document.getSelection().toString();
}
// 事件委派获取点击目标
export function _getTarget(e, targetStr, current) {
  let target = e.target,
    reg = new RegExp(`\\b${targetStr.replace(/^[\.#]/g, '')}\\b`, 'g');
  if (targetStr.startsWith('.')) {
    if (current) {
      if (reg.test(target.className)) {
        return target;
      } else {
        return null;
      }
    }
    while (target && !reg.test(target.className)) {
      target = target.parentNode;
    }
  } else if (targetStr.startsWith('#')) {
    if (current) {
      if (reg.test(target.id)) {
        return target;
      } else {
        return null;
      }
    }
    while (target && !reg.test(target.id)) {
      target = target.parentNode;
    }
  } else {
    if (current) {
      if (targetStr.toUpperCase() === target.tagName) {
        return target;
      } else {
        return null;
      }
    }
    while (target && targetStr.toUpperCase() !== target.tagName) {
      target = target.parentNode;
    }
  }
  return target;
}
// 获取HASH
export function getBuffer(file) {
  return new Promise((resolve) => {
    let fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);
    fileReader.onload = (e) => {
      let buffer = e.target.result,
        spark = new SparkMD5.ArrayBuffer(),
        HASH,
        suffix;
      spark.append(buffer);
      HASH = spark.end();
      suffix = /\.([a-zA-Z0-9]+)$/.exec(file.name)[1];
      resolve({
        buffer,
        HASH,
        suffix,
        filename: `${HASH}.${suffix}`,
      });
    };
  });
}
// 大文件切片
export function fileSlice(file, callback) {
  return new Promise((resolve, reject) => {
    let chunkSize = 3 * 1024 * 1024,
      suffix = file.name.slice(file.name.lastIndexOf('.') + 1),
      count = Math.ceil(file.size / chunkSize),
      spark = new SparkMD5.ArrayBuffer(),
      fileReader = new FileReader();
    let num = 0,
      chunks = [];
    fileReader.onload = function (e) {
      let buffer = e.target.result;
      spark.append(buffer);
      num++;
      handleChunk();
    };
    fileReader.onerror = function () {
      reject();
    };
    handleChunk();
    function handleChunk() {
      if (num >= count) {
        let HASH = spark.end();
        resolve({
          HASH,
          chunks,
          count,
          suffix,
        });
        return;
      }
      callback && callback(count === 1 ? 1 : num / (count - 1));
      let chunk = file.slice(num * chunkSize, (num + 1) * chunkSize);
      chunks.push({
        file: chunk,
        filename: `_${num}`,
      });
      fileReader.readAsArrayBuffer(chunk);
    }
  });
}
// 随机排列数组
export function myShuffle(arr) {
  let m = arr.length,
    t,
    i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = arr[m];
    arr[m] = arr[i];
    arr[i] = t;
  }
  return arr;
}
//图片或背景加载完毕后显示
export function imgjz(url, fn, fnn) {
  let myimg = new Image();
  myimg.src = url;
  myimg.onload = function () {
    fn && fn();
    myimg.onload = null;
    myimg.onerror = null;
  };
  myimg.onerror = function () {
    fnn && fnn();
    myimg.onload = null;
    myimg.onerror = null;
  };
}
// 判断网址
export function isurl(url) {
  let reg =
    /^(?:(http|https|ftp):\/\/)((?:[\w-]+\.)+[a-z0-9]+)(:[0-9]+)?((?:\/[^/?#]*)+)?(\?[^#]+)?(#.+)?$/i;
  return reg.test(url);
}
// 获取url域名
export function getHost(url) {
  let link = document.createElement("a");
  link.href = url;
  return link.host;
}
// 判断是否苹果设备
export function isios() {
  const ua = navigator.userAgent;
  return /iPad|iPhone|iPod/.test(ua);
}
// 数组按属性中英文排序
export function arrSortMinToMax(arr, property) {
  arr.sort((a, b) => {
    return mixedSort(a[property], b[property]);
  });
  return arr;
}
// 混合排序
export function mixedSort(a, b) {
  if (/^\d+/.test(a) && /^\d+/.test(b)) {
    return /^\d+/.exec(a) - /^\d+/.exec(b);
  } else if (isChinese(a) && isChinese(b)) {
    return a.localeCompare(b, 'zh-CN');
  } else {
    return a.localeCompare(b, 'en');
  }
}
// 是否汉字
export function isChinese(str) {
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
// 触控滑动事件
export function _mySlide(options) {
  let { el, up, right, down, left } = options,
    startX,
    startY;
  el = document.querySelector(el);
  el.addEventListener('touchstart', handleStart);
  el.addEventListener('mousedown', handleStart);

  function handleStart(e) {
    if (e.type === 'touchstart') {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      el.addEventListener('touchmove', handleMove);
      el.addEventListener('touchend', handleEnd);
    } else {
      startX = e.clientX;
      startY = e.clientY;
      el.addEventListener('mousemove', handleMove);
      el.addEventListener('mouseup', handleEnd);
    }
  }
  function handleMove(e) {
    let spanX = 0,
      spanY = 0;
    if (e.type === 'touchmove') {
      spanX = e.changedTouches[0].clientX - startX;
      spanY = e.changedTouches[0].clientY - startY;
      if (Math.abs(spanX) > Math.abs(spanY)) {
        //水平方向滑动
        e.preventDefault();
      } else {
        //垂直方向滑动
      }
    }
  }
  function handleEnd(e) {
    let spanX = 0,
      spanY = 0;
    if (e.type === 'touchend') {
      spanX = e.changedTouches[0].clientX - startX;
      spanY = e.changedTouches[0].clientY - startY;
    } else {
      spanX = e.clientX - startX;
      spanY = e.clientY - startY;
    }
    if (Math.abs(spanX) > Math.abs(spanY)) {
      //水平方向滑动
      if (spanX > 30) {
        right && right(e);
      } else if (spanX < -30) {
        left && left(e);
      }
    } else {
      //垂直方向滑动
      if (spanY > 30) {
        down && down(e);
      } else if (spanY < -30) {
        up && up(e);
      }
    }
    if (e.type === 'touchend') {
      el.removeEventListener('touchmove', handleMove);
      el.removeEventListener('touchend', handleEnd);
    } else {
      el.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseup', handleEnd);
    }
  }
}
export function _postAjax(url, data, y) {
  if (!y) {
    _loadingBar.start();
  }
  data = JSON.stringify(data);
  url = `${serverURL}${url}`;
  return new Promise((resolve, reject) => {
    $.ajax({
      type: 'post',
      url: url,
      dataType: 'json',
      contentType: 'application/json;charset=UTF-8',
      data: data,
      timeout: 10000,
      xhrFields: {
        withCredentials: true,
      },
      success: (data) => {
        if (!y) {
          _loadingBar.end();
        }
        if (data.code == 1) {
          _err(data.codeText);
        } else if (data.code == 2) {
          _delData('state');
          _setData('originurl', myOpen());
          myOpen('/login/');
          return;
        }
        resolve(data);
      },
      error: (err) => {
        if (!y) {
          _err(`服务器被吃了!( ╯□╰ )`);
          _loadingBar.end();
        }
        reject(err);
      },
      complete: function (XMLHttpRequest, status) {
        //请求完成后最终执行参数
        if (status == 'timeout') {
          //超时,status还有success,error等值的情况
          // ajaxTimeoutTest.abort();
          _err(`服务器被吃了!( ╯□╰ )`);
          _loadingBar.end();
        }
      },
    });
  });
}
export function _getAjax(url, data, y, time) {
  if (!y) {
    _loadingBar.start();
  }
  url = `${serverURL}${url}`;
  return new Promise((resolve, reject) => {
    $.ajax({
      type: 'get',
      url: url,
      dataType: 'json',
      contentType: 'application/json;charset=UTF-8',
      data: data,
      timeout: time ? 0 : 10000,
      xhrFields: {
        withCredentials: true,
      },
      cache: false,
      success: (data) => {
        if (!y) {
          _loadingBar.end();
        }
        if (data.code == 1) {
          _err(data.codeText);
        } else if (data.code == 2) {
          _delData('state');
          _setData('originurl', myOpen());
          myOpen('/login');
          return;
        }
        resolve(data);
      },
      error: (err) => {
        if (!y) {
          _err(`服务器被吃了!( ╯□╰ )`);
          _loadingBar.end();
        }
        reject(err);
      },
      complete: function (XMLHttpRequest, status) {
        //请求完成后最终执行参数
        if (status == 'timeout') {
          //超时,status还有success,error等值的情况
          // ajaxTimeoutTest.abort();
          _err(`服务器被吃了!( ╯□╰ )`);
          _loadingBar.end();
        }
      },
    });
  });
}
// 上传文件
export function _upFile(url, file, callback) {
  url = `${serverURL}${url}`;
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append('attrname', file);
    $.ajax({
      type: 'post',
      data: formData,
      url,
      xhrFields: {
        withCredentials: true,
      },
      contentType: false,
      processData: false,
      xhr: function () {
        let xhr = new XMLHttpRequest();
        xhr.upload.addEventListener('progress', function (e) {
          //loaded代表上传了多少
          //total代表总数为多少
          let pes = e.loaded / e.total;
          callback && callback(pes);
        });
        return xhr;
      },
      success: (data) => {
        if (data.code == 1) {
          _err(data.codeText);
        } else if (data.code == 2) {
          _delData('state');
          _setData('originurl', myOpen());
          myOpen('/login');
          return;
        }
        resolve(data);
      },
      error: () => {
        _err(`服务器被吃了!( ╯□╰ )`);
        reject();
      },
    });
  });
}
// 格式化当前日期或时间戳日期
export function newDate(templete, timestamp) {
  templete ? null : (templete = '{0}年{1}月{2}日 {3}时{4}分{5}秒 星期{6}');
  let currentDate = timestamp ? new Date(+timestamp) : new Date();
  let year = currentDate.getFullYear(),
    month = currentDate.getMonth() + 1,
    date = currentDate.getDate(),
    hour = currentDate.getHours(),
    minute = currentDate.getMinutes(),
    second = currentDate.getSeconds(),
    weekArr = ['日', '一', '二', '三', '四', '五', '六'],
    n_day = currentDate.getDay();
  let formattedDateString = `${year}-${month}-${date}-${hour}-${minute}-${second}-${n_day}`,
    timeArr = formattedDateString.match(/\d+/g);
  return templete.replace(/\{(\d+)\}/g, (...arg) => {
    if (arg[1] === '6') {
      return weekArr[timeArr[arg[1]]];
    } else {
      let time = timeArr[arg[1]] || '00';
      return time.length < 2 ? '0' + time : time;
    }
  });
}
// 选中文本
export function selectText(el) {
  if (document.body.createTextRange) {
    let range = document.body.createTextRange();
    range.moveToElementText(el);
    range.select();
  } else if (window.getSelection) {
    let selection = window.getSelection(),
      range = document.createRange();
    range.selectNodeContents(el);
    selection.removeAllRanges();
    selection.addRange(range);
  }
}
// 一键复制
export async function copyText(content, obj = {}) {
  let { success, error } = obj;
  content = content.trim();
  try {
    if (!navigator.clipboard) {
      throw new Error();
    }
    await navigator.clipboard.writeText(content);
    _success(success || '复制成功');
  } catch (err) {
    if (typeof document.execCommand !== 'function') {
      _err(error || '复制失败');
      return;
    }
    window.getSelection().removeAllRanges();
    let div = document.createElement('div'),
      range = document.createRange();
    div.innerText = content;
    div.setAttribute(
      'style',
      'position: fixed;height: 1px;fontSize: 1px;overflow: hidden;'
    );
    document.body.appendChild(div);
    range.selectNode(div);
    window.getSelection().addRange(range);
    document.execCommand('copy');
    div.remove();
    _success(success || '复制成功');
  }
}
// 文件大小计算
export function computeSize(fsize) {
  fsize = Number(fsize);
  if (isNaN(fsize)) return 0;
  if (fsize >= 1024 * 1024 * 1024) {
    fsize = `${(fsize / 1024 / 1024 / 1024).toFixed(2)}G`;
  } else if (fsize >= 1024 * 1024) {
    fsize = `${(fsize / 1024 / 1024).toFixed(2)}M`;
  } else if (fsize >= 1024) {
    fsize = `${(fsize / 1024).toFixed(2)}kb`;
  } else if (fsize < 1024) {
    fsize = `${fsize.toFixed(2)}b`;
  }
  return fsize;
}
// 转义字符串
export function encodeHtml(str) {
  return str && str.replace
    ? str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\\/g, '&#92;')
      .replace(/\//g, '&#x2F;')
      // .replace(/ /g, '&nbsp;')
      .replace(/\'/g, '&#39;')
      .replace(/\"/g, '&quot;')
    : str;
}
export function isUserName(str) {
  let reg =
    /^[\u2E80-\u2FDF\u3040-\u318F\u31A0-\u31BF\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FFF\uA960-\uA97F\uAC00-\uD7FF\w -]+$/g;
  return str && reg.test(str);
}
export function _each(obj, callback, context) {
  let isLikeArray =
    Object.prototype.toString.call(obj) === '[object Array]' ||
    ('length' in obj && typeof obj.length === 'number');
  Object.prototype.toString.call(callback) === '[object Function]'
    ? null
    : (callback = Function.prototype);

  if (isLikeArray) {
    let arr = [...obj];
    for (let i = 0; i < arr.length; i++) {
      let item = arr[i],
        res = callback.call(context, item, i);
      if (res === false) break;
      if (typeof res === 'undefined') continue;
      arr[i] = res;
    }
    return arr;
  }
  let _obj = { ...obj };
  for (let key in _obj) {
    if (!_obj.hasOwnProperty(key)) break;
    let val = _obj[key],
      res = callback.call(context, val, key);
    if (res === false) break;
    if (typeof res === 'undefined') continue;
    _obj[key] = res;
  }
  return _obj;
}
export function DownloadJSON(content, filename) {
  content = JSON.stringify(content);
  var eleLink = document.createElement('a');
  eleLink.download = filename || 'hello';
  eleLink.style.display = 'none';
  var blob = new Blob([content]);
  eleLink.href = URL.createObjectURL(blob);
  document.body.appendChild(eleLink);
  eleLink.click();
  document.body.removeChild(eleLink);
}
// id生成
export function nanoid() {
  return (+(Date.now() + Math.random().toFixed(5).slice(-5))).toString(16);
}
// 获取图片尺寸
export function _imgSize(file) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader(),
      img = new Image();

    reader.readAsDataURL(file);
    // 转换base64
    reader.onload = function (e) {
      img.src = e.target.result;
    };
    img.onload = function () {
      resolve({
        width: this.width,
        height: this.height,
      });
    };
    img.onerror = function (err) {
      reject(err);
    };
  });
}
// 压缩图片
export function compressionImg(file, x = 400, y = 400) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader(),
      img = new Image(),
      canvas = document.createElement('canvas'),
      context = canvas.getContext('2d');

    reader.readAsDataURL(file);
    // 转换base64
    reader.onload = function (e) {
      img.src = e.target.result;
    };
    img.onload = function () {
      // 图片原始尺寸
      var originWidth = this.width;
      var originHeight = this.height;
      // 目标尺寸
      var targetWidth = originWidth,
        targetHeight = originHeight;
      // 图片尺寸超过400x400的限制
      if (originWidth > x || originHeight > y) {
        if (originWidth / originHeight > x / y) {
          // 更宽，按照宽度限定尺寸
          targetWidth = x;
          targetHeight = Math.round(x * (originHeight / originWidth));
        } else {
          targetHeight = y;
          targetWidth = Math.round(y * (originWidth / originHeight));
        }
      }

      // canvas对图片进行缩放
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      // 清除画布
      context.clearRect(0, 0, targetWidth, targetHeight);
      // 图片压缩
      context.drawImage(img, 0, 0, targetWidth, targetHeight);
      // canvas转为blob并上传
      canvas.toBlob(function (blob) {
        resolve(blob);
      }, file.type || 'image/png');
    };
    img.onerror = function (err) {
      reject(err);
    };
  });
}
export function checkedType(target) {
  return Object.prototype.toString.call(target).slice(8, -1);
}
// 深拷贝
export function deepClone(obj) {
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
export function _position(el, relativeToHTML) {
  let top = el.getBoundingClientRect().top,
    left = el.getBoundingClientRect().left;
  if (!relativeToHTML) {
    let p = el.offsetParent;
    top -= _offset(p).top;
    left -= _offset(p).left;
  }
  return {
    top,
    left,
  };
}
export function _offset(el) {
  let top = 0,
    left = 0;
  while (el.nodeName !== 'BODY') {
    top += el.offsetTop;
    left += el.offsetLeft;
    el = el.parentNode;
  }
  return {
    top,
    left,
  };
}
export function _myOpen(url, name) {
  // 在iframe中显示
  if (parent.window !== window) {
    parent.window.openIframe(url, name || url);
    return;
  }
  myOpen(url, '_blank');
}
export function _progressBar(percent, callback) {
  let box = document.createElement('div');
  box.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgb(0 0 0 / 19%);
    z-index: ${LevelObj._progressBar};
    transition: .5s;
    opacity: 0;
    `;
  let proBox = document.createElement('div');
  proBox.style.cssText = `
    width: 90%;
    max-width: 500px;
    background-color: #fff;
    border-radius: 5px;
    display: flex;
    padding: 10px 30px 30px 30px;
    box-sizing: border-box;
    align-items: center;
    justify-content: center;
    flex-flow: column;
    color: #868686;
    transition: .5s;
    transform: translateY(-50px);
    `;
  // 显示百分比
  let percentBox = document.createElement('div');
  percentBox.style.cssText = `
    line-height: 50px;
    font-size: 30px;
    `;
  // 进度条盒子
  let pro1Box = document.createElement('div');
  pro1Box.style.cssText = `
    position: relative;
    width: 100%;
    height: 40px;
    background-color: #ccc;
    overflow: hidden;
    `;
  // 进度条内遮罩
  let pro2Box = document.createElement('div');
  pro2Box.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    height: 40px;
    background-color: rgb(102 101 101);
    `;
  // 进度条滑块
  let dolt = document.createElement('div');
  dolt.style.cssText = `
    float: right;
    transform: translateX(50%);
    height: 40px;
    width: 40px;
    background-color: #242424;
    `;
  // 放入body
  pro2Box.appendChild(dolt);
  pro1Box.appendChild(pro2Box);
  proBox.appendChild(percentBox);
  proBox.appendChild(pro1Box);
  box.appendChild(proBox);
  document.body.appendChild(box);
  proBox.clientHeight;
  proBox.style.transform = 'none';
  box.style.opacity = 1;

  let pro1BoxL; //进度条盒子距离窗口的距离

  calculationPosition(percent);
  // 计算进度位置
  function calculationPosition(per) {
    per <= 0 ? (per = 0) : per >= 1 ? (per = 1) : null;
    let val =
      (pro1Box.offsetWidth - dolt.offsetWidth) * per + dolt.offsetWidth / 2;
    pro2Box.style.width = val + 'px';
    percentBox.innerText = parseInt(per * 100) + '%';
  }
  function move(e) {
    percent =
      (e.clientX - pro1BoxL - dolt.offsetWidth / 2) /
      (pro1Box.offsetWidth - dolt.offsetWidth);
    percent <= 0 ? (percent = 0) : percent >= 1 ? (percent = 1) : null;
    calculationPosition(percent);
    callback && callback(percent, 'move');
  }
  // 桌面端
  pro1Box.onmousedown = function (e) {
    pro1BoxL = pro1Box.getBoundingClientRect().left;
    tmove(e);
    function tmove(e) {
      e.preventDefault();
      move(e);
    }
    function up(e) {
      callback && callback(percent, 'up');
      document.removeEventListener('mousemove', tmove);
      document.removeEventListener('mouseup', up);
    }
    document.addEventListener('mousemove', tmove);
    document.addEventListener('mouseup', up);
  };
  // 移动端
  pro1Box.ontouchstart = function (e) {
    pro1BoxL = pro1Box.getBoundingClientRect().left;
    tmove(e);
    function tmove(e) {
      e.preventDefault();
      let ev = e.changedTouches[0];
      move(ev);
    }
    function up(e) {
      callback && callback(percent, 'up');
      pro1Box.removeEventListener('touchmove', tmove);
      pro1Box.removeEventListener('touchend', up);
    }
    pro1Box.addEventListener('touchmove', tmove);
    pro1Box.addEventListener('touchend', up);
  };
  box.onclick = function (e) {
    if (e.target === box) {
      box.ontransitionend = function () {
        box.ontransitionend = null;
        pro1Box.onmousedown = null;
        pro1Box.ontouchstart = null;
        box.onclick = null;
        box.remove();
      };
      proBox.style.transform = 'translateY(-50px)';
      box.style.opacity = 0;
    }
  };
}
export function isImgFile(name) {
  return /(\.JPG|\.PNG|\.GIF|\.JPEG)$/gi.test(name);
}
// 文件logo类型
export function fileLogoType(fname) {
  if (isImgFile(fname)) {
    return 'icon-tupian';
  } else if (
    /(\.wmv|\.asf|\.asx|\.rm|\.rmvb|\.3gp|\.mov|\.mp4|\.m4v|\.avi|\.dat|\.mkv|\.flv|\.vob)$/gi.test(
      fname
    )
  ) {
    return 'icon-shipin2';
  } else if (/(\.mp3|\.wma|\.wav|\.mid|\.ape|\.flac)$/gi.test(fname)) {
    return 'icon-yinle';
  } else if (/(\.docx|\.doc|\.dot|\.RTF|\.rtf)$/gi.test(fname)) {
    return 'icon-Word';
  } else if (/(\.json)$/gi.test(fname)) {
    return 'icon-json';
  } else if (/(\.js)$/gi.test(fname)) {
    return 'icon-js';
  } else if (/(\.css)$/gi.test(fname)) {
    return 'icon-css';
  } else if (/(\.html)$/gi.test(fname)) {
    return 'icon-html';
  } else if (/(\.vue)$/gi.test(fname)) {
    return 'icon-vue';
  } else if (/(\.db)$/gi.test(fname)) {
    return 'icon-database';
  } else if (/(\.xltx|\.xls|\.xlsm|\.xlsb|\.csv|\.xml)$/gi.test(fname)) {
    return 'icon-Excel';
  } else if (/(\.pptx|\.ppt|\.xps)$/gi.test(fname)) {
    return 'icon-ppt';
  } else if (
    /(\.rar|\.7z|\.zip|\.ar|\.bz|\.car|\.dar|\.cpgz|\.f|\.ha)$/gi.test(fname)
  ) {
    return 'icon-filezip';
  } else if (/(\.md)$/gi.test(fname)) {
    return 'icon-financial_markdown';
  } else if (/(\.exe)$/gi.test(fname)) {
    return 'icon-exe1';
  } else if (/(\.txt)$/gi.test(fname)) {
    return 'icon-TXTtubiao';
  } else if (/(\.ios)$/gi.test(fname)) {
    return 'icon-ios';
  } else {
    return 'icon-24gl-fileText';
  }
}
// 下载文件
export function downloadFile(url, fileName) {
  let a = document.createElement('a');
  a.href = url;
  if (fileName) {
    a.download = fileName;
  }
  document.body.appendChild(a);
  a.click();
  a.remove();
}
// 预览图片
export function imgPreview(arr, idx = 0) {
  let result,//图片宽高
    x,//偏移
    y,
    scale = 1,//缩放
    maxScale = 10,//最大缩放
    minScale = 0.5;//最小缩放//移动状态
  let pointers = [], // 触摸点数组
    point1 = { x: 0, y: 0 }, // 第一个点坐标
    point2 = { x: 0, y: 0 }, // 第二个点坐标
    diff = { x: 0, y: 0 }, // 相对于上一次pointermove移动差值
    lastPointermove = { x: 0, y: 0 }, // 用于计算diff
    lastPoint1 = { x: 0, y: 0 }, // 上一次第一个触摸点坐标
    lastPoint2 = { x: 0, y: 0 }, // 上一次第二个触摸点坐标
    lastCenter; // 上一次中心点坐标
  let time = 0;
  let box = document.createElement('div');
  box.style.cssText = `
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  overflow: hidden;
  opacity: 0;
  z-index: ${LevelObj.imgPreview};
  `;
  let image = document.createElement('img');
  // 禁止移动端默认触摸事件
  image.style.cssText = `
  opacity: 0;
  touch-action: none;
  `;
  let image1 = document.createElement('img');
  image1.style.cssText = `
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  max-width: 100%;
  display: none;
  `;
  box.appendChild(image);
  box.appendChild(image1);
  let pre = document.createElement('div');
  pre.style.cssText = `
  display: none;
  position: absolute;
  left: 10px;
  top: 50%;
  padding: 10px;
  font-size: 40px;
  color: #aaa;
  border-radius: 10px;
  background-color: rgb(0 0 0 / 30%);
  transform: translateY(-50%);
  /*cursor: pointer;*/
  `;
  let next = document.createElement('div');
  next.style.cssText = `
  display: none;
  position: absolute;
  right: 10px;
  top: 50%;
  padding: 10px;
  font-size: 40px;
  color: #aaa;
  border-radius: 10px;
  background-color: rgb(0 0 0 / 30%);
  transform: translateY(-50%);
  /*cursor: pointer;*/
  `;
  pre.innerText = '<';
  next.innerText = '>';
  pre.setAttribute('cursor', '');
  next.setAttribute('cursor', '');
  box.appendChild(pre);
  box.appendChild(next);
  document.body.appendChild(box);
  box.style.transition = '.2s';
  box.style.opacity = 1;
  if (arr.length > 1) {
    pre.style.display = 'block';
    next.style.display = 'block';
  }

  function cut(idx) {
    scale = 1;
    image.style.opacity = 0;
    image1.style.display = 'none';
    _loadingBar.end();
    let { u1, u2 } = arr[idx];
    _loadingBar.start();
    if (u2) {
      image1.src = u2;
      image1.style.display = 'block';
    }
    image.src = u1;
  }
  cut(idx);
  function hdLoad() {
    result = getImgSize(image.naturalWidth, image.naturalHeight, window.innerWidth, window.innerHeight);
    image.style.width = result.width + 'px';
    image.style.height = result.height + 'px';
    x = (window.innerWidth - result.width) * 0.5;
    y = (window.innerHeight - result.height) * 0.5;
    image.style.transform = 'translate3d(' + x + 'px, ' + y + 'px, 0) scale(1)';
    image1.style.display = 'none';
    image.style.opacity = 1;
    _loadingBar.end();
  }
  function hdError() {
    _loadingBar.end();
    image.style.opacity = 0;
    _err('图片加载失败');
  }
  function hdMove(e) {
    if (e.target !== image) return;
    handlePointers(e);
    const current1 = { x: pointers[0].clientX, y: pointers[0].clientY };
    if (pointers.length === 1) {
      diff.x = current1.x - lastPointermove.x;
      diff.y = current1.y - lastPointermove.y;
      lastPointermove = { x: current1.x, y: current1.y };
      x += diff.x;
      y += diff.y;
      image.style.transform = 'translate3d(' + x + 'px, ' + y + 'px, 0) scale(' + scale + ')';
    } else if (pointers.length === 2) {
      const current2 = { x: pointers[1].clientX, y: pointers[1].clientY };
      // 计算相对于上一次移动距离比例 ratio > 1放大，ratio < 1缩小
      let ratio = getDistance(current1, current2) / getDistance(lastPoint1, lastPoint2);
      // 缩放比例
      const _scale = scale * ratio;
      if (_scale > maxScale) {
        scale = maxScale;
        ratio = maxScale / scale;
      } else if (_scale < minScale) {
        scale = minScale;
        ratio = minScale / scale;
      } else {
        scale = _scale;
      }
      // 计算当前双指中心点坐标
      const center = getCenter(current1, current2);
      // 计算图片中心偏移量，默认transform-origin: 50% 50%
      // 如果transform-origin: 0% 0%，那origin.x = (ratio - 1) * result.width * 0
      // origin.y = (ratio - 1) * result.height * 0
      // 如果transform-origin: 30% 40%，那origin.x = (ratio - 1) * result.width * 0.3
      // origin.y = (ratio - 1) * result.height * 0.4
      const origin = { x: (ratio - 1) * result.width * 0.5, y: (ratio - 1) * result.height * 0.5 };
      // 计算偏移量
      x -= (ratio - 1) * (center.x - x) - origin.x - (center.x - lastCenter.x);
      y -= (ratio - 1) * (center.y - y) - origin.y - (center.y - lastCenter.y);
      image.style.transform = 'translate3d(' + x + 'px, ' + y + 'px, 0) scale(' + scale + ')';
      lastCenter = { x: center.x, y: center.y };
      lastPoint1 = { x: current1.x, y: current1.y };
      lastPoint2 = { x: current2.x, y: current2.y };
    }
    e.preventDefault();
  }
  function hdUp(e) {
    pointers = [];
    box.removeEventListener('pointermove', hdMove);
    box.removeEventListener('pointerup', hdUp);
    if ((Date.now() - time) < 200) {
      if (e.target === pre) {
        idx -= 1;
        idx < 0 ? idx = arr.length - 1 : null;
        cut(idx);
        return;
      }
      if (e.target === next) {
        idx += 1;
        idx >= arr.length ? idx = 0 : null;
        cut(idx);
        return;
      }
      box.removeEventListener('pointerdown', hdDown);
      image.removeEventListener('wheel', hdWheel);
      image.removeEventListener('load', hdLoad);
      image.removeEventListener('error', hdError);
      box.style.transition = '.5s';
      box.style.opacity = 0;
      _loadingBar.end();
      let timer = setTimeout(() => {
        clearTimeout(timer);
        timer = null;
        box.remove();
      }, 500);
    }
  }
  function hdWheel(e) {
    let ratio = 1.1;
    // 缩小
    if (e.deltaY > 0) {
      ratio = 1 / 1.1;
    }
    const _scale = scale * ratio;
    if (_scale > maxScale) {
      ratio = maxScale / scale;
      scale = maxScale;
    } else if (_scale < minScale) {
      ratio = minScale / scale;
      scale = minScale;
    } else {
      scale = _scale;
    }
    // 目标元素是img说明鼠标在img上，以鼠标位置为缩放中心，否则默认以图片中心点为缩放中心
    if (e.target.tagName === 'IMG') {
      const origin = {
        x: (ratio - 1) * result.width * 0.5,
        y: (ratio - 1) * result.height * 0.5
      };
      // 计算偏移量
      x -= (ratio - 1) * (e.clientX - x) - origin.x;
      y -= (ratio - 1) * (e.clientY - y) - origin.y;
    }
    image.style.transform = 'translate3d(' + x + 'px, ' + y + 'px, 0) scale(' + scale + ')';
    e.preventDefault();
  }
  function hdDown(e) {
    // 绑定 pointerup
    box.addEventListener('pointerup', hdUp);
    time = Date.now();
    if (e.target !== image) return;
    pointers.push(e);
    point1 = { x: pointers[0].clientX, y: pointers[0].clientY };
    if (pointers.length === 1) {
      image.setPointerCapture(e.pointerId);
      lastPointermove = { x: pointers[0].clientX, y: pointers[0].clientY };
    } else if (pointers.length === 2) {
      point2 = { x: pointers[1].clientX, y: pointers[1].clientY };
      lastPoint2 = { x: pointers[1].clientX, y: pointers[1].clientY };
      lastCenter = getCenter(point1, point2);
    }
    lastPoint1 = { x: pointers[0].clientX, y: pointers[0].clientY };
    // 绑定 pointermove
    box.addEventListener('pointermove', hdMove);
  }
  // 图片加载完成后再操作，否则naturalWidth为0
  image.addEventListener('load', hdLoad);
  image.addEventListener('error', hdError);
  // 绑定 pointerdown
  box.addEventListener('pointerdown', hdDown);
  // 滚轮缩放
  image.addEventListener('wheel', hdWheel);

  /**
   * 更新指针
   * @param {PointerEvent} e
   * @param {string} type
   */
  function handlePointers(e) {
    for (let i = 0; i < pointers.length; i++) {
      if (pointers[i].pointerId === e.pointerId) {
        pointers[i] = e;
      }
    }
  }

  /**
   * 获取两点间距离
   * @param {object} a 第一个点坐标
   * @param {object} b 第二个点坐标
   * @returns
   */
  function getDistance(a, b) {
    const x = a.x - b.x;
    const y = a.y - b.y;
    return Math.hypot(x, y); // Math.sqrt(x * x + y * y);
  }
  /**
   * 获取中点坐标
   * @param {object} a 第一个点坐标
   * @param {object} b 第二个点坐标
   * @returns
   */
  function getCenter(a, b) {
    const x = (a.x + b.x) / 2;
    const y = (a.y + b.y) / 2;
    return { x: x, y: y };
  }

  /**
 * 获取图片缩放尺寸
 * @param {number} naturalWidth 
 * @param {number} naturalHeight 
 * @param {number} maxWidth 
 * @param {number} maxHeight 
 * @returns 
 */
  function getImgSize(naturalWidth, naturalHeight, maxWidth, maxHeight) {
    const imgRatio = naturalWidth / naturalHeight;
    const maxRatio = maxWidth / maxHeight;
    let width, height;
    // 如果图片实际宽高比例 >= 显示宽高比例
    if (imgRatio >= maxRatio) {
      if (naturalWidth > maxWidth) {
        width = maxWidth;
        height = maxWidth / naturalWidth * naturalHeight;
      } else {
        width = naturalWidth;
        height = naturalHeight;
      }
    } else {
      if (naturalHeight > maxHeight) {
        width = maxHeight / naturalHeight * naturalWidth;
        height = maxHeight;
      } else {
        width = naturalWidth;
        height = naturalHeight;
      }
    }
    return { width: width, height: height };
  }
}
export function getPreUrl() {
  const reg = /^(https?:\/\/)([^\/\#\?]+)/;
  return myOpen().match(reg)[0];
}
export function setPageScrollTop(top) {
  document.documentElement.scrollTop /* 标准 */ = top;
  window.pageYOffset /* Safari */ = top;
  document.body.scrollTop /* IE6/7/8 */ = top;
}
export function getPageScrollTop() {
  let doc = document;
  return doc.documentElement.scrollTop /* 标准 */ || window.pageYOffset /* Safari */ || doc.body.scrollTop /* IE6/7/8 */ || 0;
}
// 音乐去重
export function qucong(arr) {
  var hash = {};
  arr = arr.reduce((item, next) => {
    hash.hasOwnProperty(next.name + next.artist)
      ? ''
      : ((hash[next.name + next.artist] = true), item.push(next));
    return item;
  }, []);
  return arr;
}
// 限制用户名长度
export function userlenght(str) {
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
};
export function pageErr(str) {
  let div = document.createElement('div');
  div.style.cssText = `
  text-align: center;
  padding: 50px 0px;
  font-size: 30px;
  color: #e52335;
  `;
  div.innerText = str;
  document.body.innerHTML = '';
  document.body.appendChild(div);
}
export function getDuration(file) {
  return new Promise((resolve, reject) => {
    let url = URL.createObjectURL(file);
    let audioElement = new Audio(url);
    audioElement.onloadeddata = function () {
      resolve(audioElement.duration)
    }
    audioElement.onerror = function () {
      reject();
    }
  })
}