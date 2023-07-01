import { LevelObj } from "../../config";
import { playSound } from "../../utils/utils";

let msgArr = [];
let zIndex = LevelObj.msg;
class Msg {
  constructor(opt, callback) {
    this.message = opt.message;
    this.type = opt.type || 'info';
    this.callback = callback;
    this.duration = opt.duration || 3000;
    this.timer = null;
    this.init();
  }
  init() {
    this.el = document.createElement('div');
    let t = '';
    switch (this.type) {
      case 'info':
        t = `color: #0c5460;background-color: #d1ecf1;border-color: #bee5eb;`;
        break;
      case 'success':
        t = `background-color: #d1e7dd;color: #146c43;border-color: #c3e6cb;`;
        break;
      case 'danger':
        t = `color: #721c24;background-color: #f8d7da;border-color: #f5c6cb;`;
        break;
      case 'warning':
        t = `color: #856404;background-color: #fff3cd;border-color: #ffeeba;`;
      default:
        break;
    }
    this.el.style.cssText = `
        position: fixed;
        left: 50%;
        transform: translateX(-50%);
        width: 80%;
        max-width: 500px;
        opacity: 0;
        padding: 14px;
        border-radius: 5px;
        line-height: 20px;
        font-size: 16px;
        border: solid 1px;
        z-index: ${zIndex};
        ${t}`;
    this.el.innerText = this.message;
    this.show();
    this.bind();
  }
  bind() {
    this._hdEnter = this.hdEnter.bind(this);
    this._hdLeave = this.hdLeave.bind(this);
    this._hdClick = this.hdClick.bind(this);
    this.el.addEventListener('mouseenter', this._hdEnter);
    this.el.addEventListener('mouseleave', this._hdLeave);
    this.el.addEventListener('click', this._hdClick);
  }
  unbind() {
    this.el.removeEventListener('mouseenter', this._hdEnter);
    this.el.removeEventListener('mouseleave', this._hdLeave);
    this.el.removeEventListener('click', this._hdClick);
  }
  hdClick() {
    this.callback && this.callback('click');
    this.close();
  }
  hdEnter() {
    this.el.isCheck = true;
    this.el.style.zIndex = zIndex + 1;
    this.el.style.opacity = 1;
    clearTimeout(this.timer);
    this.timer = null;
  }
  hdLeave() {
    this.el.style.zIndex = zIndex;
    this.el.style.opacity = .9;
    this.el.isCheck = false;
    this.hide();
  }
  show() {
    let top = 0;
    msgArr.forEach(item => {
      top += item.offsetHeight + 20;
    })
    document.body.appendChild(this.el);
    msgArr.push(this.el);
    this.el.style.top = top + 'px';
    this.el.clientHeight;
    this.el.style.transition = '0.5s ease-out';
    this.el.style.marginTop = '20px';
    this.el.style.opacity = .9;
    this.hide();
  }
  hide() {
    this.timer = setTimeout(() => {
      clearTimeout(this.timer);
      this.timer = null;
      this.close();
    }, this.duration);
  }
  close() {
    this.unbind();
    let idx = msgArr.findIndex(item => item === this.el);
    msgArr.splice(idx, 1);
    let h = this.el.offsetHeight + 20;
    this.el.style.transition = '.5s ease-out';
    this.el.style.marginTop = `-${h}px`;
    this.el.style.opacity = 0;
    setTimeout(() => {
      this.el.remove();
      this.callback && this.callback('close');
    }, 500)
    msgArr.forEach((item, i) => {
      if (item.isCheck || i < idx) return;
      let t = parseInt(item.style.top);
      item.style.transition = '0.5s ease-out';
      item.style.top = t - h + 'px'
    })
  }
}
function success(message = '操作成功', callback) {
  playSound(`/img/blop.mp3`);
  new Msg({ message, type: 'success' }, callback);
}
function error(message = '操作失败', callback) {
  playSound(`/img/error.mp3`);
  new Msg({ message, type: 'danger', duration: 5000 }, callback)
}
function warning(message, callback) {
  playSound(`/img/notice.mp3`);
  new Msg({ message, type: 'warning', duration: 8000 }, callback)
}
function info(message, callback) {
  new Msg({ message }, callback)
}
function msg(opt, callback) {
  new Msg(opt, callback)
}
let _msg = {
  success,
  error,
  warning,
  info,
  msg
}

export default _msg;