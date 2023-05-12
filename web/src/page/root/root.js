import $ from "jquery";
import '../../css/reset.css'
import '../../css/iconfont.css'
import './index.css'
import {
  myOpen,
  _postAjax,
  _getAjax,
  newDate,
  encodeHtml,
} from '../../utils/utils'
import '../../js/common'
import { _success } from "../../plugins/message";
import { alert } from '../../plugins/alert'
~(function () {
  let $userbox = $('.userbox'),
    $clearupload = $('.clearupload'),
    $clearchat = $('.clearchat'),
    $isregister = $('.isregister'),
    $delmusicfile = $('.delmusicfile');

  render();
  function render() {
    _getAjax('/root/userlist', {}).then((result) => {
      if (parseInt(result.code) === 0) {
        result.data.sort((a, b) => b.time - a.time);
        let str = '';
        result.data.forEach((v) => {
          let { account, username, time, state, online } = v;
          str += `<li data-acc="${account}" data-state="${state}">
              <span style="color:#992f2f;">[${newDate(
            '{0}-{1}-{2} {3}:{4}',
            time
          )}]</span>
              <span style="color:${online === 'y' ? 'green' : '#aaa'};">${online === 'y' ? '在线' : '离线'
            }</span>
              <span style="color:#4494d5;">${encodeHtml(username)}(${account})</span>
              <button cursor class="deluser" style="${state == 0 ? '' : 'color:red;'
            }">${state == 0 ? '激活' : '关闭'}</button>
              <button cursor class="resetpd">重置密码</button>
              <button cursor class="tologin">登录</button>
              <button cursor class="delaccount">销毁</button>
            </li>`;
        });
        $userbox.html(str);
        return;
      }
      document.body.innerHTML = `<p style="font-size: 20px;color: #303030;text-align:center;">${result.codeText}</p>`;
    }).catch(err => { })
  }
  $userbox
    .on('click', '.deluser', function () {
      let $this = $(this),
        x = $this.parent().attr('data-acc'),
        state = $this.parent().attr('data-state'),
        flag = state == '0' ? '1' : '0';
      alert(`确认 ${state == 0 ? '关闭' : '激活'} ${x}？`, {
        confirm: true,
        handled: (msg) => {
          if (msg === 'confirm') {
            _postAjax('/root/deluser', { ac: x, flag }).then((result) => {
              if (parseInt(result.code) === 0) {
                render();
              }
            }).catch(err => { })
            return;
          }
        },
      });
    })
    .on('click', '.delaccount', function () {
      let $this = $(this),
        x = $this.parent().attr('data-acc');

      alert(`确认销毁：${x}？`, {
        confirm: true,
        handled: (msg) => {
          if (msg === 'confirm') {
            _postAjax('/root/delaccount', { ac: x }).then((result) => {
              if (parseInt(result.code) === 0) {
                render();
              }
            }).catch(err => { })
            return;
          }
        },
      });
    })
    .on('click', '.resetpd', function () {
      let x = $(this).parent().attr('data-acc');
      alert(`确认重置账号(${x})的密码？`, {
        confirm: true,
        handled: (msg) => {
          if (msg === 'confirm') {
            _getAjax('/root/resetpass', { a: x }).then((result) => {
              if (parseInt(result.code) === 0) {
                _success(result.codeText);
              }
            }).catch(err => { })
          }
        },
      });
    })
    .on('click', '.tologin', function () {
      let x = $(this).parent().attr('data-acc');
      alert(`确认登录账号：${x}？`, {
        confirm: true,
        handled: (msg) => {
          if (msg === 'confirm') {
            _postAjax('/root/loginother', { a: x }).then((result) => {
              if (parseInt(result.code) === 0) {
                myOpen('/', '_blank');
              }
            }).catch(err => { })
          }
        },
      });
    });
  $clearupload.click(function () {
    alert('确认清空upload目录？', {
      confirm: true,
      handled: (msg) => {
        if (msg === 'confirm') {
          _getAjax('/root/clearup', {}).then((result) => {
            if (parseInt(result.code) === 0) {
              _success(result.codeText);
            }
          }).catch(err => { })
          return;
        }
      },
    });
  });
  $delmusicfile.click(function () {
    alert(`确认删除多余歌曲文件？`, {
      confirm: true,
      handled: (m) => {
        if (m !== 'confirm') return;
        _getAjax('/root/delmusicfile').then((result) => {
          if (parseInt(result.code) === 0) {
            _success(result.data);
            return;
          }
        }).catch(err => { })
      },
    });
  });
  $clearchat.click(function () {
    alert(`确认清除已删除的聊天记录？`, {
      confirm: true,
      handled: (m) => {
        if (m !== 'confirm') return;
        _getAjax('/root/clearchatdata').then((result) => {
          if (parseInt(result.code) === 0) {
            _success(result.codeText);
            return;
          }
        }).catch(err => { })
      },
    });
  });
  _getAjax('/user/isregister').then(res => {
    if (res.code == 0) {
      $isregister.text(res.data === 'y' ? '注册：开' : '注册：关')
    }
  }).catch(() => { })
  $isregister.click(function () {
    _postAjax('/root/isregister').then(res => {
      if (res.code == 0) {
        $isregister.text(res.data === 'y' ? '注册：开' : '注册：关')
        _success(res.data === 'y' ? '开放注册成功' : '已关闭注册')
      }
    }).catch(() => { })
  })
})();
