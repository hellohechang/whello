
import $ from "jquery";
import '../../css/reset.css'
import '../../css/iconfont.css'
import '../../css/notes.css'
import './index.css'
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
} from '../../utils/utils'
import { _speed } from "../../config";
import '../../js/common'
import { _success } from "../../plugins/message";
import { alert } from '../../plugins/alert'
import { pagination } from '../../plugins/pagination'
~async function () {
  let $mbg = $('.mbg'),
    $toplist = $('.toplist'),
    $menu = $('.menu'),
    $footer = $('footer'),
    $showpage = $(".showpage");

  _setTimeout(() => {
    $toplist.addClass('open')
    $mbg.css({
      opacity: '1',
    });
  }, 600)
  // 渲染列表
  function renderlistdefault() {
    let str = '';
    new Array(50).fill(null).forEach(v => {
      str += `<ul style="pointer-events: none;height:20px;background-color: #ffffff5c;margin:6px" class="itemBox"></ul>`
    });
    $menu.html(str)
    setPageScrollTop(0);
  }
  function renderlist(y) {
    if (y) {
      renderlistdefault()
    }
    let pagenum = $menu.pagenum,
      type = $toplist.find('select').val(),
      slogo = 'icon-shoucang';
    pagenum ? null : pagenum = 1;
    if (type === 'note') {
      slogo = 'icon-bijiben'
    } else if (type === 'history') {
      slogo = 'icon-lishijilu'
    } else if (type === 'bookmk') {
      slogo = 'icon-shuqian1'
    }
    let showpage = _getData('recycleshowpage') || 20;
    _getAjax('/user/getrecycle', { page: pagenum, showpage, type }).then(result => {
      if (parseInt(result.code) === 0) {
        let str = '';
        let { total,
          totalPage,
          data,
          pageNo } = result.data;
        $menu.pagenum = pageNo;
        if (data.length === 0) {
          str += `<p>It feels lonely here...</p>`
        } else {
          data.forEach(v => {
            let { name, id, link, data } = v;
            name ? null : name = data
            name = encodeHtml(name);
            link ? name = `${name}(${link})` : null
            str += `<ul class="itemBox" data-id="${id}" data-type="${type}">
                  <div cursor check="n" class="check"></div>
                  <li class="logo iconfont ${slogo}"></li>
                  <li title="${name}" class="noteitem">${name}</li>
                </ul>`
          });
        }
        if (totalPage > 1) {
          str += `<div class="pagingbox">`;
          str += pagination({ pageNo, pageSize: showpage, total })
          str += `</div > `;
        }
        $menu.html(str)
        $footer.stop().slideUp(_speed)
        if (y) {
          setPageScrollTop(0);
        }
      }
    }).catch(err => { })
  }
  renderlist(true)
  $toplist.find('select').on('change', function () {
    renderlist(true)
  })
  let checkColor = 'rgb(118 254 89 / 58%)'

  $menu.on('click', '.check', function (e) {
    let $this = $(this),
      check = $this.attr('check');
    if (check === 'n') {
      $this.attr('check', 'y').css('background-color', checkColor)
    } else {
      $this.attr('check', 'n').css('background-color', 'transparent')
    }
    let $itemBox = $('.itemBox'),
      $checkArr = $itemBox.filter((_, item) => $(item).find('.check').attr('check') === 'y');
    _success(`选中：${$checkArr.length}`, true)
    if ($checkArr.length > 0) {
      $footer.stop().slideDown(_speed)
    } else {
      $footer.stop().slideUp(_speed)
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
        $menu.pagenum = $menu.pagenum || 1;
        $menu.pagenum--
        renderlist(true)
      } else if (flag === 'next') {
        $menu.pagenum = $menu.pagenum || 1;
        $menu.pagenum++
        renderlist(true)
      } else if (flag === 'go') {
        let val = document.querySelector('.pagingbox #paginationBox input').value.trim();
        val = parseInt(val)
        if (isNaN(val)) return;
        $menu.pagenum = val;
        renderlist(true)
      } else if (flag === 'gotop') {
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        })
      } else {
        $menu.pagenum = +flag;
        renderlist(true)
      }
    }
  }, 500, true))

  $footer.find('span').click(function () {
    let che = $(this).attr('check');
    che === 'y' ? che = 'n' : che = 'y';
    $footer.find('span').attr({
      class: che === 'y' ? 'iconfont icon-xuanzeyixuanze' : 'iconfont icon-xuanzeweixuanze',
      check: che
    });
    let $itemBox = $('.itemBox')
    $itemBox.find('.check').attr('check', che).css('background-color', che === 'y' ? checkColor : 'transparent')
    _success(`选中：${che === 'y' ? $itemBox.length : 0}`, true)
  })
  $footer.on('click', '.delAll', function () {
    let $itemBox = $('.itemBox'),
      $checkArr = $itemBox.filter((_, item) => $(item).find('.check').attr('check') === 'y');
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
              renderlist()
              return
            }
          }).catch(err => { })
          return
        }
      }
    })
  }).on('click', '.recoverAll', function () {
    let $itemBox = $('.itemBox'),
      $checkArr = $itemBox.filter((_, item) => $(item).find('.check').attr('check') === 'y');
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
              renderlist()
              return
            }
          }).catch(err => { })
          return
        }
      }
    })
  }).on('click', '.off', function () {
    let $itemBox = $('.itemBox');
    $itemBox.find('.check').attr('check', 'n').css('background-color', 'transparent')
    $footer.stop().slideUp(_speed)
  })
  ~function () {
    let p = 0, t = 0;
    window.addEventListener('scroll', throttle(function () {
      p = getPageScrollTop();
      if (p <= 200) {
        t = p
        $toplist.addClass('open')
        return
      }
      if (p >= t) {
        $toplist.removeClass('open')
      } else {
        $toplist.addClass('open')
      }
      _setTimeout(() => {
        t = p
      })
    }, 500))
  }()
  $showpage.val(_getData('recycleshowpage') || 20)
  $showpage.on('change', function () {
    let val = $(this).val();
    _setData('recycleshowpage', val)
    $menu.pagenum = 1
    renderlist(true)
  })
}()