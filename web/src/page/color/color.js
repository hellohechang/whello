import './jscolor'
import '../../js/common'
import '../../css/reset.css'
import '../../css/iconfont.css'
import './index.css'
~function () {
  const button = document.querySelector("button");
  const input = document.querySelector("input");
  const box = document.querySelector(".box");
  button.onclick = () => {
    let a = input.value;
    copyToClip(a);
  };
  input.onfocus = () => {
    button.innerText = "复制";
  };
  input.oninput = () => {
    document.querySelector('body').style.backgroundColor = input.value;
  };
  // 一键复制
  async function copyToClip(content) {
    content = content.trim()
    try {
      if (!navigator.clipboard) {
        throw new Error()
      }
      await navigator.clipboard.writeText(content)
      button.innerText = '复制成功'
    } catch (err) {
      if (typeof document.execCommand !== "function") {
        button.innerText = "复制失败";
        return;
      }
      window.getSelection().removeAllRanges();
      let div = document.createElement('div'),
        range = document.createRange();
      div.innerText = content;
      div.setAttribute('style', 'position: fixed;height: 1px;fontSize: 1px;overflow: hidden;');
      document.body.appendChild(div)
      range.selectNode(div);
      window.getSelection().addRange(range);
      document.execCommand('copy');
      div.remove()
      button.innerText = '复制成功'
    }
  }
}()