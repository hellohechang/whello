import { LevelObj } from "../../config";
import { _getData, _setData, randomNum } from "../../utils/utils";

// 页面加载进度条效果
class LoadingBar {
  constructor(options) {
    this.num = 0;
    this.timer = null;
    this.init(options);
  }
  init(options) {
    let defaultobj = {
      color: 'red',
      size: '3',
      setStart: null,
      setEnd: null,
      zIndex: 999
    };
    this.options = Object.assign(defaultobj, options);
    this.render();
  }
  render() {
    this.el = document.createElement('div');
    let { color, size, zIndex } = this.options;
    this.el.style.cssText = `
    display: 'none';
    height: ${size}px;
    background-color: ${color};
    position: fixed;
    bottom: 0;
    left: 0;
    width: 0;
    border-radio:20px;
    pointer-events: none;
    z-index: ${zIndex};
    background-image: linear-gradient(to right, Green, Orange, red);`;
    document.body.appendChild(this.el);
  }
  start() {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
    this.num++;
    if (this.num === 1) {
      this.el.style.display = 'block'
      this.el.style.transition = 'none'
      this.el.style.width = '0'
      this.el.clientHeight
      this.el.style.transition = '2s'
      this.el.style.width = '80%'
      this.options.setStart && this.options.setStart();
    }
  }
  end() {
    this.num--;
    this.num <= 0 ? (this.num = 0) : null;
    if (this.num === 0) {
      this.el.style.transition = '.8s'
      this.el.style.width = '100%'
      this.timer = setTimeout(() => {
        this.el.style.transition = 'none'
        this.el.style.width = '0'
        this.el.style.display = 'none'
      }, 1000)
      this.options.setEnd && this.options.setEnd();
    }
  }
}
window.loadingNum = [5, 22];

let img = document.createElement('img');
img.style.cssText = `
  display: none;
  width: 100px;
  height: 100px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  pointer-events: none;
  z-index: ${LevelObj.loading};
  `;
let timer = null;
let num = 0;
let load = null;
function change() {
  let [x, y] = loadingNum;
  let num = null;
  load = _getData('loading') || 16;

  if (load === 'y') {
    num = randomNum(x, y);
  } else if (load === 'n') {
    return;
  } else {
    if (load < x || load > y) {
      load = randomNum(x, y);
      _setData('loading', 'y');
    }
    num = load;
  }
  img.src = `/img/loading${num}.gif`;
}
change();
document.body.appendChild(img);
const showlimg = () => {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  num++;
  if (num === 1) {
    if (load === 'n') return;
    img.style.display = 'block';
    img.style.opacity = 1;
  }
};
const hidelimg = () => {
  num--;
  num <= 0 ? (num = 0) : null;
  if (num === 0) {
    img.style.transition = '.8s'
    img.style.opacity = 0;
    timer = setTimeout(() => {
      clearTimeout(timer);
      timer = null;
      img.style.display = 'none';
      change();
    }, 800)
  }
};

export const _loadingBar = new LoadingBar({
  color: 'red', //进度条颜色
  size: '4', //进度条粗细（px）
  zIndex: LevelObj.loading,
  setStart() {
    //自定义开始回调
    showlimg();
  },
  setEnd() {
    //自定义结束回调
    hidelimg();
  },
});

window.changeLoadImg = change;