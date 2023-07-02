import { LevelObj } from "../../config";

class Pop {
  constructor(opt, callback) {
    this.text = opt.text;
    this.cancel = {
      type: 'light',
      text: '取消',
      ...opt.cancel || {}
    };
    this.confirm = {
      type: 'primary',
      text: '确认',
      ...opt.confirm || {}
    };
    this.callback = callback;
    this.e = opt.e;
    this.init();
  }
  init() {
    this.mask = document.createElement('div');
    this.mask.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        transition: .5s ease-out;
        opacity: 0;
        z-index:${LevelObj.popConfirm};`;
    this.box = document.createElement('div');
    this.box.style.cssText = `
        width: 90%;
        max-width: 250px;
        max-height: 90%;
        position: absolute;
        display: flex;
        flex-flow: column;
        border-radius: 5px;
        padding: 12px;
        box-sizing: border-box;
        background-color: rgb(255, 255, 255);
        box-shadow: rgb(94, 92, 92) 0px 0px 10px;
        user-select: none;`;
    this.textBox = document.createElement('div');
    this.textBox.style.cssText = `
        flex: auto;
        font-size: 16px;
        line-height: 24px;
        word-break: break-all;`;
    this.textBox.innerText = this.text;
    this.btns = document.createElement('div');
    this.btns.style.cssText = `
        flex: none;
        text-align: right;
        padding-top: 10px;`;
    this.cancelBtn = document.createElement('button');
    this.cancelBtn.style.cssText = `padding:6px 10px;`;
    this.cancelBtn.className = `btn btn_${this.cancel.type}`;
    this.cancelBtn.setAttribute('corsur', '');
    this.cancelBtn.innerText = this.cancel.text;
    this.confirmBtn = document.createElement('button');
    this.confirmBtn.style.cssText = `margin-left: 20px;padding:6px 10px;`;
    this.confirmBtn.className = `btn btn_${this.confirm.type}`;
    this.confirmBtn.setAttribute('corsur', '');
    this.confirmBtn.innerText = this.confirm.text;
    this.btns.appendChild(this.cancelBtn);
    this.btns.appendChild(this.confirmBtn);
    this.box.appendChild(this.textBox);
    this.box.appendChild(this.btns);
    this.mask.appendChild(this.box);
    document.body.appendChild(this.mask);
    this.show();
    this.bindEvent();
  }
  show() {
    this.position();
    this.mask.clientWidth;
    this.mask.style.opacity = 1;
  }
  bindEvent() {
    this._hdClick = this.hdClick.bind(this);
    this.mask.addEventListener('click', this._hdClick)
  }
  unBindEvent() {
    this.mask.removeEventListener('click', this._hdClick)
  }
  hdClick(e) {
    const target = e.target;
    if (target == this.mask) {
      this.close();
      this.callback && this.callback('close');
    } else if (target == this.cancelBtn) {
      this.close();
      this.callback && this.callback('cancel');
    } else if (target == this.confirmBtn) {
      this.close();
      this.callback && this.callback('confirm');
    }
  }
  close() {
    this.unBindEvent();
    this.mask.style.opacity = 0;
    let timer = setTimeout(() => {
      clearTimeout(timer);
      timer = null;
      this.mask.remove();
    }, 500)
  }
  position() {
    if (!this.e) {
      this.box.style.top = '50%';
      this.box.style.left = '50%';
      this.box.style.transform = 'translate(-50%,-50%)';
      return;
    }
    let ww = window.innerWidth;
    let hh = window.innerHeight,
      mtw = this.box.offsetWidth,
      mth = this.box.offsetHeight,
      x = this.e.clientX,
      y = this.e.clientY;
    x < ww / 2 ? null : (x = x - mtw);
    y < hh / 2 ? null : (y = y - mth);
    x < 0 ? (x = 0) : x + mtw > ww ? (x = ww - mtw) : null;
    y < 0 ? (y = 0) : y + mth > hh ? (y = hh - mth) : null;
    this.box.style.top = y + 'px';
    this.box.style.left = x + 'px';
  }
}
export default function _pop(opt, callback) {
  new Pop(opt, callback);
}