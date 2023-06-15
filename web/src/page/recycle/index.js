
import $ from "jquery";
import '../../css/reset.css';
import '../../css/iconfont.css';
import '../notes/index.less';
import './index.less';
import {
  _setData,
  _getData,
  _setTimeout,
  throttle,
  debounce,
  _postAjax,
  _getAjax,
  encodeHtml,
  getPageScrollTop,
  setPageScrollTop
} from '../../utils/utils';
import { _speed } from "../../config";
import '../../js/common';
import { _success } from "../../plugins/message";
import { alert } from '../../plugins/alert';
import { pagination } from '../../plugins/pagination';
const $pageBg = $('.page_bg'),
  $headWrap = $('.head_wrap'),
  $contentWrap = $('.content_wrap'),
  $footer = $('footer'),
  $pageSize = $(".page_size");

_setTimeout(() => {
  $headWrap.addClass('open');
  $pageBg.css({
    opacity: '1',
  });
}, 600);
// 渲染列表
function pageLoading() {
  let str = '';
  new Array(50).fill(null).forEach(v => {
    str += `<ul style="pointer-events: none;height:40px;background-color: #ffffff5c;margin:6px" class="item_box"></ul>`;
  });
  $contentWrap.html(str);
  setPageScrollTop(0);
}
function renderList(y) {
  if (y) {
    pageLoading();
  }
  let pagenum = $contentWrap.pagenum,
    type = $headWrap.find('select').val(),
    slogo = 'icon-shoucang';
  pagenum ? null : pagenum = 1;
  if (type === 'note') {
    slogo = 'icon-bijiben';
  } else if (type === 'history') {
    slogo = 'icon-lishijilu';
  } else if (type === 'bookmk') {
    slogo = 'icon-shuqian1';
  }
  let showpage = _getData('recycleshowpage') || 20;
  _getAjax('/user/getrecycle', { page: pagenum, showpage, type }).then(result => {
    if (parseInt(result.code) === 0) {
      let str = '';
      let { total,
        totalPage,
        data,
        pageNo } = result.data;
      $contentWrap.pagenum = pageNo;
      if (data.length === 0) {
        str += `<p>It feels lonely here...</p>`;
      } else {
        data.forEach(v => {
          let { name, id, link, data } = v;
          name ? null : name = data;
          name = encodeHtml(name);
          link ? name = `${name}(${link})` : null;
          str += `<ul class="item_box" data-id="${id}" data-type="${type}">
                  <div cursor check="n" class="check_state"></div>
                  <li class="item_type iconfont ${slogo}"></li>
                  <li title="${name}" class="item_title">${name}</li>
                </ul>`;
        });
      }
      if (totalPage > 1) {
        str += `<div class="pagingbox">`;
        str += pagination({ pageNo, pageSize: showpage, total });
        str += `</div > `;
      }
      $contentWrap.html(str);
      $footer.stop().slideUp(_speed);
      if (y) {
        setPageScrollTop(0);
      }
    }
  }).catch(err => { });
}
renderList(true);
$headWrap.on('change', 'select', function () {
  renderList(true);
});
let checkColor = 'rgb(118 254 89 / 58%)';

$contentWrap.on('click', '.check_state', function (e) {
  let $this = $(this),
    check = $this.attr('check');
  if (check === 'n') {
    $this.attr('check', 'y').css('background-color', checkColor);
  } else {
    $this.attr('check', 'n').css('background-color', 'transparent');
  }
  let $itemBox = $contentWrap.find('.item_box'),
    $checkArr = $itemBox.filter((_, item) => $(item).find('.check_state').attr('check') === 'y');
  _success(`选中：${$checkArr.length}`, true);
  if ($checkArr.length > 0) {
    $footer.stop().slideDown(_speed);
  } else {
    $footer.stop().slideUp(_speed);
  }
  if ($checkArr.length === $itemBox.length) {
    $footer.find('span').attr({
      class: 'iconfont icon-xuanzeyixuanze',
      check: 'y'
    });
  } else {
    $footer.find('span').attr({
      class: 'iconfont icon-xuanzeweixuanze',
      check: 'n'
    });
  }
}).on('click', '.pagingbox', debounce(function (e) {
  let target = e.target,
    flag = target.getAttribute('data-flag');
  if (target.tagName === 'BUTTON') {
    if (flag === 'pre') {
      $contentWrap.pagenum = $contentWrap.pagenum || 1;
      $contentWrap.pagenum--;
      renderList(true);
    } else if (flag === 'next') {
      $contentWrap.pagenum = $contentWrap.pagenum || 1;
      $contentWrap.pagenum++;
      renderList(true);
    } else if (flag === 'go') {
      let val = document.querySelector('.pagingbox #paginationBox input').value.trim();
      val = parseInt(val);
      if (isNaN(val)) return;
      $contentWrap.pagenum = val;
      renderList(true);
    } else if (flag === 'gotop') {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    } else {
      $contentWrap.pagenum = +flag;
      renderList(true);
    }
  }
}, 500, true));

$footer.on('click', '.f_delete', function () {
  let $itemBox = $contentWrap.find('.item_box'),
    $checkArr = $itemBox.filter((_, item) => $(item).find('.check_state').attr('check') === 'y');
  if ($checkArr.length === 0) return;
  let arr = [];
  $checkArr.each((i, v) => {
    let $v = $(v);
    arr.push($v.attr("data-id"));
  });
  let type = $itemBox.attr('data-type');
  alert(`确认删除？`, {
    confirm: true,
    handled: msg => {
      if (msg === 'confirm') {
        _postAjax('/user/deleterecycle', {
          arr, type
        }).then(result => {
          if (parseInt(result.code) === 0) {
            renderList();
            return;
          }
        }).catch(err => { });
        return;
      }
    }
  });
}).on('click', '.f_recover', function () {
  let $itemBox = $contentWrap.find('.item_box'),
    $checkArr = $itemBox.filter((_, item) => $(item).find('.check_state').attr('check') === 'y');
  if ($checkArr.length === 0) return;
  let arr = [];
  $checkArr.each((i, v) => {
    let $v = $(v);
    arr.push($v.attr("data-id"));
  });
  let type = $itemBox.attr('data-type');
  alert(`确认恢复？`, {
    confirm: true,
    handled: msg => {
      if (msg === 'confirm') {
        _postAjax('/user/recoverrecycle', {
          arr, type
        }).then(result => {
          if (parseInt(result.code) === 0) {
            renderList();
            return;
          }
        }).catch(err => { });
        return;
      }
    }
  });
}).on('click', '.f_close', function () {
  let $itemBox = $contentWrap.find('.item_box');
  $itemBox.find('.check_state').attr('check', 'n').css('background-color', 'transparent');
  $footer.stop().slideUp(_speed);
}).on('click', 'span', function () {
  let che = $(this).attr('check');
  che === 'y' ? che = 'n' : che = 'y';
  $footer.find('span').attr({
    class: che === 'y' ? 'iconfont icon-xuanzeyixuanze' : 'iconfont icon-xuanzeweixuanze',
    check: che
  });
  let $itemBox = $contentWrap.find('.item_box');
  $itemBox.find('.check_state').attr('check', che).css('background-color', che === 'y' ? checkColor : 'transparent');
  _success(`选中：${che === 'y' ? $itemBox.length : 0}`, true);
});
~function () {
  let p = 0, t = 0;
  window.addEventListener('scroll', throttle(function () {
    p = getPageScrollTop();
    if (p <= 200) {
      t = p;
      $headWrap.addClass('open');
      return;
    }
    if (p >= t) {
      $headWrap.removeClass('open');
    } else {
      $headWrap.addClass('open');
    }
    _setTimeout(() => {
      t = p;
    });
  }, 500));
}();
$pageSize.val(_getData('recycleshowpage') || 20).on('change', function () {
  let val = $(this).val();
  _setData('recycleshowpage', val);
  $contentWrap.pagenum = 1;
  renderList(true);
});
