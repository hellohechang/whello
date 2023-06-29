import { LevelObj } from "../../config";

// 上传进度
let upProgressbox = document.createElement('div');
upProgressbox.style.cssText = `
  position: fixed;
  top: 60px;
  right: 20px;
  transform: translateX(100%);
  width: 80%;
  max-width: 400px;
  pointer-events: none;
  transition: 0.5s ease-out;
  z-index: ${LevelObj.upProgressbox};
  `;
document.body.appendChild(upProgressbox);

export class UpProgress {
  constructor(name) {
    this.loadnum = 0;
    this.name = name;
    this.create();
  }
  create() {
    this.box = document.createElement('div');
    this.box1 = document.createElement('div');
    this.box2 = document.createElement('div');
    this.box.style.cssText = `
                  position: relative;
                  background-color: rgb(255 255 255 / 83%);
                  margin-bottom: 5px;
                  border-radius: 5px;
                  border: 1px solid #1389a7;
                  overflow: hidden;`;
    this.box1.style.cssText = `
                  position: relative;
                  width: 100%;
                  height: 40px;
                  line-height: 40px;
                  text-indent: 10px;
                  text-overflow: ellipsis;
                  overflow: hidden;
                  white-space: nowrap;`;
    this.box2.style.cssText = `
                  position: absolute;
                  height: 100%;
                  line-height: 40px;
                  text-align: center;
                  color: #fff;
                  width: 0;
                  transition: 0.5s ease-out;
                  text-overflow: ellipsis;
                  overflow: hidden;
                  white-space: nowrap; 
                  `;
    this.box1.innerText = this.name;
    this.box.appendChild(this.box2);
    this.box.appendChild(this.box1);
    upProgressbox.appendChild(this.box);
    upProgressbox.style.transform = 'none';
  }
  update(pes) {
    //上传进度
    this.box1.innerText = this.name;
    this.box2.style.backgroundColor = '#4595d5ba';
    this.box2.style.width = pes * 100 + '%';
  }
  loading(pes) {
    this.box1.innerText = `加载中...${parseInt(pes * 100)}%`;
  }
  close(title) {
    this.box1.innerText = this.name;
    this.box2.style.width = 100 + '%';
    this.box2.style.backgroundColor = 'green';
    this.box2.style.opacity = '0.8';
    this.box2.style.zIndex = '2';
    this.box2.innerText = title || '上传成功';
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.timer = setTimeout(() => {
      clearTimeout(this.timer);
      this.timer = null;
      this.animate();
    }, 1000);
  }
  fail(title) {
    this.box1.innerText = this.name;
    this.box2.style.width = 100 + '%';
    this.box2.style.backgroundColor = 'red';
    this.box2.style.opacity = '0.8';
    this.box2.style.zIndex = '2';
    this.box2.innerText = title || '上传失败';
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.timer = setTimeout(() => {
      clearTimeout(this.timer);
      this.timer = null;
      this.animate();
    }, 4000);
  }
  animate() {
    this.loadnum += 5;
    this.box.style.transform = `translateX(${this.loadnum}%)`;
    this.box.style.opacity = 1 - this.loadnum / 100;
    if (this.loadnum >= 100) {
      if (this.animation !== null) {
        cancelAnimationFrame(this.animation);
        this.animation = null;
        this.box.remove();
        if (upProgressbox.innerHTML === '') {
          upProgressbox.style.transform = `translateX(100%)`;
        }
      }
      return;
    }
    this.animation = requestAnimationFrame(this.animate.bind(this));
  }
}