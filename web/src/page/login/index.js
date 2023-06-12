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
} from '../../utils/utils';
import { _speed } from '../../config';
import validateImg from './validate';
import '../../js/common'
import { _err } from "../../plugins/message";
import { alert } from '../../plugins/alert'
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
_setTimeout(() => {
  $bg.css({
    opacity: 0.8,
  });
  $box.stop().show(_speed)
}, 600)
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
    isLogin = false
    $register.text('登录')
    $submit.text('注册')
    $repassword.parent().css('display', 'block')
  } else {
    isLogin = true
    $register.text('注册')
    $submit.text('登录')
    $repassword.parent().css('display', 'none')
  }
})
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
            $loading.stop().fadeOut();
          });
      },
      function () {
        _err('验证失败');
      }
    );
  } else {
    if (!checkUserName() || !checkPassword() || !_flag) return;
    _flag = false;
    validateImg(function () {
      _flag = true
      let npd = {
        username: account,
        password: md5(password)
      };
      $loading.stop().fadeIn();
      _postAjax('/user/register', npd)
        .then((result) => {
          $loading.stop().fadeOut();
          if (parseInt(result.code) === 0) {
            _setData('account', npd.username);
            _setData('state', 'y');
            alert(result.codeText, {
              handled: () => {
                myOpen(_getData('originurl') || '/');
              },
            });
          }
        })
        .catch((_) => {
          $loading.stop().fadeOut();
        });
    }, function () {
      _err('验证失败');
    })
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
  $accountErr.text('')
  return true;
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