import '../../css/reset.css';
import '../../css/iconfont.css';
import './index.less';
import $ from "jquery";
import md5 from "md5";
import {
  myOpen,
  _setData,
  _getData,
  _setTimeout,
  debounce,
  _postAjax,
  _getAjax,
  isUserName,
  userlenght,
} from '../../utils/utils';
import { _speed } from '../../config';
import validateImg from './validate';
import '../../js/common';
import _msg from '../../plugins/message';
~function () {
  const $box = $('.box'),
    $register = $box.find('.register'),
    $bg = $('.bg'),
    $loading = $('.loading'),
    $submit = $box.find('.submit'),
    $account = $box.find('.account input'),
    $accountErr = $box.find('.account p'),
    $password = $box.find('.password input'),
    $repassword = $box.find('.repassword input'),
    $passwordErr = $box.find('.repassword p');
  if (_getData('account')) {
    myOpen('/');
    return;
  }
  _setTimeout(() => {
    $bg.css({
      opacity: 0.8,
    });
    $box.stop().show(_speed);
  }, 600);
  $account.val(_getData('username'));
  _getAjax('/user/isregister').then(res => {
    if (res.code == 0) {
      if (res.data == 'y') {
        $register.parent().css('display', 'block');
      }
    }
  }).catch(() => { });

  let isLogin = true;
  $register.on('click', () => {
    if (isLogin) {
      isLogin = false;
      $register.text('登录');
      $submit.text('注册');
      $repassword.parent().css('display', 'block');
    } else {
      isLogin = true;
      $register.text('注册');
      $submit.text('登录');
      $repassword.parent().css('display', 'none');
    }
  });
  $box.on('keyup', function (e) {
    if (e.key === 'Enter') {
      $submit.click();
    }
  });

  $account.on('blur', checkUserName);
  $repassword.on('blur', checkPassword);
  let _flag = true;
  $submit.on('click', debounce(function () {
    let account = $account.val().trim(),
      password = $password.val().trim();
    if (isLogin) {
      if (!checkUserName() || !_flag) return;
      _flag = false;
      validateImg(
        function () {
          _flag = true;
          let npd = {
            account,
            password: md5(password),
          };
          $loading.stop().fadeIn();
          _postAjax('/user/login', npd)
            .then((result) => {
              $loading.stop().fadeOut();
              if (parseInt(result.code) === 0) {
                _setData('username', npd.account);
                _setData('account', result.data);
                myOpen(_getData('originurl'));
              }
            })
            .catch((_) => {
              $loading.stop().fadeOut();
            });
        },
        function () {
          _msg.error('验证失败');
        }
      );
    } else {
      if (!checkUserName() || !checkPassword() || !_flag) return;
      _flag = false;
      validateImg(function () {
        _flag = true;
        let npd = {
          username: account,
          password: md5(password)
        };
        $loading.stop().fadeIn();
        _postAjax('/user/register', npd)
          .then((result) => {
            $loading.stop().fadeOut();
            if (parseInt(result.code) === 0) {
              _setData('username', npd.username);
              _setData('account', result.data);
              myOpen(_getData('originurl'));
            }
          })
          .catch((_) => {
            $loading.stop().fadeOut();
          });
      }, function () {
        _msg.error('验证失败');
      });
    }
  }, 500, true));

  function checkPassword() {
    let password = $password.val().trim(),
      repassword = $repassword.val().trim();
    if (password !== repassword) {
      $passwordErr.text('密码不一致');
      return false;
    }
    $passwordErr.text('');
    return true;
  }
  function checkUserName() {
    let username = $account.val().trim();
    if (username === '') {
      $accountErr.text('请输入昵称');
      return false;
    }
    if (!isUserName(username)) {
      $accountErr.text('昵称格式错误');
      return false;
    }
    if (userlenght(username)) {
      $accountErr.text('昵称过长');
      return false;
    }
    $accountErr.text('');
    return true;
  }
}();