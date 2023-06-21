import $ from "jquery";
import MarkdownIt from 'markdown-it';
import hljs from "highlight.js";
import '../../css/iconfont.css';
import '../../css/notecode.css';
import './index.less';
import {
  queryURLParams,
  myOpen,
  _setData,
  _getData,
  _setTimeout,
  throttle,
  debounce,
  _getTarget,
  _postAjax,
  _getAjax,
  newDate,
  copyText,
  encodeHtml,
  _myOpen,
  imgPreview,
} from '../../utils/utils';
import '../../js/common';
import { _err, _success } from "../../plugins/message";
const $contentWrap = $('.content_wrap'),
  $headBtns = $contentWrap.find('.head_btns'),
  $editWrap = $contentWrap.find('.edit_wrap'),
  $noteListMask = $editWrap.find('.note_list_mask'),
  $editBox = $editWrap.find('.edit_box'),
  $previewBox = $editWrap.find('.preview_box'),
  $pageBg = $('.page_bg');
let urlObj = queryURLParams(myOpen()),
  reg = /^hello_[0-9]+$/,
  { HASH } = urlObj;
// 背景
_setTimeout(() => {
  $pageBg.css({
    opacity: '1',
  });
}, 600)
// 对比记录
let orginData = {
  name: '',
  data: '',
};
if (HASH) {
  if (reg.test(HASH)) {
    //本地模式
    $headBtns.find('.save_btn').remove();
    $headBtns.find('.note_title').remove();
    let local = _getData('md'),
      obj = local.find((item) => item.name == HASH);
    if (obj) {
      $editBox.val(obj.data);
      rende();
    }
  } else {
    $headBtns.find('.note_list_btn').remove();
    if (HASH === 'new') {
      //新增笔记
      // 生成标题
      let name = newDate('{0}-{1}-{2} {3}:{4}');
      // 获取未上传保存在本地的笔记
      let text = _getData('newNote');
      $headBtns.find('.note_title input').val(name);
      $editBox.val(text);
      orginData.name = name;
      rende();
    } else {
      //获取内容编辑笔记
      _getAjax('/note/geteditnote', { id: HASH }).then((result) => {
        if (parseInt(result.code) === 0) {
          $headBtns.find('.note_title input').val(result.data.name);
          $editBox.val(result.data.data);
          orginData = result.data;
          rende();
        }
      }).catch(err => { });
    }
  }
} else {
  $headBtns.find('.save_btn').remove();
  $headBtns.find('.note_title').remove();
  //变为本地模式,并添加标识
  HASH = `hello_${Date.now()}`;
  myOpen(`/edit/#${HASH}`);
}
// 渲染转换显示
function rende() {
  let text = $editBox.val(),
    show = MarkdownIt({ linkify: true }).render(text);
  if (HASH) {
    if (reg.test(HASH)) {
      //本地模式
      let local = _getData('md'),
        idx = local.findIndex((item) => item.name == HASH),
        obj = {
          name: HASH,
          data: text,
        };
      if (idx < 0) {
        //没有则新增
        local.push(obj);
      } else {
        //有则替换
        local[idx] = obj;
      }
      _setData('md', local);
    } else {
      if (HASH === 'new') {
        // 新笔记未上传则保存在本地
        _setData('newNote', text);
      }
      handleSave();
    }
  }
  $previewBox.html(show);
  // hljs.initHighlightingOnLoad();
  hljs.highlightAll();
  $previewBox.find('a').attr({
    'target': '_blank',
    cursor: ''
  });
  $previewBox.find('img').attr({
    cursor: ''
  });
}
// 处理保存按钮
function handleSave() {
  let name = $headBtns.find('.note_title input').val().trim(),
    data = $editBox.val();
  // 对比内容
  if (orginData.name + orginData.data == name + data) {
    $headBtns.find('.save_btn').removeClass('active');
    return;
  }
  $headBtns.find('.save_btn').addClass('active');
}

$previewBox.on('click', '.codeCopy', debounce(function () {
  let str = $(this).parent().find('code').text();
  copyText(str);
}, 500, true)).on('click', '.shrink', debounce(function () {
  let $this = $(this);
  let flag = $this.attr('data-flag');
  if (flag === 'y') {
    $this.attr({
      'data-flag': 'n',
      class: 'shrink iconfont icon-page-next',
    });
    $this.parent().find('code').stop().stop().hide();
  } else {
    $this.attr({
      'data-flag': 'y',
      class: 'shrink iconfont icon-Down',
    });
    $this.parent().find('code').stop().show();
  }
}, 500, true))
  .on('click', 'img', function () {
    imgPreview([{ u1: $(this).attr('src') }]);
  });
$editBox
  .on('input', rende)
  .on('keydown', function (e) {
    let key = e.key,
      ctrl = e.ctrlKey || e.metaKey;
    if (key === 'Tab') {
      var start = this.selectionStart,
        end = this.selectionEnd;
      this.value =
        this.value.substring(0, start) + '    ' + this.value.substring(end);
      this.selectionStart = this.selectionEnd = start + 2;
      e.preventDefault();
    }
    if (ctrl && key === 's') {
      if (HASH) {
        if (!reg.test(HASH)) {
          $headBtns.find('.save_btn').click();
          e.preventDefault();
        }
      }
    }
  })
  .on('scroll', function () {
    let $this = $(this),
      CT = $this.scrollTop(),
      CBH = $editBox.outerHeight(),
      CH = $this[0].scrollHeight - CBH,
      SH = $previewBox[0].scrollHeight - CBH,
      ST = (CT / CH) * SH;
    $previewBox.scrollTop(ST);
  });
const $nav = $noteListMask.find('nav');
$headBtns.on('input', '.note_title input', handleSave).on('click', '.preview_state', function () {
  if (!$headBtns._flag) {
    $headBtns._flag = 'y';
  }
  if ($headBtns._flag === 'y') {
    $headBtns._flag = 'n';
    $headBtns.find('.preview_state').attr('class', 'preview_state iconfont icon-yanjing_yincang_o');
    $previewBox.stop().hide();
    $editBox.addClass('open');
    $headBtns.find('.to_max_btn').stop().hide();
  } else {
    $headBtns._flag = 'y';
    $headBtns.find('.preview_state').attr('class', 'preview_state iconfont icon-yanjing_xianshi_o');
    $previewBox.stop().show();
    $editBox.removeClass('open');
    $headBtns.find('.to_max_btn').stop().show();
  }
  $editBox.stop().show();
}).on('click', '.to_max_btn', function () {
  $editBox.toggle();
}).on('click', '.save_btn', throttle(saveNote, 1000)).on('click', '.note_list_btn', function () {
  $noteListMask.stop().fadeIn(0, () => {
    $nav.addClass('open');
  });
  let local = _getData('md'),
    str = '';
  local.reverse();
  if (local.length === 0) {
    str += `
          <li>
          <div>It feels lonely here...</div>
          </li>
          `;
  } else {
    local.forEach((item) => {
      let { name, data } = item;
      data = encodeHtml(data.slice(0, 500) + '...');
      str += `
              <li cursor title="${data}" data-name="${name}">
              <span class="note_name">${newDate(
        '{0}-{1}-{2} {3}:{4}:{5}',
        name.split('_')[1]
      )}</span>
              <span class="delete_note iconfont icon-guanbi"></span>
              </li>
              `;
    });
  }
  $noteListMask.find('ul').html(str);
});

$noteListMask
  .on('click', function (e) {
    if (_getTarget(e, '.note_list_mask', 1)) {
      $nav.removeClass('open');
      _setTimeout(() => {
        $noteListMask.stop().fadeOut(0);
      }, 500);
    }
  })
  .on('click', '.note_name', function () {
    let $this = $(this);
    let name = $this.parent().attr('data-name');
    _myOpen(`/edit/#${name}`, $this.text());
  })
  .on('click', '.delete_note', function () {
    let $this = $(this),
      name = $this.parent().attr('data-name'),
      local = _getData('md');
    local = local.filter((item) => item.name != name);
    _setData('md', local);
    $this.parent().remove();
  });
function saveNote() {
  if (HASH === 'new') {
    // 上传新笔记,则清除本地保存内容
    _setData('newNote', '');
  }
  let vn = $headBtns.find('.note_title input').val().trim(),
    vt = $editBox.val();
  if (vn === '') {
    _err('请输入标题');
    return;
  }
  if (vn === orginData.name && vt === orginData.data) return;
  _postAjax('/note/editnote', { id: HASH, vn, vt }).then((result) => {
    if (parseInt(result.code) === 0) {
      orginData.data = vt;
      orginData.name = vn;
      $headBtns.find('.save_btn').removeClass('active');
      if (result.data) {
        HASH = result.data.id;
        myOpen(`/edit/#${HASH}`);
        _success(result.codeText);
        return;
      }
      _success(result.codeText);
    }
  }).catch(err => { });
}
// 禁止后退
function pushHistory() {
  window.history.pushState(null, '', myOpen());
}
pushHistory();
window.addEventListener('popstate', function (e) {
  pushHistory();
  // to do something
});
document.addEventListener('visibilitychange', async function () {
  // 页面变为不可见时触发
  if (document.visibilityState == 'hidden') {
    // 离开页面自动保存笔记
    if (HASH && !reg.test(HASH) && HASH !== 'new') {
      saveNote();
    }
  }
  // 页面变为可见时触发
  if (document.visibilityState == 'visible') {
  }
});