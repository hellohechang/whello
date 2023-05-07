import { LevelObj } from "../../config";

// 弹出框插件
export const alert = (function () {
  class Dialog {
    constructor(content, options) {
      this.content = content;
      this.options = options;
      this.timer = null;
      this._alertBox = null;
      this._main = null;
      this._header = null;
      this._title = null;
      this._close = null;
      this._text = null;
      this._footer = null;
      this._confirm = null;
      this._cancel = null;
      this._W = document.documentElement.clientWidth;

      this.init();
    }
    //创建元素
    createEl(cssText = '', type = 'div') {
      let div = document.createElement(type);
      div.style.cssText = cssText;
      return div;
    }

    create() {
      let { confirm, button } = this.options,
        content = this.content;

      //=>创建元素
      this._alertBox = this.createEl(`
                position: fixed;
                top: 0;
                left: 0;
                z-index: ${LevelObj.alertBox};
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, .8);
                user-select: none;
                opacity: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: opacity .6s;`);
      this._main = this.createEl(`
              transform: translateY(-100px);
              width: 90%;
              max-width: 400px;
              background: #FFF;
              border-radius: 3px;
              overflow: hidden;
              transition: transform .5s;`);
      this._header = this.createEl(`
              position: relative;
              box-sizing: bobder-box;
              height: 40px;
              background: #2299EE;`);
      this._title = this.createEl(
        `
              font-size: 18px;
              color: rgb(255, 255, 255);
              margin: 0px;
              line-height: 40px;
              padding: 0 40px 0 10px;
              overflow: hidden;
              font-weight: normal;
              white-space: nowrap;
              text-overflow: ellipsis;`,
        'h3'
      );

      this._close = this.createEl(
        `
            position:  absolute;
            left:  0px;
            top:  0px;
            width:  40px;
            line-height:  40px;
            text-align:  center;
            font-size:  20px;
            font-style:  normal;
            transition: .1s;
            color:  rgb(255, 255, 255);`,
        'i'
      );
      this._text = this.createEl(`
              padding: 20px 10px;
              line-height: 20px;
              font-size: 16px;
              word-break: break-all;
              `);
      this._footer = this.createEl(`
              text-align: right;
              padding: 10px 10px;
              border-top: 1px solid #EEE;`);
      this._confirm = this.createEl(
        `
              margin: 5px 10px;
              padding: 0 15px;
              height: 28px;
              line-height: 28px;
              border: none;
              font-size: 14px;
              color: #FFF;
              transition: .1s;
              background: #2299EE;`,
        'button'
      );
      this._cancel = this.createEl(
        `
              margin: 5px 10px;
              padding: 0 15px;
              height: 28px;
              line-height: 28px;
              border: none;
              font-size: 14px;
              transition: .1s;
              co1or: #000;
              background: #DDD;`,
        'button'
      );
      //=>插入到页面中
      this._close.className = 'iconfont icon-guanbi';
      this._close.setAttribute('cursor', '');
      this._header.appendChild(this._title);
      this._header.appendChild(this._close);
      this._main.appendChild(this._header);
      this._text.innerText = content;
      this._main.appendChild(this._text);

      if (confirm) {
        this._confirm.innerHTML = button.confirm;
        this._cancel.innerHTML = button.cancel;
        this._confirm.setAttribute('cursor', '');
        this._cancel.setAttribute('cursor', '');
        this._footer.appendChild(this._cancel);
        this._footer.appendChild(this._confirm);
        this._main.appendChild(this._footer);
      }

      this._alertBox.appendChild(this._main);
      document.body.appendChild(this._alertBox);
    }
    show() {
      let { _alertBox, _main } = this;
      _alertBox.style.opacity = 1;
      _main.style.transform = 'translateY(0px)';

      if (!this.options.confirm) {
        let handled = this.options.handled;
        this.timer = setTimeout(() => {
          this.hide();
          typeof handled === 'function' ? handled.call(this, 'close') : null;
          clearTimeout(this.timer);
          this.timer = null;
        }, 5000);
      }
    }
    hide() {
      let { _alertBox, _main, _close, _confirm, _cancel } = this;
      _alertBox.style.opacity = 0;
      _main.style.transform = 'translateY(-100px)';
      clearTimeout(this.timer);
      this.timer = null;
      let timer = setTimeout(() => {
        clearTimeout(timer);
        timer = null;
        _alertBox.onclick = null;
        _close.onclick = null;
        _confirm.onclick = null;
        _cancel.onclick = null;
        _close.onmouseenter = null;
        _confirm.onmouseenter = null;
        _cancel.onmouseenter = null;
        _close.onmouseleave = null;
        _confirm.onmouseleave = null;
        _cancel.onmouseleave = null;
        _alertBox.remove();
      }, 500);
    }
    init() {
      this.create();
      this._alertBox.offsetLeft;
      this.show();

      //事件处理
      let {
        _alertBox,
        _close,
        _confirm,
        _cancel,
        options: { confirm, handled },
      } = this;

      _close.onclick = (_) => {
        typeof handled === 'function' ? handled.call(this, 'close') : null;
        this.hide();
      };
      _close.onmouseenter = (_) => {
        _close.style.backgroundColor = '#1c1c1b70';
      };
      _close.onmouseleave = (_) => {
        _close.style.backgroundColor = 'transparent';
      };
      _alertBox.onclick = (e) => {
        if (e.target === _alertBox) {
          typeof handled === 'function' ? handled.call(this, 'close') : null;
          this.hide();
        }
      };
      if (confirm) {
        _confirm.onclick = (_) => {
          typeof handled === 'function' ? handled.call(this, 'confirm') : null;
          this.hide();
        };
        _cancel.onclick = (_) => {
          typeof handled === 'function' ? handled.call(this, 'cancel') : null;
          this.hide();
        };
        _confirm.onmouseenter = (_) => {
          _confirm.style.backgroundColor = 'rgb(11 115 189)';
        };
        _confirm.onmouseleave = (_) => {
          _confirm.style.backgroundColor = '#2299EE';
        };
        _cancel.onmouseenter = (_) => {
          _cancel.style.backgroundColor = 'rgb(163 156 156)';
        };
        _cancel.onmouseleave = (_) => {
          _cancel.style.backgroundColor = '#DDD';
        };
      }
    }
  }
  return function anonymous(content = '', options = {}) {
    let _default = {
      button: {
        confirm: '确认',
        cancel: '取消',
      },
      confirm: false,
      handled: null,
    };
    for (let key in options) {
      if (!options.hasOwnProperty(key)) break;
      if (key === 'button') continue;
      _default[key] = options[key];
    }
    if (
      options.hasOwnProperty('button') &&
      Object.prototype.toString.call(options.button) === '[object Object]'
    ) {
      for (let key in options.button) {
        if (!options.button.hasOwnProperty(key)) break;
        _default.button[key] = options.button[key];
      }
    }
    return new Dialog(content, _default);
  };
})();