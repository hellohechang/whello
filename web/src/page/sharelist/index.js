import $ from "jquery";
import '../../css/reset.css';
import '../../css/iconfont.css';
import './index.less';
import {
  _setTimeout,
  _postAjax,
  _getAjax,
  _myOpen,
  getPreUrl,
  copyText
} from '../../utils/utils';
import '../../js/common';
import { alert } from '../../plugins/alert';
const $contentWrap = $('.content_wrap'), $headBtns = $contentWrap.find('.head_btns'), $shareList = $contentWrap.find('.share_list'),
  $pageBg = $('.page_bg');
_setTimeout(() => {
  $pageBg.css({
    opacity: '1',
  });
}, 600);
function renderList() {
  _getAjax('/user/sharelist').then(res => {
    if (res.code == 0) {
      let str = '';
      if (res.data.length === 0) {
        str += `<p>It feels lonely here...</p>`;
      }
      res.data.reverse();
      res.data.forEach(item => {
        let { id, type } = item,
          url = `${getPreUrl()}/${type === 'music' ? `sharemusic/#${id}` : `sharebm/#${id}`}`;
        str += `<li data-id="${id}" data-url="${url}">
            <div class="item_type_logo iconfont ${type === 'music' ? 'icon-yinle' : 'icon-shuqian1'}"></div>
            <div class="url_text">${url}</div>
            <div cursor class="copy_link iconfont icon-fuzhi"></div>
            <div cursor class="go iconfont icon-link"></div>
            <div cursor class="delete iconfont icon-guanbi"></div>
          </li>
          `;
      });
      $shareList.html(str);
    }
  }).catch(err => { });
}
renderList();
$shareList.on('click', '.delete', function () {
  let id = $(this).parent().attr('data-id');
  alert(`确认删除？`, {
    confirm: true,
    handled: m => {
      if (m !== 'confirm') return;
      _postAjax('/user/deleteshare', { id }).then(res => {
        if (res.code == 0) {
          renderList();
        }
      }).catch(err => { });
    }
  });
}).on('click', '.go', function () {
  let url = $(this).parent().attr('data-url');
  _myOpen(url, url);
}).on('click', '.copy_link', function () {
  let url = $(this).parent().attr('data-url');
  copyText(url);
})
$headBtns.on('click', '.clear_share_list_btn', function () {
  alert(`确认清空？`, {
    confirm: true,
    handled: m => {
      if (m !== 'confirm') return;
      _postAjax('/user/deleteshare').then(res => {
        if (res.code == 0) {
          renderList();
        }
      }).catch(err => { });
    }
  });
});
