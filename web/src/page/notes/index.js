import $ from "jquery";
import '../../css/reset.css';
import '../../css/iconfont.css';
import './index.less';
import {
  _setData,
  _getData,
  _setTimeout,
  throttle,
  debounce,
  _getTarget,
  _postAjax,
  _getAjax,
  encodeHtml,
  _myOpen,
  setPageScrollTop,
  getPageScrollTop,
  myOpen,
} from '../../utils/utils';
import { _speed } from "../../config";
import '../../js/common';
import { _success } from "../../plugins/message";
import { alert } from '../../plugins/alert';
import { pagination } from '../../plugins/pagination';
import { rightMenu } from '../../plugins/rightMenu';
import icon1logo from '../../img/icon1.png';
import iconlogo from '../../img/icon.png';
const $pageBg = $('.page_bg'),
  $headWrap = $('.head_wrap'),
  $contentWrap = $('.content_wrap'),
  $footer = $('footer'),
  $pageSize = $('.page_size'),
  $icon = $("link[rel*='icon']");
document.addEventListener('visibilitychange', async function () {
  // 页面变为不可见时触发
  if (document.visibilityState == 'hidden') {
    $icon.attr('href', iconlogo);
  }
  // 页面变为可见时触发
  if (document.visibilityState == 'visible') {
    $icon.attr('href', icon1logo);
  }
});
_setTimeout(() => {
  $headWrap.addClass('open');
  $pageBg.css({
    opacity: '1',
  });
}, 600);
// 背景
// 渲染列表
function pageLoading() {
  let str = '';
  new Array(50).fill(null).forEach((v) => {
    str += `<ul style="pointer-events: none;height:40px;background-color: #ffffff5c;margin-bottom:6px;" class="item_box"></ul>`;
  });
  $contentWrap.html(str);
  setPageScrollTop(0);
}
let curPageSize = _getData('nodeshowpage');
function renderList(y) {
  if (y) {
    pageLoading();
  }
  let pagenum = $contentWrap.pagenum,
    a = $headWrap.find('input').val().trim();
  pagenum ? null : (pagenum = 1);
  let showpage = curPageSize;
  _getAjax('/note/searchlist', { a, page: pagenum, showpage }).then(
    (result) => {
      if (parseInt(result.code) === 0) {
        let str = '';
        let { total, totalPage, data, pageNo } = result.data;
        $contentWrap.pagenum = pageNo;
        if (data.length === 0) {
          str += `<p>It feels lonely here...</p>`;
        } else {
          data.forEach((v) => {
            let { name, share, id, con } = v;
            name = encodeHtml(name);
            str += `<ul class="item_box" data-id="${id}" data-share="${share}" cursor x='${name}'>
                  <div cursor check="n" class="check_state"></div>
                  <li class="item_type iconfont icon-bijiben"></li>
                  <li title="${name}" class="item_title">${name}</li>
                  <li title="${share === 'n' ? 'locking' : 'open'
              }" class="lock_state ${share === 'n' ? 'open' : ''
              } iconfont icon-suo"></li>
                  <li class="set_btn iconfont icon-icon"></li>
                  </ul>`;
            if (con && con.length > 0) {
              let s = '';
              con.forEach((item) => {
                let { before, center, after } = item;
                s += `${encodeHtml(
                  before
                )}<span style="color: yellow;">${encodeHtml(
                  center
                )}</span>${encodeHtml(after)}<br/><br/>`;
              });
              str += `<p>${s}</p>`;
            }
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
          setPageScrollTop(0);
        }
      }
    }
  ).catch(err => { });
}
renderList(true);
let checkColor = 'rgb(118 254 89 / 58%)';
// 删除笔记
$contentWrap
  .on('click', '.set_btn', function (e) {
    const $this = $(this);
    let id = $this.parent().attr('data-id'),
      name = $this.parent().attr('x'),
      str = `
        <div cursor class="mtcitem"><i class="iconfont icon-link"></i><span>新标签打开</span></div>
        <div cursor class="mtcitem1"><i class="iconfont icon-bianji"></i><span>编辑笔记</span></div>
        <div cursor class="mtcitem2"><i class="iconfont icon-cangpeitubiao_shanchu"></i><span>删除</span></div>`;
    rightMenu(
      e,
      str,
      debounce(
        function ({ close, e }) {
          if (_getTarget(e, '.mtcitem')) {
            close();
            let val = $headWrap.find('input').val().trim();
            val = val.split(' ')[0];
            val = encodeURIComponent(val);
            myOpen(`/note/?v=${id}${val ? '#' + val : ''}`, name);
          } else if (_getTarget(e, '.mtcitem1')) {
            close();
            _myOpen(`/edit/#${id}`, name);
          } else if (_getTarget(e, '.mtcitem2')) {
            alert(`确认删除：${name}？`, {
              confirm: true,
              handled: (msg) => {
                if (msg === 'confirm') {
                  _postAjax('/note/delnote', { arr: [id] }).then((result) => {
                    if (parseInt(result.code) === 0) {
                      close();
                      renderList();
                    }
                  }).catch(err => { });
                  return;
                }
              },
            });
          }
        },
        1000,
        true
      )
    );
  })
  .on(
    'click',
    '.item_title',
    debounce(function () {
      let a = $(this).parent().attr('data-id'),
        name = $(this).parent().attr('x'),
        val = $headWrap.find('input').val().trim();
      val = val.split(' ')[0];
      val = encodeURIComponent(val);
      _myOpen(`/note/?v=${a}${val ? '#' + val : ''}`, name);
    }, 500)
  )
  .on('contextmenu', '.item_box', function (e) {
    e.preventDefault();
    $headWrap.find('.h_check_item_btn').click();
  })
  .on(
    'click',
    '.lock_state',
    throttle(function () {
      let $this = $(this),
        id = $this.parent().attr('data-id'),
        noteflag = $this.parent().attr('data-share');
      noteflag = noteflag === 'n' ? 'y' : 'n';
      _postAjax('/note/locking', { arr: [id], noteflag }).then((result) => {
        if (parseInt(result.code) === 0) {
          renderList();
        }
      }).catch(err => { });
    }, 1000)
  )
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
            window.scrollTo({
              top: 0,
              behavior: "smooth"
            });
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

// 添加笔记
$headWrap
  .on(
    'click',
    '.h_add_item_btn',
    debounce(function (e) {
      _myOpen('/edit/#new', 'New note');
    }, 500)
  )
  .on('click', '.h_check_item_btn', function (e) {
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
          _postAjax('/note/delnote', { arr }).then((result) => {
            if (parseInt(result.code) === 0) {
              renderList();
              return;
            }
          }).catch(err => { });
          return;
        }
      },
    });
  })
  .on('click', '.f_clock', function () {
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
    _postAjax('/note/locking', {
      arr,
      noteflag: 'n',
    }).then((result) => {
      if (parseInt(result.code) === 0) {
        renderList();
        return;
      }
    }).catch(err => { });
  })
  .on('click', '.f_open', function () {
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
    _postAjax('/note/locking', {
      arr,
      noteflag: 'y',
    }).then((result) => {
      if (parseInt(result.code) === 0) {
        renderList();
        return;
      }
    }).catch(err => { });
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
~(function () {
  let p = 0,
    t = 0;
  window.addEventListener(
    'scroll',
    throttle(function () {
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
    }, 500)
  );
})();
$pageSize.val(curPageSize).on('change', function () {
  curPageSize = $(this).val();
  _setData('nodeshowpage', curPageSize);
  $contentWrap.pagenum = 1;
  renderList(true);
});
