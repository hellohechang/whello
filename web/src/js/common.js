import consolas from '../css/consolas.ttf'
import {
  _setData,
  _getData,
  _setTimeout,
  debounce,
  randomColor,
  getSelectText,
  _getTarget,
  _postAjax,
  copyText,
  _myOpen,
  isurl,
  myOpen
} from '../utils/utils'
import { serverURL, LevelObj } from "../config";
import { _err, _success } from "../plugins/message";
import { _loadingBar } from '../plugins/loadingBar'

//复制编辑选中文本
~(function () {
  let box = document.createElement('div'),
    copy = document.createElement('span'),
    edit = document.createElement('span'),
    open = document.createElement('span'),
    text = '';
  box.style.cssText = `
  display: none;
  position: fixed;
  top: 100px;
  left: 100px;
  z-index: ${LevelObj.copyEdit};
  border-radius: 5px;
  background-color: rgb(255 255 255 / 90%);
  overflow: hidden;
  `;
  copy.setAttribute('cursor', '');
  edit.setAttribute('cursor', '');
  copy.setAttribute('title', '复制');
  edit.setAttribute('title', '编辑');
  open.setAttribute('title', '访问');
  copy.setAttribute('class', 'iconfont icon-fuzhi');
  edit.setAttribute('class', 'iconfont icon-bianji');
  open.setAttribute('class', 'iconfont icon-link');
  copy.style.cssText = edit.style.cssText = open.style.cssText = `
  display: inline-block;
  padding: 5px;
  font-size: 24px;
  margin: 4px;
  color: #6d6d6d;
  `;
  box.appendChild(open);
  box.appendChild(copy);
  box.appendChild(edit);
  document.body.appendChild(box);
  open.style.display = 'none';
  copy.addEventListener(
    'click',
    debounce(
      function () {
        copyText(text);
      },
      1000,
      true
    )
  );
  edit.addEventListener(
    'click',
    debounce(
      function () {
        let local = _getData('md'),
          obj = {
            name: `hello_${Date.now()}`,
            data: text,
          };
        local.push(obj);
        _setData('md', local);
        if (window.openIframe) {
          openIframe(`/edit/#${obj.name}`, 'Edit');
        } else {
          _myOpen(`/edit/#${obj.name}`, 'Edit');
        }
      },
      1000,
      true
    )
  );
  open.addEventListener(
    'click',
    debounce(
      function () {
        myOpen(text, '_blank');
      },
      1000,
      true
    )
  );
  copy.addEventListener('mouseenter', function () {
    copy.style.color = '#0f6ce6';
  });
  copy.addEventListener('mouseleave', function () {
    copy.style.color = '#6d6d6d';
  });
  edit.addEventListener('mouseenter', function () {
    edit.style.color = '#0f6ce6';
  });
  edit.addEventListener('mouseleave', function () {
    edit.style.color = '#6d6d6d';
  });
  open.addEventListener('mouseenter', function () {
    open.style.color = '#0f6ce6';
  });
  open.addEventListener('mouseleave', function () {
    open.style.color = '#6d6d6d';
  });
  function show(e) {
    let t = getSelectText();
    if (t === '') {
      box.style.display = 'none';
      return;
    }
    text = t;
    box.style.display = 'block';
    if (isurl(text)) {
      open.style.display = 'inline-block';
    } else {
      open.style.display = 'none';
    }
    let x = e.clientX,
      y = e.clientY,
      w = window.innerWidth - box.offsetWidth,
      h = window.innerHeight - box.offsetHeight;
    x > w ? (x = w) : null;
    y > h ? (y = h) : null;
    box.style.top = y + 'px';
    box.style.left = x + 'px';
  }
  document.addEventListener('mouseup', debounce(show, 500));
  document.addEventListener('keyup', debounce(show, 500));
})();
// document.addEventListener('mouseover', function (e) {
//   let target = _getTarget(e, 'input', 1) || _getTarget(e, 'textarea', 1) || _getTarget(e, '#ycdiv', 1);
//   if (target) {
//     target.focus();
//     // target.select && target.select()
//   }
// });
_loadingBar.start();
window.onload = function () {
  _loadingBar.end();
};
//鼠标点击效果
~(function () {
  function handle(e) {
    let box = document.createElement('div');
    box.style.cssText = `
      position: fixed;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      z-index: ${LevelObj.dianji};
      pointer-events: none;
      `;
    document.body.appendChild(box);
    let randomc = randomColor();
    box.style.left = e.clientX - 20 / 2 + 'px';
    box.style.top = e.clientY - 20 / 2 + 'px';
    box.style.backgroundColor = randomc;
    box.clientHeight;
    box.style.transition = '.8s ease-out';
    box.style.opacity = 0;
    box.style.transform = 'scale(2)';
    _setTimeout(() => {
      box.remove();
    }, 2000);
    if (_getData('dian') === 'n') return;
    // 心形状
    let box1 = document.createElement('div');
    let box2 = document.createElement('div');
    let box3 = document.createElement('div');
    box1.style.cssText = `
          position: fixed;
          width: 16px;
          height: 16px;
          z-index: ${LevelObj.dianji};
          pointer-events: none;
          transform: rotate(-45deg);
          `;
    box2.style.cssText = `
          position: absolute;
          top: -8px;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          `;
    box3.style.cssText = `
          position: absolute;
          left: 8px;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          `;
    box1.appendChild(box2);
    box1.appendChild(box3);
    document.body.appendChild(box1);
    box1.style.left = e.clientX - 16 / 2 + 'px';
    box1.style.top = e.clientY - 16 / 2 + 'px';
    box1.style.backgroundColor = randomc;
    box2.style.backgroundColor = randomc;
    box3.style.backgroundColor = randomc;
    box1.clientHeight;
    box1.style.transition = '2s ease-out';
    box1.style.opacity = 0;
    box1.style.transform = 'rotate(-55deg) translateY(-600%) scale(1.5)';
    _setTimeout(() => {
      box1.remove();
    }, 2000);
  }
  let _handle = debounce(handle, 100, true);
  document.addEventListener('mouseup', _handle);
  document.addEventListener('touchend', function (e) {
    let ev = e.changedTouches[0];
    _handle(ev);
  });
})();

// 长按事件
EventTarget.prototype._longPress = function (str, callback) {
  let time = null,
    x = null,
    y = null;
  this.addEventListener('touchstart', function (e) {
    x = e.changedTouches[0].clientX;
    y = e.changedTouches[0].clientY;
    time = Date.now();
  });
  this.addEventListener('touchend', function (e) {
    let xx = e.changedTouches[0].clientX,
      yy = e.changedTouches[0].clientY;
    if (Date.now() - time >= 500) {
      if (Math.abs(x - xx) > 30 || Math.abs(y - yy) > 30) return;
      e.preventDefault();
      if (str && callback) {
        let _target = _getTarget(e, str);
        if (_target) {
          callback.call(_target, e);
        }
      } else if (str && !callback) {
        str.call(this, e);
      }
    }
    time = null;
  });
  return this;
};
window.addEventListener('online', function () {
  _success('网络连接成功');
});
window.addEventListener('offline', function () {
  _err('断网了，少年');
});
~(function () {
  let img = document.createElement('img');
  img.src = '/img/hechang.png';
  img.style.cssText = `
  width: 100px;
  height: 100px;
  position: fixed;
  right: 0;
  bottom: 0;
  opacity: .2;
  pointer-events: none;
  z-index: ${LevelObj.hechang};
  `;
  document.body.appendChild(img);
})();
// 黑白
document.documentElement.style.filter = `grayscale(${_getData('pagecolor')})`;

// 捕获错误
window.onerror = function (message, url, line, column, error) {
  _postAjax('/user/panelerror', {
    err: `[Panel error] ${error} at ${url}:${line}:${column}`,
  });
  _err(`出现未知错误~~，站长会尽快处理~`);
};

// 字体处理
~(function () {
  let flag = null;
  function handleFontType() {
    _loadingBar.start();
    let fontType = _getData('fonttype');
    let fontUrl =
      fontType === 'consolas.ttf'
        ? consolas
        : `${serverURL}/getfile/font/${fontType}`;
    let ff = new FontFace('changfont', `url(${fontUrl})`);
    // 添加到全局的 FontFaceSet 中
    document.fonts.add(ff);
    ff.load()
      .then(() => {
        document.body.style.fontFamily = 'changfont';
        _loadingBar.end();
        if (flag) {
          document.fonts.delete(flag);
        }
        flag = ff;
      })
      .catch(() => {
        _err('字体加载失败');
        _loadingBar.end();
      });
  }
  window.handleFontType = handleFontType;
})();
handleFontType();