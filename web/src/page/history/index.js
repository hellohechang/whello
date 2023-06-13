import $ from "jquery";
import '../../css/reset.css';
import '../../css/iconfont.css';
import '../notes/index.less';
import {
  myOpen,
  _setData,
  _getData,
  _setTimeout,
  throttle,
  debounce,
  isurl,
  _postAjax,
  _getAjax,
  encodeHtml
} from '../../utils/utils';
import { _speed } from "../../config";
import '../../js/common';
import { _success } from "../../plugins/message";
import { alert } from '../../plugins/alert';
import { pagination } from '../../plugins/pagination';
const $pageBg = $('.page_bg'),
  $headWrap = $('.head_wrap'),
  $html = $(document.documentElement),
  $contentWrap = $('.content_wrap'),
  $footer = $('footer'),
  $pageSize = $('.page_size');

_setTimeout(() => {
  $headWrap.addClass('open');
}, 600);
// 背景
$pageBg.css({
  opacity: '1',
});
// 渲染列表
function pageLoading() {
  let str = '';
  new Array(50).fill(null).forEach((v) => {
    str += `<ul style="pointer-events: none;height:20px;background-color: #ffffff5c;margin:6px" class="item_box"></ul>`;
  });
  $contentWrap.html(str);
  $html.scrollTop(0);
}
function renderList(y) {
  if (y) {
    pageLoading();
  }
  let pagenum = $contentWrap.pagenum,
    a = $headWrap.find('input').val().trim();
  pagenum ? null : (pagenum = 1);
  let showpage = _getData('historyshowpage') || 80;
  _getAjax('/search/history', { a, page: pagenum, showpage }).then(
    (result) => {
      if (parseInt(result.code) === 0) {
        let str = '';
        let { total, totalPage, data, pageNo } = result.data;
        $contentWrap.pagenum = pageNo;
        if (data.length === 0) {
          str += `<p>It feels lonely here...</p>`;
        } else {
          data.forEach((v) => {
            let { id, data } = v;
            data = encodeHtml(data);
            str += `<ul title="${data}" class="item_box" data-id="${id}" cursor x='${data}'>
                          <div cursor check="n" class="check_state"></div>
                        <li class="item_type iconfont icon-lishijilu"></li>
                        <li class="item_title">${data}</li>
                        <li class="del_item iconfont icon-cangpeitubiao_shanchu"></li>
                        </ul>`;
          });
        }
        if (totalPage > 1) {
          str += `<div class="pagingbox">`;
          str += pagination({ pageNo, pageSize: showpage, total });
          str += `</div > `;
        }
        $contentWrap.html(str);
        $headWrap._flag = false;
        $footer.stop().slideUp(_speed);
        if (y) {
          $html.scrollTop(0);
        }
      }
    }
  ).catch(err => { });
}
renderList(true);
let checkColor = 'rgb(118 254 89 / 58%)';
// 删除历史
$contentWrap
  .on('click', '.del_item', function () {
    let $this = $(this);
    let a = $this.parent().attr('data-id');
    alert(`确认删除？`, {
      confirm: true,
      handled: (m) => {
        if (m !== 'confirm') return;
        _postAjax('/search/del', { arr: [a] }).then((result) => {
          if (parseInt(result.code) === 0) {
            renderList();
            return;
          }
          alert(result.codeText);
        }).catch(err => { });
      },
    });
  })
  .on(
    'click',
    '.item_title',
    debounce(function () {
      let a = $(this).parent().attr('x');
      if (isurl(a)) {
        myOpen(a, '_blank');
      } else {
        let s = _getData('searchengine') || {
          searchlink: 'https://cn.bing.com/search?q=',
        };
        myOpen(`${s.searchlink}${a}`, '_blank');
      }
    }, 500)
  )
  .on('contextmenu', '.item_box', function (e) {
    e.preventDefault();
    $headWrap.find('.h_check_item_btn').click();
  })
  .on('click', '.check_state', function (e) {
    let $this = $(this),
      check = $this.attr('check');
    if (check === 'n') {
      $this.attr('check', 'y').css('background-color', checkColor);
    } else {
      $this.attr('check', 'n').css('background-color', 'transparent');
    }
    let $itemBox = $contentWrap.find('.item_box'),
      $checkArr = $itemBox.filter(
        (_, item) => $(item).find('.check_state').attr('check') === 'y'
      );
    _success(`选中：${$checkArr.length}`, true);
    if ($checkArr.length === $itemBox.length) {
      $footer.find('span').attr({
        class: 'iconfont icon-xuanzeyixuanze',
        check: 'y',
      });
    } else {
      $footer.find('span').attr({
        class: 'iconfont icon-xuanzeweixuanze',
        check: 'n',
      });
    }
  })
  .on(
    'click',
    '.pagingbox',
    debounce(
      function (e) {
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
            let val = document
              .querySelector('.pagingbox #paginationBox input')
              .value.trim();
            val = parseInt(val);
            if (isNaN(val)) return;
            $contentWrap.pagenum = val;
            renderList(true);
          } else if (flag === 'gotop') {
            $html.stop().animate(
              {
                scrollTop: 0,
              },
              _speed
            );
          } else {
            $contentWrap.pagenum = +flag;
            renderList(true);
          }
        }
      },
      500,
      true
    )
  );

$headWrap.on('click', '.h_check_item_btn', function (e) {
  let $itemBox = $contentWrap.find('.item_box');
  if ($headWrap._flag) {
    $itemBox
      .find('.check_state')
      .css('display', 'none')
      .attr('check', 'n')
      .css('background-color', 'transparent');
    $headWrap._flag = false;
    $footer.stop().slideUp(_speed);
  } else {
    $itemBox.find('.check_state').css('display', 'block');
    $headWrap._flag = true;
    $footer.stop().slideDown(_speed);
  }
  $footer.find('span').attr({
    class: 'iconfont icon-xuanzeweixuanze',
    check: 'n',
  });
}).on('input', 'input', debounce(function () {
  $contentWrap.pagenum = 1;
  renderList(true);
}, 1000));

$footer
  .on('click', '.f_delete', function () {
    let $itemBox = $contentWrap.find('.item_box'),
      $checkArr = $itemBox.filter(
        (_, item) => $(item).find('.check_state').attr('check') === 'y'
      );
    if ($checkArr.length === 0) return;
    let arr = [];
    $checkArr.each((i, v) => {
      let $v = $(v);
      arr.push($v.attr('data-id'));
    });
    alert(`确认删除？`, {
      confirm: true,
      handled: (msg) => {
        if (msg === 'confirm') {
          _postAjax('/search/del', { arr }).then((result) => {
            if (parseInt(result.code) === 0) {
              renderList();
            }
          }).catch(err => { });
        }
      },
    });
  })
  .on('click', '.f_close', function () {
    let $itemBox = $contentWrap.find('.item_box');
    $itemBox
      .find('.check_state')
      .css('display', 'none')
      .attr('check', 'n')
      .css('background-color', 'transparent');
    $headWrap._flag = false;
    $footer.stop().slideUp(_speed);
  }).on('click', 'span', function () {
    let che = $(this).attr('check');
    che === 'y' ? (che = 'n') : (che = 'y');
    $footer.find('span').attr({
      class:
        che === 'y'
          ? 'iconfont icon-xuanzeyixuanze'
          : 'iconfont icon-xuanzeweixuanze',
      check: che,
    });
    let $itemBox = $contentWrap.find('.item_box');
    $itemBox
      .find('.check_state')
      .attr('check', che)
      .css('background-color', che === 'y' ? checkColor : 'transparent');
    _success(`选中：${che === 'y' ? $itemBox.length : 0}`, true);
  });
$pageSize.on('change', function () {
  let val = $(this).val();
  _setData('historyshowpage', val);
  $contentWrap.pagenum = 1;
  renderList(true);
}).val(_getData('historyshowpage') || 80);
~(function () {
  let p = 0,
    t = 0;
  window.addEventListener(
    'scroll',
    throttle(function () {
      p = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
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
    }, 500)
  );
})();
