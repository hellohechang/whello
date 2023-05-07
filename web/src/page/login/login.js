import $ from "jquery";
import md5 from "md5";
import '../../css/reset.css'
import '../../css/iconfont.css'
import './login.css'
import {
  queryURLParams,
  myOpen,
  _setData,
  _getData,
  _delData,
  _setTimeout,
  debounce,
  _getTarget,
  _mySlide,
  _postAjax,
  _getAjax,
  _upFile,
  isUserName,
  _each,
  _imgSize,
  _position,
  _offset,
  _myOpen,
  _progressBar,
} from '../../utils/utils'
import { _speed } from "../../config";
import '../../js/common'
import { _err, _success } from "../../plugins/message";
import { alert } from '../../plugins/alert'
import { _loadingBar } from '../../plugins/loadingBar'

~(async function () {
  let $loadingBox = $('.loadingBox'),
    $body = $('body'),
    HASH = queryURLParams(myOpen()).HASH,
    $mbg = $('.mbg');
  let timer = null;
  _setTimeout(() => {
    $mbg.css({
      opacity: '0.8',
    });
    if (HASH === 'resetpass') {
      handleResetPass();
    } else if (HASH === 'register') {
      handleRegister();
    } else if (HASH === 'changepass') {
      handleChangePass();
    } else {
      handleLogin();
    }
  }, 600);
  // 登录
  function handleLogin() {
    if (_getData('state')) {
      myOpen('/');
      return;
    }
    if (timer !== null) {
      clearInterval(timer);
      timer = null;
    }
    myOpen('#');
    $('main').remove();
    let str = `<main>
      <div class="account">
        <input autocomplete="off" type="text" value="${_getData('account') ? _getData('account') : ''
      }" placeholder="昵称/账号或邮箱">
      </div>
      <p class="paccount"></p>
      <div class="password">
        <input autocomplete="off" type="password" placeholder="密码">
      </div>
      <p></p>
      <div class="submit">
        <button cursor>登录</button>
      </div>
      <p></p>
      <div class="other">
        <div cursor class="resetPass">忘记密码？</div>
        <div cursor class="register">注册</div>
      </div>
    </main>`;
    $body.append(str);
    $('main').stop().show(_speed);
    let $account = $('.account input'),
      $password = $('.password input'),
      $resetPass = $('.resetPass'),
      $register = $('.register'),
      $submit = $('.submit button'),
      $paccount = $('.paccount');
    let _flag = true;
    $('main').on('keyup', function (e) {
      if (e.key === 'Enter') {
        if (_flag) {
          _flag = false;
          $submit.click();
        }
      }
    });
    $submit.click(
      debounce(
        function () {
          let account = $account.val().trim(),
            password = $password.val().trim();
          if (!checkUserName()) return;
          validateImg.init(
            function () {
              _flag = true;
              let npd = {
                account,
                password: md5(password),
              };
              $loadingBox.stop().fadeIn();
              _postAjax('/user/login', npd)
                .then((result) => {
                  $loadingBox.stop().fadeOut();
                  if (parseInt(result.code) === 0) {
                    _setData('account', npd.account);
                    _setData('state', 'y');
                    alert(result.codeText, {
                      handled: () => {
                        myOpen(_getData('originurl') || '/');
                      },
                    });
                  }
                })
                .catch((_) => {
                  $loadingBox.stop().fadeOut();
                });
            },
            function () {
              _err('验证失败');
            }
          );
        },
        2000,
        true
      )
    );
    $resetPass.click(() => {
      handleResetPass();
    });
    $register.click(() => {
      handleRegister();
    });
    $account.on('blur', checkUserName);
    function checkUserName() {
      let account = $account.val().trim();
      if (account === '') {
        $paccount.text('昵称/账号或邮箱');
        return false;
      }
      $paccount.text('');
      return true;
    }
  }
  // 重置密码
  function handleResetPass() {
    if (timer !== null) {
      clearInterval(timer);
      timer = null;
    }
    myOpen(`#resetpass`);
    $('main').remove();
    let str = `<main>
        <div class="password">
          <input autocomplete="off" type="password" placeholder="新密码">
        </div>
        <p></p>
        <div class="password1">
          <input autocomplete="off" type="password" placeholder="确认密码">
        </div>
        <p class="ppassword"></p>
        <div class="email">
          <input autocomplete="off" type="text" placeholder="邮箱">
        </div>
        <p class="pemail"></p>
        <div class="code">
          <input autocomplete="off" type="text" placeholder="验证码">
          <button cursor>获取验证码</button>
        </div>
        <p class="pcode"></p>
        <div class="submit">
        <button cursor>重置密码</button>
        </div>
        <p></p>
        <div class="other">
        <div cursor class="resetPass">登录</div>
      </div>
      </main>`;
    $body.append(str);
    $('main').stop().show(_speed);
    let $email = $('.email input'),
      $code = $('.code input'),
      $codebtn = $('.code button'),
      $password = $('.password input'),
      $password1 = $('.password1 input'),
      $ppassword = $('.ppassword'),
      $pemail = $('.pemail'),
      $resetPass = $('.resetPass'),
      $pcode = $('.pcode'),
      $submit = $('.submit button');
    let _flag = true;
    $('main').on('keyup', function (e) {
      if (e.key === 'Enter') {
        if (_flag) {
          _flag = false;
          $submit.click();
        }
      }
    });
    $submit.click(
      debounce(
        function () {
          let code = $code.val().trim(),
            password = $password.val().trim(),
            email = $email.val().trim();
          if (!checkUserEmail() || !checkCode() || !checkPassword()) return;
          validateImg.init(
            function () {
              _flag = true;
              $loadingBox.stop().fadeIn();
              _postAjax('/user/resetpass', {
                code,
                password: md5(password),
                email,
              })
                .then((result) => {
                  $loadingBox.stop().fadeOut();
                  if (parseInt(result.code) === 0) {
                    _delData('state');
                    _success(result.codeText);
                    handleLogin();
                  }
                })
                .catch((_) => {
                  $loadingBox.stop().fadeOut();
                });
            },
            function () {
              _err('验证失败');
            }
          );
        },
        2000,
        true
      )
    );
    $codebtn.click(
      debounce(
        function () {
          if (!checkUserEmail()) return;
          let num = 60,
            $this = $(this),
            email = $email.val().trim();
          $this.addClass('active');
          $loadingBox.stop().fadeIn();
          _getAjax('/user/resetpasscode', { email })
            .then((result) => {
              $loadingBox.stop().fadeOut();
              if (parseInt(result.code) === 0) {
                _success(result.codeText);
                function fun() {
                  num--;
                  if (num <= 0) {
                    $this.text(`获取验证码`);
                    $this.removeClass('active');
                  } else {
                    $this.text(`${num} 秒后重新获取`);
                    timer = _setTimeout(fun, 1000);
                  }
                }
                fun();
                return;
              }
              $this.removeClass('active');
            })
            .catch((_) => {
              $loadingBox.stop().fadeOut();
            });
        },
        500,
        true
      )
    );
    $resetPass.click(() => {
      handleLogin();
    });
    $email.on('blur', checkUserEmail);
    $code.on('blur', checkCode);
    $password1.on('blur', checkPassword);
    function checkUserEmail() {
      let email = $email.val().trim(),
        reg =
          /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
      if (email === '') {
        $pemail.text('请输入邮箱');
        return false;
      }
      if (!reg.test(email)) {
        $pemail.text('邮箱格式错误');
        return false;
      }
      $pemail.text('');
      return true;
    }
    function checkCode() {
      let code = $code.val().trim();
      if (code === '') {
        $pcode.text('请输入验证码');
        return false;
      }
      $pcode.text('');
      return true;
    }
    function checkPassword() {
      let password1 = $password1.val().trim(),
        password = $password.val().trim();
      if (password !== password1) {
        $ppassword.text('密码不一致');
        return false;
      }
      $ppassword.text('');
      return true;
    }
  }
  //注册
  function handleRegister() {
    if (timer !== null) {
      clearInterval(timer);
      timer = null;
    }
    myOpen(`#register`);
    $('main').remove();
    let str = `<main>
      <div class="username">
        <input autocomplete="off" type="text" placeholder="昵称">
      </div>
      <p class="pusername"></p>
      <div class="email">
        <input autocomplete="off" type="text" placeholder="邮箱">
      </div>
      <p class="pemail"></p>
      <div class="code">
        <input autocomplete="off" type="text" placeholder="验证码">
        <button cursor>获取验证码</button>
      </div>
      <p class="pcode"></p>
      <div class="password">
        <input autocomplete="off" type="password" placeholder="密码">
      </div>
      <p></p>
      <div class="password1">
        <input autocomplete="off" type="password" placeholder="确认密码">
      </div>
      <p class="ppassword"></p>
      <div class="submit">
        <button cursor>注册</button>
      </div>
      <p></p>
      <div class="other">
        <div cursor class="resetPass">登录</div>
        <div cursor class="register">登录测试账号</div>
      </div>
    </main>`;
    $body.append(str);
    $('main').stop().show(_speed);
    let $username = $('.username input'),
      $pusername = $('.pusername'),
      $email = $('.email input'),
      $code = $('.code input'),
      $codebtn = $('.code button'),
      $pcode = $('.pcode'),
      $pemail = $('.pemail'),
      $password = $('.password input'),
      $password1 = $('.password1 input'),
      $ppassword = $('.ppassword'),
      $resetPass = $('.resetPass'),
      $register = $('.register'),
      $submit = $('.submit button');
    let _flag = true;
    $('main').on('keyup', function (e) {
      if (e.key === 'Enter') {
        if (_flag) {
          _flag = false;
          $submit.click();
        }
      }
    });
    $submit.click(
      debounce(
        function () {
          let username = $username.val().trim(),
            code = $code.val().trim(),
            email = $email.val().trim(),
            password = $password.val().trim();
          if (
            !checkUserName() ||
            !checkUserEmail() ||
            !checkCode() ||
            !checkPassword()
          )
            return;
          validateImg.init(
            function () {
              _flag = true;
              let npd = {
                username,
                password: md5(password),
                email,
                code,
              };
              $loadingBox.stop().fadeIn();
              _postAjax('/user/register', npd)
                .then((result) => {
                  $loadingBox.stop().fadeOut();
                  if (parseInt(result.code) === 0) {
                    _setData('account', npd.email);
                    _setData('state', 'y');
                    alert(result.codeText, {
                      handled: () => {
                        myOpen(_getData('originurl') || '/');
                      },
                    });
                  }
                })
                .catch((_) => {
                  $loadingBox.stop().fadeOut();
                });
            },
            function () {
              _err('验证失败');
            }
          );
        },
        2000,
        true
      )
    );
    $resetPass.click(() => {
      handleLogin();
    });
    $register.click(
      debounce(function () {
        validateImg.init(
          function () {
            _getAjax('/user/testaccount').then((res) => {
              if (res.code == 0) {
                _setData('state', 'y');
                myOpen(_getData('originurl') || '/');
              }
            }).catch(err => { })
          },
          function () {
            _err('验证失败');
          }
        );
      }, 500)
    );
    $codebtn.click(
      debounce(
        function () {
          if (!checkUserEmail()) return;
          let num = 60,
            $this = $(this),
            email = $email.val().trim();
          $this.addClass('active');
          $loadingBox.stop().fadeIn();
          _getAjax('/user/registercode', { email })
            .then((result) => {
              $loadingBox.stop().fadeOut();
              if (parseInt(result.code) === 0) {
                _success(result.codeText);
                function fun() {
                  num--;
                  if (num <= 0) {
                    $this.text(`获取验证码`);
                    $this.removeClass('active');
                  } else {
                    $this.text(`${num} 秒后重新获取`);
                    timer = _setTimeout(fun, 1000);
                  }
                }
                fun();
                return;
              }
              $this.removeClass('active');
            })
            .catch((_) => {
              $loadingBox.stop().fadeOut();
            });
        },
        500,
        true
      )
    );
    $username.on('blur', checkUserName);
    $email.on('blur', checkUserEmail);
    $code.on('blur', checkCode);
    $password1.on('blur', checkPassword);
    function checkUserName() {
      let username = $username.val().trim();
      if (username === '') {
        $pusername.text('请输入昵称');
        return false;
      }
      if (!isUserName(username)) {
        $pusername.text('昵称格式错误');
        return false;
      }
      if (userlenght(username)) {
        $pusername.text('昵称过长');
        return false;
      }
      $pusername.text('');
      return true;
    }
    function checkUserEmail() {
      let email = $email.val().trim(),
        reg =
          /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
      if (email === '') {
        $pemail.text('请输入邮箱');
        return false;
      }
      if (!reg.test(email)) {
        $pemail.text('邮箱格式错误!');
        return false;
      }
      $pemail.text('');
      return true;
    }
    function checkCode() {
      let code = $code.val().trim();
      if (code === '') {
        $pcode.text('请输入验证码');
        return false;
      }
      $pcode.text('');
      return true;
    }
    function checkPassword() {
      let password = $password.val().trim(),
        password1 = $password1.val().trim();
      if (password !== password1) {
        $ppassword.text('密码不一致');
        return false;
      }
      $ppassword.text('');
      return true;
    }
  }
  //修改密码
  function handleChangePass() {
    if (!_getData('state')) {
      handleLogin();
      return;
    }
    if (timer !== null) {
      clearInterval(timer);
      timer = null;
    }
    myOpen(`#changepass`);
    $('main').remove();
    let str = `<main>
        <div class="password">
          <input autocomplete="off" type="password" placeholder="原密码">
        </div>
        <p class="ppassword"></p>
        <div class="password1">
          <input autocomplete="off" type="password" placeholder="新密码">
        </div>
        <p></p>
        <div class="password2">
          <input autocomplete="off" type="password" placeholder="确认密码">
        </div>
        <p class="ppassword2"></p>
        <div class="submit">
          <button cursor>提交</button>
        </div>
        <p></p>
        <div class="other">
          <div cursor class="resetPass">返回主页</div>
        </div>
      </main>`;
    $body.append(str);
    $('main').stop().show(_speed);
    let $password = $('.password input'),
      $password1 = $('.password1 input'),
      $password2 = $('.password2 input'),
      $ppassword2 = $('.ppassword2'),
      $resetPass = $('.resetPass'),
      $submit = $('.submit button');
    let _flag = true;
    $('main').on('keyup', function (e) {
      if (e.key === 'Enter') {
        if (_flag) {
          _flag = false;
          $submit.click();
        }
      }
    });
    $submit.click(
      debounce(
        function () {
          let password1 = $password1.val().trim(),
            password = $password.val().trim();
          if (!checkPassword()) return;
          validateImg.init(
            function () {
              _flag = true;
              $loadingBox.stop().fadeIn();
              _postAjax('/user/changepass', {
                oldpassword: md5(password),
                newpassword: md5(password1),
              })
                .then((result) => {
                  $loadingBox.stop().fadeOut();
                  if (parseInt(result.code) === 0) {
                    _success('修改密码成功，请重新登录账号~');
                    _delData('state');
                    handleLogin();
                    return;
                  }
                })
                .catch((_) => {
                  $loadingBox.stop().fadeOut();
                });
            },
            function () {
              _err('验证失败');
            }
          );
        },
        2000,
        true
      )
    );
    $resetPass.click(() => {
      myOpen('/');
    });
    $password2.on('blur', checkPassword);
    function checkPassword() {
      let password1 = $password1.val().trim(),
        password2 = $password2.val().trim();
      if (password2 !== password1) {
        $ppassword2.text('密码不一致');
        return false;
      }
      $ppassword2.text('');
      return true;
    }
  }
  // 限制用户名长度
  function userlenght(str) {
    let arr = str.split(''),
      num = 0;
    arr.forEach((v) => {
      num +=
        /[\u2E80-\u2FDF\u3040-\u318F\u31A0-\u31BF\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FFF\uA960-\uA97F\uAC00-\uD7FF]/.test(
          v
        )
          ? 2
          : 0.8;
    });
    if (num > 12) {
      return true;
    } else {
      return false;
    }
  }
})();

~(function (win) {
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

  win.validateImg = {
    init: function (success, fail) {
      new Validate(success, fail).init();
    },
  };
})(window);
