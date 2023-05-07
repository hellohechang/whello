import $ from "jquery";
import '../../css/reset.css'
import '../../css/iconfont.css'
import '../../css/notes.css'
import {
  queryURLParams,
  myOpen,
  _setData,
  _getData,
  _delData,
  _setTimeout,
  throttle,
  debounce,
  _getTarget,
  _mySlide,
  _postAjax,
  _getAjax,
  _upFile,
  encodeHtml,
  _each,
  _imgSize,
  _position,
  _offset,
  _myOpen,
  _progressBar,
} from '../../utils/utils'
import { _speed } from "../../config";
import '../../js/common'
import { _err, _success } from "../../plugins/message";
import { _loadingBar } from '../../plugins/loadingBar'
import { pagination } from '../../plugins/pagination'


~(async function () {
  let $mbg = $('.mbg'),
    $toplist = $('.toplist'),
    $searchinput = $('.toplist').find('input'),
    $menu = $('.menu'),
    $html = $(document.documentElement),
    urlparmes = queryURLParams(myOpen()),
    $showpage = $('.showpage');
  let $icon = $("link[rel*='icon']");
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
    $toplist.addClass('open');
    $mbg.css({
      opacity: 1
    });
  }, 600);
  // 背景
  // 渲染列表
  function renderlistdefault() {
    let str = '';
    new Array(50).fill(null).forEach((v) => {
      str += `<ul style="pointer-events: none;height:20px;background-color: #ffffff5c;margin:6px" class="itemBox"></ul>`;
    });
    $menu.html(str);
    $html.scrollTop(0);
  }
  function renderlist(y) {
    if (y) {
      renderlistdefault();
    }
    let pagenum = $menu.pagenum,
      a = $searchinput.val().trim();
    pagenum ? null : (pagenum = 1);
    let showpage = _getData('nodeshowpage') || 20;
    _getAjax('/note/allsearchlist', {
      acc: urlparmes.HASH || '',
      a,
      page: pagenum,
      showpage,
    }).then((result) => {
      if (parseInt(result.code) === 0) {
        let str = '';
        let { total, totalPage, data, pageNo } = result.data;
        $menu.pagenum = pageNo;
        if (data.length === 0) {
          str += `<p>It feels lonely here...</p>`;
        } else {
          data.forEach((v) => {
            let { name, id, con } = v;
            name = encodeHtml(name);
            str += `<ul class="itemBox" data-id="${id}" cursor x='${name}'>
                  <li class="logo iconfont icon-bijiben"></li>
                  <li title="${name}" class="noteitem">${name}</li>
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
        $menu.html(str);
        if (y) {
          $html.scrollTop(0);
        }
      }
    }).catch(err => { })
  }
  renderlist(true);
  $menu
    .on(
      'click',
      '.noteitem',
      debounce(function () {
        let $this = $(this),
          a = $this.parent().attr('data-id'),
          name = $this.parent().attr('x'),
          val = $searchinput.val().trim();
        val = val.split(' ')[0];
        val = encodeURIComponent(val);
        _myOpen(
          `/page/note/?v=${a}${val ? '#' + val : ''}`,
          name
        );
      }, 500)
    )
    .on(
      'click',
      '.pagingbox',
      debounce(
        function (e) {
          let target = e.target,
            flag = target.getAttribute('data-flag');
          if (target.tagName === 'BUTTON') {
            if (flag === 'pre') {
              $menu.pagenum = $menu.pagenum || 1;
              $menu.pagenum--;
              renderlist(true);
            } else if (flag === 'next') {
              $menu.pagenum = $menu.pagenum || 1;
              $menu.pagenum++;
              renderlist(true);
            } else if (flag === 'go') {
              let val = document
                .querySelector('.pagingbox #paginationBox input')
                .value.trim();
              val = parseInt(val);
              if (isNaN(val)) return;
              $menu.pagenum = val;
              renderlist(true);
            } else if (flag === 'gotop') {
              $html.stop().animate(
                {
                  scrollTop: 0,
                },
                _speed
              );
            } else {
              $menu.pagenum = +flag;
              renderlist(true);
            }
          }
        },
        500,
        true
      )
    );
  // 搜索笔记
  $searchinput.on(
    'input',
    debounce(function () {
      $menu.pagenum = 1;
      renderlist(true);
    }, 1000)
  );
  ~(function () {
    let p = 0,
      t = 0;
    window.addEventListener(
      'scroll',
      throttle(function () {
        p = document.documentElement.scrollTop;
        if (p <= 200) {
          t = p;
          $toplist.addClass('open');
          return;
        }
        if (p >= t) {
          $toplist.removeClass('open');
        } else {
          $toplist.addClass('open');
        }
        _setTimeout(() => {
          t = p;
        });
      }, 500)
    );
  })();
  $showpage.val(_getData('nodeshowpage') || 20);
  $showpage.on('change', function () {
    let val = $(this).val();
    _setData('nodeshowpage', val);
    $menu.pagenum = 1;
    renderlist(true);
  });
})();
