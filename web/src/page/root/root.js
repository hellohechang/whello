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
  let $clearupload = $('.clearupload'),
    $clearchat = $('.clearchat'),
    $isregister = $('.isregister'),
    $delmusicfile = $('.delmusicfile');
  let $tbody = $('tbody')
  render();
  function render() {
    _getAjax('/root/userlist', {}).then((result) => {
      if (parseInt(result.code) === 0) {
        result.data.sort((a, b) => b.time - a.time);
        let str = '';
        result.data.forEach((v) => {
          let { account, username, time, state, online } = v;
          username = encodeHtml(username)
          str += `<tr data-acc="${account}" data-state="${state}" data-name="${username}">
          <td>${newDate('{0}-{1}-{2} {3}:{4}', time)}</td>
          <td style="color:${online === 'y' ? 'green' : '#aaa'};">${online === 'y' ? '在线' : '离线'}</td>
          <td>${username}</td>
          <td>${account}</td>
          <td style="${state == 0 ? '' : 'color:red;'}">${state == 0 ? '启用' : '停用'}</td>
          <td>
            <button cursor class="closeuser">${state == 0 ? '停用' : '启用'}</button>
              <button cursor class="resetpd">重置密码</button>
              <button cursor class="tologin">进入</button>
              <button cursor class="delaccount">删除</button>
          </td>
        </tr>`
        });
        $tbody.html(str);
        return;
      }
      myOpen('/404')
    }).catch(err => { })
  }
  $tbody
    .on('click', '.closeuser', function () {
      let $this = $(this),
        x = $this.parent().parent().attr('data-acc'),
        state = $this.parent().parent().attr('data-state'),
        name = $this.parent().parent().attr('data-name'),
        flag = state == '0' ? '1' : '0';
      alert(`确认 ${state == 0 ? '停用' : '启用'} ${name}(${x})？`, {
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
        x = $this.parent().parent().attr('data-acc'),
        name = $this.parent().parent().attr('data-name');
      alert(`确认删除：${name}(${x})？`, {
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
      let $this = $(this),
        x = $this.parent().parent().attr('data-acc'),
        name = $this.parent().parent().attr('data-name');
      alert(`确认重置账号 ${name}(${x})的密码？`, {
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
      let $this = $(this),
        x = $this.parent().parent().attr('data-acc'),
        name = $this.parent().parent().attr('data-name');
      alert(`确认进入账号：${name}(${x})？`, {
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
