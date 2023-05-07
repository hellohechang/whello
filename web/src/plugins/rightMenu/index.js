import { LevelObj } from '../../config';
import { _setTimeout } from '../../utils/utils';
import './index.css'
// 右键菜单
export function rightMenu(e, html, callback) {
  class rightM {
    constructor(e, html, callback) {
      this.callback = callback;
      this.html = html;
      this.e = e;
      this.init();
    }
    init() {
      this.box = document.createElement('div');
      this.box.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      transition: .5s;
      opacity: 0;
      z-index: ${LevelObj.rightBox};
      `;
      this.rightBox = document.createElement('div');
      this.rightBox.style.cssText = `
      max-height: 90%;
      width: 90%;
      max-width: 300px;
      position: absolute;
      border-radius: 5px;
      box-sizing: border-box;
      background-color: rgba(255, 255, 255, .9);
      box-shadow: 0 0 10px #5e5c5c;
      overflow-y: auto;
      border: 10px solid transparent;
      scrollbar-width: none;
      -ms-overflow-style: none;
      user-select: none;
      `;
      this.rightBox.className = 'mtc';
      this.box.appendChild(this.rightBox);
      document.body.appendChild(this.box);

      this.rightBox.innerHTML = this.html;
      this.allInp = this.rightBox.querySelectorAll('input');
      this.rikey(this.e);
      this.newHdClick = this.hdClick.bind(this);
      this.newHdKeyup = this.hdKeyup.bind(this);
      this.box.addEventListener('click', this.newHdClick);
      this.box.addEventListener('keyup', this.newHdKeyup);
      this.box.style.opacity = 1
    }
    rikey(e) {
      let ww = window.innerWidth;
      if (!e || (ww <= 800 && this.allInp.length > 0)) {
        this.rightBox.style.top = '50%';
        this.rightBox.style.left = '50%';
        this.rightBox.style.transform = 'translate(-50%,-50%)';
        return;
      }
      let h = window.innerHeight,
        mtw = this.rightBox.offsetWidth,
        mth = this.rightBox.offsetHeight,
        x = e.clientX,
        y = e.clientY;
      x < ww / 2 ? null : (x = x - mtw);
      y < h / 2 ? null : (y = y - mth);
      x < 0 ? (x = 0) : x + mtw > ww ? (x = ww - mtw) : null;
      y < 0 ? (y = 0) : y + mth > h ? (y = h - mth) : null;
      this.rightBox.style.top = y + 'px';
      this.rightBox.style.left = x + 'px';
    }
    hdClick(e) {
      if (e.target === this.box) {
        this.close();
      }
      let data = [...this.allInp].map((item) => item.value.trim());
      let newClose = this.close.bind(this);
      this.callback && this.callback({ e, close: newClose, inp: data });
    }
    hdKeyup(e) {
      if (e.target.tagName === 'INPUT' && e.key === 'Enter') {
        this.box.querySelector('.mtcbtn').click();
      }
    }
    close() {
      this.box.removeEventListener('click', this.newHdClick);
      this.box.removeEventListener('keyup', this.newHdKeyup);
      this.box.style.opacity = 0;
      _setTimeout(() => {
        this.box.remove();
      }, 300);
    }
  }
  new rightM(e, html, callback);
}