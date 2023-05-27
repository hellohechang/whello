import $ from "jquery";
import '../../css/reset.css'
import '../../css/iconfont.css'
import '../../css/notes.css'
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
} from '../../utils/utils'
import { _speed } from "../../config";
import '../../js/common'
import { _success } from "../../plugins/message";
import { alert } from '../../plugins/alert'
import { pagination } from '../../plugins/pagination'
import { rightMenu } from '../../plugins/rightMenu'
import icon1logo from '../../img/icon1.png'
import iconlogo from '../../img/icon.png'
~(async function () {
  let $mbg = $('.mbg'),
    $toplist = $('.toplist'),
    $searchinput = $('.toplist').find('input'),
    $menu = $('.menu'),
    $footer = $('footer'),
    $showpage = $('.showpage');
  let $icon = $("link[rel*='icon']");
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
    $toplist.addClass('open');
    $mbg.css({
      opacity: '1',
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
    setPageScrollTop(0)
  }
  function renderlist(y) {
    if (y) {
      renderlistdefault();
    }
    let pagenum = $menu.pagenum,
      a = $searchinput.val().trim();
    pagenum ? null : (pagenum = 1);
    let showpage = _getData('nodeshowpage') || 20;
    _getAjax('/note/searchlist', { a, page: pagenum, showpage }).then(
      (result) => {
        if (parseInt(result.code) === 0) {
          let str = '';
          let { total, totalPage, data, pageNo } = result.data;
          $menu.pagenum = pageNo;
          if (data.length === 0) {
            str += `<p>It feels lonely here...</p>`;
          } else {
            data.forEach((v) => {
              let { name, share, id, con } = v;
              name = encodeHtml(name);
              str += `<ul class="itemBox" data-id="${id}" data-share="${share}" cursor x='${name}'>
                  <div cursor check="n" class="check"></div>
                  <li class="logo iconfont icon-bijiben"></li>
                  <li title="${name}" class="noteitem">${name}</li>
                  <li title="${share === 'n' ? 'locking' : 'open'
                }" class="noteshare ${share === 'n' ? 'open' : ''
                } iconfont icon-suo"></li>
                  <li class="notemenu iconfont icon-icon"></li>
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
          $toplist._flag = false;
          $footer.stop().slideUp(_speed);
          if (y) {
            setPageScrollTop(0)
          }
        }
      }
    ).catch(err => { })
  }
  renderlist(true);
  let checkColor = 'rgb(118 254 89 / 58%)';
  // 删除笔记
  $menu
    .on('click', '.notemenu', function (e) {
      let id = $(this).parent().attr('data-id'),
        name = $(this).parent().attr('x'),
        str = `<div cursor class="mtcitem1">编辑笔记</div>
              <div cursor class="mtcitem2">删除</div>`;
      rightMenu(
        e,
        str,
        debounce(
          function ({ close, e }) {
            if (_getTarget(e, '.mtcitem1')) {
              close();
              _myOpen(`/page/edit/#${id}`, name);
            } else if (_getTarget(e, '.mtcitem2')) {
              alert(`确认删除：${name}？`, {
                confirm: true,
                handled: (msg) => {
                  if (msg === 'confirm') {
                    _postAjax('/note/delnote', { arr: [id] }).then((result) => {
                      if (parseInt(result.code) === 0) {
                        close();
                        renderlist();
                      }
                    }).catch(err => { })
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
      '.noteitem',
      debounce(function () {
        let a = $(this).parent().attr('data-id'),
          name = $(this).parent().attr('x'),
          val = $searchinput.val().trim();
        val = val.split(' ')[0];
        val = encodeURIComponent(val);
        _myOpen(`/page/note/?v=${a}${val ? '#' + val : ''}`, name);
      }, 500)
    )
    .on('contextmenu', '.itemBox', function (e) {
      e.preventDefault();
      $toplist.find('.pagenote').click();
    })
    .on(
      'click',
      '.noteshare',
      throttle(function () {
        let $this = $(this),
          id = $this.parent().attr('data-id'),
          noteflag = $this.parent().attr('data-share');
        noteflag = noteflag === 'n' ? 'y' : 'n';
        _postAjax('/note/locking', { arr: [id], noteflag }).then((result) => {
          if (parseInt(result.code) === 0) {
            renderlist();
          }
        }).catch(err => { })
      }, 1000)
    )
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
              window.scrollTo({
                top: 0,
                behavior: "smooth"
              })
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
  // 添加笔记
  $toplist
    .on(
      'click',
      '.addnote',
      debounce(function (e) {
        _myOpen('/page/edit/#new', 'New note');
      }, 500)
    )
    .on('click', '.pagenote', function (e) {
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
            _postAjax('/note/delnote', { arr }).then((result) => {
              if (parseInt(result.code) === 0) {
                renderlist();
                return;
              }
            }).catch(err => { })
            return;
          }
        },
      });
    })
    .on('click', '.closeAll', function () {
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
      _postAjax('/note/locking', {
        arr,
        noteflag: 'n',
      }).then((result) => {
        if (parseInt(result.code) === 0) {
          renderlist();
          return;
        }
      }).catch(err => { })
    })
    .on('click', '.openAll', function () {
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
      _postAjax('/note/locking', {
        arr,
        noteflag: 'y',
      }).then((result) => {
        if (parseInt(result.code) === 0) {
          renderlist();
          return;
        }
      }).catch(err => { })
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
  ~(function () {
    let p = 0,
      t = 0;
    window.addEventListener(
      'scroll',
      throttle(function () {
        p = getPageScrollTop();
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
