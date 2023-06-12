let l = 42, //滑块边长
  r = 10, //滑块半径
  w, //canvas宽度
  h = 200, //canvas高度
  PI = Math.PI;
let ll = l + r * 2; //滑块的实际边长

// 获取指定区间内的随机数
function getRandomNumberByRange(start, end) {
  return Math.round(Math.random() * (end - start) + start);
}

// 创建元素
function createElement(tagName) {
  return document.createElement(tagName);
}

// 创建画布
function createCanvas(width, height) {
  const canvas = createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

// 创建图片
function createImg(onload) {
  let img = createElement('img');
  img.src = '/img/validate.jpg';
  img.crossOrigin = 'Anonymous';
  img.onload = onload;
  return img;
}
// 绘制
function draw(ctx, operation, x, y) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + l / 2, y);
  ctx.arc(x + l / 2, y - r + 2, r, 0, 2 * PI);
  ctx.lineTo(x + l / 2, y);
  ctx.lineTo(x + l, y);
  ctx.lineTo(x + l, y + l / 2);
  ctx.arc(x + l + r - 2, y + l / 2, r, 0, 2 * PI);
  ctx.lineTo(x + l, y + l / 2);
  ctx.lineTo(x + l, y + l);
  ctx.lineTo(x, y + l);
  ctx.lineTo(x, y);
  ctx.fillStyle = '#fff';
  ctx[operation]();
  ctx.beginPath();
  ctx.arc(x, y + l / 2, r, 1.5 * PI, 0.5 * PI);
  ctx.globalCompositeOperation = 'xor';
  ctx.fill();
}
class Validate {
  // 构造器
  constructor(success, fail) {
    this.success = success;
    this.fail = fail;
  }

  // 初始化
  init() {
    this.initDOM();
    this.initImg();
    this.draw();
    this.bindEvents();
  }

  // 初始化DOM
  initDOM() {
    let validateBox = createElement('div');
    validateBox.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          opacity: 0;
          transition: 1s;
          user-select: none;
          background-color: #000000b8;          
      `;
    let box = createElement('div');
    box.style.cssText = `
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        background-color: rgb(255, 255, 255);
        padding: 20px;
        display: flex;
        border-radius: 10px;
        place-items: center;
        width: 90%;
        box-sizing: border-box;
        max-width: 400px;
        z-index: 999;
      `;
    let cbox = createElement('div');
    cbox.style.cssText = `
        position: relative;
        width: 100%;
      `;
    box.appendChild(cbox);
    validateBox.appendChild(box);
    document.body.appendChild(validateBox);
    w = cbox.clientWidth;
    let canvas = createCanvas(w, h),
      block = canvas.cloneNode(true);
    block.style.cssText = `
        position: absolute;
        left: 0;
        top: 0;
      `;
    let sliderContainer = createElement('div');
    sliderContainer.style.cssText = `
        position: relative;
        text-align: center;
        height: 40px;
        line-height: 40px;
        margin-top: 15px;
        background-color: #f7f9fa;
        color: #717172;
      `;
    let sliderMask = createElement('div');
    sliderMask.style.cssText = `
        position: absolute;
        left: 0;
        top: 0;
        height: 40px;
        background-color: #ccc;
      `;
    let slider = createElement('div');
    slider.innerText = '>>';
    slider.style.cssText = `
        position: absolute;
        left: 0px;
        top: 0px;
        width: 40px;
        height: 40px;
        text-align: center;
        font-weight: bold;
        color: rgb(204, 204, 204);
        line-height: 40px;
        background: rgb(177, 177, 177);
        cursor: pointer;
      `;
    let text = createElement('span');
    text.innerHTML = '右滑补全拼图';
    text.style.cssText = `
        color:'#aaa';
      `;

    cbox.appendChild(canvas);
    cbox.appendChild(block);
    sliderMask.appendChild(slider);
    sliderContainer.appendChild(sliderMask);
    sliderContainer.appendChild(text);
    cbox.appendChild(sliderContainer);
    validateBox.style.opacity = 1;
    Object.assign(this, {
      validateBox,
      box,
      cbox,
      canvas,
      block,
      sliderContainer,
      slider,
      sliderMask,
      text,
      canvasCtx: canvas.getContext('2d'),
      blockCtx: block.getContext('2d'),
    });
  }

  // 初始化图像
  initImg() {
    const img = createImg(() => {
      this.canvasCtx.drawImage(img, 0, 0, w, h);
      this.blockCtx.drawImage(img, 0, 0, w, h);
      const y = this.y - r * 2 + 2;
      const imageData = this.blockCtx.getImageData(this.x, y, ll, ll);
      this.block.width = ll;
      this.blockCtx.putImageData(imageData, 0, y);
    });
    this.img = img;
  }

  // 绘画
  draw() {
    this.x = getRandomNumberByRange(ll + 10, w - (ll + 10));
    this.y = getRandomNumberByRange(10 + r * 2, h - (ll + 10));
    draw(this.canvasCtx, 'fill', this.x, this.y);
    draw(this.blockCtx, 'clip', this.x, this.y);
  }

  // 清除
  clean() {
    this.canvasCtx.clearRect(0, 0, w, h);
    this.blockCtx.clearRect(0, 0, w, h);
    this.block.width = w;
  }

  // 绑定事件
  bindEvents() {
    let originX,
      isMouseDown = false;
    this.slider.addEventListener('mousedown', (e) => {
      originX = e.clientX;
      isMouseDown = true;
    });
    this.slider.addEventListener('touchstart', (e) => {
      e = e.targetTouches[0];
      originX = e.clientX;
      isMouseDown = true;
    });
    document.addEventListener('mousemove', (e) => {
      e.preventDefault();
      if (!isMouseDown) {
        return false;
      }
      let moveX = e.clientX - originX;
      moveX < 0 ? (moveX = 0) : moveX > w - 40 ? (moveX = w - 40) : null;
      this.slider.style.left = moveX + 'px';
      this.sliderMask.style.width = moveX + 'px';
      this.block.style.left = ((w - 40 - 20) / (w - 40)) * moveX + 'px';
      this.text.style.display = 'none';
    });
    this.slider.addEventListener('touchmove', (e) => {
      e.preventDefault();
      e = e.targetTouches[0];
      if (!isMouseDown) {
        return false;
      }
      let moveX = e.clientX - originX;
      moveX < 0 ? (moveX = 0) : moveX > w - 40 ? (moveX = w - 40) : null;
      this.slider.style.left = moveX + 'px';
      this.sliderMask.style.width = moveX + 'px';
      this.block.style.left = ((w - 40 - 20) / (w - 40)) * moveX + 'px';
      this.text.style.display = 'none';
    });
    document.addEventListener('mouseup', (e) => {
      if (!isMouseDown) {
        return false;
      }
      isMouseDown = false;
      if (this.verify()) {
        this.sliderMask.style.backgroundColor = '#d2f4ef';
        this.slider.style.backgroundColor = '#52ccba';
        this.validateBox.remove();
        this.success && this.success();
      } else {
        this.sliderMask.style.backgroundColor = '#fce1e1';
        this.slider.style.backgroundColor = '#f57a7a';
        this.fail && this.fail();
        setTimeout(() => {
          this.reset();
        }, 500);
      }
    });
    this.slider.addEventListener('touchend', (e) => {
      if (!isMouseDown) {
        return false;
      }
      isMouseDown = false;
      if (this.verify()) {
        this.sliderMask.style.backgroundColor = '#d2f4ef';
        this.slider.style.backgroundColor = '#52ccba';
        this.validateBox.remove();
        this.success && this.success();
      } else {
        this.sliderMask.style.backgroundColor = '#fce1e1';
        this.slider.style.backgroundColor = '#f57a7a';
        this.fail && this.fail();
        setTimeout(() => {
          this.reset();
        }, 500);
      }
    });
  }

  // 重置
  reset() {
    this.text.style.display = 'block';
    this.sliderMask.style.backgroundColor = '#ccc';
    this.slider.style.backgroundColor = 'rgb(177, 177, 177)';
    this.slider.style.left = 0;
    this.block.style.left = 0;
    this.sliderMask.style.width = 0;
    this.clean();
    this.img.src = '/img/validate.jpg';
    this.draw();
  }
  // 验证
  verify() {
    const left = parseInt(this.block.style.left);
    return Math.abs(left - this.x) < 10;
  }
}

export default function validateImg(success, fail) {
  new Validate(success, fail).init();
}