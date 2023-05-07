import $ from "jquery";
import '../../css/reset.css'
import '../../css/iconfont.css'
import '../../css/notes.css'
import {
  myOpen,
  _setData,
  _getData,
  _delData,
  _setTimeout,
  throttle,
  debounce,
  _getTarget,
  isurl,
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
import { alert } from '../../plugins/alert'
import { _loadingBar } from '../../plugins/loadingBar'
import { pagination } from '../../plugins/pagination'
~(async function () {
  let $mbg = $('.mbg'),
    $toplist = $('.toplist'),
    $html = $(document.documentElement),
    $searchinput = $('.toplist').find('input'),
    $menu = $('.menu'),
    $footer = $('footer'),
    $showpage = $('.showpage');

  _setTimeout(() => {
    $toplist.addClass('open');
  }, 600);
  // 背景
  $mbg.css({
    opacity: '1',
  });
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
    let showpage = _getData('historyshowpage') || 80;
    _getAjax('/search/history', { a, page: pagenum, showpage }).then(
      (result) => {
        if (parseInt(result.code) === 0) {
          let str = '';
          let { total, totalPage, data, pageNo } = result.data;
          $menu.pagenum = pageNo;
          if (data.length === 0) {
            str += `<p>It feels lonely here...</p>`;
          } else {
            data.forEach((v) => {
              let { id, data } = v;
              data = encodeHtml(data);
              str += `<ul title="${data}" class="itemBox" data-id="${id}" cursor x='${data}'>
                          <div cursor check="n" class="check"></div>
                        <li class="logo iconfont icon-lishijilu"></li>
                        <li class="noteitem">${data}</li>
                        <li class="delnote iconfont icon-cangpeitubiao_shanchu"></li>
                        </ul>`;
            });
          }
          if (totalPage > 1) {
            str += `<div class="pagingbox">`;
            str += pagination({ pageNo, pageSize: showpage, total });
            str += `</div > `;
          }
          $menu.html(str);
          $toplist._flag = false;
          $footer.stop().slideUp(_speed);
          if (y) {
            $html.scrollTop(0);
          }
        }
      }
    ).catch(err => { })
  }
  renderlist(true);
  let checkColor = 'rgb(118 254 89 / 58%)';
  // 删除历史
  $menu
    .on('click', '.delnote', function () {
      let $this = $(this);
      let a = $this.parent().attr('data-id');
      alert(`确认删除？`, {
        confirm: true,
        handled: (m) => {
          if (m !== 'confirm') return;
          _postAjax('/search/del', { arr: [a] }).then((result) => {
            if (parseInt(result.code) === 0) {
              renderlist();
              return;
            }
            alert(result.codeText);
          }).catch(err => { })
        },
      });
    })
    .on(
      'click',
      '.noteitem',
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
    .on('contextmenu', '.itemBox', function (e) {
      e.preventDefault();
      $toplist.find('.pagenote').click();
    })
    .on('click', '.check', function (e) {
      let $this = $(this),
        check = $this.attr('check');
      if (check === 'n') {
        $this.attr('check', 'y').css('background-color', checkColor);
      } else {
        $this.attr('check', 'n').css('background-color', 'transparent');
      }
      let $itemBox = $('.itemBox'),
        $checkArr = $itemBox.filter(
          (_, item) => $(item).find('.check').attr('check') === 'y'
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
  // 搜索历史
  $searchinput.on(
    'input',
    debounce(function () {
      $menu.pagenum = 1;
      renderlist(true);
    }, 1000)
  );
  $toplist.on('click', '.pagenote', function (e) {
    let $itemBox = $('.itemBox');
    if ($toplist._flag) {
      $itemBox
        .find('.check')
        .css('display', 'none')
        .attr('check', 'n')
        .css('background-color', 'transparent');
      $toplist._flag = false;
      $footer.stop().slideUp(_speed);
    } else {
      $itemBox.find('.check').css('display', 'block');
      $toplist._flag = true;
      $footer.stop().slideDown(_speed);
    }
    $footer.find('span').attr({
      class: 'iconfont icon-xuanzeweixuanze',
      check: 'n',
    });
  });
  $footer.find('span').click(function () {
    let che = $(this).attr('check');
    che === 'y' ? (che = 'n') : (che = 'y');
    $footer.find('span').attr({
      class:
        che === 'y'
          ? 'iconfont icon-xuanzeyixuanze'
          : 'iconfont icon-xuanzeweixuanze',
      check: che,
    });
    let $itemBox = $('.itemBox');
    $itemBox
      .find('.check')
      .attr('check', che)
      .css('background-color', che === 'y' ? checkColor : 'transparent');
    _success(`选中：${che === 'y' ? $itemBox.length : 0}`, true);
  });
  $footer
    .on('click', '.delAll', function () {
      let $itemBox = $('.itemBox'),
        $checkArr = $itemBox.filter(
          (_, item) => $(item).find('.check').attr('check') === 'y'
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
                renderlist();
              }
            }).catch(err => { })
          }
        },
      });
    })
    .on('click', '.off', function () {
      let $itemBox = $('.itemBox');
      $itemBox
        .find('.check')
        .css('display', 'none')
        .attr('check', 'n')
        .css('background-color', 'transparent');
      $toplist._flag = false;
      $footer.stop().slideUp(_speed);
    });
  $showpage.val(_getData('historyshowpage') || 80);
  $showpage.on('change', function () {
    let val = $(this).val();
    _setData('historyshowpage', val);
    $menu.pagenum = 1;
    renderlist(true);
  });
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
})();
