import $ from "jquery";
import '../../css/reset.css';
import '../../css/iconfont.css';
import './index.less';
import {
  myOpen,
  _postAjax,
  _getAjax,
  newDate,
  encodeHtml,
  pageErr,
} from '../../utils/utils';
import '../../js/common';
import { _success } from "../../plugins/message";
import { alert } from '../../plugins/alert';
const $contentWrap = $('.content_wrap'),
  $headBtns = $contentWrap.find('.head_btns'),
  $tableBox = $contentWrap.find('.table_box'),
  $list = $tableBox.find('tbody');
renderList();
function renderList() {
  _getAjax('/root/userlist', {}).then((result) => {
    if (parseInt(result.code) === 0) {
      result.data.sort((a, b) => b.time - a.time);
      let str = '';
      result.data.forEach((v) => {
        let { account, username, time, state, online } = v;
        username = encodeHtml(username);
        str += `<tr data-acc="${account}" data-state="${state}" data-name="${username}">
          <td>${newDate('{0}-{1}-{2} {3}:{4}', time)}</td>
          <td style="color:${online === 'y' ? 'green' : '#aaa'};">${online === 'y' ? '在线' : '离线'}</td>
          <td>${username}</td>
          <td>${account}</td>
          <td style="${state == 0 ? '' : 'color:red;'}">${state == 0 ? '启用' : '停用'}</td>
          <td>
            <button cursor class="user_state">${state == 0 ? '停用' : '启用'}</button>
              <button cursor class="reset_pd">重置密码</button>
              <button cursor class="to_login">进入</button>
              <button cursor class="del_account">删除</button>
          </td>
        </tr>`;
      });
      $list.html(str);
      return;
    }
    pageErr('sorry 你没有权限访问')
  }).catch(err => { });
}
$list
  .on('click', '.user_state', function () {
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
              renderList();
            }
          }).catch(err => { });
          return;
        }
      },
    });
  })
  .on('click', '.del_account', function () {
    let $this = $(this),
      x = $this.parent().parent().attr('data-acc'),
      name = $this.parent().parent().attr('data-name');
    alert(`确认删除：${name}(${x})？`, {
      confirm: true,
      handled: (msg) => {
        if (msg === 'confirm') {
          _postAjax('/root/delaccount', { ac: x }).then((result) => {
            if (parseInt(result.code) === 0) {
              renderList();
            }
          }).catch(err => { });
          return;
        }
      },
    });
  })
  .on('click', '.reset_pd', function () {
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
          }).catch(err => { });
        }
      },
    });
  })
  .on('click', '.to_login', function () {
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
          }).catch(err => { });
        }
      },
    });
  });

$headBtns.on('click', '.clear_upload', function () {
  alert('确认清空upload目录？', {
    confirm: true,
    handled: (msg) => {
      if (msg === 'confirm') {
        _getAjax('/root/clearup', {}).then((result) => {
          if (parseInt(result.code) === 0) {
            _success(result.codeText);
          }
        }).catch(err => { });
        return;
      }
    },
  });
}).on('click', '.del_music_file', function () {
  alert(`确认删除多余歌曲文件？`, {
    confirm: true,
    handled: (m) => {
      if (m !== 'confirm') return;
      _getAjax('/root/delmusicfile').then((result) => {
        if (parseInt(result.code) === 0) {
          _success(result.data);
          return;
        }
      }).catch(err => { });
    },
  });
}).on('click', '.clear_chat', function () {
  alert(`确认清除已删除的聊天记录？`, {
    confirm: true,
    handled: (m) => {
      if (m !== 'confirm') return;
      _getAjax('/root/clearchatdata').then((result) => {
        if (parseInt(result.code) === 0) {
          _success(result.codeText);
          return;
        }
      }).catch(err => { });
    },
  });
}).on('click', '.register_state', function () {
  _postAjax('/root/isregister').then(res => {
    if (res.code == 0) {
      $headBtns.find('.register_state').text(res.data === 'y' ? '注册：开' : '注册：关');
      _success(res.data === 'y' ? '开放注册成功' : '已关闭注册');
    }
  }).catch(() => { });
});
_getAjax('/user/isregister').then(res => {
  if (res.code == 0) {
    $headBtns.find('.register_state').text(res.data === 'y' ? '注册：开' : '注册：关');
  }
}).catch(() => { });
