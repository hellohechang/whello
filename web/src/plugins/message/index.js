import { LevelObj } from "../../config";
import { playSound } from "../../utils/utils";

// 操作提示弹窗
let timer = null;
let box = document.createElement('div'),
  textbox = document.createElement('div');
box.style.cssText = `
    width: 100%;
    min-height: 100px;
    position: fixed;
    top: 30px;
    transform: translateY(-100%);
    font-size: 18px;
    opacity: 0;
    text-align: center;
    z-index: ${LevelObj.mstc};
    pointer-events: none;`;
textbox.style.cssText = `
    display: inline-block;
    max-height: 100%;
    max-width: 80%;
    line-height: 30px;
    overflow: hidden;
    font-weight: bold;
    box-sizing: border-box;
    padding: 5px 10px;
    border-radius: 10px;
    background-color: rgba(0, 0, 0, 0.6);`;
box.appendChild(textbox);
document.body.appendChild(box);
function mstc(flag, str, again) {
  if (timer !== null) {
    clearTimeout(timer);
    timer = null;
  }
  str = str || (flag ? '操作成功~' : '操作失败~');
  let color = flag ? 'white' : 'rgba(245,27,112,1)';
  if (!again) {
    box.style.transition = '0s';
    box.style.transform = 'translateY(-100%)';
    box.style.opacity = '0';
    box.clientWidth;
  }

  textbox.innerText = str;
  textbox.style.color = color;
  box.style.transition = '0.5s ease-out';
  box.style.transform = 'none';
  box.style.opacity = '1';

  timer = setTimeout(() => {
    clearTimeout(timer);
    timer = null;
    box.style.transition = '1s ease-out';
    box.style.transform = 'translateY(-100%)';
    box.style.opacity = '0';
  }, 5000);
}
export function _success(str, again) {
  mstc(true, str, again);
}
export function _err(str, again) {
  playSound(`/img/error.mp3`);
  mstc(false, str, again);
}