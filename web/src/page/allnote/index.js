import $ from "jquery";
import '../../css/reset.css';
import '../../css/iconfont.css';
import '../notes/index.less';
import {
  queryURLParams,
  myOpen,
  _setData,
  _getData,
  _setTimeout,
  throttle,
  debounce,
  _getAjax,
  encodeHtml,
  _myOpen,
  setPageScrollTop,
  getPageScrollTop,
  pageErr
} from '../../utils/utils';
import { _speed } from "../../config";
import '../../js/common';
import { pagination } from '../../plugins/pagination';
~function () {
  const $pageBg = $('.page_bg'),
    $headWrap = $('.head_wrap'),
    $contentWrap = $('.content_wrap'),
    urlparmes = queryURLParams(myOpen()),
    $pageSize = $('.page_size'),
    $icon = $("link[rel*='icon']");
  if (!urlparmes.HASH) {
    pageErr('地址错误')
    return;
  }
  document.addEventListener('visibilitychange', async function () {
    // 页面变为不可见时触发
    if (document.visibilityState == 'hidden') {
      $icon.attr('href', '/img/icon.png');
    }
    // 页面变为可见时触发
    if (document.visibilityState == 'visible') {
      $icon.attr('href', '/img/icon1.png');
    }
  });
  _setTimeout(() => {
    $headWrap.addClass('open');
    $pageBg.css({
      opacity: 1
    });
  }, 600);
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
    _getAjax('/note/allsearchlist', {
      acc: urlparmes.HASH || '',
      a,
      page: pagenum,
      showpage,
    }).then((result) => {
      if (parseInt(result.code) === 0) {
        let str = '';
        let { total, totalPage, data, pageNo } = result.data;
        $contentWrap.pagenum = pageNo;
        if (data.length === 0) {
          str += `<p>It feels lonely here...</p>`;
        } else {
          data.forEach((v) => {
            let { name, id, con, share } = v;
            name = encodeHtml(name);
            str += `<ul class="item_box" data-id="${id}" cursor x='${name}'>
                  <li class="item_type iconfont icon-bijiben"></li>
                  <li class="item_title">${name}</li>
                  <li class="lock_state iconfont ${share === 'n' ? 'icon-24gl-unlock2 open' : 'icon-24gl-unlock4'}"></li>
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
        if (y) {
          setPageScrollTop(0);
        }
      }
    }).catch(err => { });
  }
  renderList(true);
  $contentWrap.on('click', '.item_title', debounce(function () {
    let $this = $(this),
      a = $this.parent().attr('data-id'),
      name = $this.parent().attr('x'),
      val = $headWrap.find('input').val().trim();
    val = val.split(' ')[0];
    val = encodeURIComponent(val);
    _myOpen(`/note/?v=${a}${val ? '#' + val : ''}`, name);
  }, 500)
  ).on('click', '.pagingbox', debounce(function (e) {
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
          .querySelector('.pagingbox .paginationBox input')
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
  }, 500, true));
  $headWrap.on('input', 'input', debounce(function () {
    $contentWrap.pagenum = 1;
    renderList(true);
  }, 1000));
  ~(function () {
    let p = 0,
      t = 0;
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
    }, 500)
    );
  })();
  $pageSize.on('change', function () {
    curPageSize = $(this).val();
    _setData('nodeshowpage', curPageSize);
    $contentWrap.pagenum = 1;
    renderList(true);
  }).val(curPageSize);
}();