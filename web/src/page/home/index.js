import $ from "jquery";
import SparkMD5 from "spark-md5";
import md5 from 'md5';
import './recorder.mp3.min';
import '../../css/reset.css';
import '../../css/iconfont.css';
import './index.less';
import icon1logo from '../../img/icon1.png';
import iconlogo from '../../img/icon.png';
import {
  queryURLParams,
  myOpen,
  _setData,
  _getData,
  _delData,
  _setTimeout,
  extname,
  throttle,
  debounce,
  playSound,
  getSelectText,
  _getTarget,
  fileSlice,
  myShuffle,
  imgjz,
  isurl,
  getHost,
  isios,
  arrSortMinToMax,
  mixedSort,
  _mySlide,
  _postAjax,
  _getAjax,
  _upFile,
  newDate,
  copyText,
  computeSize,
  encodeHtml,
  isUserName,
  nanoid,
  _imgSize,
  compressionImg,
  deepClone,
  _position,
  _progressBar,
  isImgFile,
  fileLogoType,
  downloadFile,
  imgPreview,
  qucong,
  userlenght,
  getDuration,
} from '../../utils/utils.js';
import { _speed, serverURL, mediaURL, _d } from "../../config";
import '../../js/common';
import { _err, _success } from "../../plugins/message";
import { alert } from '../../plugins/alert';
import { _loadingBar } from '../../plugins/loadingBar';
import { pagination } from '../../plugins/pagination';
import { rightMenu } from '../../plugins/rightMenu';
import { UpProgress } from '../../plugins/UpProgress';
const $pageBg = $('.page_bg'),
  $minimizeBox = $('.minimize_box'),
  $asideBtn = $('.aside_btn'),
  $asideWrap = $('.aside_wrap'),
  $aside = $asideWrap.find('.aside'),
  $searchBoxMask = $('.search_box_mask'),
  $searchLogo = $searchBoxMask.find('.search_logo'),
  $searchInpWrap = $searchBoxMask.find('.search_inp_wrap'),
  $homeBmWrap = $searchBoxMask.find('.home_bm_wrap'),
  $homeFootMenu = $searchBoxMask.find('.home_foot_menu'),
  $myAudio = $('.my_audio'),
  $miniPlayer = $('.mini_player'),
  $miniLrcWrap = $('.mini_lrc_wrap'),
  $musicPlayerBox = $('.music_palyer_box'),
  $musicFootProgress = $musicPlayerBox.find('.music_foot_progress'),
  $searchMusicWrap = $musicPlayerBox.find('.search_music_wrap'),
  $musicPlayerBg = $musicPlayerBox.find('.music_palyer_bg'),
  $playingListWrap = $musicPlayerBox.find('.playing_list_mask'),
  $pMusicListBox = $playingListWrap.find('.p_music_list_wrap'),
  $musicHeadWrap = $musicPlayerBox.find('.head_wrap'),
  $msuicContentBox = $musicPlayerBox.find('.content_box'),
  $songListWrap = $musicPlayerBox.find('.song_list_wrap'),
  $songListUl = $songListWrap.find('ul'),
  $listItemsWarp = $musicPlayerBox.find('.list_items_wrap'),
  $songItemsBox = $listItemsWarp.find('.items_box'),
  $musicFootBox = $musicPlayerBox.find('.music_foot_box'),
  $playingSongLogo = $musicFootBox.find('.logo_img'),
  $musicLrcWrap = $musicPlayerBox.find('.music_lrc_wrap'),
  $lrcBg = $musicLrcWrap.find('.lrc_bg'),
  $lrcHead = $musicLrcWrap.find('.lrc_head'),
  $lrcListWrap = $musicLrcWrap.find('.lrc_list_wrap'),
  $lrcMenuWrap = $musicLrcWrap.find('.lrc_menu_wrap'),
  $lrcFootWrap = $musicLrcWrap.find('.lrc_foot_wrap'),
  $lrcProgressBar = $lrcFootWrap.find('.progress_bar'),
  $lrcFootBtnWrap = $lrcFootWrap.find('.foot_btn_wrap'),
  $editLrcWrap = $('.edit_lrc_wrap'),
  $musicMvWrap = $('.music_mv_wrap'),
  $myVideo = $musicMvWrap.find('.my_video'),
  $logWrap = $('.log_wrap'),
  $logHeadBtns = $logWrap.find('.log_head_btns'),
  $logContent = $logWrap.find('.log_content'),
  $userLogoBtn = $('.user_logo_btn'),
  $rightMenuMask = $('.right_menu_mask'),
  $rightBox = $rightMenuMask.find('.right_box'),
  $userInfoWrap = $('.user_info_wrap'),
  $chatAudio = $('.chat_ausio'),
  $chatRoomWrap = $('.chat_room_wrap'),
  $userListBox = $chatRoomWrap.find('.user_list_box'),
  $chatHeadBtns = $chatRoomWrap.find('.c_head_btns'),
  $chatListBox = $chatRoomWrap.find('.chat_list_box'),
  $chatFootBox = $chatRoomWrap.find('.chat_foot_box'),
  $showChatRoomBtn = $('.show_chat_room_btn'),
  $randomChangeBgBtn = $('.random_change_bg_btn'),
  $allBgWrap = $('.all_bg_wrap'),
  $bgList = $allBgWrap.find('.bg_list'),
  $searchBoxBtn = $('.search_box_btn'),
  $mainid = $('#main'),
  $clock = $('.clock');

let $document = $(document),
  dmwidth = $document.width(),
  curSearchEngine = _getData('searchengine'),
  curFilterBg = _getData('filterbg'),
  curBgPageSize = _getData('bgshowpage'),
  curPlaySpeed = _getData('lastplaysd'),
  lrcstatu = _getData('lrcstatu'),
  curPlayVol = _getData('lastvol'),
  musicPageSize = _getData('musicpagenum'),
  curSongListSort = _getData('lastpx'),
  boxpositon = _getData('lastweizi'),
  curPageColor = _getData('pagecolor'),
  curFontType = _getData('fonttype'),
  curLogPageSize = _getData('logshowpage');
// 时钟
~(function () {
  // 动画
  let _head = document.querySelectorAll('head')[0],
    _style = document.createElement('style');
  _style.type = 'text/css';
  _head.appendChild(_style);
  const clock = document.querySelector('.clock');
  const domHour = clock.querySelector('.hour');
  const domMin = clock.querySelector('.min');
  const domSec = clock.querySelector('.sec');
  function clockRun(sec, min, hour) {
    if (domHour.animate) {
      domHour.animate(
        { transform: [`rotate(${hour}deg`, `rotate(${hour + 360}deg`] },
        { duration: 216000 * 1000, iterations: Infinity }
      );
      domMin.animate(
        { transform: [`rotate(${min}deg`, `rotate(${min + 360}deg`] },
        { duration: 3600 * 1000, iterations: Infinity }
      );
      domSec.animate(
        { transform: [`rotate(${sec}deg`, `rotate(${sec + 360}deg`] },
        { duration: 60 * 1000, iterations: Infinity }
      );
      return;
    }
    let arr = [];
    new Array(3).fill(null).forEach(() => {
      arr.push('a' + Math.random().toString(36).slice(2));
    });
    let str = '';
    // 遍历三个参数
    [].forEach.call(arguments, (item, index) => {
      str += `@keyframes ${arr[index]}{
            0%{
                transform: rotate(${item}deg);
            }
            100%{
                transform: rotate(${item + 360}deg);
            }
        }`;
    });
    _style.innerHTML = str;
    domHour.style.animation = `${arr[2]} 216000s infinite linear`;
    domMin.style.animation = `${arr[1]} 3600s infinite linear`;
    domSec.style.animation = `${arr[0]} 60s infinite linear`;
  }
  // 刻度
  function drawLines(className, total, translateX) {
    const gap = 360 / total;
    let strHtml = '';
    for (let i = 0; i < total; i++) {
      strHtml += `<li style="transform:rotate(${i * gap
        }deg) translate(${translateX}px,-50%);"></li>`;
    }
    const wrap = document.querySelector(className);
    wrap.innerHTML = strHtml;
  }
  // 数字
  function drawNumbers(className) {
    const wrap = document.querySelector(className),
      radius = wrap.clientWidth / 2;

    let strHtml = '';
    for (let i = 1; i <= 12; i++) {
      const myAngle = ((i - 3) / 6) * Math.PI,
        myX = radius + radius * Math.cos(myAngle),
        myY = radius + radius * Math.sin(myAngle);
      strHtml += `<li style="left:${myX}px; top:${myY}px">${i}</li>`;
    }
    wrap.innerHTML = strHtml;
  }

  // 指针旋转

  function clockMove(time = Date.now()) {
    const now = new Date(+time),
      hour = now.getHours(),
      min = now.getMinutes(),
      sec = now.getSeconds(),
      secAngle = sec * 6 - 90,
      minAngle = min * 6 + sec * 0.1 - 90,
      hourAngle = hour * 30 + min * 0.5 - 90;

    clockRun(secAngle, minAngle, hourAngle);
  }
  function clockinit() {
    drawLines('.line-min', 60, 90);
    drawLines('.line-hour', 12, 85);
    drawNumbers('.number');
  }
  clockinit();
  clockMove();
})();
// 图标处理
~(function () {
  let $icon = $("link[rel*='icon']");
  document.addEventListener('visibilitychange', function () {
    // 页面变为不可见时触发
    if (document.visibilityState == 'hidden') {
      $icon.attr('href', iconlogo);
    }
    // 页面变为可见时触发
    if (document.visibilityState == 'visible') {
      $icon.attr('href', icon1logo);
    }
  });
})();
// 关闭页面加载
let closeLoading = function () {
  const $onloading = $('.onloading');
  return function () {
    $onloading.css({
      'transform': 'translateX(100%) rotate(180deg) scale(0)',
      transition: '2s'
    });
    _setTimeout(() => {
      $onloading.remove();
    }, 2000)
  };
}();
if (dmwidth <= 800) $clock.css('display', 'none');
let zindexnum = 100;
function setZindex($el) {
  zindexnum++;
  $el.css('z-index', zindexnum);
}
// 拖动移动列表位置
~(function () {
  let fromDom = null;
  $aside.find('.list')
    .on('dragstart', '.bm_item', function (e) {
      fromDom = this;
    })
    .on('drop', '.bm_item', function (e) {
      let $this = $(this),
        $fromDom = $(fromDom),
        pid = $this.parent().prev().attr('data-id'),
        fromId = $fromDom.attr('data-id'),
        toId = $this.attr('data-id');
      if (fromDom) {
        _postAjax('/nav/bmkmove', { pid, fromId, toId }).then((result) => {
          if (parseInt(result.code) === 0) {
            sendCommand({ type: 'updatedata', flag: 'bookmark' });
            renderAsideList();
          }
        }).catch(err => { });
      }
      fromDom = null;
    })
    .on('dragover', '.bm_item', function (e) {
      e.preventDefault();
    });
})();
// 拖动移动书签位置
~(function () {
  let fromDom = null;
  $aside.find('.list')
    .on('dragstart', '.list_title', function (e) {
      fromDom = this;
    })
    .on('drop', '.list_title', function (e) {
      let $this = $(this),
        fromId = $(fromDom).attr('data-id'),
        toId = $this.attr('data-id');
      if (fromDom) {
        if (fromId !== toId) {
          _postAjax('/nav/listmove', { fromId, toId }).then((result) => {
            if (parseInt(result.code) === 0) {
              sendCommand({ type: 'updatedata', flag: 'bookmark' });
              renderAsideList();
              return;
            }
          }).catch(err => { });
        }
        fromDom = null;
      }
    })
    .on('dragover', '.list_title', function (e) {
      e.preventDefault();
    });
})();
// 列表加载效果
function renderAsideListLoading() {
  let str = '';
  let color = 'rgb(255 255 255 / 10%)';
  new Array(50).fill(null).forEach((item) => {
    str += `<div style="pointer-events: none;background-image:none;background-color:${color};margin:4px" class="list_title jzxz"></div>`;
  });
  $aside.find('.list').html(str);
}
// 渲染左导航
$asideBtn.activeId = 'hide'; //记录开启列表
function renderAsideList() {
  if ($asideWrap.is(':hidden')) return;
  let id = $asideBtn.activeId;
  _getAjax('/nav/getlist', { id }).then((result) => {
    if (result.code === 0) {
      _d.bookmark = result.data;
      if (!$asideBtn.activeId) {
        if (_d.bookmark.side.length > 0) {
          $asideBtn.activeId = _d.bookmark.side[0].id;
        }
      }
      rAsideList();
    }
  }).catch(err => { });
}
function rAsideList() {
  if ($asideWrap.is(':hidden')) return;
  $aside.find('.foot_menu').stop().slideUp(_speed).find('div').attr({
    class: 'iconfont icon-xuanzeweixuanze',
    check: 'n',
  });
  let id = $asideBtn.activeId,
    _nav = _d.bookmark.side,
    str = '';
  _nav.forEach((item) => {
    let name = encodeHtml(item.name);
    if (item.id === id) {
      str += `<div class="list_title jzxz" data-id="${item.id}" data-name="${name}" cursor title="${name}" flag="on" draggable="true">
        <i class="iconfont icon-shoucang"></i>
        <em>${name}</em></div>
        <ul style="display:'block'">`;
      item.item.forEach((y) => {
        let name = encodeHtml(y.name);
        let des = y.des ? encodeHtml(y.des) : '';
        str += `<li class="bm_item jzxz" data-pid="${item.id}" data-name="${name}" data-des="${des}" data-id="${y.id}" cursor data-link="${y.link}" data-src="${y.logo}" draggable="true">
          <div cursor check="n" class="check_bm"></div>
          <div class="bm_logo"></div>
          <div title="${name}(${y.link})" class="bm_name">${name}</div>
          <p title="${des}">${des || '描述'}</p>
          </li>`;
      });
      str += '<div cursor class="pack_up_bm_list iconfont icon-up"></div></ul>';
    } else {
      str += `<div data-id="${item.id}" data-name="${name}" cursor title="${name}" flag="off" draggable="true" class="list_title jzxz">
      <i class="iconfont icon-shoucang"></i>
      <em>${name}</em></div>
      <ul style="display:'none'"></ul>`;
    }
  });
  str += `<div cursor title="新增列表" class="add_list_btn iconfont icon-icon-test"></div>`;
  const $aList = $aside.find('.list');
  $aList.html(str);
  let curIdx = _d.bookmark.side.findIndex(item => item.id == $asideBtn.activeId)
  if (curIdx >= 0) {
    const $listTitle = $aList.find('.list_title').eq(curIdx);
    $aList.stop().animate({
      scrollTop: _position($listTitle[0]).top + $aList[0].scrollTop - 5,
    }, _speed);
  }
  hdAsideListItemLogo();
}
//处理侧边书签logo
function hdAsideListItemLogo() {
  if ($asideBtn.activeId === 'hide') return;
  $aside.find('.bm_item').each((_, item) => {
    let $item = $(item),
      url = $item.attr('data-src'),
      link = $item.attr('data-link');
    if (!url.includes('favicon.ico')) {
      url = mediaURL + url;
    }
    let $bm_logo = $item.find('.bm_logo');
    imgjz(
      url,
      () => {
        $bm_logo.css('background-image', `url(${url})`);
      },
      () => {
        let u = `https://api.iowen.cn/favicon/${getHost(link)}.png`;
        imgjz(
          u,
          () => {
            $bm_logo.css('background-image', `url('${u}')`);
          },
          () => {
            $bm_logo.css('background-image', `url('/img/mrlogo.png')`);
          }
        );
      }
    );
  });
}
//侧边导航缩放
$asideWrap.on('click', '.list_title', debounce(function () {
  $aside.find('.foot_menu').stop().slideUp(_speed).find('div').attr({
    class: 'iconfont icon-xuanzeweixuanze',
    check: 'n',
  });
  let $this = $(this),
    id = $this.attr('data-id');
  $asideBtn.activeId = id;
  if ($this.attr('flag') === 'on') {
    $this.next().stop().slideUp(_speed).html('');
    $asideBtn.activeId = 'hide';
    $this.attr('flag', 'off');
    return;
  }
  function fun() {
    let bmk = _d.bookmark.side.find((item) => item.id === id),
      str = '';
    if (!bmk) return;
    bmk.item.forEach((y) => {
      let name = encodeHtml(y.name);
      let des = y.des ? encodeHtml(y.des) : '';
      str += `<li data-pid="${id}" data-name="${name}" data-des="${des}" data-id="${y.id}" data-link="${y.link}" data-src="${y.logo}" cursor class="bm_item jzxz" draggable="true">
        <div cursor check="n" class="check_bm"></div>
        <div class="bm_logo"></div>
          <div title="${name}(${y.link})" class="bm_name">${name}</div>
          <p title="${des}">${des || '描述'}</p>
          </li>`;
    });
    str += `<div cursor class="pack_up_bm_list iconfont icon-up"></div>`;
    $aside.find('.list_title')
      .attr('flag', 'off')
      .next()
      .stop()
      .slideUp(_speed)
      .html('');
    $this
      .attr('flag', 'on')
      .next()
      .html(str)
      .slideDown(_speed, () => {
        $aside.find('.list').stop().animate(
          {
            scrollTop:
              _position($this[0]).top + $aside.find('.list')[0].scrollTop - 5,
          },
          _speed
        );
      });
    hdAsideListItemLogo();
  }
  _getAjax('/nav/getlist', { id }).then((result) => {
    if (result.code === 0) {
      _d.bookmark = result.data;
      fun();
      return;
    }
  }).catch(err => { });
}, 500, true)).on('click', '.bm_item', function (e) {
  let link = $(this).attr('data-link');
  myOpen(link, "_blank");
}).on('click', '.add_list_btn', (e) => {
  // 新建列表
  let str = `
          <input autocomplete="off" placeholder="列表名" type="text">
          <button cursor class="mtcbtn">新增列表</button>`;
  rightMenu(e, str, debounce(function ({ close, e, inp }) {
    if (_getTarget(e, '.mtcbtn')) {
      let va = inp[0];
      if (va === '') {
        _err('请输入列表名');
        return;
      }
      _postAjax('/nav/addlist', { name: va }).then((result) => {
        if (parseInt(result.code) === 0) {
          close();
          sendCommand({ type: 'updatedata', flag: 'bookmark' });
          renderAsideList();
          return;
        }
      }).catch(err => { });
    }
  },
    1000,
    true
  )
  );
}).on('contextmenu', '.list_title', function (e) {
  //操作列表
  e.preventDefault();
  let $this = $(this);
  asideBmMenu(e, {
    id: $this.attr('data-id'),
    name: $this.attr('data-name'),
    index: $this.index('.list_title'),
  });
}).on('contextmenu', '.bm_item', function (e) {
  //操作书签
  e.preventDefault();
  let $this = $(this);
  asideListMenu(e, {
    pid: $this.attr('data-pid'),
    cid: $this.attr('data-id'),
    des: $this.attr('data-des'),
    index: $this.index(),
    name: $this.attr('data-name'),
    link: $this.attr('data-link'),
    logo: $this.attr('data-src'),
  });
}).on('click', '.foot_menu div', function () {
  let che = $(this).attr('check');
  che === 'y' ? (che = 'n') : (che = 'y');
  $aside.find('.foot_menu div').attr({
    class:
      che === 'y'
        ? 'iconfont icon-xuanzeyixuanze'
        : 'iconfont icon-xuanzeweixuanze',
    check: che,
  });
  let $sidenav = $aside.find('.bm_item');
  $sidenav
    .find('.check_bm')
    .attr('check', che)
    .css('background-color', che === 'y' ? _d.checkColor : 'transparent');
  _success(`选中：${che === 'y' ? $sidenav.length : 0}`, true);
}).on('click', '.check_bm', function (e) {
  e.stopPropagation();
  let $this = $(this),
    check = $this.attr('check');
  if (check === 'n') {
    $this.attr('check', 'y').css('background-color', _d.checkColor);
  } else {
    $this.attr('check', 'n').css('background-color', 'transparent');
  }
  let $sidenav = $aside.find('.bm_item'),
    $checkArr = $sidenav.filter(
      (_, item) => $(item).find('.check_bm').attr('check') === 'y'
    );
  _success(`选中：${$checkArr.length}`, true);
  if ($checkArr.length === $sidenav.length) {
    $aside.find('.foot_menu div').attr({
      class: 'iconfont icon-xuanzeyixuanze',
      check: 'y',
    });
  } else {
    $aside.find('.foot_menu div').attr({
      class: 'iconfont icon-xuanzeweixuanze',
      check: 'n',
    });
  }
}).on('click', '.pack_up_bm_list', function () {
  $(this).parent().prev().click();
}).on('click', '.delete_bm', function (e) {
  let $sidenav = $aside.find('.bm_item'),
    $checkArr = $sidenav.filter(
      (_, item) => $(item).find('.check_bm').attr('check') === 'y'
    );
  if ($checkArr.length === 0) return;
  let arr = [],
    pid = $checkArr.attr('data-pid');
  $checkArr.each((i, v) => {
    let $v = $(v);
    arr.push($v.attr('data-id'));
  });
  alert(`确认删除？`, {
    confirm: true,
    handled: (msg) => {
      if (msg === 'confirm') {
        _postAjax('/nav/delbmk', { pid, arr }).then((result) => {
          if (parseInt(result.code) === 0) {
            sendCommand({ type: 'updatedata', flag: 'bookmark' });
            renderAsideList();
            return;
          }
        }).catch(err => { });
        return;
      }
    },
  });
}).on('click', '.move_bm', function (e) {
  let $sidenav = $aside.find('.bm_item'),
    $checkArr = $sidenav.filter(
      (_, item) => $(item).find('.check_bm').attr('check') === 'y'
    );
  if ($checkArr.length === 0) return;
  let arr = [],
    pid = $checkArr.attr('data-pid');
  $checkArr.each((i, v) => {
    let $v = $(v);
    arr.push($v.attr('data-id'));
  });
  let str = ``;
  str += `<div data-name="Home" cursor class="mtcitem" data-id="home"><i class='iconfont icon-shoucang'></i><span style="margin-left:10px;">主页</span></div>`;
  _d.bookmark.side.forEach((item) => {
    let name = encodeHtml(item.name);
    if (item.id !== pid) {
      str += `<div data-name="${name}" class="mtcitem" data-id="${item.id}"><i class='iconfont icon-shoucang'></i><span style="margin-left:10px;">${name}</span></div>`;
    }
  });
  rightMenu(
    e,
    str,
    debounce(
      function ({ close, e }) {
        let _this = _getTarget(e, '.mtcitem');
        if (_this) {
          let $this = $(_this),
            toid = $this.attr('data-id'),
            listname = $this.attr('data-name');
          alert(`确认移动到 ${listname}?`, {
            confirm: true,
            handled: (m) => {
              if (m !== 'confirm') return;
              _postAjax('/nav/bmktolist', { pid, arr, toid }).then(
                (result) => {
                  if (parseInt(result.code) === 0) {
                    close();
                    sendCommand({ type: 'updatedata', flag: 'bookmark' });
                    renderAsideList();
                  }
                }
              ).catch(err => { });
            },
          });
        }
      },
      1000,
      true
    )
  );
}).on('click', '.close', function (e) {
  let $sidenav = $aside.find('.bm_item');
  $sidenav
    .find('.check_bm')
    .stop()
    .fadeOut(_speed)
    .attr('check', 'n')
    .css('background-color', 'transparent');
  $aside.find('.foot_menu').stop().slideUp(_speed);
}).on('click', function (e) {
  if (_getTarget(e, '.aside_wrap', 1)) {
    hideAside();
  }
});
if (isios()) {
  $aside[0]
    ._longPress('.list_title', function (e) {
      let $this = $(this),
        ev = e.changedTouches[0];
      asideBmMenu(ev, {
        id: $this.attr('data-id'),
        name: $this.attr('data-name'),
        index: $this.index('.list_title'),
      });
    })
    ._longPress('.bm_item', function (e) {
      let $this = $(this),
        ev = e.changedTouches[0];
      asideListMenu(ev, {
        pid: $this.attr('data-pid'),
        cid: $this.attr('data-id'),
        des: $this.attr('data-des'),
        index: $this.index(),
        name: $this.attr('data-name'),
        link: $this.attr('data-link'),
        logo: $this.attr('data-src'),
      });
    });
}
//操作列表
function asideBmMenu(e, obj) {
  let str = `<div cursor class="mtcitem"><i class="iconfont icon-bianji"></i><span>重命名</span></div>
              <div cursor class="mtcitem1"><i class="iconfont icon-icon-test"></i><span>新增书签</span></div>
              <div cursor class="mtcitem2"><i class="iconfont icon-fenxiang_2"></i><span>分享</span></div>
              <div cursor class="mtcitem3"><i class="iconfont icon-cangpeitubiao_shanchu"></i><span>删除</span></div>`;
  rightMenu(
    e,
    str,
    debounce(
      function ({ close, e }) {
        // 编辑列表
        if (_getTarget(e, '.mtcitem')) {
          let str = `<div class="mtcinp">
          <input autocomplete="off" placeholder="列表名" value="${encodeHtml(obj.name)}" type="text">
        </div>
        <button cursor class="mtcbtn">提交</button>`;
          rightMenu(
            e,
            str,
            debounce(
              function ({ close, e, inp }) {
                if (_getTarget(e, '.mtcbtn')) {
                  let ni = inp[0];
                  if (ni === '') {
                    _err('请输入列表名');
                    return;
                  }
                  if (ni === obj.name) return;
                  _postAjax('/nav/editlist', { id: obj.id, name: ni }).then(
                    (result) => {
                      if (parseInt(result.code) === 0) {
                        obj.name = ni;
                        close();
                        sendCommand({ type: 'updatedata', flag: 'bookmark' });
                        renderAsideList();
                        return;
                      }
                    }
                  ).catch(err => { });
                }
              },
              1000,
              true
            )
          );
        } else if (_getTarget(e, '.mtcitem1')) {
          // 新增书签
          let str = `
          <input autocomplete="off" placeholder="标题" type="text">
          <input autocomplete="off" placeholder="https://" type="text">
          <textarea autocomplete="off" placeholder="描述"></textarea>
          <button cursor class="mtcbtn">提交</button>`;
          rightMenu(
            e,
            str,
            debounce(
              function ({ close, e, inp }) {
                if (_getTarget(e, '.mtcbtn')) {
                  let an = inp[0],
                    al = inp[1],
                    des = inp[2];
                  if (!isurl(al)) {
                    _err('请输入正确的网址');
                    return;
                  }
                  if (an === '') {
                    _err('请输入书签标题');
                    return;
                  }
                  let logo = '//' + getHost(al) + '/favicon.ico';
                  _postAjax('/nav/addbmk', {
                    id: obj.id,
                    obj: { name: an, link: al, logo: logo, des },
                  }).then((result) => {
                    if (parseInt(result.code) === 0) {
                      close();
                      sendCommand({ type: 'updatedata', flag: 'bookmark' });
                      $asideBtn.activeId = obj.id;
                      renderAsideList();
                    }
                  }).catch(err => { });
                }
              },
              1000,
              true
            )
          );
        } else if (_getTarget(e, '.mtcitem2')) {
          //分享列表
          _postAjax('/nav/share', { id: obj.id }).then((result) => {
            if (parseInt(result.code) === 0) {
              close();
              hideAside();
              openIframe(`/sharelist`, '分享列表');
            }
          }).catch(err => { });
        } else if (_getTarget(e, '.mtcitem3')) {
          //删除列表
          alert(`确认删除列表：${obj.name}？`, {
            confirm: true,
            handled: (m) => {
              if (m !== 'confirm') return;
              _postAjax('/nav/dellist', { id: obj.id }).then((result) => {
                if (parseInt(result.code) === 0) {
                  close();
                  sendCommand({ type: 'updatedata', flag: 'bookmark' });
                  renderAsideList();
                }
              }).catch(err => { });
            },
          });
        }
      },
      1000,
      true
    )
  );
}
//操作书签
function asideListMenu(e, obj) {
  let str = `<div cursor class="mtcitem"><i class="iconfont icon-danchuang"></i><span>弹窗打开</span></div>
                  <div cursor class="mtcitem1"><i class="iconfont icon-shangchuan1"></i><span>上传图标</span></div>
                  ${$aside.find('.foot_menu').is(':hidden')
      ? '<div cursor class="mtcitem2"><i class="iconfont icon-duoxuan"></i><span>选中</span></div>'
      : ''
    }
                  <div cursor class="mtcitem3"><i class="iconfont icon-bianji"></i><span>编辑书签</span></div>
                  <div cursor class="mtcitem4"><i class="iconfont icon-moveto"></i><span>移动到</span></div>
                  <div cursor class="mtcitem5"><i class="iconfont icon-cangpeitubiao_shanchu"></i><span>删除</span></div>`;
  rightMenu(
    e,
    str,
    debounce(
      function ({ close, e }) {
        if (_getTarget(e, '.mtcitem')) {
          close();
          hideAside();
          openIframe(obj.link, obj.name);
        } else if (_getTarget(e, '.mtcitem1')) {
          //上传图标
          close();
          let input = document.createElement('input');
          input.type = 'file';
          input.accept = '.jpg,.png,.gif,.jpeg';
          input.style.display = 'none';
          document.body.appendChild(input);
          input.click();
          let $input = $(input);
          $input.change(async (e) => {
            var file = e.target.files[0];
            $input.remove();
            if (!isImgFile(file.name)) {
              _err('上传文件格式错误');
              return;
            }
            let blob;
            try {
              blob = await compressionImg(file); //压缩图片
            } catch (error) {
              _err('上传失败');
              return;
            }
            let fileReader = new FileReader();
            fileReader.readAsArrayBuffer(blob);
            fileReader.onload = (e) => {
              let buffer = e.target.result,
                spark = new SparkMD5.ArrayBuffer();
              spark.append(buffer);
              let HASH = spark.end() + '.' + extname(file.name)[1];
              let pro = new UpProgress(file.name);
              _upFile(`/home/bmklogo?name=${HASH}`, blob, function (pes) {
                pro.update(pes);
              })
                .then((result) => {
                  if (parseInt(result.code) === 0) {
                    pro.close();
                    let purl = result.data.purl;
                    _postAjax('/nav/setlogo', {
                      pid: obj.pid,
                      cid: obj.cid,
                      purl,
                    }).then((result) => {
                      if (parseInt(result.code) === 0) {
                        sendCommand({ type: 'updatedata', flag: 'bookmark' });
                        renderAsideList();
                        return;
                      }
                    });
                    return;
                  }
                  return new Promise.reject();
                })
                .catch(() => {
                  pro.fail();
                });
            };
          });
        } else if (_getTarget(e, '.mtcitem2')) {
          //多选
          $aside.find('.foot_menu').stop().slideDown(_speed).find('div').attr({
            class: 'iconfont icon-xuanzeweixuanze',
            check: 'n',
          });
          let $sidenav = $aside.find('.bm_item');
          $sidenav.find('.check_bm').stop().fadeIn(_speed);
          close();
        } else if (_getTarget(e, '.mtcitem3')) {
          // 修改书签
          let str = `
        <input autocomplete="off" placeholder="标题" value="${encodeHtml(obj.name)}" type="text">
        <input autocomplete="off" placeholder="https://" value="${obj.link}" type="text">
        <textarea autocomplete="off" placeholder="描述">${encodeHtml(obj.des)}</textarea>
        <button cursor class="mtcbtn">提交</button>`;
          rightMenu(
            e,
            str,
            debounce(
              function ({ close, e, inp }) {
                if (_getTarget(e, '.mtcbtn')) {
                  let an = inp[0],
                    al = inp[1],
                    des = inp[2];
                  if (!isurl(al)) {
                    _err('请输入正确的网址');
                    return;
                  }
                  if (an === '') {
                    _err('请输入书签标题');
                    return;
                  }
                  if (an === obj.name && al === obj.link && des === obj.des) return;
                  let requestObj = {
                    pid: obj.pid,
                    cid: obj.cid,
                    des,
                    name: an,
                    logo: obj.logo,
                    link: al,
                  };
                  if (requestObj.logo.includes('favicon.ico')) {
                    requestObj.logo = '//' + getHost(al) + '/favicon.ico';
                  }
                  _postAjax('/nav/editbmk', requestObj).then((result) => {
                    if (parseInt(result.code) === 0) {
                      obj.name = an;
                      obj.link = al;
                      obj.des = des;
                      close();
                      sendCommand({ type: 'updatedata', flag: 'bookmark' });
                      renderAsideList();
                      return;
                    }
                  }).catch(err => { });
                }
              },
              1000,
              true
            )
          );
        } else if (_getTarget(e, '.mtcitem4')) {
          // 移动书签
          let str = ``;
          str += `<div data-name="Home" cursor class="mtcitem" data-id="home"><i class='iconfont icon-shoucang'></i><span style="margin-left:10px;">主页</span></div>`;
          _d.bookmark.side.forEach((item) => {
            let name = encodeHtml(item.name);
            if (item.id !== obj.pid) {
              str += `<div data-name="${name}" class="mtcitem" data-id="${item.id}"><i class='iconfont icon-shoucang'></i><span style="margin-left:10px;">${name}</span></div>`;
            }
          });
          let flagClose = close;
          rightMenu(
            e,
            str,
            debounce(
              function ({ close, e }) {
                let _this = _getTarget(e, '.mtcitem');
                if (_this) {
                  let $this = $(_this),
                    toid = $this.attr('data-id'),
                    listname = $this.attr('data-name');
                  alert(`确认移动到 ${listname}?`, {
                    confirm: true,
                    handled: (m) => {
                      if (m !== 'confirm') return;
                      _postAjax('/nav/bmktolist', {
                        pid: obj.pid,
                        arr: [obj.cid],
                        toid,
                      }).then((result) => {
                        if (parseInt(result.code) === 0) {
                          flagClose();
                          close();
                          sendCommand({
                            type: 'updatedata',
                            flag: 'bookmark',
                          });
                          renderAsideList();
                        }
                      }).catch(err => { });
                    },
                  });
                }
              },
              1000,
              true
            )
          );
        } else if (_getTarget(e, '.mtcitem5')) {
          // 删除书签
          alert(`确认删除？`, {
            confirm: true,
            handled: (m) => {
              if (m !== 'confirm') return;
              _postAjax('/nav/delbmk', { pid: obj.pid, arr: [obj.cid] }).then(
                (result) => {
                  if (parseInt(result.code) === 0) {
                    close();
                    sendCommand({ type: 'updatedata', flag: 'bookmark' });
                    renderAsideList();
                    return;
                  }
                }
              ).catch(err => { });
            },
          });
        }
      },
      1000,
      true
    )
  );
}

$asideBtn.on('click', function (e) {
  if ($asideWrap.is(':hidden')) {
    showAside();
  } else {
    hideAside();
  }
});
// 显示和隐藏侧栏
function showAside() {
  $asideWrap.css('display', 'block');
  let menuw = $aside.outerWidth();
  renderAsideListLoading();
  $mainid.css({
    transform: `translateX(${menuw}px)`,
  });
  $aside.css({
    transform: 'translateX(0px)',
  });
  $asideBtn.find('.boxtop').addClass('active');
  $asideBtn.find('.boxdow').addClass('active');
  $asideBtn.find('.boxcon').css('opacity', '0');
  _setTimeout(() => {
    renderAsideList();
  }, 500);
}
function hideAside() {
  let menuw = $aside.outerWidth();
  $mainid.css({
    transform: 'none',
  });
  $aside.css({
    transform: `translateX(-${menuw}px)`,
  });
  $asideBtn.find('.boxtop').removeClass('active');
  $asideBtn.find('.boxdow').removeClass('active');
  $asideBtn.find('.boxcon').css('opacity', '1');
  $asideWrap.stop().fadeOut(_speed, () => {
    $aside.find('.list').html('');
  });
}

_getAjax('/chat/getnews', { a: 3 }).then((result) => {
  if (parseInt(result.code) === 0) {
    $showChatRoomBtn.find('.g_chat_msg_alert').stop().fadeOut(_speed);
  } else {
    $showChatRoomBtn.find('.g_chat_msg_alert').stop().fadeIn(_speed);
  }
}).catch(err => { });
_getAjax('/user/renewal').then(res => { }).catch(err => { });


_getAjax('/user/getuserinfo').then((result) => {
  if (parseInt(result.code) === 0) {
    _d.userInfo = result.data;
    _d.myTitle = `Hello ${_d.userInfo.username}`;
    if ($myAudio[0].paused) {
      document.title = _d.myTitle;
    }
    if (_d.userInfo.account !== 'root') {
      $rightBox.find('.show_log').remove();
      $rightBox.find('.user_managa').remove();
    }
    $rightBox.find('.user_name')
      .text(_d.userInfo.username)
      .attr('title', _d.userInfo.username)
      .stop()
      .fadeIn(_speed);
    _success(`Welcome ${_d.userInfo.username}`);
    $userLogoBtn.css(
      'background-image',
      `url(${mediaURL}/logo/${_d.userInfo.account}/${_d.userInfo.account
      }.png?v=${Math.random()})`
    );
    const urlParmes = queryURLParams(myOpen());
    if (urlParmes.c) {
      let { account, username } = _getData('toUser');
      if (account && username) {
        if (account === _d.userInfo.account) {
          myOpen('/');
          return;
        }
        chatobj.account = account;
        $chatHeadBtns.find('.chat_title').text(username);
        $showChatRoomBtn.click();
      }
    }
    if (urlParmes.p) {
      $rightBox.find('.show_music_player').click();
    }
    if (dmwidth > 800 && !_d.userInfo.bg || dmwidth <= 800 && !_d.userInfo.bgxs) {
      $pageBg.css(
        'background-image',
        `url(/img/bg.svg)`
      ).attr('data-bg', '');
      closeLoading();
      return;
    }
    let bgUrl = '';
    if (dmwidth > 800) {
      bgUrl = `${mediaURL}/bg/bg/${_d.userInfo.bg}`;
    } else {
      bgUrl = `${mediaURL}/bg/bgxs/${_d.userInfo.bgxs}`;
    }
    imgjz(bgUrl, () => {
      $pageBg.css(
        'background-image',
        `url(${bgUrl})`
      ).attr('data-bg', bgUrl.split('/').pop());
      closeLoading();
    }, () => {
      $pageBg.css(
        'background-image',
        `url(/img/bg.svg)`
      ).attr('data-bg', '');
      closeLoading();
    });
  }
}).catch(err => { });

// 主页书签
~(function () {
  let fromDom = null;
  $homeBmWrap.find('ul')
    .on('dragstart', '.home_bm_item', function (e) {
      fromDom = this;
    })
    .on('drop', '.home_bm_item', function (e) {
      let fromId = $(fromDom).attr('data-id'),
        toId = $(this).attr('data-id');
      if (fromDom) {
        if (fromId && toId && fromId !== toId) {
          _postAjax('/home/move', { fromId, toId }).then((result) => {
            if (parseInt(result.code) === 0) {
              sendCommand({ type: 'updatedata', flag: 'bookmark' });
              _d.bookmark = result.data;
              renderHomebook();
              return;
            }
          }).catch(err => { });
        }
        fromDom = null;
      }
    })
    .on('dragover', '.home_bm_item', function (e) {
      e.preventDefault();
    });
})();
//主页书签渲染
function renderHomebook() {
  if ($searchBoxMask.is(':hidden')) return;
  let a = $homeBmWrap.find('ul').children();
  if (a.length === 0) {
    renderhomebookdefault();
  }
  _getAjax('/home/getlist').then((result) => {
    if (result.code === 0) {
      _d.bookmark = result.data;
      renderhomebook();
      return;
    }
  }).catch(err => { });
}
function renderhomebookdefault() {
  let str = '';
  let color = '#ffffff54';
  new Array(21).fill(null).forEach((v, i) => {
    str += `<li style="pointer-events: none;" class="home_bm_item">
              <div style="background-color:${color}" class="home_bm_logo"></div>
              <p></p>
              </li>`;
  });
  $homeBmWrap.find('ul').html(str);
}
function renderhomebook() {
  if ($searchBoxMask.is(':hidden')) return;
  $homeFootMenu.stop().slideUp(_speed).find('div').attr({
    class: 'iconfont icon-xuanzeweixuanze',
    check: 'n',
  });
  let homearr = _d.bookmark.home,
    str = '';
  homearr.forEach((v, i) => {
    let name = encodeHtml(v.name);
    let des = v.des ? encodeHtml(v.des) : '';
    str += `<li class="home_bm_item" data-link="${v.link}" data-des="${des}" data-src="${v.logo}" data-id="${v.id}" data-name="${name}" draggable="true">
              <div cursor check="n" class="check_home_bm"></div>
              <div class="home_bm_logo" cursor title="${name}(${v.link})"></div>
              <p title="${des}">${name}</p>
              </li>`;
  });
  str += `<li class="home_bm_item" data-src="/img/tianjia.png">
                <div cursor x="add" class="home_bm_logo">
                </div>
                <p></p>
              </li>`;
  $homeBmWrap.find('ul').html(str).find('.home_bm_item').each((index, item) => {
    let $item = $(item),
      url = $item.attr('data-src'),
      $fib = $item.find('.home_bm_logo');
    if (
      !url.includes('favicon.ico') &&
      $item.find('.home_bm_logo').attr('x') !== 'add'
    ) {
      url = mediaURL + url;
    }
    imgjz(
      url,
      () => {
        $fib.css({
          'background-image': `url(${url})`,
        });
      },
      () => {
        let link = $item.attr('data-link');
        let u = `https://api.iowen.cn/favicon/${getHost(link)}.png`;
        imgjz(
          u,
          () => {
            $fib.css({
              'background-image': `url('${u}')`,
            });
          },
          () => {
            $fib.css({
              'background-image': `url('/img/mrlogo.png')`,
            });
          }
        );
      }
    );
  });
}

$searchBoxMask.on('click', '.home_bm_logo', debounce(function (e) {
  let $this = $(this);
  if ($this.attr('x') === 'add') {
    let str = `
    <input autocomplete="off" placeholder="标题" type="text">
    <input autocomplete="off" placeholder="https://" type="text">
    <textarea autocomplete="off" placeholder="描述"></textarea>
    <button cursor class="mtcbtn">提交</button>`;
    rightMenu(
      e,
      str,
      debounce(
        function ({ close, e, inp }) {
          if (_getTarget(e, '.mtcbtn')) {
            let sqname = inp[0],
              sqlink = inp[1],
              des = inp[2];
            if (!isurl(sqlink)) {
              _err('请输入正确的网址');
              return;
            }
            if (sqname === '') {
              _err('请输入书签标题');
              return;
            }
            let logo = '//' + getHost(sqlink) + '/favicon.ico';
            _postAjax('/home/addbmk', {
              name: sqname,
              link: sqlink,
              logo: logo,
              des
            }).then((result) => {
              if (parseInt(result.code) === 0) {
                close();
                sendCommand({ type: 'updatedata', flag: 'bookmark' });
                renderHomebook();
                return;
              }
            }).catch(err => { });
          }
        },
        1000,
        true
      )
    );
  } else {
    let link = $this.parent().attr('data-link');
    myOpen(link, "_blank");
  }
},
  1000,
  true
)
).on('contextmenu', '.home_bm_logo', function (e) {
  e.preventDefault();
  let $this = $(this);
  homeBmMenu(e, {
    id: $this.parent().attr('data-id'),
    name: $this.parent().attr('data-name'),
    link: $this.parent().attr('data-link'),
    des: $this.parent().attr('data-des'),
    logo: $this.parent().attr('data-src'),
    index: $this.parent().index(),
  });
}).on('click', '.home_foot_menu div', function () {
  let che = $(this).attr('check');
  che === 'y' ? (che = 'n') : (che = 'y');
  $homeFootMenu.find('div').attr({
    class:
      che === 'y'
        ? 'iconfont icon-xuanzeyixuanze'
        : 'iconfont icon-xuanzeweixuanze',
    check: che,
  });
  let $folder = $homeBmWrap.find('.home_bm_item').find('.check_home_bm');
  $folder
    .attr('check', che)
    .css('background-color', che === 'y' ? _d.checkColor : 'transparent');
  _success(`选中：${che === 'y' ? $folder.length : 0}`, true);
}).on('click', '.check_home_bm', function (e) {
  e.stopPropagation();
  let $this = $(this),
    check = $this.attr('check');
  if (check === 'n') {
    $this.attr('check', 'y').css('background-color', _d.checkColor);
  } else {
    $this.attr('check', 'n').css('background-color', 'transparent');
  }
  let $sidenav = $homeBmWrap.find('.home_bm_item'),
    $checkArr = $sidenav.filter(
      (_, item) =>
        $(item).attr('data-id') &&
        $(item).find('.check_home_bm').attr('check') === 'y'
    );
  _success(`选中：${$checkArr.length}`, true);
  if ($checkArr.length === $sidenav.length - 1) {
    $homeFootMenu.find('div').attr({
      class: 'iconfont icon-xuanzeyixuanze',
      check: 'y',
    });
  } else {
    $homeFootMenu.find('div').attr({
      class: 'iconfont icon-xuanzeweixuanze',
      check: 'n',
    });
  }
}).on('click', '.delete_bm', function (e) {
  let $sidenav = $homeBmWrap.find('.home_bm_item'),
    $checkArr = $sidenav.filter(
      (_, item) =>
        $(item).attr('data-id') &&
        $(item).find('.check_home_bm').attr('check') === 'y'
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
        _postAjax('/home/delbmk', { arr }).then((result) => {
          if (parseInt(result.code) === 0) {
            sendCommand({ type: 'updatedata', flag: 'bookmark' });
            renderHomebook();
            return;
          }
        }).catch(err => { });
        return;
      }
    },
  });
}).on('click', '.move_bm', function (e) {
  let $sidenav = $homeBmWrap.find('.home_bm_item'),
    $checkArr = $sidenav.filter(
      (_, item) =>
        $(item).attr('data-id') &&
        $(item).find('.check_home_bm').attr('check') === 'y'
    );
  if ($checkArr.length === 0) return;
  let arr = [];
  $checkArr.each((i, v) => {
    let $v = $(v);
    arr.push($v.attr('data-id'));
  });
  let str = '';
  if (_d.bookmark.side.length === 0) {
    _err('未找到列表');
    return;
  }
  str += ``;
  _d.bookmark.side.forEach((v, i) => {
    let name = encodeHtml(v.name);
    str += `<div data-name="${name}" cursor class="mtcitem" data-id="${v.id}"><i class='iconfont icon-shoucang'></i><span style="margin-left:10px;">${name}</span></div>`;
  });
  rightMenu(
    e,
    str,
    debounce(
      function ({ close, e }) {
        let _this = _getTarget(e, '.mtcitem');
        if (_this) {
          let $this = $(_this),
            nid = $this.attr('data-id'),
            listname = $this.attr('data-name');
          alert(`确认移动到 ${listname}?`, {
            confirm: true,
            handled: (m) => {
              if (m !== 'confirm') return;
              _postAjax('/home/bmktolist', { arr, nid }).then((result) => {
                if (parseInt(result.code) === 0) {
                  close();
                  sendCommand({ type: 'updatedata', flag: 'bookmark' });
                  renderHomebook();
                  if ($mainid.css('transform') == 'none') {
                  } else {
                    renderAsideList();
                  }
                  return;
                }
              }).catch(err => { });
            },
          });
        }
      },
      1000,
      true
    )
  );
}).on('click', '.close', function (e) {
  let $sidenav = $homeBmWrap.find('.home_bm_item');
  $sidenav
    .find('.check_home_bm')
    .stop()
    .fadeOut(_speed)
    .attr('check', 'n')
    .css('background-color', 'transparent');
  $homeFootMenu.stop().slideUp(_speed);
}).on('click', function (e) {
  if (_getTarget(e, '.search_box_mask', 1)) {
    $homeBmWrap.find('ul').html('');
    $searchBoxMask.stop().hide(_speed);
    $searchBoxBtn.stop().show(_speed);
    $pageBg.removeClass('sce');
  }
});
if (isios()) {
  $searchBoxMask[0]._longPress('.home_bm_logo', function (e) {
    let $this = $(this),
      ev = e.changedTouches[0];
    homeBmMenu(ev, {
      id: $this.parent().attr('data-id'),
      name: $this.parent().attr('data-name'),
      link: $this.parent().attr('data-link'),
      des: $this.parent().attr('data-des'),
      logo: $this.parent().attr('data-src'),
      index: $this.parent().index(),
    });
  });
}


// 编辑书签
function homeBmMenu(e, obj) {
  if (!obj.id) return;
  let str = `<div cursor class="mtcitem"><i class="iconfont icon-danchuang"></i><span>弹窗打开</span></div>
            <div cursor class="mtcitem1"><i class="iconfont icon-shangchuan1"></i><span>上传图标</span></div>
            ${$homeFootMenu.is(':hidden') ? '<div cursor class="mtcitem2"><i class="iconfont icon-duoxuan"></i><span>选中</span></div>' : ''}
            <div cursor class="mtcitem3"><i class="iconfont icon-bianji"></i><span>编辑书签</span></div>
            ${_d.bookmark.side.length === 0 ? '' : '<div cursor class="mtcitem4"><i class="iconfont icon-moveto"></i><span>移动到</span></div>'}
            <div cursor class="mtcitem5"><i class="iconfont icon-cangpeitubiao_shanchu"></i><span>删除</span></div>
            `;
  rightMenu(e, str, debounce(function ({ close, e }) {
    if (_getTarget(e, '.mtcitem')) {
      close();
      openIframe(obj.link, obj.name);
    } else if (_getTarget(e, '.mtcitem1')) {
      // 自定义图标
      close();
      let input = document.createElement('input');
      input.type = 'file';
      input.accept = '.jpg,.png,.gif,.jpeg';

      input.style.display = 'none';
      document.body.appendChild(input);
      input.click();
      let $input = $(input);
      $input.change(async (e) => {
        var file = e.target.files[0];
        $input.remove();
        if (!isImgFile(file.name)) {
          _err('上传文件格式错误');
          return;
        }
        let blob;
        try {
          blob = await compressionImg(file); //压缩图片
        } catch (error) {
          _err('上传失败');
          return;
        }
        let fileReader = new FileReader();
        fileReader.readAsArrayBuffer(blob);
        fileReader.onload = (e) => {
          let buffer = e.target.result,
            spark = new SparkMD5.ArrayBuffer();
          spark.append(buffer);
          let HASH = spark.end() + '.' + extname(file.name)[1];
          let pro = new UpProgress(file.name);
          _upFile(`/home/bmklogo?name=${HASH}`, blob, function (pes) {
            pro.update(pes);
          })
            .then((result) => {
              if (parseInt(result.code) === 0) {
                pro.close();
                let purl = result.data.purl;
                _postAjax('/home/setlogo', { id: obj.id, purl }).then(
                  (result) => {
                    if (parseInt(result.code) === 0) {
                      sendCommand({
                        type: 'updatedata',
                        flag: 'bookmark',
                      });
                      renderHomebook();
                      return;
                    }
                  }
                ).catch(err => { });
                return;
              }
              return new Promise.reject();
            })
            .catch(() => {
              pro.fail();
            });
        };
      });
    } else if (_getTarget(e, '.mtcitem2')) {
      //批量操作
      $homeFootMenu.stop().slideDown(_speed).find('div').attr({
        class: 'iconfont icon-xuanzeweixuanze',
        check: 'n',
      });
      let $sidenav = $homeBmWrap.find('.home_bm_item');
      $sidenav.find('.check_home_bm').stop().fadeIn(_speed);
      close();
    } else if (_getTarget(e, '.mtcitem3')) {
      //编辑书签
      let str = `
          <input autocomplete="off" placeholder="标题" value="${encodeHtml(obj.name)}" type="text">
          <input autocomplete="off" placeholder="https://" value="${obj.link}" type="text">
          <textarea autocomplete="off" placeholder="描述">${encodeHtml(obj.des)}</textarea>
          <button cursor class="mtcbtn">提交</button>`;
      rightMenu(
        e,
        str,
        debounce(
          function ({ close, e, inp }) {
            if (_getTarget(e, '.mtcbtn')) {
              let b = inp[0],
                c = inp[1],
                des = inp[2];
              if (!isurl(c)) {
                _err('请输入正确的网址');
                return;
              }
              if (b === '') {
                _err('请输入书签标题');
                return;
              }
              let requestObj = {
                id: obj.id,
                name: b,
                des,
                logo: obj.logo,
                link: c,
              };
              if (requestObj.logo.includes('favicon.ico')) {
                requestObj.logo = '//' + getHost(c) + '/favicon.ico';
              }
              if (b === obj.name && c === obj.link && des === obj.des) return;
              _postAjax('/home/editbmk', requestObj).then((result) => {
                if (parseInt(result.code) === 0) {
                  obj.name = b;
                  obj.link = c;
                  obj.des = des;
                  close();
                  sendCommand({ type: 'updatedata', flag: 'bookmark' });
                  renderHomebook();
                  return;
                }
              }).catch(err => { });
            }
          },
          1000,
          true
        )
      );
    } else if (_getTarget(e, '.mtcitem4')) {
      // 移动书签
      let str = '';
      if (_d.bookmark.side.length === 0) {
        _err('没有可移动的列表');
        return;
      }
      _d.bookmark.side.forEach((v, i) => {
        let name = encodeHtml(v.name);
        str += `<div data-name="${name}" cursor class="mtcitem" data-id="${v.id}"><i class='iconfont icon-shoucang'></i><span style="margin-left:10px;">${name}</span></div>`;
      });
      let flagClose = close;
      rightMenu(
        e,
        str,
        debounce(
          function ({ close, e }) {
            let _this = _getTarget(e, '.mtcitem');
            if (_this) {
              let $this = $(_this),
                nid = $this.attr('data-id'),
                listname = $this.attr('data-name');
              alert(`确认移动到 ${listname}?`, {
                confirm: true,
                handled: (m) => {
                  if (m !== 'confirm') return;
                  _postAjax('/home/bmktolist', {
                    arr: [obj.id],
                    nid,
                  }).then((result) => {
                    if (parseInt(result.code) === 0) {
                      flagClose();
                      close();
                      sendCommand({
                        type: 'updatedata',
                        flag: 'bookmark',
                      });
                      renderHomebook();
                      if ($mainid.css('transform') == 'none') {
                      } else {
                        renderAsideList();
                      }
                      return;
                    }
                  }).catch(err => { });
                },
              });
            }
          },
          1000,
          true
        )
      );
    } else if (_getTarget(e, '.mtcitem5')) {
      // 删除书签
      alert(`确认删除？`, {
        confirm: true,
        handled: (m) => {
          if (m !== 'confirm') return;
          _postAjax('/home/delbmk', {
            arr: [obj.id],
          }).then((result) => {
            if (parseInt(result.code) === 0) {
              close();
              sendCommand({ type: 'updatedata', flag: 'bookmark' });
              renderHomebook();
              return;
            }
          }).catch(err => { });
        },
      });
    }
  },
    1000,
    true
  )
  );
}

$searchBoxBtn.on('click', function (e) {
  $searchBoxMask.stop().show(_speed, () => {
    renderHomebook();
  });
  setZindex($searchBoxMask);
  $(this).stop().hide(_speed);
  $pageBg.addClass('sce');
  $searchLogo.find('.logo_box').addClass('active');
});

//搜索相关
//切换搜索引擎
~(function () {
  let { icon, logo, searchlink } = curSearchEngine;
  $searchLogo.find('img').attr({ src: logo });
  $searchBoxBtn.attr('src', icon);
  $searchInpWrap.find('.inp_box input').attr({
    placeholder: '输入搜索内容或网址',
    action: searchlink,
  });
})();


// 搜索提示词
function tosearch() {
  const $inp = $searchInpWrap.find('.inp_box input'),
    action = $inp.attr('action'),
    val = $inp.val().trim();
  $inp.val('');
  if (val === '') return;
  saveSearchText(val);
  if (isurl(val)) {
    myOpen(val, '_blank');
    return;
  }
  myOpen(`${action}${val}`, '_blank');
}
let numff = -1;
$searchInpWrap.on('click', '.search_submit', tosearch).on('click', '.translate_btn', debounce(function () {
  const $inp = $searchInpWrap.find('.inp_box input');
  let a = $inp.val().trim();
  $inp.val('');
  if (a === '') return;
  saveSearchText(a);
  myOpen(`https://dict.youdao.com/w/${a}`, '_blank');
}, 500)).on('keyup', '.inp_box input', function (e) {
  e.stopPropagation();
  e.preventDefault();
  let key = e.key;
  if (key == 'Enter') {
    tosearch();
  }
  // 清空
  if (key === 'Delete') {
    $searchInpWrap.find('.inp_box input').val('');
  }
}).on('keydown', '.inp_box input', function (e) {
  let key = e.key,
    listlength = $searchInpWrap.find('.search_list_box ul').children('li').length - 1;
  if (key !== 'ArrowDown' && key !== 'ArrowUp') {
    numff = -1;
  }
  if (key === 'ArrowDown') {
    numff++;
    if (numff > listlength) {
      numff = 0;
    }
    let $searchItem = $searchInpWrap.find('.search_list_box ul .search_item');
    $searchItem.removeClass('active').eq(numff).addClass('active');
    let aa = $searchItem.eq(numff).attr('xx');
    $searchInpWrap.find('.inp_box input').val(aa);
    let dw = parseInt(numff * 36);
    $searchInpWrap.find('.search_list_box').scrollTop(dw);
  }
  if (key === 'ArrowUp') {
    numff--;
    if (numff < 0) {
      numff = listlength;
    }
    let $searchItem = $searchInpWrap.find('.search_list_box ul .search_item');
    $searchItem.removeClass('active').eq(numff).addClass('active');
    let aa = $searchItem.eq(numff).attr('xx');
    $searchInpWrap.find('.inp_box input').val(aa);
    let dw = parseInt(numff * 36);
    $searchInpWrap.find('.search_list_box').scrollTop(dw);
  }
}).on('input', '.inp_box input', debounce(function () {
  let val = this.value.trim();
  if (val === '') {
    _getAjax('/search/getsearchdata').then((result) => {
      if (parseInt(result.code) === 0) {
        if (result.data.length > 0) {
          sxtsc(result.data);
        }
      }
    }).catch(err => { });
  } else {
    textinput(val);
  }
}, 1000)).on('focus', '.inp_box input', function () {
  $searchInpWrap.find('.search_list_box').stop().fadeIn(_speed);
  let val = this.value.trim();
  if (val === '') {
    _getAjax('/search/getsearchdata').then((result) => {
      if (parseInt(result.code) === 0) {
        if (result.data.length > 0) {
          sxtsc(result.data);
        }
      }
    }).catch(err => { });
  } else {
    textinput(val);
  }
}).find('.search_list_box').on(
  'click',
  'li',
  debounce(function (e) {
    const $inp = $searchInpWrap.find('.inp_box input');
    $inp.val('');
    let $this = $(this),
      href = $inp.attr('action'),
      xx = $this.attr('xx'),
      x = $this.attr('x'),
      xxx = $this.attr('xxx'),
      noteid = $this.attr('noteid');
    if (x === 'ss') {
      saveSearchText(xx);
      if (isurl(xx)) {
        myOpen(xx, '_blank');
      } else {
        myOpen(`${href}${xx}`, '_blank');
      }
    } else if (x === 'note') {
      openIframe(`/note/?v=${noteid}`, xx);
    } else if (x === 'bmk') {
      myOpen(xxx, '_blank');
    }
  }, 500)).on('click', '.dellss', function (e) {
    e.stopPropagation();
    let x = $(this).parent().attr('ssid');
    _postAjax('/search/del', { arr: [x] }).then((result) => {
      if (parseInt(result.code) === 0) {
        $(this).parent().stop().slideUp(_speed);
        return;
      }
    }).catch(err => { });
  })
  .on('contextmenu', 'li', function (e) {
    let xx = $(this).attr('xx');
    e.preventDefault();
    $searchInpWrap.find('.inp_box input').val(xx);
  });
// 保存搜索历史
function saveSearchText(str) {
  str = str.trim();
  if (str === '') return;
  _postAjax('/search/add', { a: str }).then(res => { }).catch(err => { });
}
let searchstr = '';
function textinput(val) {
  searchstr = '';
  _getAjax('/search/getsearchdata', { a: val }).then((result) => {
    if (parseInt(result.code) === 0) {
      if (result.data.length > 0) {
        result.data.forEach((v) => {
          let { name, link, type, id } = v;
          name = encodeHtml(name);
          if (type === 'ss') {
            searchstr += `<li title="${name}" x="${type}" cursor xx='${name}' ssid="${id}" class="search_item">${name}<div class="type_logo iconfont icon-lishijilu"></div><div class="dellss iconfont icon-cangpeitubiao_shanchu"></div></li>`;
          } else if (type === 'note') {
            searchstr += `<li title="${name}" x="${type}" cursor xx="${name}" noteid="${id}" class="search_item">${name}<div class="type_logo iconfont icon-bijiben"></div></li>`;
          } else if (type === 'bmk') {
            searchstr += `<li title="${name}(${link})" x="${type}" xxx="${link}" cursor xx="${name}" class="search_item">${name}<div class="type_logo iconfont icon-shuqian1"></div></li>`;
          }
        });
      }
      $searchInpWrap.find('.search_list_box ul').html(searchstr);
      numff = -1;
    }
    let callWord = _getData('callword');
    if (callWord === 'y') {
      const script = document.createElement('script');
      script.src = `https://www.baidu.com/su?wd=${val}&cb=showMsg`;
      document.body.appendChild(script);
      document.body.removeChild(script);
    };
  }).catch(err => { });
}

window.showMsg = function (msg) {
  var str = '';
  for (var i = 0; i < msg.s.length; i++) {
    let name = encodeHtml(msg.s[i]);
    str += `<li title="${name}" x="ss" cursor xx='${name}' class="search_item">${name}<div class="type_logo iconfont icon-tishi"></div></li>`;
  }
  str = searchstr += str;
  $searchInpWrap.find('.search_list_box ul').html(str);
  numff = -1;
};


if (isios()) {
  $searchInpWrap.find('.search_list_box')[0]._longPress('li', function () {
    let xx = $(this).attr('xx');
    $searchInpWrap.find('.inp_box input').val(xx);
  });
}

function sxtsc(arr) {
  let str = '';
  arr.forEach((v) => {
    let data = encodeHtml(v.data);
    str += `<li title="${data}" x="ss" cursor xx='${data}' ssid="${v.id}" class="search_item">${data}<div class="type_logo iconfont icon-lishijilu"></div><div class="dellss iconfont icon-cangpeitubiao_shanchu"></div></li>`;
  });
  $searchInpWrap.find('.search_list_box ul').html(str);
  numff = -1;
}

$searchBoxMask.on('click', '.setting', debounce(function (e) {
  e.stopPropagation();
  let callWord = _getData('callword');
  let str = `
    <div cursor data-callword="${callWord}" class="mtcitem"><i class="iconfont icon-tishi"></i><span>百度提示词</span><i class="iconfont ${callWord === 'y' ? 'icon-kaiguan-kai1' : 'icon-kaiguan-guan'}"></i></div>
    <div cursor class="mtcitem1"><i class="iconfont icon-lishijilu"></i><span>历史记录管理</span></div>
    <div cursor class="mtcitem2"><i class="iconfont icon-search"></i><span>切换搜索引擎</span></div>
    `;
  rightMenu(e, str, debounce(function ({ e, close }) {
    let item = _getTarget(e, '.mtcitem');
    if (item) {
      let _this = $(item);
      let flag = _this.attr('data-callword');
      if (flag === 'y') {
        _this.attr('data-callword', 'n');
        _this.html(`<i class="iconfont icon-tishi"></i><span>百度提示词</span><i class="iconfont icon-kaiguan-guan"></i>`);
        _setData('callword', 'n');
      } else {
        _this.attr('data-callword', 'y');
        _this.html(`<i class="iconfont icon-tishi"></i><span>百度提示词</span><i class="iconfont icon-kaiguan-kai1"></i>`);
        _setData('callword', 'y');
      }
    } else if (_getTarget(e, '.mtcitem1')) {
      close();
      openIframe('/history/', '历史记录管理');
    } else if (_getTarget(e, '.mtcitem2')) {
      let _close = close;
      let str = ``;
      _d.searchEngineData.forEach((v, i) => {
        let { name, icon } = v;
        str += `<div title="${name}" cursor class="mtcitem ${curSearchEngine.name == name ? 'active' : ''}" xi=${i}><img style="width: 40px;height: 40px;" src="${icon}"><span style="margin-left:10px;">${name}</span></div>`;
      });
      rightMenu(
        e,
        str,
        debounce(
          function ({ close, e }) {
            let _this = _getTarget(e, '.mtcitem');
            if (_this) {
              $searchLogo.find('.logo_box').removeClass('active');
              let xi = $(_this).attr('xi'),
                { icon, logo, searchlink } = _d.searchEngineData[xi];
              _loadingBar.start();
              close();
              _close();
              imgjz(
                logo,
                () => {
                  _loadingBar.end();
                  $searchLogo.find('img').attr({ src: logo });
                  $searchLogo.find('.logo_box').addClass('active');
                  $searchBoxBtn.attr({ src: icon });
                  $searchInpWrap.find('.inp_box input').attr({
                    placeholder: '输入搜索内容或网址',
                    action: searchlink,
                  });
                  curSearchEngine = _d.searchEngineData[xi];
                  _setData('searchengine', curSearchEngine);
                },
                () => {
                  _err();
                  _loadingBar.end();
                }
              );
            }
          },
          1000,
          true
        )
      );
    }
  }, 1000, true));
}, 1000, true));

//壁纸相关
//壁纸模糊处理
$pageBg.css({
  filter: `blur(${curFilterBg}px)`,
});
//随机背景
function bgInterval() {
  let _flag = dmwidth > 800 ? 'bg' : 'bgxs';
  $randomChangeBgBtn.addClass('open').find('img').addClass('open');
  _getAjax('/bg/randombg', { p: _flag }, true).then((result) => {
    if (parseInt(result.code) === 0) {
      let url = `${mediaURL}/bg/${_flag}/${result.data.link}`;
      imgjz(
        url,
        () => {
          $randomChangeBgBtn.removeClass('open').find('img').removeClass('open');
          $pageBg.css('background-image', `url(${url})`).attr('data-bg', result.data.link);
          _d.userInfo[_flag] = result.data.link;
          _postAjax(
            '/bg/updatabg',
            { flag: _flag, bg: result.data.link },
            true
          ).then((result) => {
            if (parseInt(result.code) === 0) {
              sendCommand({ type: 'updatedata', flag: 'userinfo' });
              return;
            }
          }).catch(err => { });
        },
        () => {
          _err('加载失败');
          $randomChangeBgBtn.removeClass('open').find('img').removeClass('open');
        }
      );
    }
  }).catch(err => {
    _err('加载错误');
    $randomChangeBgBtn.removeClass('open').find('img').removeClass('open');
  });
}

// 上传壁纸
function hdUpBg(files) {
  ~(async function fn(num) {
    if (num >= files.length) {
      bgpage = 1;
      bgxuanran(true);
      return;
    }
    let { name, size } = files[num];
    let pro = new UpProgress(name);
    if (!isImgFile(name)) {
      pro.fail();
      _err(`${name} 格式错误`);
      num++;
      fn(num);
      return;
    }
    if (size == 0) {
      pro.fail();
      _err(`${name} 为空文件`);
      num++;
      fn(num);
      return;
    }
    try {
      let iobj = await _imgSize(files[num]),
        iii = iobj.width < iobj.height ? 'bgxs' : 'bg';
      //文件切片
      let { chunks, count, suffix, HASH } = await fileSlice(
        files[num],
        (pes) => {
          pro.loading(pes);
        }
      );
      // 压缩图片
      let a = 400,
        b = 800;
      if (iii == 'bg') {
        (a = 600), (b = 400);
      }
      chunks.push({
        file: await compressionImg(files[num], a, b),
        filename: `_hello`,
      });
      ++count;
      let breakpointarr = (await _postAjax('/bg/breakpoint', { HASH })).data; //断点续传
      let isrepeat = await _postAjax('/bg/repeatfile', {
        name: `${HASH}.${suffix}`,
        flag: iii,
      }); //是否已经存在文件

      function compale(index) {
        pro.update(index / count);
      }

      if (parseInt(isrepeat.code) === 0) {
        pro.close('文件已存在');
        //文件已经存在操作
        num++;
        fn(num); //多文件递归上传
        return;
      }

      let index = breakpointarr.length;
      compale(index);

      ~(async function fnn(numm) {
        if (numm >= chunks.length) {
          let aa = await _postAjax('/bg/mergefile', {
            HASH,
            count,
            name: `${HASH}.${suffix}`,
            flag: iii,
          }); //合并切片
          if (parseInt(aa.code) === 0) {
            pro.close();
          } else {
            pro.fail();
          }
          num++;
          fn(num);
          return;
        }
        let { filename, file } = chunks[numm];
        if (breakpointarr.includes(filename)) {
          numm++;
          fnn(numm);
          return;
        }
        _upFile(`/bg/up?name=${filename}&HASH=${HASH}`, file).finally(() => {
          index++;
          compale(index);
          numm++;
          fnn(numm);
        });
      })(0);
    } catch (error) {
      pro.fail();
      num++;
      fn(num);
    }
  })(0);
}
$allBgWrap.on('click', '.upload_bg', function () {
  let input = document.createElement('input');

  input.type = 'file';
  input.multiple = 'multiple';
  input.accept = '.jpg,.jpeg,.png,.gif';

  input.style.display = 'none';
  document.body.appendChild(input);
  input.click();
  let $input = $(input);
  $input.change((e) => {
    let files = [...e.target.files];
    $input.remove();
    if (files.length == 0) return;
    hdUpBg(files);
  });
}).on('change', '.show_bg_size', function () {
  curBgPageSize = $(this).val();
  _setData('bgshowpage', curBgPageSize);
  bgpage = 1;
  bgxuanran(true);
}).on('click', '.b_close_btn', function () {
  $allBgWrap.stop().fadeOut(_speed, () => {
    $bgList.html('');
  });
});
~(function () {
  let allbg = $bgList[0];
  allbg.addEventListener('dragenter', function (e) {
    e.preventDefault();
  });
  allbg.addEventListener('dragover', function (e) {
    e.preventDefault();
  });
  allbg.addEventListener('drop', function (e) {
    e.preventDefault();
    var files = [...e.dataTransfer.files];
    if (files.length == 0) return;
    hdUpBg(files);
  });
})();
function bgitemmenu(e, url) {
  let str = '';
  str += `<div cursor class="mtcitem"><i class="iconfont icon-bizhishezhi"></i><span>设为壁纸</span></div>`;
  if (_d.userInfo.account === 'root') {
    str += `<div cursor class="mtcitem1"><i class="iconfont icon-cangpeitubiao_shanchu"></i><span>删除</span></div>`;
  }
  rightMenu(
    e,
    str,
    debounce(
      function ({ close, e }) {
        if (_getTarget(e, '.mtcitem')) {
          let bgflag = dmwidth > 800 ? 'bg' : 'bgxs',
            xx = `${mediaURL}/bg/${bgflag}/${url}`;
          $allBgWrap.stop().fadeOut(_speed, () => {
            $bgList.html('');
          });
          $randomChangeBgBtn.addClass('open').find('img').addClass('open');
          close();
          imgjz(
            xx,
            () => {
              $randomChangeBgBtn.removeClass('open').find('img').removeClass('open');
              $pageBg.css('background-image', `url(${xx})`).attr('data-bg', url);
            },
            () => {
              _err('加载失败');
              $randomChangeBgBtn.removeClass('open').find('img').removeClass('open');
            }
          );
          _d.userInfo[bgflag] = url;
          _postAjax('/bg/updatabg', { flag: bgflag, bg: url }, true).then(
            (result) => {
              if (parseInt(result.code) === 0) {
                sendCommand({ type: 'updatedata', flag: 'userinfo' });
                return;
              }
            }
          ).catch(err => { });
        } else if (_getTarget(e, '.mtcitem1')) {
          if (_d.userInfo.account === 'root') {
            alert('确认删除？', {
              confirm: true,
              handled: (m) => {
                if (m !== 'confirm') return;
                _postAjax('/bg/delbg', { url: url }).then((result) => {
                  if (parseInt(result.code) === 0) {
                    close();
                    bgxuanran();
                    return;
                  }
                }).catch(err => { });
              },
            });
          }
        }
      },
      1000,
      true
    )
  );
}

// 获取壁纸
var bgpage = 1;
function bgxuanrandefault() {
  let str = '';
  new Array(50).fill(null).forEach((v) => {
    str += `<div style="pointer-events: none;" class="bg_item">
            <div class="bg_img"></div>
            </div>`;
  });
  $bgList.html(str).scrollTop(0);
}
function bgxuanran(y) {
  if ($allBgWrap.is(':hidden')) return;
  if (y) {
    bgxuanrandefault();
  }
  let str = '',
    _flag = dmwidth > 800 ? 'bg' : 'bgxs',
    showpage = curBgPageSize;
  _getAjax('/bg/getbg', { flag: _flag, page: bgpage, showpage }).then(
    (result) => {
      if (parseInt(result.code) === 0) {
        if ($allBgWrap.is(':hidden')) return;
        let { total, totalPage, data, pageNo } = result.data;
        bgpage = pageNo;
        data.forEach((v) => {
          str += `<div class="bg_item" x="${v}">
                <div class="bg_img" data-src="${mediaURL}/bgys/${_flag}/${v}"></div>
                    </div>`;
        });
        if (totalPage > 1) {
          str += `<div class="bg_paging_box">`;
          str += pagination({ pageNo, pageSize: showpage, total });
          str += `</div > `;
        }
        $bgList.html(str);
        if (y) {
          $bgList.scrollTop(0);
        }
        bglazyImg($bgList, '.bg_item', '.bg_img');
        return;
      }
    }
  ).catch(err => { });
}
$bgList
  .on('contextmenu', '.bg_item', function (e) {
    e.preventDefault();
    let url = $(this).attr('x');
    bgitemmenu(e, url);
  })
  .on('click', '.bg_item', function () {
    let $this = $(this);
    let idx = $this.index();
    let arr = [];
    $bgList.find('.bg_item').each((idx, item) => {
      let $item = $(item);
      let u2 = $item.children('.bg_img').attr('data-src');
      arr.push({
        u2,
        u1: u2.replace('bgys', 'bg')
      });
    });
    imgPreview(arr, idx);
  })
  .on(
    'click',
    '.bg_paging_box',
    debounce(
      function (e) {
        let target = e.target,
          flag = target.getAttribute('data-flag');
        if (target.tagName === 'BUTTON') {
          if (flag === 'pre') {
            bgpage--;
            bgxuanran(true);
          } else if (flag === 'next') {
            bgpage++;
            bgxuanran(true);
          } else if (flag === 'go') {
            let val = document
              .querySelector('.bg_paging_box .paginationBox input')
              .value.trim();
            val = parseInt(val);
            if (isNaN(val)) return;
            bgpage = val;
            bgxuanran(true);
          } else if (flag === 'gotop') {
            $bgList.stop().animate(
              {
                scrollTop: 0,
              },
              _speed
            );
          } else {
            bgpage = +flag;
            bgxuanran(true);
          }
        }
      },
      500,
      true
    )
  )
  .on(
    'scroll',
    debounce(function () {
      bglazyImg($bgList, '.bg_item', '.bg_img');
    }, 100)
  );
if (isios()) {
  $bgList[0]._longPress('.bg_item', function (e) {
    let url = $(this).attr('x'),
      ev = e.changedTouches[0];
    bgitemmenu(ev, url);
  });
}

function bglazyImg($fel, sels, simg) {
  let $B = $fel.outerHeight();
  $fel.find(sels).each((i, v) => {
    let $v = $(v),
      $vB = $v.position().top,
      isload = $v.attr('isload');
    if ($vB <= $B && $vB >= -$v.outerHeight() && isload !== 'true') {
      $v.attr('isload', true);
      let $img = $v.find(simg);
      $img.css({
        'background-image': `url(${$img.attr('data-src')})`,
      });
      imgjz($img.attr('data-src'), () => {
        $img.stop().fadeIn(_speed);
      });
    }
  });
}
function openbgku() {
  $rightBox.removeClass('open');
  $rightMenuMask.stop().fadeOut(_speed);
  $allBgWrap.stop().slideDown(_speed, () => {
    bgxuanran(true);
  });
  setZindex($allBgWrap);
  $allBgWrap.find('.show_bg_size').val(curBgPageSize);
}

$randomChangeBgBtn.on('click', throttle(function () {
  bgInterval();
}, 1000)).on('contextmenu', function (e) {
  let url = $pageBg.attr('data-bg');
  if (_d.userInfo.account !== 'root' || !url) return;
  e.preventDefault();
  let str = `<div cursor class="mtcitem"><i class="iconfont icon-cangpeitubiao_shanchu"></i><span>删除壁纸</span></div>`;
  rightMenu(e, str, debounce(function ({ e, close }) {
    if (_getTarget(e, '.mtcitem')) {
      alert('确认删除？', {
        confirm: true,
        handled: (m) => {
          if (m !== 'confirm') return;
          _postAjax('/bg/delbg', { url }).then((result) => {
            if (parseInt(result.code) === 0) {
              close();
              bgInterval();
              return;
            }
          }).catch(err => { });
        },
      });
    }
  }, 1000, true));
});


// 时间日期
//{0}年{1}月{2}日 {3}时{4}分{5}秒 星期{6}
let musicflagnum = 0;
function showTime(time = Date.now()) {
  let arr = newDate('{0}-{1}-{2}-{3}-{4}-{5}-{6}', +time).split('-'),
    [year, month, date, hour, minute, second, strDate] = arr;
  // 报时
  if (
    (minute == 59 && second >= 30) ||
    (minute == 29 && second >= 30) ||
    (minute == 0 && second == 0) ||
    (minute == 30 && second == 0)
  ) {
    _success(`${hour}:${minute}:${second}`, true);
  }
  if (!$myAudio[0].paused) {
    //标题跑马灯
    let title = document.title,
      first = title.charAt(0),
      other = title.substring(1);
    document.title = other + first;
  }
  // 同步播放进度
  musicflagnum++;
  if (musicflagnum >= 10) {
    musicflagnum = 0;
    if (!$myAudio[0].paused && musicobj) {
      _postAjax('/player/updatemusicinfo', {
        history: 'n',
        lastplay: {
          id: musicobj.id,
          name: musicobj.name,
          artist: musicobj.artist,
          duration: musicobj.duration,
          mv: musicobj.mv
        },
        currentTime: $myAudio[0].currentTime,
        duration: musicobj.duration,
      },
        true
      ).then((result) => {
        if (result.code == 0) {
          sendCommand({ type: 'updatedata', flag: 'musicinfo' });
          return;
        }
      }).catch(err => { });
    }
  }
  _setTimeout(showTime, 1000);
}
showTime();

//音乐播放器
let actionLrcIndex = 0,
  randomplay = true,
  musicarr,
  musicarrjl,
  musicobj;
//播放模式切换
$lrcFootBtnWrap.on('click', '.random_play_btn', function () {
  if (!_d.music) return;
  if (_d.remoteState) {
    sendCommand({
      type: 'yc', hd: {
        type: 'playmode',
        data: randomplay,
      }
    });
  }
  var a;
  switch (randomplay) {
    case true:
      {
        randomplay = false;
        $myAudio.attr('loop', null);
        $lrcFootBtnWrap.find('.random_play_btn').attr('class', 'random_play_btn iconfont icon-suiji');
        a = '随机播放';
        musicarr = myShuffle(deepClone(_d.playingList));
      }
      break;
    case false:
      {
        randomplay = 1;
        $myAudio.attr('loop', 'loop');
        $lrcFootBtnWrap.find('.random_play_btn').attr('class', 'random_play_btn iconfont icon-ttpodicon');
        a = '单曲播放';
      }
      break;
    case 1:
      {
        randomplay = true;
        $myAudio.attr('loop', null);
        $lrcFootBtnWrap.find('.random_play_btn').attr('class', 'random_play_btn iconfont icon-shunxubofang');
        a = '顺序播放';
        musicarr = deepClone(_d.playingList);
      }
      break;
  }
  _success(a);
}).on('click', '.playing_list_btn', function (e) {
  defaultdqplaying();
  $playingListWrap.stop().fadeIn(100, () => {
    $pMusicListBox
      .stop()
      .slideDown(_speed, () => {
        let idx = _d.playingList.findIndex((v) => musicobj.id === v.id);
        if (idx >= 0) {
          playingPageNum = Math.ceil(idx / playingSize);
        };
        dqplaying();
        gaolianging(true);
      });
  });
}).on('click', '.prev_play_btn', function (e) {
  let index;
  if (!_d.music) return;
  if (musicarr.length == 0) {
    _err('播放列表为空')
    audioPause();
    return;
  }
  index = musicarr.findIndex(
    (x) => x.id === musicobj.id
  );
  index--;
  index < 0 ? (index = musicarr.length - 1) : null;
  musicPlay(musicarr[index]);
}).on('click', '.next_play', function (e) {
  $musicFootProgress.css({
    width: 0,
  });
  $lrcProgressBar.find('.pro2').width('0');
  let index;
  if (!_d.music) return;
  if (musicarr.length == 0) {
    _err('播放列表为空')
    audioPause();
    return;
  }
  index = musicarr.findIndex(
    (x) => x.id === musicobj.id
  );
  index++;
  index > musicarr.length - 1 ? (index = 0) : null;
  musicPlay(musicarr[index]);
}).on('click', '.play_btn', function () {
  if ($myAudio[0].paused) {
    audioPlay();
  } else {
    audioPause();
  }
});
$miniPlayer.on('click', '.play_btn', function () {
  $lrcFootBtnWrap.find('.play_btn').click();
}).on('click', '.next_btn', function () {
  $lrcFootBtnWrap.find('.next_play').click();
}).on('click', '.prev_btn', function () {
  $lrcFootBtnWrap.find('.prev_play_btn').click();
}).on('mouseenter', function () {
  if (!musicobj) return;
  $(this).attr('title', `${musicobj.artist} - ${musicobj.name}`);
}).on('click', '.to_max', function () {
  $rightBox.find('.show_music_player').click();
}).on('click', '.show_lrc', function () {
  $miniLrcWrap.fadeToggle(_speed)._isone = true;
  setZindex($miniLrcWrap);
});

// 暂停
function audioPause() {
  $myAudio[0].pause();
  document.title = _d.myTitle;
  $lrcProgressBar.find('.dolt').css('animation-play-state', 'paused');
  $playingSongLogo.css('animation-play-state', 'paused');
  $musicFootBox.find('.right_btns .play_btn').attr('class', 'play_btn iconfont icon-65zanting').css('animation', 'none');
  $lrcFootBtnWrap.find('.play_btn').attr('class', 'play_btn iconfont icon-65zanting').css('animation', 'none');
  $miniPlayer.find('.play_btn').attr('class', 'play_btn iconfont icon-65zanting').css('animation', 'none');
}
//播放音乐
function audioPlay() {
  videoPause();
  if (!$musicMvWrap.is(':hidden')) {
    $musicMvWrap.stop().fadeOut(_speed);
  }
  if (!musicobj) return;
  if (_d.remoteState) {
    //远程播放
    sendCommand({
      type: 'yc', hd: {
        type: 'play',
        data: {
          play: true,
          obj: musicobj,
        },
      }
    });
  } else {
    document.title = `\xa0\xa0\xa0♪正在播放：${musicobj.artist} - ${musicobj.name}`;
    $myAudio[0].play();
    if ($myAudio[0].buffered.length === 0) {
      //音乐没有缓冲
      musicInitial();
    }
    if ($lrcListWrap.find('.lrc_items').children().length === 0 || $myAudio[0]._rod.length === 0) {
      musiclrc();
    }
  }
  //保持播放速度
  $myAudio[0].playbackRate = curPlaySpeed[1];
}

function videoPause() {
  $myVideo[0].pause();
}
function videoPlay() {
  audioPause();
  $myVideo[0].play();
}
//歌词处理
function musiclrc() {
  if (!musicobj) return;
  _getAjax('/player/lrc', {
    artist: musicobj.artist,
    name: musicobj.name,
  }).then((result) => {
    if (parseInt(result.code) === 0) {
      let rod = result.data;
      rod = rod.map((item, idx) => {
        item.idx = idx;
        return item;
      });
      $myAudio[0]._rod = rod;
      let hasfy = !rod.every((item) => item.fy === '');
      if (hasfy) {
        $lrcMenuWrap.find('.lrc_translate_btn').stop().show(_speed);
      } else {
        $lrcMenuWrap.find('.lrc_translate_btn').stop().hide(_speed);
      }
      let str = '';
      rod.forEach((item) => {
        let { p, fy } = item;
        p = encodeHtml(p);
        fy = encodeHtml(fy);
        str += `<div>
          <p style="text-align:${lrcstatu.statu};font-size:${lrcstatu.size + 'px'
          };line-height:${lrcstatu.size + 6 + 'px'}" class="elrc">${p}</p>
          <p style="display: ${_getData('showfy') && hasfy ? 'block' : 'none'
          };text-align:${lrcstatu.statu};font-size:${lrcstatu.size - 2 + 'px'
          };line-height:${lrcstatu.size + 4 + 'px'}" class="lrcfy">${fy
          }</p></div>`;
      });
      $lrcListWrap.find('.lrc_items').html(str);
      handleLrc(true);
    }
  }).catch(err => { });
}
function handleLrc(y) {
  const $lrc = $lrcListWrap.find('.lrc_items');
  if ($lrc.children().length === 0 || $myAudio[0]._rod.length === 0) return;
  let $lrcdiv = $lrc.children('div'),
    $activediv = $lrcdiv.eq(actionLrcIndex),
    wH = $lrcListWrap.outerHeight(),
    lrcmtop = parseInt($lrc.css('marginTop')),
    mtop = lrcmtop - $activediv.position().top + wH * 0.4,
    move = mtop - lrcmtop;
  $activediv.addClass('active').siblings().removeClass('active');
  if (y) {
    $lrc.css({
      transition: '0s',
      'margin-top': mtop,
    });
  } else {
    $lrc.css({
      transition: 'margin-top 0.5s ease-out',
      'margin-top': mtop,
    });
  }
  $lrcdiv.addClass('open');
  $lrcdiv.each((_, item) => {
    let $item = $(item),
      ptop = $item.position().top,
      ph = $item.outerHeight(),
      a = ptop + move;
    if (y) {
      if (ptop > 10 && ptop < wH - ph - 10) {
        $item.removeClass('open');
      }
    } else {
      if (a > 10 && a < wH - ph - 10) {
        $item.removeClass('open');
      }
    }
  });
}

$lrcListWrap.on('click', function () {
  if ($lrcFootWrap._flag !== 'y') return;
  if (this._isop) {
    $lrcListWrap.css('opacity', 1);
    $lrcBg.removeClass('open');
    this._isop = false;
  } else {
    $lrcListWrap.css('opacity', 0);
    $lrcBg.addClass('open');
    this._isop = true;
  }
});
// 音乐事件
let upprog = throttle(function () {
  $lrcProgressBar.find('.current_time').text(tin($myAudio[0].currentTime));
  proTime($myAudio[0].currentTime / musicobj.duration, true);
}, 500);
let lrcCount = -1; //歌词计数
$myAudio
  .on('loadedmetadata', function () {
    //元数据加载完
  })
  .on('waiting', function () {
    //缺少数据加载效果
    if ($myAudio[0].paused) return;
    $lrcProgressBar.find('.dolt').css('animation', 'bgcolor .3s infinite linear alternate');
    $miniPlayer.find('.play_btn').attr('class', 'play_btn iconfont icon-65zanting').css('animation', 'fontcolor .5s infinite linear alternate');
    $lrcFootBtnWrap.find('.play_btn').attr('class', 'play_btn iconfont icon-65zanting').css('animation', 'fontcolor .5s infinite linear alternate');
    $musicFootBox.find('.right_btns .play_btn').attr('class', 'play_btn iconfont icon-65zanting').css('animation', 'fontcolor .5s infinite linear alternate');
  })
  .on(
    'playing',
    debounce(function () {
      //准备开始播放
      if ($myAudio[0].paused) return;
      $lrcProgressBar.find('.dolt').css('animation', 'bgcolor 2s infinite linear alternate');
      $lrcFootBtnWrap.find('.play_btn').attr('class', 'play_btn iconfont icon-zanting').css('animation', 'none');
      $miniPlayer.find('.play_btn').attr('class', 'play_btn iconfont icon-zanting').css('animation', 'none');
      $musicFootBox.find('.right_btns .play_btn').attr('class', 'play_btn iconfont icon-zanting').css('animation', 'none');
      $playingSongLogo.css({
        animation: 'turn 8s infinite linear',
      });
    }, 500)
  )
  .on('error', function () {
    _err('歌曲加载失败')
    audioPause();
  })
  .on('ended', function () {
    if (randomplay === 1) return;
    $lrcFootBtnWrap.find('.next_play').click();
  })
  .on('timeupdate', function () {
    let times = this.currentTime,
      timm = Math.round(times);
    upprog();
    if ($myAudio[0]._flag == timm) return;
    let rod = $myAudio[0]._rod || [];
    rod
      .filter((item) => item.t == timm)
      .forEach((item, i) => {
        lrcCount++;
        $myAudio[0]._flag = timm;
        _setTimeout(() => {
          actionLrcIndex = item.idx;
          lrcCount--;
          if ($musicLrcWrap.css('transform') === 'none') {
            if (lrcCount > 1) {
              handleLrc(true);
            } else {
              handleLrc();
            }
          }
          let activep = '',
            activep1 = '';
          activep = _getData('showfy')
            ? `${rod[actionLrcIndex].p} ${rod[actionLrcIndex].fy}`
            : rod[actionLrcIndex].p;
          if (actionLrcIndex + 1 === rod.length) {
            activep1 = '';
          } else {
            activep1 = _getData('showfy')
              ? `${rod[actionLrcIndex + 1].p} ${rod[actionLrcIndex + 1].fy}`
              : rod[actionLrcIndex + 1].p;
          }
          const $lb = $miniLrcWrap.find('.lrcbot');
          if ($lb.attr('x') === '0') {
            $lb.find('.one').text(activep).addClass('open');
            $lb.find('.tow').text(activep1).removeClass('open');
            $lb.attr('x', '1');
          } else {
            $lb.find('.one').text(activep1).removeClass('open');
            $lb.find('.tow').text(activep).addClass('open');
            $lb.attr('x', '0');
          }
        }, lrcCount * 100);
      });
  });

// 歌词设置样式和编辑
$editLrcWrap.find('textarea').on('keydown', function (e) {
  let key = e.key,
    ctrl = e.ctrlKey || e.metaKey;
  if (ctrl && key === 's') {
    $editLrcWrap.find('.save').click();
    e.preventDefault();
  }
});
$editLrcWrap.on('click', '.close', function () {
  $editLrcWrap.stop().fadeOut(_speed).find('textarea').val('');
}).on('click', '.back', function () {
  $editLrcWrap.stop().fadeOut(_speed).find('textarea').val('');
}).on('click', '.save', function () {
  let val = $editLrcWrap.find('textarea').val();
  if ($editLrcWrap._val === val || _d.userInfo.account != 'root') return;
  $editLrcWrap._val = val;
  _postAjax('/player/editlrc', {
    name: $editLrcWrap._mobj.name,
    artist: $editLrcWrap._mobj.artist,
    val,
  }).then((result) => {
    if (parseInt(result.code) === 0) {
      $editLrcWrap._val = val;
      _success(result.codeText);
      return;
    }
  }).catch(err => { });
});
// 进度条处理
function proTime(pes, y) {
  pes <= 0 ? (pes = 0) : pes >= 1 ? (pes = 1) : null;
  let val =
    (pro1.offsetWidth - dolt.offsetWidth) * pes + dolt.offsetWidth / 2 + 'px';
  let per = pes * 100 + '%';
  if (dolt.offsetWidth) {
    pro2.style.width = val;
  } else {
    pro2.style.width = per;
  }
  $musicFootProgress.css({
    width: per,
  });
  if (!y) {
    $myAudio[0].currentTime = pes * musicobj.duration;
  }
}
// 处理时间函数
function tin(time) {
  time = parseInt(time);
  if (time < 60) {
    return (time = `00:${time.toString().padStart(2, '0')}`);
  }
  var ot = parseInt(time / 60)
    .toString()
    .padStart(2, '0');
  var oh = parseInt(time % 60)
    .toString()
    .padStart(2, '0');
  return (time = `${ot}:${oh}`);
}

//远程播放
$lrcHead.on('click', '.remote_play', function (e) {
  if (_d.remoteState) {
    _d.remoteState = !_d.remoteState;
    _success('远程播放已关闭');
    $lrcListWrap.find('.lrc_items').html(``);
    $lrcHead.find('.remote_play').removeClass('red');
    sendCommand({
      type: 'yc', hd: {
        type: 'play',
        data: {
          play: false,
        },
      }
    });
  } else {
    if (!musicobj) return;
    _d.remoteState = !_d.remoteState;
    _success('远程播放已开启');
    $myAudio[0]._rod = [];
    $lrcListWrap.find('.lrc_items').html(
      `<div style="width:100%;font-size:18px;position: fixed;text-align: center;top: 45%;left:50%;transform: translateX(-50%);">远程播放中...</div>`
    );
    audioPause();
    $lrcHead.find('.remote_play').addClass('red');
    sendCommand({
      type: 'yc', hd: {
        type: 'play',
        data: {
          play: true,
          obj: musicobj,
        },
      }
    });
  }
}).on('click', '.close', function () {
  $musicLrcWrap.removeClass('active');
}).on('click', '.artist_name_text', function (e) {
  e.stopPropagation();
  $musicHeadWrap.find('.search_music_inp').val(this.innerText);
  _musicsea();
});
//歌单播放
function musicobjInit(obj) {
  musicobj = deepClone(obj);
  musicobj.pic = encodeURI(
    `${mediaURL}/music/${musicobj.artist}-${musicobj.name}.jpg`
  );
  musicobj.url = encodeURI(
    `${mediaURL}/music/${musicobj.artist}-${musicobj.name}.mp3`
  );
  musicobj.murl = encodeURI(
    `${mediaURL}/music/${musicobj.artist}-${musicobj.name}.mp4`
  );
}
function musicInitial() {
  actionLrcIndex = 0;
  $miniLrcWrap.find('.lrcbot').find('.one').text('');
  $miniLrcWrap.find('.lrcbot').find('.tow').text('');
  $myAudio[0]._rod = [];
  $lrcListWrap.find('.lrc_items').html(
    `<div style="width:100%;font-size:18px;position: fixed;text-align: center;top: 45%;left:50%;transform: translateX(-50%);">正在获取歌词...</div>`
  );
}
let playtimer = null;
function musicPlay(obj) {
  if (playtimer) {
    clearTimeout(playtimer);
    playtimer = null;
  }
  $myAudio[0].currentTime = 0; //时间进度归零
  musicobjInit(obj); //初始化音乐数据
  let a = `♪♪ ${musicobj.artist} - ${musicobj.name}`;
  $lrcProgressBar.find('.total_time').text(tin(musicobj.duration));
  _success(a);
  gaoliang(false); //列表定位
  gaolianging(false);
  $musicFootProgress.css({
    width: 0,
  });
  $lrcBg.addClass('lrcbgss'); //背景透明
  $musicPlayerBg.addClass('lrcbgss');
  $playingSongLogo.css('animation', 'none');
  csfz();
  musicInitial();
  toggleLrcMenuWrapBtnsState();
  playtimer = setTimeout(() => {
    playtimer = null;
    audioPlay();
    if (!_d.remoteState) {
      //未开启远程
      musicflagnum = 0; //初始化倒计时
      _postAjax('/player/updatemusicinfo', {
        //更新当前播放音乐
        history: 'y',
        lastplay: {
          id: musicobj.id,
          name: musicobj.name,
          artist: musicobj.artist,
          duration: musicobj.duration,
          mv: musicobj.mv
        },
        currentTime: $myAudio[0].currentTime,
        duration: obj.duration,
      },
        true
      ).then((result) => {
        if (result.code == 0) {
          sendCommand({ type: 'updatedata', flag: 'music' });
          if (!$musicPlayerBox.is(':hidden')) {
            if (
              _d.music &&
              _d.music.findIndex((item) => item.id === curSongListId) === 0 &&
              $msuicContentBox.find('.list_items_wrap').css('transform') === 'none'
            ) {
              renderMusicItem();
            }
          }
        }
      }).catch(err => { });
    }
  }, 2000);
}

// 播放列表相关
$musicFootBox.on('click', '.right_btns .playing_list_btn', function (e) {
  $lrcFootBtnWrap.find('.playing_list_btn').click();
}).on('click', '.right_btns .next_btn', function () {
  $lrcFootBtnWrap.find('.next_play').click();
}).on('click', '.right_btns .play_btn', function () {
  $lrcFootBtnWrap.find('.play_btn').click();
}).on('click', '.playing_song_info', function () {
  $playingSongLogo.click();
}).on('mouseover', '.playing_song_info', function () {
  var a = $(this).text();
  $(this).attr('title', a);
});

function defaultdqplaying() {
  let str = ``;
  new Array(50).fill(null).forEach(() => {
    str += `<li style="background-color:#e9e9e9;pointer-events: none;margin: 2px 0;" class = "song_item"></li>`;
  });
  $pMusicListBox.find('.p_foot').html(str);
}

//处理播放列表
let playingPageNum = 1;
let playingSize = 100;
function dqplaying() {
  if ($pMusicListBox.is(':hidden')) return;
  let scObj = _d.music[1].item.reduce((total, item) => {
    total[item.id] = 'y';
    return total;
  }, {});
  let str = '';
  if (!_d.playingList || _d.playingList.length == 0) {
    $pMusicListBox.find('.left').text(`正在播放(0)`);
    $pMusicListBox.find('.p_foot').html('<p style="padding: 20px 0;text-align: center;pointer-events: none;">空空如也</p>');
    return;
  }
  $pMusicListBox.find('.left').text(`正在播放(${_d.playingList.length})`);
  let playarr = _d.playingList.map((item, idx) => {
    item.idx = idx;
    return item;
  });
  let totalPage = Math.ceil(playarr.length / playingSize);
  playingPageNum < 1 ? playingPageNum = 1 : (playingPageNum > totalPage ? playingPageNum = totalPage : null);
  let arr = playarr.slice((playingPageNum - 1) * playingSize, playingPageNum * playingSize);
  arr.forEach((v) => {
    let { name, artist, mv, idx, duration, id } = v;
    let issc = scObj.hasOwnProperty(id);
    name = encodeHtml(name);
    artist = encodeHtml(artist);
    str += `<li class="song_item" cursor data-id="${id}" data-duration="${duration}" data-name="${name}" data-issc="${issc}" data-artist="${artist}" data-idx="${idx}" data-mv="${mv}">
          <div class="logo_wrap">
          <img class="logo" data-src=${encodeURI(`${mediaURL}/musicys/${artist}-${name}.jpg`)}>
          <img class="play_gif" src="/img/wave.gif">
          </div>
          <div class="song_info_wrap">
          <span class = "song_name">${name}</span>
          <span class="artist_name"><i class="artist_name_text">${artist}</i></span>
          </div>
          ${mv === 'y' ? `<div class="play_mv iconfont icon-shipin2"></div>` : ''}
          <div style="color:${issc ? '#fd4747' : '#ccc'}" class="like_hear iconfont ${issc ? 'icon-hear-full' : 'icon-hear'}"></div>
          <div cursor class="del iconfont icon-guanbi"></div>
        </li>`;
  });
  str += `<div style="padding:20px 0;text-align:center;" class="playing_list_paging">
      ${totalPage > 1 ? `<span style="${playingPageNum == 1 ? 'pointer-events: none;opacity:.4;' : ''}" cursor class="prev_page iconfont icon-prev"></span>
      <span cursor class="input_num" style="margin:0 30px">${playingPageNum}/${totalPage}</span>
      <span style="${playingPageNum == totalPage ? 'pointer-events: none;opacity:.4;' : ''}" cursor class="next_page iconfont icon-page-next"></span>` : ''}
    </div>`;
  $pMusicListBox.find('.p_foot').html(str);
  lazyImg($pMusicListBox.find('.p_foot'), '.song_item', '.logo', 1);
}

// 图片懒加载
function lazyImg($fel, sels, simg, y) {
  let $B = $fel.outerHeight();
  $fel.find(sels).each((i, v) => {
    let $v = $(v),
      $vB = $v.position().top,
      isload = $v.attr('isload');
    if ($vB <= $B && $vB >= -$v.outerHeight() && isload !== 'true') {
      $v.attr('isload', true);
      let $img = $v.find(simg),
        $imgbg = $img.parent();
      let u = $img.attr('data-src');
      $img.attr('src', u);
      imgjz(u, () => {
        if (y) {
          $img.css('display', 'block');
        } else {
          $img.stop().stop().fadeIn(_speed);
        }
        $imgbg.css('background', 'none');
      });
    }
  });
}
//清空播放列表
$pMusicListBox.on('click', '.clear_playing_list', function () {
  if (_d.playingList.length == 0) return;
  _postAjax('/player/updateplaying', { data: [] }).then(
    (result) => {
      if (parseInt(result.code) === 0) {
        sendCommand({ type: 'updatedata', flag: 'playinglist' });
        return;
      }
    }
  ).catch(err => { });
  _d.playingList = [];
  musicarr = [];
  dqplaying();
}).on('click', '.share_playing_list', debounce(function () {
  let arr = _d.playingList.map(item => ({ id: item.id }));
  _postAjax('/player/musicshare', arr).then((result) => {
    if (parseInt(result.code) === 0) {
      openIframe(`/sharelist`, '分享列表');
    }
  }).catch(err => { });
}, 1000, true));
//选择播放列表歌曲播放
$pMusicListBox.find('.p_foot').on('click', '.song_info_wrap', function () {
  let $this = $(this).parent();
  let obj = {
    name: $this.attr('data-name'),
    artist: $this.attr('data-artist'),
    mv: $this.attr('data-mv'),
    duration: $this.attr('data-duration'),
    id: $this.attr('data-id')
  };
  if (musicobj.id == obj.id) {
    $lrcFootBtnWrap.find('.play_btn').click();
    return;
  }
  musicPlay(obj);
}).on('click', '.artist_name_text', function (e) {
  e.stopPropagation();
  $musicHeadWrap.find('.search_music_inp').val(this.innerText);
  _musicsea();
}).on('click', '.play_mv', function (e) {
  e.stopPropagation();
  let $this = $(this).parent();
  let sobj = {
    name: $this.attr('data-name'),
    artist: $this.attr('data-artist'),
    mv: $this.attr('data-mv'),
    duration: $this.attr('data-duration'),
    id: $this.attr('data-id')
  };
  setZindex($musicMvWrap);
  musicMv(sobj);
}).on('click', '.prev_page', function () {
  playingPageNum--;
  $pMusicListBox.find('.p_foot')[0].scrollTop = 0;
  dqplaying();
  gaolianging();
}).on('click', '.next_page', function () {
  playingPageNum++;
  $pMusicListBox.find('.p_foot')[0].scrollTop = 0;
  dqplaying();
  gaolianging();
}).on('click', '.input_num', function (e) {
  let str = `
    <input autocomplete="off" value="${playingPageNum}" type="number">
    <button cursor class="mtcbtn">Go</button>`;
  rightMenu(e, str, debounce(function ({ e, inp, close }) {
    if (_getTarget(e, '.mtcbtn')) {
      let val = parseInt(inp[0]);
      if (isNaN(val)) return;
      close();
      playingPageNum = val;
      $pMusicListBox.find('.p_foot')[0].scrollTop = 0;
      dqplaying();
      gaolianging();
    }
  }, 1000, true))
}).on('click', '.del', function (e) {
  e.stopPropagation();
  let $this = $(this),
    mobj = {
      name: $this.parent().attr('data-name'),
      artist: $this.parent().attr('data-artist'),
      mv: $this.parent().attr('data-mv'),
      duration: $this.parent().attr('data-duration'),
      id: $this.parent().attr('data-id')
    };
  _d.playingList = _d.playingList.filter(
    (v) => v.id !== mobj.id
  );
  musicarr = musicarr.filter(
    (v) => v.id !== mobj.id
  );
  dqplaying();
  gaolianging();
  updatePlayingList();
}).on('scroll', debounce(function () {
  lazyImg($pMusicListBox.find('.p_foot'), '.song_item', '.logo');
}, 100)).on('click', '.logo_wrap', function () {
  $(this).parent().find('.song_info_wrap').click();
}).on('click', '.like_hear', function () {
  let $this = $(this).parent();
  let sobj = {
    name: $this.attr('data-name'),
    artist: $this.attr('data-artist'),
    mv: $this.attr('data-mv'),
    issc: $this.attr('data-issc'),
    duration: $this.attr('data-duration'),
    id: $this.attr('data-id')
  };
  if (sobj.issc == 'true') {
    _postAjax('/player/closecollectsong', {
      id: sobj.id,
      name: sobj.name,
      artist: sobj.artist,
      mv: sobj.mv,
      duration: sobj.duration
    }).then((result) => {
      if (parseInt(result.code) === 0) {
        sendCommand({ type: 'updatedata', flag: 'music' });
        renderMusicList();
        return;
      }
    }).catch(err => { });
  } else {
    _postAjax('/player/collectsong', {
      ar: [{
        id: sobj.id,
        name: sobj.name,
        artist: sobj.artist,
        mv: sobj.mv,
        duration: sobj.duration
      }]
    }).then((result) => {
      if (parseInt(result.code) === 0) {
        sendCommand({ type: 'updatedata', flag: 'music' });
        renderMusicList();
        return;
      }
    }).catch(err => { });
  }
});
const updatePlayingList = debounce(function () {
  _postAjax('/player/updateplaying', { data: _d.playingList }).then(
    (result) => {
      if (parseInt(result.code) === 0) {
        sendCommand({ type: 'updatedata', flag: 'playinglist' });
        return;
      }
    }
  ).catch(err => { });
}, 1000);
function gaolianging(a) {
  if ($pMusicListBox.is(':hidden') || !musicobj || !_d.playingList) return;
  let $song_item = $pMusicListBox.find('.p_foot').find('.song_item');
  $song_item.removeClass('active').find('.play_gif').removeClass('show');
  let y = Array.prototype.findIndex.call($song_item, (item) => item.dataset.id == musicobj.id);
  if (y < 0) return;
  let cur = $song_item.eq(y);
  if (a) {
    let sp = $pMusicListBox.find('.p_foot').scrollTop() + cur.position().top - 42;
    $pMusicListBox.find('.p_foot').scrollTop(sp);
  }
  cur.addClass('active').find('.play_gif').addClass('show');
}

//隐藏播放列表
$playingListWrap.on('click', function (e) {
  if (_getTarget(e, '.playing_list_mask', 1)) {
    $pMusicListBox.find('.p_foot').html('');
    $pMusicListBox
      .stop()
      .slideUp(_speed, () => {
        $playingListWrap.stop().fadeOut(100);
      });
  }
});
// 音乐返回按钮
$musicHeadWrap.on('click', '.back', function (e) {
  if (!$searchMusicWrap.is(':hidden')) {
    $searchMusicWrap.stop().fadeOut(_speed);
    $musicHeadWrap.find('.search_music_inp').val('');
  } else if ($musicLrcWrap.css('transform') === 'none') {
    $lrcHead.find('.close').click();
  } else if ($msuicContentBox.find('.list_items_wrap').css('transform') === 'none') {
    $songListWrap.removeClass('open');
    $msuicContentBox.find('.list_items_wrap').removeClass('open');
    _setTimeout(() => {
      $songItemsBox.html('');
    }, 800);
    $musicHeadWrap.find('.song_list_name').css('opacity', 0);
  } else if (!$musicPlayerBox.is(':hidden')) {
    if (dmwidth < 800) {
      $musicPlayerBox.stop().fadeOut(_speed, () => {
        $songItemsBox.html('');
        $songListUl.html('');
      });
    } else {
      $musicHeadWrap.find('.hide').click();
    }
  }
}).on('click', '.close', function (e) {
  if (dmwidth > 800) {
    $musicPlayerBox.stop().fadeOut(_speed, () => {
      $songItemsBox.html('');
      $songListUl.html('');
    });
  }
  $musicMvWrap.stop().fadeOut(_speed);
  $miniPlayer.stop().hide(_speed);
  $miniLrcWrap.stop().fadeOut(_speed);
  audioPause();
  videoPause();
}).on('click', '.hide', function () {
  if (dmwidth > 800) {
    $miniPlayer.stop().show(_speed);
    setZindex($miniPlayer);
    $musicPlayerBox.stop().fadeOut(_speed, () => {
      $songItemsBox.html('');
      $songListUl.html('');
    });
    if (!$miniLrcWrap._isone) {
      $miniLrcWrap.stop().fadeIn(_speed);
      setZindex($miniLrcWrap);
    }
  }
}).on('input', '.search_music_inp', function () {
  let a = $musicHeadWrap.find('.search_music_inp').val().trim();
  if (a === '') {
    $searchMusicWrap.stop().fadeOut(_speed, () => {
      $searchMusicWrap.find('ul').html('');
    });
  } else {
    _musicsea();
  }
}).on('click', '.volume', function (e) {
  _progressBar(
    curPlayVol,
    throttle(function (per, type) {
      curPlayVol = per;
      vobellm();
      if (type === 'up') {
        if (_d.remoteState) {
          sendCommand({
            type: 'yc', hd: {
              type: 'vol',
              data: curPlayVol,
            }
          });
        }
      }
    }, 500)
  );
});

//层级处理
$document.on('click', function (e) {
  if (_getTarget(e, '.search-box')) {
    setZindex($searchBoxMask);
  } else if (_getTarget(e, '.music_palyer_box')) {
    setZindex($musicPlayerBox);
  } else if (_getTarget(e, '.mini_player')) {
    setZindex($miniPlayer);
  } else if (_getTarget(e, '.mini_lrc_wrap')) {
    setZindex($miniLrcWrap);
  } else if (_getTarget(e, '.music_mv_wrap')) {
    setZindex($musicMvWrap);
  } else if (_getTarget(e, '.log_wrap')) {
    setZindex($logWrap);
  } else if (_getTarget(e, '.chat_room_wrap')) {
    setZindex($chatRoomWrap);
  } else if (_getTarget(e, '.edit_lrc_wrap')) {
    setZindex($editLrcWrap);
  } else if (_getTarget(e, '.all_bg_wrap')) {
    setZindex($allBgWrap);
  } else if (_getTarget(e, '.userinfobox')) {
    setZindex($userInfoWrap);
  }
  if (!_getTarget(e, '.search_inp_wrap')) {
    let val = $searchInpWrap.find('.inp_box input').val().trim();
    if (val !== '') {
      saveSearchText(val);
    }
    $searchInpWrap.find('.inp_box input').val('');
    $searchInpWrap.find('.search_list_box').stop().fadeOut(_speed);
  }
});

let searchMusicList = [];
$searchMusicWrap.find('ul').on('click', '.song_info_wrap', function (e) {
  let $this = $(this).parent();
  let obj = {
    name: $this.attr('data-name'),
    artist: $this.attr('data-artist'),
    mv: $this.attr('data-mv'),
    duration: $this.attr('data-duration'),
    id: $this.attr('data-id')
  };
  if (_d.playingList.length !== searchMusicList.length
    || !searchMusicList.every((item, idx) => item.id === _d.playingList[idx].id && item.name === _d.playingList[idx].name && item.artist === _d.playingList[idx].artist)) {
    _postAjax('/player/updateplaying', { data: searchMusicList }).then((result) => {
      if (parseInt(result.code) === 0) {
        sendCommand({ type: 'updatedata', flag: 'playinglist' });
        return;
      }
    }
    ).catch(err => { });
    musicarr =
      randomplay === false
        ? myShuffle(deepClone(searchMusicList))
        : deepClone(searchMusicList);
    _d.playingList = deepClone(searchMusicList);
  };

  if (musicobj.id == obj.id) {
    $lrcFootBtnWrap.find('.play_btn').click();
    return;
  }
  musicPlay(obj);
}).on('click', '.set_menu', function (e) {
  let $this = $(this).parent();
  let sobj = {
    name: $this.attr('data-name'),
    artist: $this.attr('data-artist'),
    mv: $this.attr('data-mv'),
    duration: $this.attr('data-duration'),
    id: $this.attr('data-id'),
    pcount: $this.attr('data-pcount'),
    ccount: $this.attr('data-ccount')
  };
  let str = '';
  str += `<div class="mtcitem9" style="justify-content: center;font-size: 14px;color: #5a5a5a;">收藏(${sobj.ccount}) 播放(${sobj.pcount})</div>
          <div cursor class="mtcitem"><i class="iconfont icon-fenxiang_2"></i><span>分享歌曲</span></div>
          <div cursor class="mtcitem5"><i class="iconfont icon-fuzhi"></i><span>复制信息</span></div>
          <div cursor class="mtcitem7"><i class="iconfont icon-bianji"></i><span>编辑歌词</span></div>
          <div cursor class="mtcitem8"><i class="iconfont icon-tupian"></i><span>封面</span></div>
          <div cursor class="mtcitem3"><i class="iconfont icon-icon-test"></i><span>添加到</span></div>`;
  if (_d.userInfo.account === 'root') {
    str += `<div cursor class="mtcitem6"><i class="iconfont icon-bianji"></i><span>编辑歌曲信息</span></div>
    <div cursor class="mtcitem1"><i class="iconfont icon-cangpeitubiao_shanchu"></i><span>删除</span></div>`;
  };
  rightMenu(
    e,
    str,
    debounce(
      function ({ close, e }) {
        if (_getTarget(e, '.mtcitem')) {
          close();
          _postAjax('/player/musicshare', [{
            id: sobj.id
          }]).then((result) => {
            if (parseInt(result.code) === 0) {
              openIframe(`/sharelist`, '分享列表');
            }
          }).catch(err => { });
        } else if (_getTarget(e, '.mtcitem1')) {
          alert(`确认删除：${sobj.artist}-${sobj.name}？`, {
            confirm: true,
            handled: (m) => {
              if (m !== 'confirm') return;
              _postAjax('/player/delsong', {
                id: 'all', ar: [sobj]
              }).then((result) => {
                if (parseInt(result.code) === 0) {
                  _success();
                  close();
                  sendCommand({ type: 'updatedata', flag: 'music' });
                  _musicsea();
                  renderMusicList();
                  return;
                }
              }).catch(err => { });
            },
          });
        } else if (_getTarget(e, '.mtcitem3')) {
          let str = '';
          _d.music.forEach((v, i) => {
            if (i > 2) {
              let name = encodeHtml(v.name),
                pic = !/^\/img/.test(v.pic) ? `${mediaURL}${v.pic}` : v.pic;
              str += `<div data-name="${name}" cursor class="mtcitem" data-id="${v.id}"><img style="width: 40px;height: 40px;" src="${pic}"><span style="margin-left:10px;">${name}</span></div>`;
            }
          });
          if (str == '') {
            _err('没有可选歌单')
            return;
          }
          rightMenu(
            e,
            str,
            debounce(
              function ({ close, e }) {
                let _this = _getTarget(e, '.mtcitem');
                if (_this) {
                  let $this = $(_this),
                    tid = $this.attr('data-id'),
                    listname = $this.attr('data-name');
                  alert(`确认添加到 ${listname}?`, {
                    confirm: true,
                    handled: (m) => {
                      if (m !== 'confirm') return;
                      _postAjax('/player/songtolist', {
                        id: 'all',
                        tid,
                        ar: [sobj],
                      }).then((result) => {
                        if (parseInt(result.code) === 0) {
                          close();
                          _success();
                          sendCommand({
                            type: 'updatedata',
                            flag: 'music',
                          });
                          renderMusicList();
                          return;
                        }
                      }).catch(err => { });
                    },
                  });
                }
              },
              1000,
              true
            )
          );
        } else if (_getTarget(e, '.mtcitem5')) {
          close();
          copyText(`${sobj.artist}-${sobj.name}`);
        } else if (_getTarget(e, '.mtcitem6')) {
          if (_d.userInfo.account != 'root') return;
          let str = `
          <input autocomplete="off" placeholder="歌手名" value="${encodeHtml(sobj.artist)}" >
          <input autocomplete="off" placeholder="歌曲名" value="${encodeHtml(sobj.name)}">
            <button cursor class="mtcbtn">提交</button>`;
          rightMenu(e, str, debounce(function ({ e, close, inp }) {
            if (_getTarget(e, '.mtcbtn')) {
              let newName = inp[1];
              let newArtist = inp[0];
              if (newName + newArtist == sobj.name + sobj.artist) return;
              _postAjax('/player/editsong', {
                id: sobj.id,
                oldObj: {
                  name: sobj.name,
                  artist: sobj.artist
                }, newObj: {
                  name: newName,
                  artist: newArtist
                }
              }).then(res => {
                if (res.code == 0) {
                  sobj.name = newName;
                  sobj.artist = newArtist;
                  close();
                  sendCommand({ type: 'updatedata', flag: 'music' });
                  _musicsea();
                  renderMusicItem();

                }
              }).catch(err => { });
            }
          }, 1000, true));
        } else if (_getTarget(e, '.mtcitem7')) {
          if (_d.userInfo.account !== 'root') {
            $editLrcWrap.find('.save').remove();
          }
          $editLrcWrap.find('.song_info_text').text(`${sobj.artist}-${sobj.name}`);
          setZindex($editLrcWrap);
          $editLrcWrap.stop().fadeIn(_speed, () => {
            $editLrcWrap.css('display', 'flex').find('textarea').val('');
            $editLrcWrap._mobj = deepClone(sobj);
            _getAjax('/player/getlrc', {
              name: sobj.name,
              artist: sobj.artist,
            }).then((result) => {
              if (parseInt(result.code) === 0) {
                close();
                $editLrcWrap._val = result.data;
                $editLrcWrap.find('textarea').val(result.data);
                return;
              }
            }).catch(err => { });
          });
        } else if (_getTarget(e, '.mtcitem8')) {
          close();
          imgPreview([{
            u1: `${mediaURL}/music/${sobj.artist}-${sobj.name}.jpg`,
            u2: `${mediaURL}/musicys/${sobj.artist}-${sobj.name}.jpg`
          }]);
        };
      },
      1000,
      true
    )
  );
}).on('click', '.add_palying_list', function () {
  let $this = $(this).parent();
  let mobj = {
    name: $this.attr('data-name'),
    artist: $this.attr('data-artist'),
    mv: $this.attr('data-mv'),
    duration: $this.attr('data-duration'),
    id: $this.attr('data-id')
  };
  _d.playingList.push(mobj);
  musicarr.push(mobj);
  _d.playingList.reverse();
  musicarr.reverse();
  _d.playingList = qucong(_d.playingList);
  musicarr = qucong(musicarr);
  _d.playingList.reverse();
  musicarr.reverse();
  _success('添加成功');
  updatePlayingList();
}).on('click', '.like_hear', function () {
  let $this = $(this).parent();
  let issc = $this.attr('data-issc');
  let sobj = {
    name: $this.attr('data-name'),
    artist: $this.attr('data-artist'),
    mv: $this.attr('data-mv'),
    duration: $this.attr('data-duration'),
    id: $this.attr('data-id')
  };
  if (issc == 'true') {
    _postAjax('/player/closecollectsong', sobj).then((result) => {
      if (parseInt(result.code) === 0) {
        sendCommand({ type: 'updatedata', flag: 'music' });
        _musicsea();
        renderMusicList();
        return;
      }
    }).catch(err => { });
  } else {
    _postAjax('/player/collectsong', {
      ar: [sobj]
    }).then((result) => {
      if (parseInt(result.code) === 0) {
        sendCommand({ type: 'updatedata', flag: 'music' });
        _musicsea();
        renderMusicList();
        return;
      }
    }).catch(err => { });
  }
}).on('click', '.play_mv', function (e) {
  e.stopPropagation();
  let $this = $(this).parent();
  let sobj = {
    name: $this.attr('data-name'),
    artist: $this.attr('data-artist'),
    mv: $this.attr('data-mv'),
    duration: $this.attr('data-duration'),
    id: $this.attr('data-id')
  };
  setZindex($musicMvWrap);
  if (_d.playingList.length !== searchMusicList.length
    || !searchMusicList.every((item, idx) => item.id === _d.playingList[idx].id && item.name === _d.playingList[idx].name && item.artist === _d.playingList[idx].artist)) {
    _postAjax('/player/updateplaying', { data: searchMusicList }).then(
      (result) => {
        if (parseInt(result.code) === 0) {
          sendCommand({ type: 'updatedata', flag: 'playinglist' });
          return;
        }
      }
    ).catch(err => { });
    musicarr =
      randomplay === false
        ? myShuffle(deepClone(searchMusicList))
        : deepClone(searchMusicList);
    _d.playingList = deepClone(searchMusicList);
  };
  musicMv(sobj);
}).on('scroll', debounce(function () {
  lazyImg($searchMusicWrap.find('ul'), '.song_item', '.logo');
}, 100)).on('click', '.logo_wrap', function () {
  $(this).parent().find('.song_info_wrap').click();
});
let _musicsea = debounce(musicsea, 1000);
function musicsea() {
  let a = $musicHeadWrap.find('.search_music_inp').val().trim();
  if (a !== '') {
    $searchMusicWrap.stop().fadeIn(_speed);
    _getAjax('/player/search', { a }).then((result) => {
      if (parseInt(result.code) === 0) {
        if ($musicPlayerBox.is(':hidden')) return;
        let scObj = _d.music[1].item.reduce((total, item) => {
          total[item.id] = 'y';
          return total;
        }, {});
        let str = '';
        let arr = result.data;
        searchMusicList = arr;
        if (arr.length > 0) {
          arr.forEach((v) => {
            let { artist, name, mv, duration, id, collect_count, play_count } = v;
            let issc = scObj.hasOwnProperty(id);
            artist = encodeHtml(artist);
            name = encodeHtml(name);
            str += `<li class="song_item" data-pcount="${play_count}" data-ccount="${collect_count}" data-id="${id}" data-duration="${duration}" data-name="${name}" data-issc="${issc}" data-artist="${artist}" data-mv="${mv}" cursor>
                    <div class="add_palying_list iconfont icon-icon-test"></div>
                    <div class="logo_wrap">
                    <img class="logo" data-src=${encodeURI(`${mediaURL}/musicys/${artist}-${name}.jpg`)}>
                    </div>
                    <div class="song_info_wrap">
                      <span class="song_name">${name}</span>
                      <span class="artist_name">${artist}</span>
                    </div>
                    ${mv === 'y' ? `<div class="play_mv iconfont icon-shipin2"></div>` : ''}
                    <div style="color:${issc ? '#fd4747' : '#ccc'};" class="like_hear iconfont ${issc ? 'icon-hear-full' : 'icon-hear'}"></div>
                    <div class="set_menu iconfont icon-icon"></div>
                  </li>`;
          });
          $searchMusicWrap.find('ul').html(str).scrollTop(0);
          lazyImg($searchMusicWrap.find('ul'), '.song_item', '.logo', 1);
        } else {
          $searchMusicWrap.find('ul').html(
            '<p style="padding: 20px 0;text-align: center;pointer-events: none;">没有找到歌曲</p>'
          );
        }
        return;
      }
    }).catch(err => { });
  }
}
$searchMusicWrap.on('click', function (e) {
  if (_getTarget(e, '.search_music_wrap', 1)) {
    $searchMusicWrap.stop().fadeOut(_speed, () => {
      $searchMusicWrap.find('ul').html('');
      $musicHeadWrap.find('.search_music_inp').val('');
    });
  }
});


$lrcHead.find('.song_name').on('mouseover', function () {
  var a = $(this).text();
  $(this).attr('title', a);
});
$lrcHead.find('.artist_name').on('mouseover', function () {
  var a = $(this).text();
  $(this).attr('title', a);
});

//进度条
var probox = $lrcProgressBar.find('.probox')[0],
  pro1 = $lrcProgressBar.find('.pro1')[0],
  pro2 = $lrcProgressBar.find('.pro2')[0],
  dolt = $lrcProgressBar.find('.dolt')[0],
  mmlist = $musicPlayerBox[0];
probox.addEventListener('touchstart', function (e) {
  $lrcProgressBar.find('.dolt').addClass('open');
  $lrcProgressBar.find('.pro1').addClass('open');
  let pes;
  mmove(e);
  function mmove(e) {
    e.preventDefault();
    let ev = e.targetTouches[0];
    let a = pro1.offsetLeft + mmlist.offsetLeft - $musicPlayerBox.width() / 2;
    pes =
      (ev.clientX - a - dolt.offsetWidth / 2) /
      (pro1.offsetWidth - dolt.offsetWidth);
    proTime(pes);
  }
  function mend(e) {
    if (_d.remoteState) {
      sendCommand({
        type: 'yc', hd: {
          type: 'progress',
          data: pes,
        }
      });
    }
    $lrcProgressBar.find('.dolt').removeClass('open');
    $lrcProgressBar.find('.pro1').removeClass('open');
    probox.removeEventListener('touchmove', mmove);
    probox.removeEventListener('touchend', mend);
  }
  probox.addEventListener('touchmove', mmove);
  probox.addEventListener('touchend', mend);
});

probox.addEventListener('mousedown', function (e) {
  let pes;
  mmove(e);
  function mmove(e) {
    e.preventDefault();
    let a = pro1.offsetLeft + mmlist.offsetLeft - $musicPlayerBox.width() / 2;
    pes =
      (e.clientX - a - dolt.offsetWidth / 2) /
      (pro1.offsetWidth - dolt.offsetWidth);
    proTime(pes);
  }
  function mup() {
    if (_d.remoteState) {
      sendCommand({
        type: 'yc', hd: {
          type: 'progress',
          data: pes,
        }
      });
    }
    document.removeEventListener('mousemove', mmove);
    document.removeEventListener('mouseup', mup);
  }
  document.addEventListener('mousemove', mmove);
  document.addEventListener('mouseup', mup);
});

let remoteVol = debounce(function () {
  sendCommand({
    type: 'yc', hd: {
      type: 'vol',
      data: curPlayVol,
    }
  });
}, 500)
// 主页全局键盘事件
document.onkeydown = function (e) {
  let key = e.key,
    ctrl = e.ctrlKey || e.metaKey;
  let isFocus = $('input').is(':focus') || $('textarea').is(':focus');
  if (!isFocus && document.activeElement.className !== 'c_text_msg') {
    if (ctrl && key === 'ArrowLeft') $lrcFootBtnWrap.find('.prev_play_btn').click(); // 上一曲
    if (ctrl && key === 'ArrowRight') $lrcFootBtnWrap.find('.next_play').click(); // 下一曲
    //音量+
    if (ctrl && key === 'ArrowUp') {
      e.preventDefault();
      curPlayVol += 0.1;
      if (curPlayVol >= 1) {
        curPlayVol = 1;
      }
      vobellm();
      if (_d.remoteState) {
        remoteVol()
      }
      _success(parseInt(curPlayVol * 100) + '%', true);
    }
    //音量-
    if (ctrl && key === 'ArrowDown') {
      e.preventDefault();
      curPlayVol -= 0.1;
      if (curPlayVol <= 0) {
        curPlayVol = 0;
      }
      vobellm();
      if (_d.remoteState) {
        remoteVol();
      }
      _success(parseInt(curPlayVol * 100) + '%', true);
    }
    //暂停/播放
    if (key === ' ') {
      if (!_d.music) return;
      if ($musicMvWrap.is(':hidden')) {
        $lrcFootBtnWrap.find('.play_btn').click();
      } else {
        if ($myVideo[0].paused) {
          videoPlay();
        } else {
          videoPause();
        }
      }
    }
    // 迷你切换
    if (key === 'm') {
      if ($musicPlayerBox.is(':hidden')) {
        $rightBox.find('.show_music_player').click();
      } else {
        $musicHeadWrap.find('.hide').click();
      }
    }
    // 歌词
    if (key === 'l') {
      $miniPlayer.find('.show_lrc').click();
    }
    // 书签
    if (key === 's' && !ctrl) {
      if ($searchBoxMask.is(':hidden')) {
        $searchBoxBtn.click();
      }
    }
    //搜索聚焦
    if (key === 'f') {
      if (!$searchBoxMask.is(':hidden')) {
        if (!$searchInpWrap.find('.inp_box input').is(':focus')) {
          e.preventDefault();
        }
        $searchInpWrap.find('.inp_box input').focus();
      }
    }
    // 跳到历史记录
    if (key === 'h') {
      openIframe('/history', '历史记录管理');
    }
    // 跳到笔记
    if (key === 'n') {
      $rightBox.find('.show_note').click();
    }
    // 侧边栏
    if (key === 'a' && !ctrl) {
      $asideBtn.click();
    }
    // 播放模式
    if (key === 'r') {
      $lrcFootBtnWrap.find('.random_play_btn').click();
    }
    // 停止歌曲并关闭所有音乐窗口
    if (key === 'c' && !ctrl) {
      $musicHeadWrap.find('.close').click();
    }
  }
};

if (curPlayVol <= 0) {
  $musicHeadWrap.find('.volume').attr('class', 'volume iconfont icon-24gl-volumeCross');
}
//音量
$myAudio[0].volume = curPlayVol;
$myVideo[0].volume = curPlayVol;
function vobellm() {
  $myAudio[0].volume = curPlayVol;
  $myVideo[0].volume = curPlayVol;
  _setData('lastvol', curPlayVol);
  if (curPlayVol <= 0) {
    $musicHeadWrap.find('.volume').attr('class', 'volume iconfont icon-24gl-volumeCross');
  } else {
    $musicHeadWrap.find('.volume').attr('class', 'volume iconfont icon-24gl-volumeHigh');
  }
}

//歌曲封面
$playingSongLogo.on('click', function () {
  $musicLrcWrap.addClass('active');
  handleLrc();
  $lrcHead.find('.close').stop().fadeIn(_speed);
});
function toggleLrcMenuWrapBtnsState() {
  if (musicobj && musicobj.mv == 'y') {
    $lrcMenuWrap.find('.play_mv_btn').stop().show(_speed);
  } else {
    $lrcMenuWrap.find('.play_mv_btn').stop().hide(_speed);
  }
  if (_d.music && _d.music[1].item.some((v) => v.id === musicobj.id)) {
    $lrcMenuWrap.find('.collect_song_btn').attr('class', 'collect_song_btn iconfont icon-hear-full active');
  } else {
    $lrcMenuWrap.find('.collect_song_btn').attr('class', 'collect_song_btn iconfont icon-hear');
  }
}
//歌单列表
(function () {
  let fromDom = null;
  $songListWrap
    .on('dragstart', '.song_list_item', function (e) {
      fromDom = this;
    })
    .on('drop', '.song_list_item', function (e) {
      let a = $(fromDom).index(),
        b = $(this).index(),
        fromId = $(fromDom).attr('data-id'),
        toId = $(this).attr('data-id');
      if (fromDom) {
        if (a > 2 && b > 2 && a !== b) {
          _postAjax('/player/listmove', { fromId, toId }).then((result) => {
            if (parseInt(result.code) === 0) {
              sendCommand({ type: 'updatedata', flag: 'music' });
              renderMusicList();
              return;
            }
          }).catch(err => { });
        }
        fromDom = null;
      }
    })
    .on('dragover', '.song_list_item', function (e) {
      e.preventDefault();
    });
})();
//处理歌曲列表
function renderMusicList() {
  if ($musicPlayerBox.is(':hidden')) return;
  let a = $songListUl.children();
  if (a.length === 0) {
    rendermusiclistdefault();
  }
  let id = curSongListId;
  _getAjax('/player/getmusicinfo').then((result) => {
    if (parseInt(result.code) === 0) {
      if ($musicPlayerBox.is(':hidden')) return;
      if ($myAudio[0].paused) {
        let _musicinfo = result.data;
        let { currentTime = 0, duration = 0, lastplay } = _musicinfo;
        musicobjInit(lastplay);
        csfz();
        $myAudio[0].currentTime = currentTime;
        upprog();
        $lrcProgressBar.find('.total_time').text(tin(duration));
      }
      _getAjax('/player/getlist', { id }).then((result) => {
        if (parseInt(result.code) === 0) {
          _d.music = result.data;
          toggleLrcMenuWrapBtnsState();
          dqplaying();
          gaolianging();
          rendermusiclist();
          return;
        }
      }).catch(err => { });
    }
  }).catch(err => { });
  if (!_d.playingList) {
    _getAjax('/player/getplaying').then((result) => {
      if (parseInt(result.code) === 0) {
        _d.playingList = result.data;
        musicarr = deepClone(_d.playingList);
        return;
      }
    }).catch(err => { });
  }
}
function rendermusiclistdefault() {
  let str = '';
  let color = 'rgb(0 0 0 / 10%)';
  new Array(50).fill(null).forEach((item) => {
    str += `<li style="pointer-events: none;" class="song_list_item">
      <div class="list_logo" style="background-color:${color};background-image:none;box-shadow: none;"></div>
      </li>`;
  });
  $songListUl.html(str);
}
let curSongListId = null;
function rendermusiclist() {
  if ($musicPlayerBox.is(':hidden')) return;
  let arr = _d.music,
    str = '';
  arr.forEach((item) => {
    let name = encodeHtml(item.name);
    let des = item.des ? `-${encodeHtml(item.des)}` : '';
    let pic = !/^\/img/.test(item.pic) ? `${mediaURL}${item.pic}` : item.pic;
    str += `<li class="song_list_item" title="${name}${des}" data-id="${item.id}" cursor draggable="true">
      <div class="list_logo">
        <img class="logo" data-src="${pic}"></div>
        <span>${name}</sapn>
        </li>`;
  });
  str += `<li cursor class="add_song_list"><img src="/img/tianjia.png"></li>`;
  $songListUl.html(str);
  lazyImg($songListWrap, '.song_list_item', 'img', true);
  if (!curSongListId) {
    curSongListId = arr[0].id;
  }
  if ($msuicContentBox.find('.list_items_wrap').css('transform') === 'none') {
    rendermusicitem();
  }
}
let musicPageNum = 1;
function renderMusicItem() {
  if ($musicPlayerBox.is(':hidden') || $msuicContentBox.find('.list_items_wrap').css('transform') !== 'none') return;
  let id = curSongListId;
  _getAjax('/player/getlist', { id }).then((result) => {
    if (parseInt(result.code) === 0) {
      if ($musicPlayerBox.is(':hidden') || $msuicContentBox.find('.list_items_wrap').css('transform') !== 'none')
        return;
      _d.music = result.data;
      rendermusicitem();
      return;
    }
  }).catch(err => { });
}
function rendermusicitemdefault() {
  let str = '';
  let color = 'rgb(0 0 0 / 10%)';
  str += `<div style="pointer-events: none;" class="items_list_top_wrap">
        <div style="background-color:${color};background-image:none" class="song_list_cover"></div>
        <div style="background-color:${color}; height: 40px;width: 100px;margin: 30px;" class="song_list_info"></div>
      </div>
      <div style="pointer-events: none; height: 40px;width: 100%;box-sizing: border-box;padding: 0 5px;overflow:hidden;">
          <div style="background-color:${color};height: 40px;width:50%;float:left;"></div>
          <div style="background-color:${color};height: 40px;width:30%;float:right;"></div>
      </div>`;
  new Array(50).fill(null).forEach((item) => {
    str += `<div style="pointer-events: none;" data-flag="default" class="song_item">
        <div style="background-color:${color};background-image:none" class="song_logo_box"></div>
        <div class="song_info_wrap">
          <span style="background-color:${color};margin: 8px 0 0 0;width: 110px;height:15px" class="song_name"></span>
          <span style="background-color:${color};margin: 5px 0 0 0;width: 110px;height:15px" class="artist_name"></span>
        </div>
        <div style="background-color:${color};width:100px;height: 40px;margin: 10px 0 0 10px;" class="set_song_btn"></div>
      </div>`;
  });
  $songItemsBox.html(str);
}

function rendermusicitem(gao) {
  if ($musicPlayerBox.is(':hidden') || $msuicContentBox.find('.list_items_wrap').css('transform') !== 'none') return;
  let id = curSongListId,
    listpx = curSongListSort;
  let ind = _d.music.findIndex((item) => item.id === id);
  ind < 0 ? (ind = 0) : null;
  let marr = deepClone(_d.music[ind]);
  if (ind > 0) {
    if (listpx === 'artist') {
      marr.item = arrSortMinToMax(marr.item, 'artist');
    } else if (listpx === 'name') {
      marr.item = arrSortMinToMax(marr.item, 'name');
    } else if (listpx === 'playCount') {
      marr.item.sort((a, b) => {
        return b.play_count - a.play_count;
      })
    } else if (listpx === 'collectCount') {
      marr.item.sort((a, b) => {
        return b.collect_count - a.collect_count;
      })
    }
  }
  let scObj = ind == 1 ? {} : _d.music[1].item.reduce((total, item) => {
    total[item.id] = 'y';
    return total;
  }, {});
  let str = '';
  let name = encodeHtml(marr.name);
  let des = marr.des ? encodeHtml(marr.des) : '';
  let pic = !/^\/img/.test(marr.pic) ? `${mediaURL}${marr.pic}` : marr.pic;
  str += `<div class="items_list_top_wrap">
        <div class="song_list_cover">
          <img onload="this.style.display='block';this.parentNode.style.background='none'" onerror="this.onerror=''; src='/img/music.jpg';this.parentNode.style.background='none'" src="${pic
    }">
      </div>
      <div class="song_list_info">
        <div class="song_list_name" title="${name}">${name}</div>
        ${des ? `<div class="song_list_des">${des}</div>` : ''}
      </div>
    </div>
    <div class="items_list_top_menu">
      <div cursor class="play_list_btn iconfont icon-65zanting"></div>
      <div class="list_total_num">播放全部<span>(${marr.item.length})</span></div>
      ${ind > 2 || _d.userInfo.account == 'root' ? `<div cursor class="edit_song_list_btn"><i class="iconfont icon-bianji"></i></div>` : ''}
      ${ind == 2 && _d.userInfo.account == 'root' ? '<div cursor class="upload_song_btn"><i class="iconfont icon-shangchuan1"></i></div>' : ''}
      <div cursor class="share_song_list_btn"><i class="iconfont icon-fenxiang_2"></i></div>
      <div cursor class="sheck_song_btn"><i class="iconfont icon-duoxuan"></i></div>
      ${ind > 0 ? `<div cursor class="sort_songs"><i class="iconfont icon-paixu"></i></div>` : ''}
    </div>`;
  let pageTotal = Math.ceil(marr.item.length / musicPageSize);
  musicPageNum < 1 ? musicPageNum = 1 : (musicPageNum > pageTotal ? musicPageNum = pageTotal : null);
  let sliceList = marr.item.slice((musicPageNum - 1) * musicPageSize, musicPageNum * musicPageSize);
  sliceList.forEach((item) => {
    let { name, artist, mv, duration, id, collect_count, play_count } = item;
    let issc = scObj.hasOwnProperty(id);
    name = encodeHtml(name);
    artist = encodeHtml(artist);
    str += `<div class="song_item" data-pcount="${play_count}" data-ccount="${collect_count}" data-duration="${duration}" data-id="${id}" draggable="true" data-issc="${issc}" m="${mv}" xn="${name}" xa="${artist}" cursor>
        <div cursor check="n" class="check_state"></div>
        <div class="song_logo_box">
          <img class="logo" data-src=${encodeURI(`${mediaURL}/musicys/${artist}-${name}.jpg`)}>
          <img class="play_gif" src="/img/wave.gif">
        </div>
        <div class="song_info_wrap">
          <span class="song_name">${name}</span>
          <span class="artist_name"><i class="viptu iconfont icon-vip1"></i><i class="artist_name_text">${artist}</i></span>
        </div>
        ${mv === 'y' ? `<div class="play_mv iconfont icon-shipin2"></div>` : ''}
        ${ind == 1 ? '' : `<div style="color:${issc ? '#fd4747' : '#ccc'};" class="like_hear iconfont ${issc ? 'icon-hear-full' : 'icon-hear'}"></div>`}
        <div title="添加到播放列表" class="add_song_playing_btn iconfont icon-icon-test"></div>
        <div class="set_song_btn iconfont icon-icon"></div>
      </div>`;
  });
  str += `<div style="padding:20px 0;text-align:center;" class="song_list_paging">
      ${pageTotal > 1 ? `<span class="prev_page iconfont icon-prev" style="${musicPageNum == 1 ? 'pointer-events: none;opacity:.4;' : ''}" cursor></span>
      <span cursor class="input_num" style="margin:0 30px">${musicPageNum}/${pageTotal}</span>
      <span class="next_page iconfont icon-page-next" style="${musicPageNum == pageTotal ? 'pointer-events: none;opacity:.4;' : ''}" cursor></span>` : ''}
    </div>`;
  str += `
      <div class="check_all_menu_wrap">
        <div cursor x='1' class="check_all_song_btn">全选</div>
        <div cursor class="share_all_song_btn">分享</div>
        <div cursor title="添加到播放列表" class="add_all_playing_btn">添加</div>
        ${ind == 1 ? '' : '<div cursor class="collect_songs_btn">收藏</div>'}
        <div cursor class="move_song_btn">${ind < 3 ? '添加到' : '移动到'}</div>
        ${_d.userInfo.account === 'root' || ind != 2 ? `<div cursor class="del_songs_btn">${ind == 2 ? '删除' : '移除'}</div>` : ''}
        ${ind < 2 ? '<div cursor class="clear_all_song_btn">清空</div>' : ''}
      </div>`;
  $songItemsBox.html(str)._check = false;
  musicarrjl = marr.item;
  if (!gao) {
    gaoliang();
  } else {
    gaoliang(1);
  }
  $msuicContentBox.find('.list_items_wrap').scroll();
  lazyImg($msuicContentBox.find('.list_items_wrap'), '.song_item', '.logo', 1);
}

//打开列表
$songListWrap
  .on(
    'click',
    '.song_list_item',
    debounce(function (e) {
      rendermusicitemdefault();
      curSongListId = $(this).attr('data-id');
      $songListWrap.addClass('open');
      $msuicContentBox.find('.list_items_wrap').addClass('open').scrollTop(0);
      musicPageNum = 1;
      _setTimeout(renderMusicItem, 800);
    }, 1000, true)
  )
  .on(
    'scroll',
    debounce(function () {
      lazyImg($songListWrap, '.song_list_item', 'img');
    }, 100)
  )
  .on('click', '.add_song_list', function (e) {
    // 添加歌单
    let str = `
    <input autocomplete="off" placeholder="歌单标题" type="text">
    <textarea autocomplete="off" placeholder="描述"></textarea>
    <button cursor class="mtcbtn">新增歌单</button>`;
    rightMenu(
      e,
      str,
      debounce(
        function ({ close, e, inp }) {
          if (_getTarget(e, '.mtcbtn')) {
            let val = inp[0];
            let des = inp[1];
            if (val === '') {
              _err('请输入歌单名');
              return;
            }
            _postAjax('/player/addlist', { name: val, des }).then((result) => {
              if (parseInt(result.code) === 0) {
                close();
                sendCommand({ type: 'updatedata', flag: 'music' });
                renderMusicList();
                return;
              }
            }).catch(err => { });
          }
        },
        1000,
        true
      )
    );
  })
  .on('contextmenu', '.song_list_item', function (e) {
    e.preventDefault();
    const id = $(this).attr('data-id');
    gedanmenu(e, id);
  });
if (isios()) {
  $songListWrap[0]._longPress('.song_list_item', function (e) {
    const id = $(this).attr('data-id');
    let ev = e.changedTouches[0];
    gedanmenu(ev, id);
  });
}

// 删除歌单
function gedanmenu(e, id) {
  let index = _d.music.findIndex((item) => item.id === id);
  let { des, name } = _d.music[index];
  let str = '';
  if (_d.userInfo.account == 'root') {
    str = `<div cursor class="mtcitem1"><i class="iconfont icon-bianji"></i><span>编辑</span></div>
        ${index > 2 ? '<div cursor class="mtcitem"><i class="iconfont icon-cangpeitubiao_shanchu"></i><span>删除歌单</span></div>' : ''}`;
  } else {
    if (index < 3) return;
    str = `<div cursor class="mtcitem1"><i class="iconfont icon-bianji"></i><span>编辑</span></div>
        <div cursor class="mtcitem"><i class="iconfont icon-cangpeitubiao_shanchu"></i><span>删除歌单</span></div>`;
  }
  rightMenu(
    e,
    str,
    debounce(
      function ({ close, e }) {
        if (_getTarget(e, '.mtcitem')) {
          alert(`确认删除歌单：${name}？`, {
            confirm: true,
            handled: (m) => {
              if (m !== 'confirm') return;
              _postAjax('/player/dellist', { id }).then((result) => {
                if (parseInt(result.code) === 0) {
                  close();
                  sendCommand({ type: 'updatedata', flag: 'music' });
                  renderMusicList();
                  return;
                }
              }).catch(err => { });
            },
          });
        } else if (_getTarget(e, '.mtcitem1')) {
          let str = `
          <input autocomplete="off" placeholder="歌单标题" type="text" value="${encodeHtml(name)}">
          <textarea autocomplete="off" placeholder="描述">${encodeHtml(des || '')}</textarea>
          <button cursor class="mtcbtn">提交</button>`;
          rightMenu(e, str, debounce(function ({ e, close, inp }) {
            if (_getTarget(e, '.mtcbtn')) {
              let nname = inp[0],
                ndes = inp[1];
              if (nname === '') {
                _err('请输入歌单名');
                return;
              }
              if (nname + ndes == name + (des || '')) return;
              _postAjax('/player/editlist', { id, name: nname, des: ndes }).then(
                (result) => {
                  if (parseInt(result.code) === 0) {
                    close();
                    name = nname;
                    des = ndes;
                    sendCommand({ type: 'updatedata', flag: 'music' });
                    renderMusicList();
                    return;
                  }
                }
              ).catch(err => { });
            }
          }, 1000, true));
        };
      },
      1000,
      true
    )
  );
}
function playList() {
  if (musicarrjl.length === 0) {
    _err('播放列表为空');
    return;
  }
  if (_d.playingList.length !== musicarrjl.length
    || !musicarrjl.every((item, idx) => item.id === _d.playingList[idx].id && item.name === _d.playingList[idx].name && item.artist === _d.playingList[idx].artist)) {
    _postAjax('/player/updateplaying', { data: musicarrjl }).then(
      (result) => {
        if (parseInt(result.code) === 0) {
          sendCommand({ type: 'updatedata', flag: 'playinglist' });
          return;
        }
      }
    ).catch(err => { });
  };
  musicarr =
    randomplay === false
      ? myShuffle(deepClone(musicarrjl))
      : deepClone(musicarrjl);
  _d.playingList = deepClone(musicarrjl);
  musicPlay(musicarr[0]);
}
let songItemsBoxHide = debounce(function () {
  $listItemsWarp.find('.position_btn').stop().fadeOut(_speed);
}, 10000);
// 歌单列表编辑
$msuicContentBox.find('.list_items_wrap').on('click', '.edit_song_list_btn', function (e) {
  let id = curSongListId;
  let index = _d.music.findIndex((item) => item.id === id);
  let { des, name } = _d.music[index];
  let str = `
  <input autocomplete="off" placeholder="歌单标题" type="text" value="${encodeHtml(name)}">
  <textarea autocomplete="off" placeholder="描述">${encodeHtml(des || '')}</textarea>
          <button cursor class="mtcbtn">提交</button>`;
  rightMenu(e, str, debounce(function ({ e, close, inp }) {
    if (_getTarget(e, '.mtcbtn')) {
      let nname = inp[0],
        ndes = inp[1];
      if (nname === '') {
        _err('请输入歌单名');
        return;
      }
      if (nname + ndes == name + (des || '')) return;
      _postAjax('/player/editlist', { id, name: nname, des: ndes }).then(
        (result) => {
          if (parseInt(result.code) === 0) {
            close();
            sendCommand({ type: 'updatedata', flag: 'music' });
            renderMusicList();
            return;
          }
        }
      ).catch(err => { });
    }
  }, 1000, true));
}).on('click', '.share_song_list_btn', debounce(function () {
  let id = curSongListId;
  let index = _d.music.findIndex((item) => item.id === id);
  if (index < 0) return;
  let arr = _d.music[index].item.map(item => ({ id: item.id }));
  _postAjax('/player/musicshare', arr).then((result) => {
    if (parseInt(result.code) === 0) {
      openIframe(`/sharelist`, '分享列表');
    }
  }).catch(err => { });
}, 1000, true)).on('click', '.upload_song_btn', async function (e) {
  // 上传歌曲
  if (_d.userInfo.account !== 'root') return;
  let input = document.createElement('input');
  input.type = 'file';
  input.multiple = 'multiple';
  input.accept = '.jpg,.mp3,.lrc,.mp4';
  input.style.display = 'none';
  document.body.appendChild(input);
  input.click();
  let $input = $(input);
  $input.change((e) => {
    let files = [...e.target.files];
    $input.remove();
    if (files.length == 0) return;
    ~(async function fn(num) {
      if (num >= files.length) {
        _postAjax('/player/addsong').then((result) => {
          if (parseInt(result.code) === 0) {
            sendCommand({ type: 'updatedata', flag: 'music' });
            renderMusicList();
            return;
          }
        }).catch(err => { });
        return;
      }
      let { name, size } = files[num];
      let pro = new UpProgress(name);
      if (size === 0) {
        pro.fail();
        _err(`${name} 为空文件`);
        num++;
        fn(num);
        return;
      }
      if (
        !/^[^\-]*[^\s\-]\-[^\s\-][^\-]*\.(jpg|mp3|lrc|mp4)$/i.test(name)
      ) {
        pro.fail();
        _err(`${name} 格式错误`);
        num++;
        fn(num);
        return;
      }

      try {
        //文件切片
        let { chunks, count, suffix, HASH } = await fileSlice(
          files[num],
          (pes) => {
            pro.loading(pes);
          }
        );

        if (isImgFile(name)) {
          // 压缩图片
          chunks.push({
            file: await compressionImg(files[num]),
            filename: `_hello`,
          });
          ++count;
        }

        let breakpointarr = (
          await _postAjax('/player/breakpoint', { HASH })
        ).data; //断点续传
        let isrepeat = await _postAjax('/player/repeatfile', { name }); //是否已经存在文件

        let [a, b] = extname(name);

        function compale(index) {
          pro.update(index / count);
        }

        if (parseInt(isrepeat.code) === 0) {
          //文件已经存在操作
          pro.close('文件已存在');
          num++;
          fn(num);
          return;
        }

        let index = breakpointarr.length;
        compale(index);

        ~(async function fnn(numm) {
          if (numm >= chunks.length) {
            let robj = {
              HASH, count, name
            }
            if (b.toLowerCase() === 'mp3') {
              let duration = await getDuration(files[num]);
              robj.duration = duration;
            }
            let aa = await _postAjax('/player/mergefile', robj); //合并切片
            if (parseInt(aa.code) === 0) {
              pro.close();
            } else {
              pro.fail();
            }
            num++;
            fn(num);
            return;
          }
          let { filename, file } = chunks[numm];
          if (breakpointarr.includes(filename)) {
            numm++;
            fnn(numm);
            return;
          }
          _upFile(`/player/up?name=${filename}&HASH=${HASH}`, file).finally(
            () => {
              index++;
              compale(index);
              numm++;
              fnn(numm);
            }
          );
        })(0);
      } catch (error) {
        pro.fail();
        num++;
        fn(num);
      }
    })(0);
  });
}).on('scroll', function () {
  //列表滚动
  $listItemsWarp.find('.position_btn').css('display', 'block');
  songItemsBoxHide();
  if (this.scrollTop > 115) {
    $msuicContentBox.find('.items_list_top_menu').addClass('sct');
    $msuicContentBox.find('.items_list_top_wrap').addClass('lbxma');
    $musicHeadWrap.find('.song_list_name').text($songItemsBox.find('.song_list_name').text()).css('opacity', 1);
  } else {
    $msuicContentBox.find('.items_list_top_menu').removeClass('sct');
    $msuicContentBox.find('.items_list_top_wrap').removeClass('lbxma');
    $musicHeadWrap.find('.song_list_name').css('opacity', 0);
  }
}).on('click', '.play_list_btn', playList).on(
  'scroll',
  debounce(function () {
    lazyImg($msuicContentBox.find('.list_items_wrap'), '.song_item', '.logo');
  }, 100)
).on('click', '.add_song_playing_btn', function (e) {
  //添加到播放列表
  let $this = $(this);
  let mobj = {
    name: $this.parent().attr('xn'),
    artist: $this.parent().attr('xa'),
    mv: $this.parent().attr('m'),
    duration: $this.parent().attr('data-duration'),
    id: $this.parent().attr('data-id')
  };
  _d.playingList.push(mobj);
  musicarr.push(mobj);
  _d.playingList.reverse();
  musicarr.reverse();
  _d.playingList = qucong(_d.playingList);
  musicarr = qucong(musicarr);
  _d.playingList.reverse();
  musicarr.reverse();
  _success('添加成功');
  updatePlayingList();
}).on('click', '.sheck_song_btn', () => {
  //多选操作
  let $qxcz = $msuicContentBox.find('.check_all_menu_wrap'),
    $duoxuan = $msuicContentBox.find('.list_items_wrap .check_state');
  if ($songItemsBox._check) {
    $qxcz.stop().fadeOut(_speed);
    $duoxuan.stop().fadeOut(_speed);
    $songItemsBox._check = false;
  } else {
    $qxcz.stop().fadeIn(_speed);
    $duoxuan.stop().fadeIn(_speed);
    $songItemsBox._check = true;
  }
  $duoxuan.attr('check', 'n').css('background-color', 'transparent');
  $msuicContentBox.find('.list_items_wrap .check_all_song_btn').attr('x', '1');
}).on('click', '.check_all_song_btn', function () {
  //全选/全不选
  let $this = $(this),
    $duoxuan = $msuicContentBox.find('.list_items_wrap .check_state');
  let num = 0;
  if ($this.attr('x') === '1') {
    $duoxuan.attr('check', 'y').css('background-color', _d.checkColor);
    $this.attr('x', '2');
    num = $duoxuan.length;
  } else {
    $duoxuan.attr('check', 'n').css('background-color', 'transparent');
    $this.attr('x', '1');
    num = 0;
  }
  _success(`选中：${num}`, true);
}).on('click', '.share_all_song_btn', debounce(function () {
  let $songlist = $msuicContentBox.find('.list_items_wrap .song_item'),
    $selectarr = $songlist.filter(
      (index, item) => $(item).find('.check_state').attr('check') === 'y'
    );
  if ($selectarr.length === 0) return;
  let arr = [];
  $selectarr.each((i, v) => {
    let $v = $(v);
    arr.push({
      id: $v.attr('data-id')
    });
  });
  _postAjax('/player/musicshare', arr).then((result) => {
    if (parseInt(result.code) === 0) {
      $msuicContentBox.find('.list_items_wrap .sheck_song_btn').click();
      openIframe(`/sharelist`, '分享列表');
    }
  }).catch(err => { });
}, 1000, true)).on('click', '.collect_songs_btn', function (e) {
  //收藏选中
  let $songlist = $msuicContentBox.find('.list_items_wrap .song_item'),
    $selectarr = $songlist.filter(
      (index, item) => $(item).find('.check_state').attr('check') === 'y'
    );
  if ($selectarr.length === 0) return;
  let arr = [];
  $selectarr.each((i, v) => {
    let $v = $(v);
    arr.push({
      name: $v.attr('xn'),
      artist: $v.attr('xa'),
      mv: $v.attr('m'),
      duration: $v.attr('data-duration'),
      id: $v.attr('data-id')
    });
  });
  _postAjax('/player/collectsong', { ar: arr }).then((result) => {
    if (parseInt(result.code) === 0) {
      sendCommand({ type: 'updatedata', flag: 'music' });
      renderMusicList();
      _success();
      return;
    }
  }).catch(err => { });
}).on('click', '.del_songs_btn', function (e) {
  // 移除全选
  let $songlist = $msuicContentBox.find('.list_items_wrap .song_item'),
    id = curSongListId,
    $selectarr = $songlist.filter(
      (index, item) => $(item).find('.check_state').attr('check') === 'y'
    );
  if ($selectarr.length === 0) return;
  alert(`确认${this.innerText}？`, {
    confirm: true,
    handled: (m) => {
      if (m !== 'confirm') return;
      let arr = [];
      $selectarr.each((i, v) => {
        let $v = $(v);
        arr.push({
          name: $v.attr('xn'),
          artist: $v.attr('xa'),
          mv: $v.attr('m'),
          duration: $v.attr('data-duration'),
          id: $v.attr('data-id')
        });
      });
      _postAjax('/player/delsong', { id, ar: arr }).then((result) => {
        if (parseInt(result.code) === 0) {
          sendCommand({ type: 'updatedata', flag: 'music' });
          renderMusicList();
          return;
        }
      }).catch(err => { });
    },
  });
}).on('click', '.clear_all_song_btn', function () {
  let id = curSongListId;
  let idx = _d.music.findIndex((item) => item.id === id);
  if (idx > 1 || id == 'all') return;
  alert(`确认清空？`, {
    confirm: true,
    handled: (m) => {
      if (m !== 'confirm') return;
      _postAjax('/player/delsong', { id, ar: _d.music[idx].item }).then((result) => {
        if (parseInt(result.code) === 0) {
          sendCommand({ type: 'updatedata', flag: 'music' });
          renderMusicList();
          return;
        }
      }).catch(err => { });
    },
  });
}).on('click', '.move_song_btn', function (e) {
  let text = $(this).text();
  // 全选移动
  let $songlist = $msuicContentBox.find('.list_items_wrap .song_item'),
    id = curSongListId,
    $selectarr = $songlist.filter(
      (index, item) => $(item).find('.check_state').attr('check') === 'y'
    );
  if ($selectarr.length === 0) return;
  let str = ``;
  _d.music.forEach((item, i) => {
    if (item.id !== id && i > 2) {
      let name = encodeHtml(item.name),
        pic = !/^\/img/.test(item.pic) ? `${mediaURL}${item.pic}` : item.pic;
      str += `<div data-name="${name}" cursor class="mtcitem" data-id="${item.id}"><img style="width: 40px;height: 40px;" src="${pic}"><span style="margin-left:10px;">${name}</span></div>`;
    }
  });
  if (str == '') {
    _err('没有可选歌单')
    return;
  }
  rightMenu(
    e,
    str,
    debounce(
      function ({ close, e }) {
        let _this = _getTarget(e, '.mtcitem');
        if (_this) {
          let $this = $(_this),
            tid = $this.attr('data-id'),
            listname = $this.attr('data-name'),
            arr = [];
          $selectarr.each((i, v) => {
            let $v = $(v);
            arr.push({
              name: $v.attr('xn'),
              artist: $v.attr('xa'),
              mv: $v.attr('m'),
              duration: $v.attr('data-duration'),
              id: $v.attr('data-id')
            });
          });
          alert(`确认${text} ${listname}?`, {
            confirm: true,
            handled: (m) => {
              if (m !== 'confirm') return;
              _postAjax('/player/songtolist', { id, tid, ar: arr }).then(
                (result) => {
                  if (parseInt(result.code) === 0) {
                    _success();
                    close();
                    sendCommand({ type: 'updatedata', flag: 'music' });
                    renderMusicList();
                    return;
                  }
                }
              ).catch(err => { });
            },
          });
        }
      },
      1000,
      true
    )
  );
}).on('click', '.add_all_playing_btn', function (e) {
  // 选中添加到播放列表
  let $songlist = $msuicContentBox.find('.list_items_wrap .song_item');
  let $selectarr = $songlist.filter(
    (index, item) => $(item).find('.check_state').attr('check') === 'y'
  );
  if ($selectarr.length === 0) return;
  let arr = [];
  $selectarr.each((i, v) => {
    let $v = $(v);
    arr.push({
      name: $v.attr('xn'),
      artist: $v.attr('xa'),
      mv: $v.attr('m'),
      duration: $v.attr('data-duration'),
      id: $v.attr('data-id')
    });
  });
  _d.playingList = [..._d.playingList, ...arr];
  musicarr = [...musicarr, ...arr];
  _d.playingList.reverse();
  musicarr.reverse();
  _d.playingList = qucong(_d.playingList);
  musicarr = qucong(musicarr);
  _d.playingList.reverse();
  musicarr.reverse();
  _success('添加成功');
  $msuicContentBox.find('.sheck_song_btn').click();
  _postAjax('/player/updateplaying', { data: _d.playingList }).then(
    (result) => {
      if (parseInt(result.code) === 0) {
        sendCommand({ type: 'updatedata', flag: 'playinglist' });
        return;
      }
    }
  ).catch(err => { });
}).on('click', '.song_info_wrap', function () {
  let $this = $(this).parent();
  let sobj = {
    name: $this.attr('xn'),
    artist: $this.attr('xa'),
    mv: $this.attr('m'),
    duration: $this.attr('data-duration'),
    id: $this.attr('data-id')
  };
  if (_d.playingList.length !== musicarrjl.length
    || !musicarrjl.every((item, idx) => item.id === _d.playingList[idx].id && item.name === _d.playingList[idx].name && item.artist === _d.playingList[idx].artist)) {
    _postAjax('/player/updateplaying', { data: musicarrjl }).then(
      (result) => {
        if (parseInt(result.code) === 0) {
          sendCommand({ type: 'updatedata', flag: 'playinglist' });
          return;
        }
      }
    ).catch(err => { });
    musicarr = randomplay === false
      ? myShuffle(deepClone(musicarrjl))
      : deepClone(musicarrjl);
    _d.playingList = deepClone(musicarrjl);
  };
  if (musicobj.id == sobj.id) {
    $lrcFootBtnWrap.find('.play_btn').click();
  } else {
    musicPlay(sobj);
  }
}).on('click', '.artist_name_text', function (e) {
  e.stopPropagation();
  $musicHeadWrap.find('.search_music_inp').val(this.innerText);
  _musicsea();
}).on('click', '.song_logo_box', function () {
  $(this).parent().find('.song_info_wrap').click();
  $playingSongLogo.click();
}).on('click', '.play_mv', function (e) {
  e.stopPropagation();
  let $this = $(this).parent();
  let sobj = {
    name: $this.attr('xn'),
    artist: $this.attr('xa'),
    mv: $this.attr('m'),
    duration: $this.attr('data-duration'),
    id: $this.attr('data-id')
  };
  setZindex($musicMvWrap);
  if (_d.playingList.length !== musicarrjl.length
    || !musicarrjl.every((item, idx) => item.id === _d.playingList[idx].id && item.name === _d.playingList[idx].name && item.artist === _d.playingList[idx].artist)) {
    _postAjax('/player/updateplaying', { data: musicarrjl }).then(
      (result) => {
        if (parseInt(result.code) === 0) {
          sendCommand({ type: 'updatedata', flag: 'playinglist' });
          return;
        }
      }
    ).catch(err => { });
    musicarr =
      randomplay === false
        ? myShuffle(deepClone(musicarrjl))
        : deepClone(musicarrjl);
    _d.playingList = deepClone(musicarrjl);
  };
  musicMv(sobj);
}).on('click', '.like_hear', function () {
  let $this = $(this).parent();
  let issc = $this.attr('data-issc');
  let sobj = {
    name: $this.attr('xn'),
    artist: $this.attr('xa'),
    mv: $this.attr('m'),
    duration: $this.attr('data-duration'),
    id: $this.attr('data-id')
  };
  if (issc == 'true') {
    _postAjax('/player/closecollectsong', sobj).then((result) => {
      if (parseInt(result.code) === 0) {
        sendCommand({ type: 'updatedata', flag: 'music' });
        renderMusicList();
        return;
      }
    }).catch(err => { });
  } else {
    _postAjax('/player/collectsong', {
      ar: [sobj]
    }).then((result) => {
      if (parseInt(result.code) === 0) {
        sendCommand({ type: 'updatedata', flag: 'music' });
        renderMusicList();
        return;
      }
    }).catch(err => { });
  }
}).on('click', '.set_song_btn', function (e) {
  let $this = $(this).parent();
  let sobj = {
    artist: $this.attr('xa'),
    name: $this.attr('xn'),
    id: $this.attr('data-id'),
    mv: $this.attr('m'),
    duration: $this.attr('data-duration'),
    pcount: $this.attr('data-pcount'),
    ccount: $this.attr('data-ccount')
  };
  let ii = _d.music.findIndex((item) => item.id === curSongListId);
  if (ii < 0) return;
  let str = '';
  str += `<div class="mtcitem9" style="justify-content: center;font-size: 14px;color: #5a5a5a;">收藏(${sobj.ccount}) 播放(${sobj.pcount})</div>
          <div cursor class="mtcitem"><i class="iconfont icon-fenxiang_2"></i><span>分享歌曲</span></div>
          <div cursor class="mtcitem5"><i class="iconfont icon-fuzhi"></i><span>复制信息</span></div>
          <div cursor class="mtcitem7"><i class="iconfont icon-bianji"></i><span>编辑歌词</span></div>
          <div cursor class="mtcitem8"><i class="iconfont icon-tupian"></i><span>封面</span></div>
          <div cursor class="mtcitem3"><i class="iconfont ${ii < 3 ? 'icon-icon-test' : 'icon-moveto'}"></i><span>${ii < 3 ? '添加到' : '移动到'}</span></div>`;
  if (_d.userInfo.account === 'root') {
    str += `<div cursor class="mtcitem6"><i class="iconfont icon-bianji"></i><span>编辑歌曲信息</span></div>`;
    if (sobj.mv === 'y') {
      str += `<div cursor  class="mtcitem4"><i class="iconfont icon-cangpeitubiao_shanchu"></i><span>删除 MV</span></div>`;
    }
  }
  if (_d.userInfo.account === 'root' || ii != 2) {
    str += `<div cursor class="mtcitem1"><i class="iconfont ${ii == 2 ? 'icon-cangpeitubiao_shanchu' : 'icon-guanbi1'}"></i><span>${ii == 2 ? '删除' : '移除'}</span></div>`
  }
  rightMenu(
    e,
    str,
    debounce(
      function ({ close, e }) {
        if (_getTarget(e, '.mtcitem')) {
          close();
          _postAjax('/player/musicshare', [{
            id: sobj.id
          }]).then((result) => {
            if (parseInt(result.code) === 0) {
              openIframe(`/sharelist`, '分享列表');
            }
          }).catch(err => { });
        } else if (_getTarget(e, '.mtcitem1')) {
          alert(`确认${ii == 2 ? '删除' : '移除'}：${sobj.artist}-${sobj.name}？`, {
            confirm: true,
            handled: (m) => {
              if (m !== 'confirm') return;
              let id = curSongListId;
              _postAjax('/player/delsong', {
                id, ar: [sobj]
              }).then((result) => {
                if (parseInt(result.code) === 0) {
                  close();
                  sendCommand({ type: 'updatedata', flag: 'music' });
                  renderMusicList();
                  return;
                }
              }).catch(err => { });
            },
          });
        } else if (_getTarget(e, '.mtcitem3')) {
          let str = '',
            id = curSongListId;
          _d.music.forEach((v, i) => {
            if (i > 2 && v.id !== id) {
              let name = encodeHtml(v.name),
                pic = !/^\/img/.test(v.pic) ? `${mediaURL}${v.pic}` : v.pic;
              str += `<div data-name="${name}" cursor class="mtcitem" data-id="${v.id}"><img style="width: 40px;height: 40px;" src="${pic}"><span style="margin-left:10px;">${name}</span></div>`;
            }
          });
          if (str == '') {
            _err('没有可选歌单')
            return;
          }
          let flagClose = close;
          rightMenu(
            e,
            str,
            debounce(
              function ({ close, e }) {
                let _this = _getTarget(e, '.mtcitem');
                if (_this) {
                  let $this = $(_this),
                    tid = $this.attr('data-id'),
                    listname = $this.attr('data-name');
                  alert(`确认${ii < 3 ? '添加' : '移动'}到 ${listname}?`, {
                    confirm: true,
                    handled: (m) => {
                      if (m !== 'confirm') return;
                      _postAjax('/player/songtolist', {
                        id,
                        tid,
                        ar: [sobj],
                      }).then((result) => {
                        if (parseInt(result.code) === 0) {
                          _success();
                          flagClose();
                          close();
                          sendCommand({
                            type: 'updatedata',
                            flag: 'music',
                          });
                          renderMusicList();
                          return;
                        }
                      }).catch(err => { });
                    },
                  });
                }
              },
              1000,
              true
            )
          );
        } else if (_getTarget(e, '.mtcitem4')) {
          if (_d.userInfo.account !== 'root') return;
          alert(`确认删除MV？`, {
            confirm: true,
            handled: (m) => {
              if (m !== 'confirm') return;
              _postAjax('/player/delmv', { sobj }).then((result) => {
                if (parseInt(result.code) === 0) {
                  close();
                  sendCommand({ type: 'updatedata', flag: 'music' });
                  renderMusicItem();
                  return;
                }
              }).catch(err => { });
            },
          });
        } else if (_getTarget(e, '.mtcitem5')) {
          close();
          copyText(`${sobj.artist}-${sobj.name}`);
        } else if (_getTarget(e, '.mtcitem6')) {
          if (_d.userInfo.account !== 'root') return;
          let str = `
          <input autocomplete="off" placeholder="歌手名" value="${encodeHtml(sobj.artist)}" >
          <input autocomplete="off" placeholder="歌曲名" value="${encodeHtml(sobj.name)}">
                <button cursor class="mtcbtn">提交</button>`;
          rightMenu(e, str, debounce(function ({ e, close, inp }) {
            if (_getTarget(e, '.mtcbtn')) {
              let newName = inp[1];
              let newArtist = inp[0];
              if (newName + newArtist == sobj.name + sobj.artist) return;
              _postAjax('/player/editsong', {
                id: sobj.id, oldObj: {
                  name: sobj.name,
                  artist: sobj.artist
                }, newObj: {
                  name: newName,
                  artist: newArtist
                }
              }).then(res => {
                if (res.code == 0) {
                  sobj.name = newName;
                  sobj.artist = newArtist;
                  close();
                  sendCommand({ type: 'updatedata', flag: 'music' });
                  renderMusicItem();
                }
              }).catch(err => { });
            }
          }, 1000, true));
        } else if (_getTarget(e, '.mtcitem7')) {
          if (_d.userInfo.account !== 'root') {
            $editLrcWrap.find('.save').remove();
          }
          $editLrcWrap.find('.song_info_text').text(`${sobj.artist}-${sobj.name}`);
          setZindex($editLrcWrap);
          $editLrcWrap.stop().fadeIn(_speed, () => {
            $editLrcWrap.css('display', 'flex').find('textarea').val('');
            $editLrcWrap._mobj = deepClone(sobj);
            _getAjax('/player/getlrc', {
              name: sobj.name,
              artist: sobj.artist,
            }).then((result) => {
              if (parseInt(result.code) === 0) {
                close();
                $editLrcWrap._val = result.data;
                $editLrcWrap.find('textarea').val(result.data);
                return;
              }
            }).catch(err => { });
          });
        } else if (_getTarget(e, '.mtcitem8')) {
          close();
          imgPreview([{
            u1: `${mediaURL}/music/${sobj.artist}-${sobj.name}.jpg`,
            u2: `${mediaURL}/musicys/${sobj.artist}-${sobj.name}.jpg`
          }]);
        };
      },
      1000,
      true
    )
  );
}).on('contextmenu', '.song_item', function (e) {
  e.preventDefault();
  $msuicContentBox.find('.list_items_wrap .sheck_song_btn').click();
}).on('click', '.sort_songs', function (e) {
  //歌曲排序
  let str = `<div cursor data-type="default" class="mtcitem ${curSongListSort == 'default' ? 'active' : ''}">默认排序</div>
      <div cursor data-type="artist" class="mtcitem ${curSongListSort == 'artist' ? 'active' : ''}">按歌手名排序</div>
      <div cursor data-type="name" class="mtcitem ${curSongListSort == 'name' ? 'active' : ''}">按歌曲名排序</div>
      <div cursor data-type="playCount" class="mtcitem ${curSongListSort == 'playCount' ? 'active' : ''}">按播放量排序</div>
      <div cursor data-type="collectCount" class="mtcitem ${curSongListSort == 'collectCount' ? 'active' : ''}">按收藏量排序</div>`;
  rightMenu(e, str, debounce(function ({ e, items }) {
    let _this = _getTarget(e, '.mtcitem');
    if (_this) {
      curSongListSort = _this.dataset.type;
      let $items = $(items);
      $items.removeClass('active');
      _this.classList.add('active');
      _setData('lastpx', curSongListSort);
      musicPageNum = 1;
      $msuicContentBox.find('.list_items_wrap')[0].scrollTop = 0;
      if (curSongListSort == 'playCount' || curSongListSort == 'collectCount') {
        renderMusicItem();
      } else {
        rendermusicitem();
      }
    }
  }, 1000, true));
}).on('click', '.to_top', function () {
  //列表回到顶部底部和定位到当前播放歌曲
  $msuicContentBox.find('.list_items_wrap').stop().animate(
    {
      scrollTop: 0,
    },
    _speed
  );
}).on('click', '.to_bot', function () {
  $msuicContentBox.find('.list_items_wrap').stop().animate(
    {
      scrollTop: $msuicContentBox.find('.list_items_wrap').prop('scrollHeight'),
    },
    _speed
  );
}).on('click', '.get_location', function () {
  let idx = musicarrjl.findIndex(item => item.id === musicobj.id);
  if (idx >= 0) {
    let page = Math.ceil((idx + 1) / musicPageSize);
    if (page != musicPageNum) {
      musicPageNum = page;
      rendermusicitem(1);
      return;
    }
    gaoliang(true);
  }
}).on('click', '.music_list_setting', function (e) {
  let str = `
      <div cursor data-val="50" class="mtcitem ${musicPageSize == 50 ? 'active' : ''}">50条/页</div>
      <div cursor data-val="100" class="mtcitem ${musicPageSize == 100 ? 'active' : ''}">100条/页</div>
      <div cursor data-val="200" class="mtcitem ${musicPageSize == 200 ? 'active' : ''}">200条/页</div>
      `;
  rightMenu(e, str, debounce(function ({ e, close }) {
    let item = _getTarget(e, '.mtcitem');
    if (item) {
      close();
      musicPageSize = +item.dataset.val;
      _setData('musicpagenum', musicPageSize);
      musicPageNum = 1;
      $msuicContentBox.find('.list_items_wrap')[0].scrollTop = 0;
      rendermusicitem();
    }
  }, 1000, true));
}).on('click', '.check_state', function (e) {
  let $this = $(this),
    check = $this.attr('check');
  if (check === 'n') {
    $this.attr('check', 'y').css('background-color', _d.checkColor);
  } else {
    $this.attr('check', 'n').css('background-color', 'transparent');
  }
  let $duoxuan = $msuicContentBox.find('.list_items_wrap .check_state'),
    $checkArr = $duoxuan.filter((_, item) => $(item).attr('check') === 'y');
  _success(`选中：${$checkArr.length}`, true);
}).on('click', '.prev_page', function () {
  musicPageNum--;
  $msuicContentBox.find('.list_items_wrap')[0].scrollTop = 0;
  rendermusicitem();
}).on('click', '.next_page', function () {
  musicPageNum++;
  $msuicContentBox.find('.list_items_wrap')[0].scrollTop = 0;
  rendermusicitem();
}).on('click', '.input_num', function (e) {
  let str = `
    <input autocomplete="off" value="${musicPageNum}" type="number">
    <button cursor class="mtcbtn">Go</button>`;
  rightMenu(e, str, debounce(function ({ e, inp, close }) {
    if (_getTarget(e, '.mtcbtn')) {
      let val = parseInt(inp[0]);
      if (isNaN(val)) return;
      close();
      musicPageNum = val;
      $msuicContentBox.find('.list_items_wrap')[0].scrollTop = 0;
      rendermusicitem();
    }
  }, 1000, true))
});
if (isios()) {
  $msuicContentBox.find('.list_items_wrap')[0]._longPress('.song_item', function (e) {
    $msuicContentBox.find('.sheck_song_btn').click();
  });
};
// 移动歌曲
(function () {
  let fromDom = null;
  $msuicContentBox.find('.list_items_wrap').on('dragstart', '.song_item', function (e) {
    fromDom = this;
  }).on('drop', '.song_item', function (e) {
    let fid = $(fromDom).attr('data-id'),
      tid = $(this).attr('data-id'),
      id = curSongListId,
      index = _d.music.findIndex((item) => item.id === id);
    if (fromDom) {
      if (curSongListSort === 'default' && index > 0 && id !== 'all') {
        _postAjax('/player/songmove', { id, fid, tid }).then((result) => {
          if (parseInt(result.code) === 0) {
            sendCommand({ type: 'updatedata', flag: 'music' });
            renderMusicList();
            return;
          }
        }).catch(err => { });
      }
      fromDom = null;
    }
  }).on('dragover', '.song_item', function (e) {
    e.preventDefault();
  });
})();

$lrcMenuWrap.on('click', '.collect_song_btn', function (e) {
  if (!musicobj) return;
  const $this = $(this);
  if (!$this.hasClass('active')) {
    _postAjax('/player/collectsong', {
      ar: [{
        id: musicobj.id,
        name: musicobj.name,
        artist: musicobj.artist,
        duration: musicobj.duration,
        mv: musicobj.mv
      }]
    }).then((result) => {
      if (parseInt(result.code) === 0) {
        sendCommand({ type: 'updatedata', flag: 'music' });
        renderMusicList();
        $this.attr('class', 'collect_song_btn iconfont icon-hear-full active');
        return;
      }
    }).catch(err => { });
  } else {
    _postAjax('/player/closecollectsong', {
      id: musicobj.id,
      name: musicobj.name,
      artist: musicobj.artist,
      duration: musicobj.duration,
      mv: musicobj.mv
    }).then((result) => {
      if (parseInt(result.code) === 0) {
        sendCommand({ type: 'updatedata', flag: 'music' });
        renderMusicList();
        $this.attr('class', 'collect_song_btn iconfont icon-hear');
        return;
      }
    }).catch(err => { });
  }
}).on('click', '.play_mv_btn', function (e) {
  e.stopPropagation();
  if (!musicobj) return;
  $myVideo.attr('src', `${musicobj.murl}`);
  $musicMvWrap.stop().fadeIn(_speed);
  videoPlay();
  setZindex($musicMvWrap);
}).on('click', '.lrc_translate_btn', (e) => {
  let showfy = _getData('showfy');
  if (showfy) {
    $lrcListWrap.find('.lrc_items .lrcfy').css('display', 'none');
  } else {
    $lrcListWrap.find('.lrc_items .lrcfy').css('display', 'block');
  }
  handleLrc(true);
  showfy = !showfy;
  _setData('showfy', showfy);
}).on('click', '.share_song_btn', debounce(
  function (e) {
    if (!musicobj) return;
    _postAjax('/player/musicshare', [{ id: musicobj.id }]).then((result) => {
      if (parseInt(result.code) === 0) {
        openIframe(`/sharelist`, '分享列表');
      }
    }).catch(err => { });
  },
  500,
  true
)).on('click', '.set_lrc_btn', debounce(
  function (e) {
    let str = `<div cursor class="mtcitem"><i class="iconfont icon-24gl-fontSizeIncrease"></i><span>放大字体</span></div>
            <div cursor class="mtcitem1"><i class="iconfont icon-24gl-fontSizeDecrease"></i><span>缩小字体</span></div>
            <div cursor class="mtcitem2"><i class="iconfont icon-kaozuo"></i><span>靠左</span></div>
            <div cursor class="mtcitem3"><i class="iconfont icon-geci"></i><span>居中</span></div>
            <div cursor class="mtcitem4"><i class="iconfont icon-kaoyou"></i><span>靠右</span></div>
            <div cursor class="mtcitem5"><i class="iconfont icon-bianji"></i><span>编辑歌词</span></div>
            <div cursor class="mtcitem6"><i class="iconfont icon-tupian"></i><span>封面</span></div>
            <div cursor class="mtcitem7"><i class="iconfont icon-fuzhi"></i><span>复制信息</span></div>
            <div cursor class="mtcitem8"><i class="iconfont icon-icon-test"></i><span>添加到</span></div>
            ${_d.userInfo.account == 'root' ? '<div cursor class="mtcitem9"><i class="iconfont icon-cangpeitubiao_shanchu"></i><span>删除</span></div>' : ''}`;
    rightMenu(e, str, function ({ close, e }) {
      if (_getTarget(e, '.mtcitem')) {
        let { size } = lrcstatu;
        size += 2;
        size >= 24 ? (size = 24) : null;
        let $lrcdiv = $lrcListWrap.find('.lrc_items').children('div');
        $lrcdiv.find('.elrc').css({
          'font-size': size + 'px',
          'line-height': size + 6 + 'px',
        });
        $lrcdiv.find('.lrcfy').css({
          'font-size': size - 2 + 'px',
          'line-height': size + 4 + 'px',
        });
        lrcstatu.size = size;
        _setData('lrcstatu', lrcstatu);
        handleLrc(true);
      } else if (_getTarget(e, '.mtcitem1')) {
        let { size } = lrcstatu;
        size -= 2;
        size <= 14 ? (size = 14) : null;
        let $lrcdiv = $lrcListWrap.find('.lrc_items').children('div');
        $lrcdiv.find('.elrc').css({
          'font-size': size + 'px',
          'line-height': size + 6 + 'px',
        });
        $lrcdiv.find('.lrcfy').css({
          'font-size': size - 2 + 'px',
          'line-height': size + 4 + 'px',
        });
        lrcstatu.size = size;
        _setData('lrcstatu', lrcstatu);
        handleLrc(true);
      } else if (_getTarget(e, '.mtcitem2')) {
        lrcstatu.statu = 'left';
        let $lrcdiv = $lrcListWrap.find('.lrc_items').children('div');
        $lrcdiv.find('.elrc').css({
          'text-align': 'left',
        });
        $lrcdiv.find('.lrcfy').css({
          'text-align': 'left',
        });
        _setData('lrcstatu', lrcstatu);
      } else if (_getTarget(e, '.mtcitem3')) {
        lrcstatu.statu = 'center';
        let $lrcdiv = $lrcListWrap.find('.lrc_items').children('div');
        $lrcdiv.find('.elrc').css({
          'text-align': 'center',
        });
        $lrcdiv.find('.lrcfy').css({
          'text-align': 'center',
        });
        _setData('lrcstatu', lrcstatu);
      } else if (_getTarget(e, '.mtcitem4')) {
        lrcstatu.statu = 'right';
        let $lrcdiv = $lrcListWrap.find('.lrc_items').children('div');
        $lrcdiv.find('.elrc').css({
          'text-align': 'right',
        });
        $lrcdiv.find('.lrcfy').css({
          'text-align': 'right',
        });
        _setData('lrcstatu', lrcstatu);
      } else if (_getTarget(e, '.mtcitem5')) {
        if (!musicobj) return;
        if (_d.userInfo.account !== 'root') {
          $editLrcWrap.find('.save').remove();
        }
        $editLrcWrap.find('.song_info_text').text(`${musicobj.artist}-${musicobj.name}`);
        setZindex($editLrcWrap);
        $editLrcWrap.stop().fadeIn(_speed, () => {
          $editLrcWrap.css('display', 'flex').find('textarea').val('');
          $editLrcWrap._mobj = deepClone(musicobj);
          _getAjax('/player/getlrc', {
            name: musicobj.name,
            artist: musicobj.artist,
          }).then((result) => {
            if (parseInt(result.code) === 0) {
              close();
              $editLrcWrap._val = result.data;
              $editLrcWrap.find('textarea').val(result.data);
              return;
            }
          }).catch(err => { });
        });
      } else if (_getTarget(e, '.mtcitem6')) {
        close();
        imgPreview([{
          u1: `${mediaURL}/music/${musicobj.artist}-${musicobj.name}.jpg`,
          u2: `${mediaURL}/musicys/${musicobj.artist}-${musicobj.name}.jpg`
        }]);
      } else if (_getTarget(e, '.mtcitem7')) {
        close();
        copyText(`${musicobj.artist}-${musicobj.name}`);
      } else if (_getTarget(e, '.mtcitem8')) {
        let str = '';
        _d.music.forEach((v, i) => {
          if (i > 2) {
            let name = encodeHtml(v.name),
              pic = !/^\/img/.test(v.pic) ? `${mediaURL}${v.pic}` : v.pic;
            str += `<div data-name="${name}" cursor class="mtcitem" data-id="${v.id}"><img style="width: 40px;height: 40px;" src="${pic}"><span style="margin-left:10px;">${name}</span></div>`;
          }
        });
        if (str == '') {
          _err('没有可选歌单')
          return;
        }
        rightMenu(
          e,
          str,
          debounce(
            function ({ close, e }) {
              let _this = _getTarget(e, '.mtcitem');
              if (_this) {
                let $this = $(_this),
                  tid = $this.attr('data-id'),
                  listname = $this.attr('data-name');
                let sobj = deepClone(musicobj);
                alert(`确认添加到 ${listname}?`, {
                  confirm: true,
                  handled: (m) => {
                    if (m !== 'confirm') return;
                    _postAjax('/player/songtolist', {
                      id: 'all',
                      tid,
                      ar: [sobj],
                    }).then((result) => {
                      if (parseInt(result.code) === 0) {
                        _success();
                        close();
                        sendCommand({
                          type: 'updatedata',
                          flag: 'music',
                        });
                        renderMusicList();
                        return;
                      }
                    }).catch(err => { });
                  },
                });
              }
            },
            1000,
            true
          )
        );
      } else if (_getTarget(e, '.mtcitem9')) {
        if (!musicobj) return;
        let sobj = deepClone(musicobj);
        alert(`确认删除：${sobj.artist}-${sobj.name}？`, {
          confirm: true,
          handled: (m) => {
            if (m !== 'confirm') return;
            _postAjax('/player/delsong', {
              id: 'all', ar: [sobj]
            }).then((result) => {
              if (parseInt(result.code) === 0) {
                _success();
                close();
                sendCommand({ type: 'updatedata', flag: 'music' });
                renderMusicList();
                return;
              }
            }).catch(err => { });
          },
        });
      };
    });
  },
  500,
  true
)).on('click', '.play_speed_btn', function (e) {
  let str = `<div cursor class="mtcitem ${curPlaySpeed[1] == 2 ? 'active' : ''}">x2</div>
            <div cursor class="mtcitem ${curPlaySpeed[1] == 1.75 ? 'active' : ''}">x1.75</div>
            <div cursor class="mtcitem ${curPlaySpeed[1] == 1.5 ? 'active' : ''}">x1.5</div>
            <div cursor class="mtcitem ${curPlaySpeed[1] == 1.25 ? 'active' : ''}">x1.25</div>
            <div cursor class="mtcitem ${curPlaySpeed[1] == 1 ? 'active' : ''}">x1</div>
            <div cursor class="mtcitem ${curPlaySpeed[1] == 0.75 ? 'active' : ''}">x0.75</div>
            <div cursor class="mtcitem ${curPlaySpeed[1] == 0.25 ? 'active' : ''}">x0.25</div>`;
  rightMenu(e, str, function ({ e, items }) {
    let _this = _getTarget(e, '.mtcitem');
    if (_this) {
      let a = _this.innerText,
        b = +a.slice(1);
      let $items = $(items);
      $items.removeClass('active');
      _this.classList.add('active');
      $lrcMenuWrap.find('.play_speed_btn').text(a);
      $myAudio[0].playbackRate = b;
      curPlaySpeed = [a, b];
      _setData('lastplaysd', curPlaySpeed);
      _success(b + 'X');
    }
  });
}).find('.play_speed_btn').text(curPlaySpeed[0]);
// 自动触发定时函数
function zidonghide(timemax, el, ell, fn, fn2, fel) {
  let time = timemax,
    timer = null;
  function fun() {
    time--;
    if (time <= 0) {
      fn2();
      return;
    }
    timer = _setTimeout(fun, 1000);
  }
  $(el)
    .on('mouseup touchstart mousemove', function (e) {
      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
      }
      time = timemax;
      if (!_getTarget(e, fel)) {
        fn();
      }
      if (_getTarget(e, ell) && dmwidth > 800) return;
      fun();
    })
    .on('mouseleave', function (e) {
      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
      }
      fn2();
    });
}

//定位播放歌曲
function gaoliang(a) {
  if ($musicPlayerBox.is(':hidden') || $msuicContentBox.find('.list_items_wrap').css('transform') !== 'none') return;
  if (musicarrjl != undefined && musicobj) {
    if (musicarrjl.some(item => item.id === musicobj.id)) {
      $listItemsWarp.find('.get_location').stop().slideDown(_speed);
    } else {
      $listItemsWarp.find('.get_location').stop().slideUp(_speed);
    }
    let $songlist = $msuicContentBox.find('.list_items_wrap .song_item');
    $songlist.removeClass('active').find('.play_gif').removeClass('show');
    let ii = [].findIndex.call($songlist, (item) => {
      let $item = $(item);
      return (
        $item.attr('data-id') == musicobj.id
      );
    });

    if (ii >= 0) {
      if (a) {
        let sp = $msuicContentBox.find('.list_items_wrap').scrollTop() + $songlist.eq(ii).position().top - 100;
        $msuicContentBox.find('.list_items_wrap').stop().animate(
          {
            scrollTop: sp,
          },
          _speed
        );
      }
      $songlist
        .eq(ii)
        .addClass('active')
        .find('.play_gif')
        .addClass('show');
    }
  }
}

//MV
$musicMvWrap.on('click', '.m_close', function (e) {
  videoPause();
  $musicMvWrap.stop().fadeOut(_speed);
}).on('click', '.m_back', function (e) {
  $musicMvWrap.find('.m_close').click();
});

$miniLrcWrap.find('.close').on('click', function () {
  $miniLrcWrap.stop().fadeOut(_speed)._isone = true;
});

//MV播放函数
function musicMv(obj) {
  musicobjInit(obj);
  csfz();
  audioPause();
  $myVideo.attr('src', `${musicobj.murl}`);
  videoPlay();
  $musicMvWrap.stop().fadeIn(_speed);
  setZindex($musicMvWrap);
  gaoliang(false);
  gaolianging(false);
  toggleLrcMenuWrapBtnsState();
  _postAjax('/player/updatemusicinfo', {
    history: 'y',
    lastplay: {
      id: musicobj.id,
      name: musicobj.name,
      artist: musicobj.artist,
      duration: musicobj.duration,
      mv: musicobj.mv
    },
    currentTime: $myAudio[0].currentTime,
    duration: musicobj.duration,
  },
    true
  ).then((result) => {
    if (result.code == 0) {
      sendCommand({ type: 'updatedata', flag: 'music' });
      if (!$musicPlayerBox.is(':hidden')) {
        if (
          _d.music &&
          _d.music.findIndex((item) => item.id === curSongListId) === 0 &&
          $msuicContentBox.find('.list_items_wrap').css('transform') === 'none'
        ) {
          renderMusicItem();
        }
      }
    }
  }).catch(err => { });
}
$myVideo[0].onerror = function (e) {
  _err(`MV加载失败`);
};
//拖动
var mmlist = $musicPlayerBox[0],
  musichide = $miniPlayer[0],
  lrcbotwrap = $miniLrcWrap[0];
drag($('.clock')[0], $('.clock')[0], 'lastmyclock');
drag($chatHeadBtns.find('.chat_title')[0], $chatRoomWrap[0]);
drag($userInfoWrap[0], $userInfoWrap[0]);
drag($logHeadBtns.find('.l_log_space')[0], $logWrap[0]);
drag($miniPlayer[0], $miniPlayer[0], 'lastmusichide');
drag($miniLrcWrap[0], $miniLrcWrap[0], 'lastwingc');
drag($musicMvWrap.find('.m_top_space')[0], $musicMvWrap[0]);
drag($musicHeadWrap.find('.song_list_name')[0], $musicPlayerBox[0]);
drag($editLrcWrap.find('.song_info_text')[0], $editLrcWrap[0]);


function drag(obj, oobj, lastweizi) {
  //记录最后所在的位置
  if (dmwidth > 800) {
    if (boxpositon.hasOwnProperty(lastweizi)) {
      oobj.style.left = boxpositon[lastweizi].left + 'px';
      oobj.style.top = boxpositon[lastweizi].top + 'px';
    }
  }
  obj.onmousedown = function (e) {
    if (dmwidth > 800) {
      zindexnum++;
      oobj.style.zIndex = zindexnum;
    }
    let ol = e.clientX - oobj.offsetLeft,
      ot = e.clientY - oobj.offsetTop;
    function move(e) {
      e.preventDefault();
      let left = e.clientX - ol,
        top = e.clientY - ot;
      oobj.style.left = left + 'px';
      oobj.style.top = top + 'px';
    }
    function up() {
      if (lastweizi) {
        boxpositon[lastweizi] = {
          left: oobj.offsetLeft,
          top: oobj.offsetTop,
        };
        if (dmwidth > 800) {
          _setData('lastweizi', boxpositon);
        }
      }
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', up);
    }
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
  };
}

//全屏
// let toFullScreen = () => {
//   let el = document.documentElement;
//   let rfs =
//     el.requestFullScreen ||
//     el.webkitRequestFullScreen ||
//     el.mozRequestFullScreen ||
//     el.msRequestFullScreen;
//   if (rfs) {
//     rfs.call(el);
//   } else if (typeof window.ActiveXObject != "undefined") {
//     let wscript = new ActiveXObject("WScript.Shell");
//     if (wscript != null) {
//       wscript.SendKeys("{F11}");
//     }
//   } else {
//     _err("Browser does not support full screen");
//   }
// };
//退出全屏
// let exitFullscreen = function () {
//   let el = parent.document;
//   let cfs =
//     el.cancelFullScreen ||
//     el.webkitCancelFullScreen ||
//     el.mozCancelFullScreen ||
//     el.exitFullScreen;
//   if (cfs) {
//     cfs.call(el);
//   } else if (typeof window.ActiveXObject != "undefined") {
//     let wscript = new ActiveXObject("WScript.Shell");
//     if (wscript != null) {
//       wscript.SendKeys("{F11}");
//     }
//   } else {
//     _err("Failed to switch, try ESC to exit");
//   }
// };


// 监听浏览器返回事件
function pushHistory() {
  window.history.pushState(null, '', myOpen());
}
pushHistory();
window.addEventListener('popstate', function (e) {
  pushHistory();
});
// 移动端触控效果
//主页
_mySlide({
  el: '#main',
  up(e) {
    if (!_getTarget(e, '#main', 1)) return;
    $rightBox.find('.show_music_player').click();
  },
  down(e) {
    if (!_getTarget(e, '#main', 1)) return;
    openbgku();
  },
  right(e) {
    if (!_getTarget(e, '#main', 1)) return;
    showAside();
  },
  left(e) {
    if (!_getTarget(e, '#main', 1)) return;
    $userLogoBtn.click();
  },
});
//左导航
_mySlide({
  el: '.aside_wrap',
  left() {
    hideAside();
  },
});
// 右边选项
_mySlide({
  el: '.right_menu_mask',
  right() {
    $rightBox.removeClass('open');
    $rightMenuMask.stop().fadeOut(_speed);
  },
});
// 歌词
_mySlide({
  el: '.music_lrc_wrap',
  right(e) {
    if (_getTarget(e, '.lrc_foot_wrap')) return;
    $lrcFootBtnWrap.find('.prev_play_btn').click();
  },
  down(e) {
    if (_getTarget(e, '.lrc_foot_wrap')) return;
    $lrcHead.find('.close').click();
  },
  left(e) {
    if (_getTarget(e, '.lrc_foot_wrap')) return;
    $lrcFootBtnWrap.find('.next_play').click();
  },
});
// 歌单
_mySlide({
  el: '.song_list_wrap',
  right() {
    $musicHeadWrap.find('.back').click();
  },
});
// 歌单列表
_mySlide({
  el: '.list_items_wrap',
  right() {
    $musicHeadWrap.find('.back').click();
  },
});
// 播放器底部控制
_mySlide({
  el: '.playing_song_info',
  right() {
    $lrcFootBtnWrap.find('.prev_play_btn').click();
  },
  left() {
    $lrcFootBtnWrap.find('.next_play').click();
  },
});
// 壁纸
_mySlide({
  el: '.all_bg_wrap',
  right(e) {
    $allBgWrap.find('.b_close_btn').click();
  },
});
_mySlide({
  el: '.video_box',
  right(e) {
    if (_getTarget(e, '.video_box', 1)) {
      $musicMvWrap.find('.m_close').click();
    }
  },
});
// 日志
_mySlide({
  el: '.log_content',
  right() {
    if (getSelectText() !== '') return;
    $logHeadBtns.find('.l_close_btn').click();
  },
});
// 聊天
_mySlide({
  el: '.chat_list_box',
  right() {
    if (getSelectText() !== '') return;
    $chatHeadBtns.find('.c_close_btn').click();
  },
});
// 播放列表
_mySlide({
  el: '.playing_list_mask',
  right() {
    $pMusicListBox.find('.p_foot').html('');
    $pMusicListBox
      .stop()
      .slideUp(_speed, () => {
        $playingListWrap.stop().fadeOut(_speed);
      });
  },
});
// 搜索列表
_mySlide({
  el: '.search_music_wrap',
  right() {
    $searchMusicWrap.stop().fadeOut(_speed);
    $musicHeadWrap.find('.search_music_inp').val('');
  },
});



function csfz() {
  if (!musicobj) return;
  $musicFootBox.find('.playing_song_info').text(`${musicobj.artist} - ${musicobj.name}`);
  $lrcHead.find('.song_name').text(musicobj.name);
  $lrcHead.find('.artist_name i').text(musicobj.artist);
  $myAudio.attr('src', `${musicobj.url}`);
  $playingSongLogo.css('background-image', `url("/img/musicbg.png")`);
  imgjz(
    musicobj.pic,
    () => {
      $playingSongLogo.css('background-image', `none`).find('img').attr('src', musicobj.pic).stop().fadeIn(_speed);
      $lrcBg.css('background-image', `url("${musicobj.pic}")`).removeClass('lrcbgss');
      $miniPlayer.css('background-image', `url("${musicobj.pic}")`);
      $musicPlayerBg.css('background-image', `url("${musicobj.pic}")`).removeClass('lrcbgss');
    },
    () => {
      $playingSongLogo.css('background-image', `none`).find('img')
        .attr('src', '/img/music.jpg')
        .stop()
        .fadeIn(_speed);
      $lrcBg.css('background-image', `url("/img/music.jpg")`).removeClass('lrcbgss');
      $miniPlayer.css('background-image', `url("/img/music.jpg")`);
      $musicPlayerBg.css('background-image', `url("/img/music.jpg")`).removeClass('lrcbgss');
    }
  );
}

$rightMenuMask.on('click', function (e) {
  if (_getTarget(e, '.right_menu_mask', 1)) {
    $rightBox.removeClass('open');
    $rightMenuMask.stop().fadeOut(_speed);
  }
});
$userLogoBtn.on('click',
  debounce(
    function (e) {
      $rightMenuMask.css('display', 'block');
      $rightBox.scrollTop(0);
      setZindex($rightMenuMask);
      _setTimeout(() => {
        $rightBox.addClass('open');
      }, 100);
    },
    500,
    true
  )
);





$userInfoWrap
  .on('click', '.edit_user_name', function (e) {
    let str = `
    <input autocomplete="off" placeholder="昵称" value="${encodeHtml(_d.userInfo.username)}" type="text">
    <button cursor class="mtcbtn">提交</button>`;
    rightMenu(
      e,
      str,
      debounce(
        function ({ close, e, inp }) {
          if (_getTarget(e, '.mtcbtn')) {
            let uname = inp[0];
            if (uname === _d.userInfo.username) return;
            if (!isUserName(uname)) {
              _err('昵称格式错误');
              return;
            }
            if (userlenght(uname)) {
              _err('昵称过长');
              return;
            }
            _postAjax('/user/changeusername', {
              username: uname,
            }).then((result) => {
              if (parseInt(result.code) === 0) {
                close();
                sendCommand({ type: 'updatedata', flag: 'userinfo' });
                handleuser();
                return;
              }
            }).catch(err => { });
          }
        },
        1000,
        true
      )
    );
  })
  .on(
    'click',
    '.dailybg',
    debounce(
      function () {
        _getAjax('/user/dailybg').then((result) => {
          if (parseInt(result.code) === 0) {
            handleuser();
            sendCommand({ type: 'updatedata', flag: 'userinfo' });
            _success(result.codeText);
            return;
          }
        }).catch(err => { });
      },
      500,
      true
    )
  ).on('click', '.u_close_btn', () => {
    $userInfoWrap.stop().fadeOut(_speed);
  }).on('click', '.user_logo div', (e) => {
    let str = `<div cursor class="mtcitem"><i class="iconfont icon-shangchuan1"></i><span>上传头像</span></div>
    <div cursor class="mtcitem1"><i class="iconfont icon-yanjing_xianshi_o"></i><span>查看</span></div>`;
    rightMenu(
      e,
      str,
      debounce(
        function ({ close, e }) {
          if (_getTarget(e, '.mtcitem')) {
            let input = document.createElement('input');
            input.type = 'file';
            input.accept = '.jpg,.png,.gif,.jpeg';
            input.style.display = 'none';
            document.body.appendChild(input);
            input.click();
            let $input = $(input);
            $input.change(async (e) => {
              var file = e.target.files[0];
              $input.remove();
              if (!isImgFile(file.name)) {
                _err('上传文件格式错误');
                return;
              }
              let blob;
              try {
                blob = await compressionImg(file, 800, 800); //压缩图片
                let pro = new UpProgress(file.name);
                _upFile(`/user/upuserlogo`, blob, function (pes) {
                  pro.update(pes);
                })
                  .then((result) => {
                    if (parseInt(result.code) === 0) {
                      pro.close();
                      close();
                      handleuser();
                      sendCommand({ type: 'updatedata', flag: 'userinfo' });
                      return;
                    }
                    return new Promise.reject();
                  })
                  .catch(() => {
                    pro.fail();
                  });
              } catch (error) {
                _err('上传失败');
                return;
              }
            });
          } else if (_getTarget(e, '.mtcitem1')) {
            imgPreview(
              [{ u1: `${mediaURL}/logo/${_d.userInfo.account}/${_d.userInfo.account}.png?v=${Math.random()}` }]
            );
          }
        },
        1000,
        true
      )
    );
  });
function handleUserinfo() {
  let str = `<ul><li>昵称</li><li>${encodeHtml(
    _d.userInfo.username
  )}</li><li cursor class="edit_user_name">修改</li></ul>
    <ul><li>账号</li><li>${_d.userInfo.account}</li></ul>
    <ul><li>壁纸</li><li>每日自动更换壁纸</li><li style="color: #1389a7;" class="dailybg iconfont ${_d.userInfo.dailybg && _d.userInfo.dailybg === 'y' ? 'icon-kaiguan-kai1' : 'icon-kaiguan-guan'}" cursor></li></ul>`;
  $userInfoWrap.find('.user_list').html(str);
  $userInfoWrap.find('.user_logo div').css(
    'background-image',
    `url(${mediaURL}/logo/${_d.userInfo.account}/${_d.userInfo.account
    }.png?v=${Math.random()})`
  );
}

//关于
$rightBox.on('click', '.user_name', function () {
  $rightBox.removeClass('open');
  $rightMenuMask.stop().fadeOut(_speed);
  handleUserinfo();
  $userInfoWrap.stop().fadeIn(_speed);
  setZindex($userInfoWrap);
}).on('click', '.r_about', debounce(
  function () {
    $rightBox.removeClass('open');
    $rightMenuMask.stop().fadeOut(_speed);
    openIframe('/note/?v=about', 'About');
  },
  1000,
  true
)).on('click', '.show_recycle', debounce(
  function () {
    $rightBox.removeClass('open');
    $rightMenuMask.stop().fadeOut(_speed);
    openIframe('/recycle', 'Recycle');
  },
  1000,
  true
)).on('click', '.show_log', () => {
  $rightBox.removeClass('open');
  $rightMenuMask.stop().fadeOut(_speed);
  setZindex($logWrap);
  $logWrap.stop().fadeIn(_speed, () => {
    $logWrap.css('display', 'flex');
    $logWrap.find('.log_page_size').val(curLogPageSize);
    logpage = 1;
    logxuanran(true);
  });
}).on('click', '.r_setting', debounce(
  function (e) {
    let str = `<div cursor class="mtcitem"><i class="iconfont icon-duoren"></i><span>账号管理</span></div>
                <div cursor class="mtcitem1"><i class="iconfont icon-huabi"></i><span>个性化</span></div>`;
    rightMenu(
      e,
      str,
      debounce(
        function ({ e, close }) {
          if (_getTarget(e, '.mtcitem')) {
            let str = `<div cursor class="mtcitem"><i class="iconfont icon-zhanghao"></i><span>个人信息</span></div>
              <div cursor class="mtcitem1"><i class="iconfont icon-suo"></i><span>修改密码</span></div>
              <div cursor class="mtcitem2"><i class="iconfont icon-zhuxiao"></i><span>注销账号</span></div>`;
            let flagClose = close;
            rightMenu(
              e,
              str,
              debounce(
                function ({ close, e }) {
                  if (_getTarget(e, '.mtcitem')) {
                    $rightBox.find('.user_name').click();
                    flagClose();
                    close();
                  } else if (_getTarget(e, '.mtcitem1')) {
                    let str = `
                    <input autocomplete="off" placeholder="原密码" type="password">
                    <input autocomplete="off" placeholder="新密码" type="password">
                    <input autocomplete="off" placeholder="确认密码" type="password">
                    <button cursor class="mtcbtn">提交</button>`;
                    rightMenu(e, str, debounce(function ({ close, e, inp }) {
                      if (_getTarget(e, '.mtcbtn')) {
                        let oldpassword = inp[0],
                          newpassword = inp[1],
                          newpassword1 = inp[2];
                        if (newpassword !== newpassword1) {
                          _err('密码不一致');
                          return;
                        };
                        _postAjax('/user/changepass', {
                          oldpassword: md5(oldpassword),
                          newpassword: md5(newpassword),
                        }).then((result) => {
                          if (parseInt(result.code) === 0) {
                            close();
                            _success(result.codeText);
                            return;
                          }
                        }).catch((_) => { });
                      }
                    }, 500, true));
                  } else if (_getTarget(e, '.mtcitem2')) {
                    alert('确认注销账号？', {
                      confirm: true,
                      handled: (m) => {
                        if (m === 'confirm') {
                          _postAjax('/user/delaccount', {}).then(
                            (result) => {
                              if (parseInt(result.code) === 0) {
                                alert(result.codeText, {
                                  handled: (_) => {
                                    _delData();
                                    myOpen('/login/');
                                  },
                                });
                                return;
                              }
                            }
                          ).catch(err => { });
                        }
                      },
                    });
                  }
                },
                1000,
                true
              )
            );
          } else if (_getTarget(e, '.mtcitem1')) {
            let dian = _getData('dian');
            let str = `<div cursor class="mtcitem"><i class="iconfont icon-bizhishezhi"></i><span>壁纸库</span></div>
                <div cursor class="mtcitem1"><i class="iconfont icon-mohu"></i><span>背景模糊</span></div>
              <div cursor class="mtcitem2"><i class="iconfont icon-heibai"></i><span>背景黑白</span></div>
              <div cursor class="mtcitem3"><i class="iconfont icon-font-size"></i><span>更换字体</span></div>
              <div cursor data-dian="${dian}" class="mtcitem6"><i class="iconfont icon-dianji"></i><span>点击爱心</span><i class="iconfont ${dian === 'y' ? 'icon-kaiguan-kai1' : 'icon-kaiguan-guan'}"></i></div>
              <div cursor class="mtcitem7"><i class="iconfont icon-jiazai"></i><span>加载动画</span></div>`;
            let flagClose = close;
            rightMenu(
              e,
              str,
              debounce(
                function ({ close, e }) {
                  let item6 = _getTarget(e, '.mtcitem6');
                  if (_getTarget(e, '.mtcitem')) {
                    flagClose();
                    close();
                    openbgku();
                  } else if (_getTarget(e, '.mtcitem1')) {
                    _progressBar(
                      curFilterBg / 100,
                      throttle(function (per) {
                        curFilterBg = parseInt(per * 100);
                        if (curFilterBg <= 0) {
                          $pageBg.removeClass('mh');
                        } else {
                          $pageBg.addClass('mh');
                        }
                        $pageBg.css({
                          filter: `blur(${curFilterBg}px)`,
                        });
                        _setData('filterbg', curFilterBg);
                      }, 500)
                    );
                  } else if (_getTarget(e, '.mtcitem2')) {
                    _progressBar(
                      curPageColor,
                      throttle(function (per) {
                        curPageColor = per;
                        document.documentElement.style.filter = `grayscale(${curPageColor})`;
                        _setData('pagecolor', curPageColor);
                      }, 500)
                    );
                  } else if (_getTarget(e, '.mtcitem3')) {
                    _getAjax('/user/getfont').then((res) => {
                      if (res.code == 0) {
                        res.data.sort((a, b) => mixedSort(a, b));
                        res.data.unshift('consolas.ttf');
                        let str = '';
                        res.data.forEach((item, idx) => {
                          let name = item.slice(0, -4);
                          str += `<div cursor data-font="${item}" class="mtcitem ${curFontType == item ? 'active' : ''}"><span style="font-size:16px">${(
                            idx +
                            1 +
                            ''
                          ).padStart(2, '0')}. </span>${item === 'consolas.ttf' ? '默认字体' : name
                            }</div>`;
                        });
                        rightMenu(
                          e,
                          str,
                          debounce(
                            function ({ e, items }) {
                              let _this = _getTarget(e, '.mtcitem');
                              if (_this) {
                                let $this = $(_this);
                                let $items = $(items);
                                $items.removeClass('active');
                                $this.addClass('active');
                                curFontType = $this.attr('data-font');
                                _setData('fonttype', curFontType);
                                handleFontType();
                              }
                            },
                            1000,
                            true
                          )
                        );
                      }
                    }).catch(err => { });
                  } else if (item6) {
                    let _this = $(item6);
                    let flag = _this.attr('data-dian');
                    if (flag === 'y') {
                      _this.attr('data-dian', 'n');
                      _this.html(`<i class="iconfont icon-dianji"></i><span>点击爱心</span><i class="iconfont icon-kaiguan-guan"></i>`);
                      _setData('dian', 'n');
                    } else {
                      _this.attr('data-dian', 'y');
                      _this.html(`<i class="iconfont icon-dianji"></i><span>点击爱心</span><i class="iconfont icon-kaiguan-kai1"></i>`);
                      _setData('dian', 'y');
                    }
                  } else if (_getTarget(e, '.mtcitem7')) {
                    let cur = _getData('loading');
                    let str = `<div cursor data-flag="n" style="justify-content: center;" class="mtcitem ${cur == 'n' ? 'active' : ''}"><span style="line-height:40px;">关闭</span></div>
                      <div cursor data-flag="y" style="justify-content: center;" class="mtcitem ${cur == 'y' ? 'active' : ''}"><span style="line-height:40px;">随机</span></div>`;
                    let [x, y] = loadingNum;
                    for (let i = x; i <= y; i++) {
                      str += `<div cursor data-flag="${i}" style="justify-content: center;" class="mtcitem ${cur == i ? 'active' : ''}"><img style="width:40px;height:40px" src="/img/loading${i}.gif"></div>`;
                    }
                    rightMenu(e, str, function ({ e, items }) {
                      let _this = _getTarget(e, '.mtcitem');
                      if (_this) {
                        let $items = $(items);
                        $items.removeClass('active');
                        _this.classList.add('active');
                        let flag = _this.getAttribute('data-flag');
                        _setData('loading', flag);
                        changeLoadImg();
                        _success();
                      }
                    });
                  }
                },
                500,
                true
              )
            );
          }
        },
        1000,
        true
      )
    );
  },
  1000,
  true
)).on('click', '.show_note', debounce(
  function () {
    $rightBox.removeClass('open');
    $rightMenuMask.stop().fadeOut(_speed);
    openIframe(`/notes/`, 'Notes');
  },
  1000,
  true
)).on('click', '.show_share_list', debounce(
  function () {
    $rightBox.removeClass('open');
    $rightMenuMask.stop().fadeOut(_speed);
    openIframe(`/sharelist/`, 'Sharelist');
  },
  1000,
  true
)).on('click', '.show_music_player', debounce(
  function () {
    $rightBox.removeClass('open');
    $rightMenuMask.stop().fadeOut(_speed);
    if (!$musicPlayerBox._mflag) {
      zidonghide(
        10,
        '.music_lrc_wrap',
        '.lrc_foot_wrap',
        debounce(
          function () {
            $lrcFootWrap.stop().slideDown(_speed, () => {
              $lrcFootWrap._flag = 'y';
              handleLrc();
            });
          },
          500,
          true
        ),
        debounce(
          function () {
            $lrcFootWrap.stop().slideUp(_speed, () => {
              $lrcFootWrap._flag = 'n';
              handleLrc();
            });
          },
          500,
          true
        ),
        '.lrc_menu_wrap'
      );
      $musicPlayerBox._mflag = true;
    }
    $miniPlayer.stop().fadeOut(_speed);
    $musicPlayerBox.stop().fadeIn(_speed, () => {
      renderMusicList();
    });
    setZindex($musicPlayerBox);
  },
  1000,
  true
)).on('click', '.log_out', () => {
  alert('退出当前，还是退出所有登录设备？', {
    confirm: true,
    button: {
      confirm: '退出当前',
      cancel: '退出所有',
    },
    handled: (m) => {
      if (m === 'close') return;
      let all = 'y';
      m === 'confirm' ? (all = 'n') : null;
      _getAjax('/user/signout', { all }).then((result) => {
        if (parseInt(result.code) === 0) {
          _delData('state');
          _setData('originurl', '/');
          myOpen('/login/');
          return;
        }
      }).catch(err => { });
    },
  });
}).on('click', '.user_managa', function () {
  openIframe(`/root`, '用户管理')
})

// 日志
var logpage = 1;
function logxuanrandefault() {
  let str = '';
  new Array(50).fill(null).forEach((v, i) => {
    let w = Math.round(Math.random() * (90 - 20) + 20);
    str += `<p style="pointer-events: none;background-color:rgb(255 255 255 / 20%);height:25px;width:100%;margin:10px 0;"></p>
            ${w % 2 === 0
        ? '<p style="pointer-events: none;background-color:rgb(255 255 255 / 20%);height:25px;width:100%;margin:10px 0;"></p>'
        : ''
      }
            <p style="pointer-events: none;background-color:rgb(255 255 255 / 20%);height:25px;width:${w}%;margin:10px 0;"></p>
      `;
  });
  $logContent.html(str).scrollTop(0);
}

function logxuanran(y) {
  if (y) {
    logxuanrandefault();
  }
  let context = $logHeadBtns.find('.l_search_inp').val().trim(),
    showpage = curLogPageSize;
  _getAjax('/root/logsearch', { page: logpage, context, showpage }).then(
    (result) => {
      if (parseInt(result.code) === 0) {
        if ($logWrap.is(':hidden')) return;
        let { total, totalPage, data, pageNo } = result.data;
        logpage = pageNo;
        let str = '';
        data.forEach((v) => {
          str += `<p>=>${encodeHtml(v)}</p>`;
        });
        if (totalPage > 1) {
          str += `<div class="log_paging_box">`;
          str += pagination({ pageNo, pageSize: showpage, total });
          str += `</div > `;
        }
        $logContent.html(str);
        if (y) {
          $logContent.scrollTop(0);
        }
        return;
      }
    }
  ).catch(err => { });
}
$logContent.on(
  'click',
  debounce(
    function (e) {
      let target = e.target,
        flag = target.getAttribute('data-flag');
      if (target.tagName === 'BUTTON') {
        if (flag === 'pre') {
          logpage--;
          logxuanran(true);
        } else if (flag === 'next') {
          logpage++;
          logxuanran(true);
        } else if (flag === 'go') {
          let val = document
            .querySelector('.log_content .paginationBox input')
            .value.trim();
          val = parseInt(val);
          if (isNaN(val)) return;
          logpage = val;
          logxuanran(true);
        } else if (flag === 'gotop') {
          $logContent.stop().animate(
            {
              scrollTop: 0,
            },
            _speed
          );
        } else {
          logpage = +flag;
          logxuanran(true);
        }
      }
    },
    500,
    true
  )
);

$logWrap.find('.log_page_size').on('change', function () {
  curLogPageSize = $(this).val();
  _setData('logshowpage', curLogPageSize);
  logpage = 1;
  logxuanran(true);
});
$logHeadBtns.on('click', '.l_close_btn', () => {
  $logWrap.stop().fadeOut(_speed, () => {
    $logWrap.css('display', 'none');
    $logContent.html('');
  });
}).on('click', '.l_back_btn', () => {
  $logHeadBtns.find('.l_close_btn').click();
}).on('click', '.l_regresh', throttle(function () {
  logpage = 1;
  logxuanran(true);
}, 500)).on('input', '.l_search_inp', debounce(function () {
  logpage = 1;
  logxuanran(true);
}, 1000)).on('click', '.l_clear_log', (e) => {
  alert(`确认清空日志？`, {
    confirm: true,
    handled: (m) => {
      if (m === 'confirm') {
        _postAjax('/root/logclear', {}).then((result) => {
          if (parseInt(result.code) === 0) {
            $logContent.html('');
            $logHeadBtns.find('.l_search_inp').val('');
            logpage = 1;
            return;
          }
        }).catch(err => { });
        return;
      }
    },
  });
});

// 留言板
let chatobj = {
  account: 'chang',
};
$chatHeadBtns.on('click', '.c_close_btn', function () {
  $chatRoomWrap.stop().fadeOut(_speed, () => {
    $chatListBox.find('.chat_list').html('');
    $chatHeadBtns.find('.search_msg_inp').val('');
  });
}).on('click', '.c_back_btn', function () {
  $chatHeadBtns.find('.c_close_btn').click();
}).on('click', '.clear_msg_btn', function () {
  let ac = chatobj.account;
  if (ac === 'chang' && _d.userInfo.account !== 'root') {
    _err('没有权限操作');
    return;
  }
  alert(`确认清空当前聊天记录？`, {
    confirm: true,
    handled: (msg) => {
      if (msg === 'confirm') {
        _postAjax('/chat/clearmsg', { ac }).then((result) => {
          if (parseInt(result.code) === 0) {
            $chatListBox.find('.chat_list').html('');
            sendCommand({
              type: 'chat',
              flag: 'clear',
              to: ac,
            });
          }
        }).catch(err => { });
        return;
      }
    },
  });
}).on('click', '.chat_home_btn', throttle(function () {
  if (_d.userInfo.account === 'root') {
    $chatHeadBtns.find('.clear_msg_btn').stop().fadeIn(_speed);
  } else {
    $chatHeadBtns.find('.clear_msg_btn').stop().fadeOut(_speed);
  }
  $chatHeadBtns.find('.search_msg_inp').val('');
  chatobj.account = 'chang';
  $chatHeadBtns.find('.chat_title').text('聊天室');
  $chatHeadBtns.find('.search_msg_inp').val('');
  _getAjax('/chat/getmsg', { acc: 'chang', stu: 0 }).then((result) => {
    if (parseInt(result.code) === 0) {
      if ($chatRoomWrap.is(':hidden')) return;
      let str = sxliuyan(result.data);
      $chatListBox.find('.chat_list').html(str);
      $chatListBox[0].scrollTop = $chatListBox[0].scrollHeight;
      chatimgLoad();
    }
  }).catch(err => { });
  $chatHeadBtns.find('.c_home_msg_alert').stop().fadeOut(_speed);
}, 500)).on('input', '.search_msg_inp', debounce(function () {
  let val = $chatHeadBtns.find('.search_msg_inp').val().trim();
  let pchatId = deepClone(chatobj);
  _getAjax('/chat/getmsg', { stu: 0, acc: pchatId.account, val }).then(
    (result) => {
      if (parseInt(result.code) === 0) {
        if ($chatRoomWrap.is(':hidden')) return;
        let str = sxliuyan(result.data);
        $chatListBox.find('.chat_list').html(str);
        $chatListBox[0].scrollTop = $chatListBox[0].scrollHeight;
        chatimgLoad();
      }
    }
  ).catch(err => { });
}, 1000)).on('click', '.c_user_btn', debounce(
  function (e) {
    $userListBox.stop().slideDown(_speed, () => {
      let a = $userListBox.children();
      if (a.length === 0) {
        chengyuandefault();
      }
      _getAjax('/chat/getmember').then((result) => {
        if (parseInt(result.code) === 0) {
          if ($chatRoomWrap.is(':hidden') || $userListBox.is(':hidden'))
            return;
          result.data.sort((a, b) => b.time - a.time);
          result.data.sort((a, b) =>
            b.online.localeCompare(a.online, 'en')
          );
          let str = '',
            rnum = Math.random();
          result.data.forEach((v) => {
            let { username, account, logo, online } = v;
            username = encodeHtml(username);
            str += `<ul cursor xx="${username}" xxx="${account}" class="user_item">
              <i x=${v.islook} class="msg_alert"></i>
              <li class="user_logo" style="${online === 'y' ? '' : 'filter: grayscale(1);'
              }background-image:url('${mediaURL}${logo}?v=${rnum}');"></li>
              <li class="user_name">${username}</li>
              <li style="font-size:14px;line-height:40px;flex:none;color:${online === 'y' ? 'green' : '#aaa'
              };">${online === 'y' ? '在线' : '离线'}</li>
              </ul>`;
          });
          $userListBox.html(str);
          $chatHeadBtns.find('.c_msg_alert').stop().fadeOut(_speed);
          return;
        }
      }).catch(err => { });
    });
  },
  500,
  true
));
// 渲染显示聊天内容
function sxliuyan(carr) {
  if (carr.length === 0) return '';
  let str = '',
    rnum = Math.random();
  carr.forEach((v, i) => {
    let { id, data, time, isrc, _from, _to, name, size, showTime } = v;
    let date = newDate('{0}-{1}-{2} {3}:{4}', time).split(' ');
    let showname = false;
    if (_to === 'chang') {
      showname = true;
    }
    data = encodeHtml(data);
    name = encodeHtml(name);
    let isright = _from === _d.userInfo.account ? true : false,
      textcolor = isright ? '#95EC69' : '#ffffff';
    if (showTime === 'y') {
      str += `<div style="text-align: center;color: #1389a7;font-size: 14px;padding-top: 10px;">${date[0]}</div>`;
    }
    str += `<ul class="chat_item" id="${id}" data-id="${id}" data-data="${data}" data-size="${size}" data-isrc="${isrc}" data-from="${_from}" data-name="${name}">`;
    if (!isright) {
      str += `<li class="c_left_logo">`;
      str += `<div class="c_logo" style="background-image: url(${mediaURL}/logo/${_from}/${_from}.png?v=${rnum});float: left;"></div>`;
      str += `</li>`;
    }
    str += `<li class="c_content_box">`;
    str += `<span class="c_user_name" style="text-align: ${!isright ? 'left' : 'right'
      };">${showname ? `${name}` : ''} <span style="color: #aaa;">${date[1]
      }</span></span>`;
    if (isrc) {
      if (isImgFile(isrc)) {
        str += `<div class="c_img_msg_box" style="float: ${!isright ? 'left' : 'right'
          };">
                    <div class="c_img"><span>${size}</span></div>`;
        if (isright) {
          str += `<span class="c_right_triangle" style="border-left-color:#ccc"><span>`;
        } else {
          str += `<span class="c_left_triangle" style="border-right-color:#ccc"><span>`;
        }
        str += `</div>`;
      } else if (extname(isrc)[1] == 'mp3' && size.slice(-1) == 's') {
        str += `<div class="c_voice_msg_box " style="float: ${!isright ? 'left' : 'right'
          };background-color: ${textcolor};">
            <i class="iconfont icon-yuyin1"></i><span style="font-size:12px;">${size}</span>`;
        if (isright) {
          str += `<span class="c_right_triangle" style="border-left-color:${textcolor}"><span>`;
        } else {
          str += `<span class="c_left_triangle" style="border-right-color:${textcolor}"><span>`;
        }
        str += `</div>`;
      } else {
        str += `<div title="${data}" class="c_file_msg_box" style="float: ${!isright ? 'left' : 'right'
          };">
            <div class="c_file_info">
              <span class="file_name">${data}</span>
              <span class="file_size">${size}</span>
            </div>
            <div class="file_type iconfont ${fileLogoType(data)}">
            </div>`;
        if (isright) {
          str += `<span class="c_right_triangle"><span>`;
        } else {
          str += `<span class="c_left_triangle"><span>`;
        }
        str += `</div>`;
      }
    } else {
      str += `<p class="c_text_msg_box" style="float: ${!isright ? 'left' : 'right'
        };background-color: ${textcolor};">${data}`;
      if (isright) {
        str += `<span class="c_right_triangle" style="border-left-color:${textcolor}"><span>`;
      } else {
        str += `<span class="c_left_triangle" style="border-right-color:${textcolor}"><span>`;
      }
      str += `</p>`;
    }
    str += `</li>`;
    if (isright) {
      str += `<li class="c_right_logo">`;
      str += `<div class="c_logo" style="background-image: url(${mediaURL}/logo/${_from}/${_from}.png?v=${rnum});float: right;"></div>`;
      str += `</li>`;
    }
    str += `</ul>`;
  });
  return str;
}
//处理聊天图片
function chatimgLoad() {
  $chatListBox.find('.c_img').each((i, v) => {
    let $v = $(v),
      isload = $v.attr('isload');
    if (isload !== 'true') {
      $v.attr('isload', true);
      let url = (
        mediaURL + $v.parent().parent().parent().attr('data-isrc')
      ).replace('upload', 'uploadys');
      imgjz(
        url,
        () => {
          $v.css('background-image', `url(${url})`);
        },
        () => {
          $v.css('background-image', `url('/img/gqimg.png')`);
        }
      );
    }
  });
}

// 浏览器通知
function tongzhi(name, data) {
  playSound(`/img/notice.mp3`);
  _success(`${name}: ${data}`);
  // try {
  //   if (window.Notification.permission == "granted") {
  //     new Notification(name, {
  //       body: data,
  //     });
  //   } else if (window.Notification.permission != "denied") {
  //     window.Notification.requestPermission(function (permission) {
  //       new Notification(name, {
  //         body: data,
  //       });
  //     });
  //   }
  // } catch (error) {

  // }
}

//打开聊天窗
$showChatRoomBtn.on('click',
  debounce(
    function () {
      let obj = deepClone(chatobj);
      setZindex($chatRoomWrap);
      if (obj.account === 'chang') {
        if (_d.userInfo.account === 'root') {
          $chatHeadBtns.find('.clear_msg_btn').stop().fadeIn(_speed);
        } else {
          $chatHeadBtns.find('.clear_msg_btn').stop().fadeOut(_speed);
        }
      } else {
        $chatHeadBtns.find('.clear_msg_btn').stop().fadeIn(_speed);
      }
      //隐藏主页消息提示
      $showChatRoomBtn.find('.g_chat_msg_alert').stop().fadeOut(_speed);
      $chatRoomWrap.stop().fadeIn(_speed, () => {
        //获取消息
        $chatHeadBtns.find('.search_msg_inp').val('');
        _getAjax('/chat/getmsg', { acc: obj.account, stu: 0 }).then(
          (result) => {
            if (parseInt(result.code) === 0) {
              if ($chatRoomWrap.is(':hidden')) return;
              let str = sxliuyan(result.data);
              $chatListBox.find('.chat_list').html(str);
              $chatListBox[0].scrollTop =
                $chatListBox[0].scrollHeight;
              chatimgLoad();
              //获取是否有未读私聊消息
              _getAjax('/chat/getnews', { a: 2 }).then((result) => {
                if (parseInt(result.code) === 0) {
                  $chatHeadBtns.find('.c_msg_alert').stop().fadeOut(_speed);
                } else {
                  $chatHeadBtns.find('.c_msg_alert').stop().fadeIn(_speed);
                }
              }).catch(err => { });
              //获取是否有群消息未读
              _getAjax('/chat/getnews', { a: 1 }).then((result) => {
                if (parseInt(result.code) === 0) {
                  $chatHeadBtns.find('.c_home_msg_alert').stop().fadeOut(_speed);
                } else {
                  $chatHeadBtns.find('.c_home_msg_alert').stop().fadeIn(_speed);
                }
              }).catch(err => { });
            }
          }
        ).catch(err => { });
      });
    },
    500,
    true
  )
);

let msgtimer = null;
$chatListBox
  .on('click', '.c_logo', function (e) {
    //点击用户头像私聊
    let a = $(this).parent().parent().attr('data-from'),
      b = $(this).parent().parent().attr('data-name'),
      obj = deepClone(chatobj);
    //忽略自己点自己头像或在私聊
    if (a === _d.userInfo.account) {
      imgPreview([{ u1: `${mediaURL}/logo/${a}/${a}.png?v=${Math.random()}` }]);
      return;
    }
    let str = `
    <div cursor class="mtcitem2" style="justify-content: center;">${b}</div>
    ${obj.account == 'chang' ? '<div cursor class="mtcitem"><i class="iconfont icon-huaban"></i><span>发送消息</span></div>' : ''
      }
    <div cursor class="mtcitem1"><i class="iconfont icon-bijiben"></i><span>查看笔记</span></div>
    `;
    rightMenu(
      e,
      str,
      debounce(
        function ({ close, e }) {
          if (_getTarget(e, '.mtcitem')) {
            $chatHeadBtns.find('.chat_title').text(b);
            chatobj.account = a;
            $chatHeadBtns.find('.clear_msg_btn').stop().fadeIn(_speed);
            $chatHeadBtns.find('.search_msg_inp').val('');
            _getAjax('/chat/getmsg', { acc: a, stu: 0 }).then((result) => {
              if (parseInt(result.code) === 0) {
                if ($chatRoomWrap.is(':hidden')) return;
                close();
                let str = sxliuyan(result.data);
                $chatListBox.find('.chat_list').html(str);
                $chatListBox[0].scrollTop =
                  $chatListBox[0].scrollHeight;
                chatimgLoad();
              }
            }).catch(err => { });
          } else if (_getTarget(e, '.mtcitem1')) {
            let url = `/allnote/#${a}`;
            openIframe(url, b);
            close();
          } else if (_getTarget(e, '.mtcitem2')) {
            imgPreview([{ u1: `${mediaURL}/logo/${a}/${a}.png?v=${Math.random()}` }]);
          }
        },
        1000,
        true
      )
    );
  })
  .on('click', '.c_file_msg_box', function (e) {
    //下载文件
    let aa = $(this).parent().parent().attr('data-isrc');
    //查看文件是否过期
    _getAjax('/chat/isexpired', { name: aa }).then((result) => {
      if (parseInt(result.code) === 0) {
        if (isios()) {
          myOpen(mediaURL + aa);
        } else {
          myOpen(mediaURL + aa, 'blank');
        }
        return;
      }
      _err('文件已过期');
    }).catch(err => { });
  })
  .on('contextmenu', '.c_content_box', function (e) {
    //操作消息
    e.preventDefault();
    let $this = $(this),
      x = $this.parent().attr('data-id'),
      n = $this.parent().attr('data-data'),
      s = $this.parent().attr('data-size'),
      y = $this.parent().attr('data-isrc'),
      z = null,
      f = $this.parent().attr('data-from');
    let $z = $this.parent().find('.c_text_msg_box');
    if ($z.length > 0) {
      z = $z[0].innerText;
    }
    backmsg(e, x, y, z, f, n, s);
  })
  .on('click', '.c_voice_msg_box', function (e) {
    //播放语音
    let a = $(this).parent().parent().attr('data-isrc');
    //检查语音是否过期
    openyuy(mediaURL + a, this);
  })
  .on('click', '.c_img', function (e) {
    //打开图片
    let a = $(this).parent().parent().parent().attr('data-isrc'),
      b = a.replace('upload', 'uploadys');
    // 检查图片是否过期
    _getAjax('/chat/isexpired', { name: a }).then((result) => {
      if (parseInt(result.code) === 0) {
        imgPreview([{ u1: mediaURL + a, u2: mediaURL + b }]);
        return;
      }
      _err('图片已过期');
    }).catch(err => { });
  })
  .on(
    'scroll',
    debounce(function () {
      //向上滚动获取前面聊天内容
      if (
        $chatListBox[0].scrollHeight -
        $chatListBox.outerHeight() -
        $chatListBox[0].scrollTop >
        100
      ) {
        $chatRoomWrap.find('.scroll_to_bot_btn').stop().fadeIn(_speed);
        if (msgtimer) {
          clearTimeout(msgtimer);
          msgtimer = null;
        }
        msgtimer = setTimeout(() => {
          $chatRoomWrap.find('.scroll_to_bot_btn').stop().fadeOut(_speed);
        }, 3000);
      }
      let nomore = $chatListBox.find('.nomore');
      if (
        $chatListBox.find('.chat_list').outerHeight() <
        $chatListBox.outerHeight() ||
        nomore.length > 0
      )
        return;
      if (this.scrollTop <= 30) {
        let fristel = $chatListBox.find('.chat_item').eq(0);
        let flag = fristel.attr('data-id');
        let val = $chatHeadBtns.find('.search_msg_inp').val().trim();
        _getAjax('/chat/getmsg', {
          flag,
          acc: chatobj.account,
          stu: 1,
          val,
        }).then((result) => {
          if (parseInt(result.code) === 0) {
            if ($chatRoomWrap.is(':hidden')) return;
            let str = sxliuyan(result.data);
            if (str === '') {
              str += `<div class="nomore" style="text-align: center;font-size: 14px;color: #cdb;">没有更多了<div>`;
            }
            $chatListBox.find('.chat_list').prepend(str);
            $chatListBox.scrollTop(fristel.position().top - 50);
            chatimgLoad();
          }
        }).catch(err => { });
      }
    }, 200)
  );
$chatRoomWrap.on('click', '.scroll_to_bot_btn', function () {
  $chatListBox.animate(
    {
      scrollTop: $chatListBox[0].scrollHeight,
    },
    _speed
  );
});

if (isios()) {
  $chatListBox[0]._longPress('.c_content_box', function (e) {
    let $this = $(this),
      x = $this.parent().attr('data-id'),
      y = $this.parent().attr('data-isrc'),
      n = $this.parent().attr('data-data'),
      s = $this.parent().attr('data-size'),
      z = null,
      f = $this.parent().attr('data-from'),
      ev = e.changedTouches[0];
    let $z = $this.parent().find('.c_text_msg_box');
    if ($z.length > 0) {
      z = $z[0].innerText;
    }
    backmsg(ev, x, y, z, f, n, s);
  });
}
//操作消息
function backmsg(e, tt, y, z, f, n, s) {
  let obj = deepClone(chatobj),
    str = `${y === 'null'
      ? `${isurl(z) ? '<div cursor class="mtcitem4"><i class="iconfont icon-link"></i><span>打开链接</span></div>' : ''}
      <div cursor class="mtcitem1"><i class="iconfont icon-fuzhi"></i><span>复制</span></div>
      <div cursor class="mtcitem2"><i class="iconfont icon-bianji"></i><span>编辑</span></div>`
      : '<div cursor class="mtcitem3"><i class="iconfont icon-xiazai"></i><span>下载</span></div>'
      }
            ${f === _d.userInfo.account
        ? '<div cursor class="mtcitem"><i class="iconfont icon-chexiao"></i><span>撤回</span></div>'
        : ''
      }`;
  rightMenu(
    e,
    str,
    debounce(
      function ({ close, e }) {
        if (_getTarget(e, '.mtcitem')) {
          _postAjax('/chat/delmsg', { tt }).then((result) => {
            if (parseInt(result.code) === 0) {
              close();
              sendCommand({
                type: 'chat',
                flag: 'del',
                to: obj.account,
                tt,
              });
              let $msg = $chatListBox.find(`#${tt}`);
              $msg.stop().slideUp(_speed, () => {
                $msg.remove();
              });
              return;
            }
          }).catch(err => { });
        } else if (_getTarget(e, '.mtcitem1')) {
          copyText(z);
          close();
        } else if (_getTarget(e, '.mtcitem2')) {
          let local = _getData('md'),
            obj = {
              name: `hello_${Date.now()}`,
              data: z,
            };
          local.push(obj);
          _setData('md', local);
          openIframe(`/edit/#${obj.name}`, 'Edit');
          close();
        } else if (_getTarget(e, '.mtcitem3')) {
          let type = null;
          if (isImgFile(y)) {
            type = '图片';
          } else if (extname(y)[1] == 'mp3' && s.slice(-1) == 's') {
            type = '语音';
          } else {
            type = '文件';
          }
          if (!type) return;
          _getAjax('/chat/isexpired', { name: y }).then((result) => {
            if (parseInt(result.code) === 0) {
              close();
              downloadFile(`/getfile${y}`, n);
              return;
            }
            _err(`${type}已过期`);
          }).catch(err => { });
        } else if (_getTarget(e, '.mtcitem4')) {
          myOpen(z, '_blank');
        }
      },
      1000,
      true
    )
  );
}

// 播放语音
function openyuy(a, _this) {
  let pflag = $chatAudio.playflag,
    reg = /\/upload\/([a-zA-Z0-9]+)\.mp3$/,
    _flag = reg.exec(a)[1];
  $chatAudio[0].pause();
  $chatListBox.find('.c_voice_msg_box i').css('animation', 'none');
  if (pflag === _flag) {
    $chatAudio.playflag = '';
    return;
  }
  $chatAudio.playflag = _flag;
  $chatAudio[0].src = a;
  $chatAudio[0].play();
  $(_this)
    .children('i')
    .css('animation', 'fontcolor .5s infinite linear alternate');
}
$chatAudio
  .on('ended', function () {
    $chatAudio.playflag = '';
    $chatListBox.find('.c_voice_msg_box i').css('animation', 'none');
  })
  .on('error', function () {
    _err('语音已过期');
    $chatAudio.playflag = '';
    $chatListBox.find('.c_voice_msg_box i').css('animation', 'none');
  });


function sendText() {
  let pchatId = deepClone(chatobj),
    pdata = $chatFootBox.find('.c_text_msg')[0].innerText.trim();
  $chatFootBox.find('.c_sent_msg_btn').attr('x', 1).children('i').attr('class', 'iconfont icon-jiahao');
  if (pdata === '') {
    $chatFootBox.find('.c_text_msg')[0].innerText = '';
    return;
  }
  $chatFootBox.find('.c_text_msg')[0].innerText = '';
  let obj = {
    data: pdata,
    _from: _d.userInfo.account,
  };
  sendmasg(obj, pchatId);
}
// 发送消息
function sendmasg(obj, pchatId) {
  obj._to = pchatId.account;
  _postAjax('/chat/takemsg', { obj }).then((result) => {
    if (parseInt(result.code) === 0) {
      sendCommand({
        type: 'chat',
        flag: 'addmsg',
        to: pchatId.account,
      });
      if (pchatId.account === chatobj.account) {
        debounceGetNewMsg(true);
      }
      return;
    }
  }).catch(err => { });
}
let debounceGetNewMsg = debounce(getNewMsg, 1000);
function getNewMsg(y) {
  let pchatId = deepClone(chatobj);
  let $lastItem = $chatListBox
    .find('.chat_item')
    .last();
  let flag = $lastItem.attr('data-id');
  $chatHeadBtns.find('.search_msg_inp').val('');
  _getAjax('/chat/getmsg', { stu: 2, acc: pchatId.account, flag }).then(
    (result) => {
      if (parseInt(result.code) === 0) {
        if ($chatRoomWrap.is(':hidden')) return;
        playSound(`/img/blop.mp3`);
        let str = sxliuyan(result.data);
        $chatListBox.find('.chat_list').append(str);
        if (y) {
          $chatListBox.stop().animate(
            {
              scrollTop: $chatListBox[0].scrollHeight,
            },
            1000
          );
        }
        chatimgLoad();
      }
    }
  ).catch(err => { });
}

// 文件消息对象
function msginfo(HASH, suffix, yname, fsize) {
  let obj = {
    isrc: `/upload/${HASH}.${suffix}`,
    data: yname,
    size: computeSize(fsize),
    _from: _d.userInfo.account,
  };
  return obj;
}
// 发送文件
$chatFootBox.on('click', '.c_sent_msg_btn', function () {
  if ($(this).attr('x') == 1) {
    let pchatId = deepClone(chatobj),
      input = document.createElement('input');

    input.type = 'file';
    input.multiple = 'multiple';

    input.style.display = 'none';
    document.body.appendChild(input);
    input.click();
    let $input = $(input);

    $input.change(async (e) => {
      var files = [...e.target.files];
      $input.remove();
      if (files.length == 0) return;
      sendfile(files, pchatId);
    });
  } else {
    sendText();
  }
}).on('click', '.c_change_btn', function () {
  const $this = $(this);
  if ($this.attr('x') == 1) {
    $chatFootBox.find('.c_get_voice_btn').css('display', 'block');
    $chatFootBox.find('.c_text_msg').css('display', 'none');
    $this
      .attr('x', 2)
      .children('i')
      .attr('class', 'iconfont icon-w_jianpan');
    $chatFootBox.find('.c_sent_msg_btn').attr('x', 1).children('i').attr('class', 'iconfont icon-jiahao');
  } else {
    $chatFootBox.find('.c_get_voice_btn').css('display', 'none');
    $chatFootBox.find('.c_text_msg').css('display', 'block');
    $this.attr('x', 1).children('i').attr('class', 'iconfont icon-yuyin');
    if ($chatFootBox.find('.c_text_msg')[0].innerText.length !== 0) {
      $chatFootBox.find('.c_sent_msg_btn')
        .attr('x', 2)
        .children('i')
        .attr('class', 'iconfont icon-huaban');
    }
  }
}).on('input', '.c_text_msg', function () {
  if ($(this).text() === '') {
    $chatFootBox.find('.c_sent_msg_btn').attr('x', 1).children('i').attr('class', 'iconfont icon-jiahao');
  } else {
    $chatFootBox.find('.c_sent_msg_btn').attr('x', 2).children('i').attr('class', 'iconfont icon-huaban');
  }
}).on('keydown', '.c_text_msg', function (e) {
  if (e.key == 'Enter') {
    e.preventDefault();
    sendText();
  }
});
// 拖拽发送文件
~(function () {
  let guestb = $chatRoomWrap[0];
  guestb.addEventListener('dragenter', function (e) {
    e.preventDefault();
  });
  guestb.addEventListener('dragover', function (e) {
    e.preventDefault();
  });
  guestb.addEventListener('drop', function (e) {
    e.preventDefault();
    var files = [...e.dataTransfer.files],
      pchatId = deepClone(chatobj);
    if (files.length == 0) return;
    sendfile(files, pchatId);
  });
})();
// 递归发送文件
function sendfile(files, pchatId) {
  ~(async function fn(num) {
    if (num >= files.length) {
      return;
    }
    let { name, size } = files[num];
    let pro = new UpProgress(name);
    if (size == 0) {
      pro.fail('发送失败');
      _err(`${name} 为空文件`);
      num++;
      fn(num);
      return;
    }
    try {
      let { chunks, count, suffix, HASH } = await fileSlice(
        files[num],
        (pes) => {
          pro.loading(pes);
        }
      );
      if (isImgFile(name)) {
        // 压缩图片
        chunks.push({
          file: await compressionImg(files[num]),
          filename: `_hello`,
        });
        ++count;
      }
      let breakpointarr = (await _postAjax('/chat/breakpoint', { HASH }))
        .data, //断点续传
        isrepeat = await _postAjax('/chat/repeatfile', {
          name: `${HASH}.${suffix}`,
        }), //是否已经存在文件
        obj = msginfo(HASH, suffix, name, files[num].size); //生成消息对象

      function compale(index) {
        pro.update(index / count);
      }

      if (parseInt(isrepeat.code) === 0) {
        //文件已经存在操作
        pro.close('发送成功');
        sendmasg(obj, pchatId);
        ++num;
        fn(num);
        return;
      }

      let index = breakpointarr.length;
      compale(index);
      ~(async function fnn(numm) {
        if (numm >= chunks.length) {
          let aa = await _postAjax('/chat/mergefile', {
            HASH,
            count,
            name: `${HASH}.${suffix}`,
          }); //合并切片
          if (parseInt(aa.code) === 0) {
            pro.close('发送成功');
            sendmasg(obj, pchatId);
          } else {
            pro.fail('发送失败');
            _err(`${files[num].name} 发送失败`);
          }
          num++;
          fn(num);
          return;
        }
        let { filename, file } = chunks[numm];
        if (breakpointarr.includes(filename)) {
          numm++;
          fnn(numm);
          return;
        }
        _upFile(`/chat/up?name=${filename}&HASH=${HASH}`, file).finally(
          () => {
            index++;
            compale(index);
            numm++;
            fnn(numm);
          }
        );
      })(0);
    } catch (error) {
      pro.fail('发送失败');
      num++;
      fn(num);
    }
  })(0);
}
// 录音

~(function () {
  let rec = null;
  function start() {
    rec = Recorder();
    rec.open(
      () => {
        rec.start();
      },
      () => {
        if (!rec) return;
        rec.close();
        rec = null;
        _err('没有打开权限或浏览器不支持语音输入');
      }
    );
  }
  function stop(success, error) {
    if (!rec) return;
    rec.stop(
      (blob, duration) => {
        rec.close();
        rec = null;
        success && success(blob, duration);
      },
      (msg) => {
        rec.close();
        rec = null;
        error && error(msg);
      }
    );
  }
  window._rec = {
    start,
    stop,
  };
})();
// 语音发送
function uploadRec(blob, duration) {
  let pchatId = deepClone(chatobj);
  let fileReader = new FileReader();
  fileReader.readAsArrayBuffer(blob);
  fileReader.onload = (e) => {
    let buffer = e.target.result,
      spark = new SparkMD5.ArrayBuffer();
    spark.append(buffer);
    let HASH = spark.end();

    var formData = new FormData();

    formData.append('attrname', blob, 'recorder.mp3');
    let pro = new UpProgress(`recorder.mp3`);
    $.ajax({
      type: 'post',
      data: formData,
      url: `${serverURL}/chat/upp?name=${HASH}.mp3`,
      xhrFields: {
        withCredentials: true,
      },
      contentType: false,
      processData: false,
      xhr: function () {
        var xhr = new XMLHttpRequest();
        //使用XMLHttpRequest.upload监听上传过程，注册progress事件，打印回调函数中的event事件
        xhr.upload.addEventListener('progress', function (e) {
          //loaded代表上传了多少
          //total代表总数为多少
          var pes = e.loaded / e.total;
          pro.update(pes);
        });
        return xhr;
      },
      success: (data) => {
        pro.close('发送成功');
        let obj = {
          isrc: `/upload/${HASH}.mp3`,
          data: '语音',
          size: (duration / 1000).toFixed(2) + 's',
          _from: _d.userInfo.account,
        };
        sendmasg(obj, pchatId);
        playSound(`/img/voice.mp3`);
      },
      error: () => {
        pro.fail('发送失败');
        _err('发送失败');
      },
    });
  };
}
~(function () {
  let x = null,
    y = null;
  $chatFootBox.find('.c_get_voice_btn')
    .on('touchstart', function (e) {
      e.preventDefault();
      $chatFootBox.find('.c_get_voice_btn').addClass('gren');
      x = e.changedTouches[0].clientX;
      y = e.changedTouches[0].clientY;
      _rec.start();
    })
    .on('touchend', function (e) {
      e.preventDefault();
      $chatFootBox.find('.c_get_voice_btn').removeClass('gren');
      let xx = e.changedTouches[0].clientX,
        yy = e.changedTouches[0].clientY;
      if (Math.abs(x - xx) > 60 || Math.abs(y - yy) > 60) {
        _rec.stop();
        return;
      }
      _rec.stop(
        (blob, duration) => {
          uploadRec(blob, duration);
        },
        () => {
          _err('发送失败');
        }
      );
    })
    .on('mousedown', function () {
      $chatFootBox.find('.c_get_voice_btn').addClass('gren');
      _rec.start();
    });
  $document.on('mouseup', function (e) {
    $chatFootBox.find('.c_get_voice_btn').removeClass('gren');
    if (_getTarget(e, '.c_get_voice_btn')) {
      _rec.stop(
        (blob, duration) => {
          uploadRec(blob, duration);
        },
        () => {
          _err('发送失败');
        }
      );
    } else {
      _rec.stop();
    }
  });
})();
// 显示好友
$chatRoomWrap.on('click', function (e) {
  if (!_getTarget(e, '.user_list_box') && !_getTarget(e, '.c_user_btn')) {
    $userListBox.stop().slideUp(_speed, () => {
      $userListBox.html('');
    });
  }
});
function chengyuandefault() {
  let str = '';
  new Array(50).fill(null).forEach(() => {
    str += `<ul style="pointer-events: none;" class="user_item">
              <li class="user_logo"></li>
              <li class="user_name"></li>
              <li></li>
              </ul>`;
  });
  $userListBox.html(str);
}

// 显示好友消息
$userListBox.on('click', '.user_item', function (e) {
  let b = $(this).attr('xx'),
    a = $(this).attr('xxx');
  if (!b || !a) return;
  if (_getTarget(e, '.user_logo')) {
    imgPreview([{ u1: `${mediaURL}/logo/${a}/${a}.png?v=${Math.random()}` }]);
    return;
  }
  if (_d.userInfo.account == a) return;
  let str = `
    <div cursor class="mtcitem2" style="justify-content: center;">${b}</div>
    <div cursor class="mtcitem"><i class="iconfont icon-huaban"></i><span>发送消息</span></div>
    <div cursor class="mtcitem1"><i class="iconfont icon-bijiben"></i><span>查看笔记</span></div>
    `;
  rightMenu(
    e,
    str,
    debounce(
      function ({ close, e }) {
        if (_getTarget(e, '.mtcitem')) {
          $chatHeadBtns.find('.chat_title').text(b);
          chatobj.account = a;
          $chatHeadBtns.find('.clear_msg_btn').stop().fadeIn(_speed);
          $chatHeadBtns.find('.search_msg_inp').val('');
          _getAjax('/chat/getmsg', { acc: a, stu: 0 }).then((result) => {
            if (parseInt(result.code) === 0) {
              if ($chatRoomWrap.is(':hidden')) return;
              close();
              $userListBox.stop().slideUp(_speed, () => {
                $userListBox.html('');
              });
              let str = sxliuyan(result.data);
              $chatListBox.find('.chat_list').html(str);
              $chatListBox[0].scrollTop =
                $chatListBox[0].scrollHeight;
              chatimgLoad();
            }
          }).catch(err => { });
        } else if (_getTarget(e, '.mtcitem1')) {
          let url = `/allnote/#${a}`;
          openIframe(url, b);
          close();
          $userListBox.stop().slideUp(_speed, () => {
            $userListBox.html('');
          });
        } else if (_getTarget(e, '.mtcitem2')) {
          imgPreview([{ u1: `${mediaURL}/logo/${a}/${a}.png?v=${Math.random()}` }]);
        }
      },
      1000,
      true
    )
  );
});
// 天气
$.ajax({
  type: 'get',
  url: 'https://widget-v3.seniverse.com/api/weather/e14489a8-9a7e-477d-9c6c-b4b390175cca?unit=c&language=auto&location=WX4FBXXFKE4F&geolocation=true&detected=zh-cn',
  dataType: 'json',
  contentType: 'application/json;charset=UTF-8',
  xhrFields: {
    withCredentials: true,
  },
  success: (data) => {
    try {
      let w = data.results[0].data[0],
        { location, text, today, suggestion } = w,
        str = `<span>${location}</span>
          <span>${text}</span>
          <span>${parseInt(today.low)}~${today.high}</span>
          <span>${suggestion}</span>`;
      $('.weather_box').html(str);
    } catch (error) {
      $('.weather_box').stop().fadeOut(_speed);
    }
  },
  error: (err) => {
    $('.weather_box').stop().fadeOut(_speed);
  },
});

//桌面大小改变自适应
window.addEventListener(
  'resize',
  throttle(function () {
    let w = window.innerWidth;
    if (w === dmwidth || !_d.userInfo) return;
    if (dmwidth > 800 && w <= 800) {
      //大屏变小屏幕
      $clock.stop().fadeOut(_speed); //隐藏时钟
      //更改背景
      if (_d.userInfo.bgxs != '') {
        $pageBg.css(
          'background-image',
          `url(${mediaURL}/bg/bgxs/${_d.userInfo.bgxs})`
        ).attr('data-bg', _d.userInfo.bgxs);
      } else {
        $pageBg.css('background-image', `url(/img/bg.svg)`).attr('data-bg', '');
      }
      $('.iframe_warp').css({
        top: '50%',
        left: '50%',
      });
      $musicPlayerBox.css({
        top: '50%',
        left: '50%',
      });
      $userInfoWrap.css({
        top: '50%',
        left: '50%',
      });
      $editLrcWrap.css({
        top: '50%',
        left: '50%',
      });
      $chatRoomWrap.css({
        top: '50%',
        left: '50%',
      });
      $logWrap.css({
        top: '50%',
        left: '50%',
      });
      $musicMvWrap.css({
        top: '50%',
        left: '50%',
      });
      if (!$miniLrcWrap.is(':hidden')) {
        lrcbotwrap.style.display = 'none';
        lrcbotwrap.isshow = true;
      } else {
        lrcbotwrap.isshow = false;
      }
      if (!$miniPlayer.is(':hidden')) {
        musichide.style.display = 'none';
        musichide.isshow = true;
      } else {
        musichide.isshow = false;
      }
    } else if (dmwidth <= 800 && w > 800) {
      //小屏变大屏
      $clock.stop().fadeIn(_speed);
      if (_d.userInfo.bg != '') {
        $pageBg.css(
          'background-image',
          `url(${mediaURL}/bg/bg/${_d.userInfo.bg})`
        ).attr('data-bg', _d.userInfo.bg);
      } else {
        $pageBg.css('background-image', `url(/img/bg.svg)`).attr('data-bg', '');
      }
      if (lrcbotwrap.isshow) {
        lrcbotwrap.style.display = 'block';
      }
      if (musichide.isshow) {
        musichide.style.display = 'block';
      }
    }
    dmwidth = w;
    bgxuanran(true);
  }, 1000)
);
//个人中心
function handleuser() {
  _getAjax('/user/getuserinfo').then((result) => {
    if (parseInt(result.code) === 0) {
      _d.userInfo = result.data;
      _d.myTitle = `Hello ${_d.userInfo.username}`;
      _setData('account', _d.userInfo.username);
      if ($myAudio[0].paused) {
        document.title = _d.myTitle;
      }
      $rightBox.find('.user_name')
        .text(_d.userInfo.username)
        .attr('title', _d.userInfo.username)
        .stop()
        .fadeIn(_speed);
      $userLogoBtn.css(
        'background-image',
        `url(${mediaURL}/logo/${_d.userInfo.account}/${_d.userInfo.account
        }.png?v=${Math.random()})`
      );
      if (dmwidth > 800) {
        $pageBg.css(
          'background-image',
          _d.userInfo.bg ? `url(${mediaURL}/bg/bg/${_d.userInfo.bg})` : '/img/bg.svg'
        ).attr('data-bg', _d.userInfo.bg ? _d.userInfo.bg : '');
      } else {
        $pageBg.css(
          'background-image',
          _d.userInfo.bgxs ? `url(${mediaURL}/bg/bgxs/${_d.userInfo.bgxs})` : '/img/bg.svg'
        ).attr('data-bg', _d.userInfo.bgxs ? _d.userInfo.bgxs : '');
      }
      handleUserinfo();
      return;
    }
  }).catch(err => { });
}
//同步数据
~(function () {
  //生成设备ID和初始标识
  let id = nanoid(),
    fg = 0;
  function realtime() {
    _getAjax('/user/realtime', { flag: fg, id }, true, true)
      .then((resu) => {
        if (resu.code == 0) {
          fg = resu.data.flag; //更新标识
          realtime();
          //to do something
          let { type, flag, from, to, tt, hd } = resu.data.data;
          //处理聊天指令
          if (type === 'chat') {
            let pid = deepClone(chatobj); //当前聊天框
            if (flag === 'addmsg') {
              //新消息处理
              // 消息通知
              _getAjax('/chat/notice', {
                acc: to === 'chang' ? 'chang' : from.account,
              }).then((result) => {
                if (parseInt(result.code) === 0) {
                  let data = result.data;
                  //如果是自己发送的则不通知
                  if (from.account !== _d.userInfo.account) {
                    tongzhi(data[0].name, data[0].data);
                  }
                  if ($chatRoomWrap.is(':hidden')) {
                    //聊天框是隐藏
                    if (from.account !== _d.userInfo.account) {
                      $showChatRoomBtn.find('.g_chat_msg_alert').stop().fadeIn(_speed);
                    }
                  } else {
                    if (
                      (pid.account === from.account && to !== 'chang') ||
                      (pid.account === 'chang' && to === 'chang') ||
                      (from.account === _d.userInfo.account &&
                        pid.account === to)
                    ) {
                      //新消息是当前聊天框
                      let acc =
                        to === 'chang'
                          ? 'chang'
                          : from.account === _d.userInfo.account &&
                            pid.account === to
                            ? to
                            : from.account;
                      let flag = $chatListBox
                        .find('.chat_item')
                        .last()
                        .attr('data-id');
                      let val = $chatHeadBtns.find('.search_msg_inp').val().trim();
                      _getAjax('/chat/getmsg', {
                        stu: 2,
                        acc,
                        flag,
                        val,
                      }).then((result) => {
                        if (parseInt(result.code) === 0) {
                          if ($chatRoomWrap.is(':hidden')) return;
                          let data = result.data;
                          let str = sxliuyan(data);

                          //新增内容
                          $chatListBox.find('.chat_list').append(str);
                          if (
                            $chatListBox[0].scrollHeight -
                            $chatListBox[0].scrollTop -
                            $chatListBox[0].clientHeight <
                            500
                          ) {
                            $chatListBox.stop().animate(
                              {
                                scrollTop: $chatListBox[0].scrollHeight,
                              },
                              1000
                            );
                          }
                          chatimgLoad();
                        }
                      }).catch(err => { });
                    } else {
                      //新消息不是是当前聊天框
                      if (from.account !== _d.userInfo.account) {
                        if (pid.account === 'chang') {
                          $chatHeadBtns.find('.c_msg_alert').stop().fadeIn(_speed);
                        } else {
                          if (to === 'chang') {
                            $chatHeadBtns.find('.c_home_msg_alert').stop().fadeIn(_speed);
                          } else {
                            $chatHeadBtns.find('.c_msg_alert').stop().fadeIn(_speed);
                          }
                        }
                      }
                    }
                  }
                }
              }).catch(err => { });
            } else if (flag === 'del') {
              //撤回消息
              if (from.account !== _d.userInfo.account) {
                tongzhi(from.username, '撤回消息');
              }
              if (!$chatRoomWrap.is(':hidden')) {
                if (
                  (pid.account === from.account && to !== 'chang') ||
                  (pid.account === 'chang' && to === 'chang') ||
                  (from.account === _d.userInfo.account && pid.account === to)
                ) {
                  let $msg = $chatListBox.find(`#${tt}`);
                  $msg.stop().slideUp(_speed, () => {
                    $msg.remove();
                  });
                }
              }
            } else if (flag === 'clear') {
              //清空聊天框
              if (from.account !== _d.userInfo.account) {
                tongzhi(from.username, '清空聊天记录');
              }
              if (!$chatRoomWrap.is(':hidden')) {
                if (
                  (pid.account === from.account && to !== 'chang') ||
                  (pid.account === 'chang' && to === 'chang') ||
                  (from.account === _d.userInfo.account && pid.account === to)
                ) {
                  $chatListBox.find('.chat_list').html('');
                }
              }
            }
          } else if (type === 'updatedata') {
            //数据同步更新
            if (flag === 'music') {
              renderMusicList();
            } else if (flag === 'bookmark') {
              renderAsideList();
              renderHomebook();
            } else if (flag === 'userinfo') {
              handleuser();
            } else if (flag === 'playinglist') {
              _getAjax('/player/getplaying').then((result) => {
                if (parseInt(result.code) === 0) {
                  _d.playingList = result.data;
                  musicarr =
                    randomplay === false
                      ? myShuffle(deepClone(_d.playingList))
                      : deepClone(_d.playingList);
                  dqplaying();
                  gaolianging();
                  return;
                }
              }, true).catch(err => { });
            } else if (flag === 'musicinfo') {
              if (!$musicPlayerBox.is(':hidden')) {
                if ($myAudio[0].paused) {
                  _getAjax('/player/getmusicinfo', {}, true).then(
                    (result) => {
                      if (parseInt(result.code) === 0) {
                        let _musicinfo = result.data;
                        let {
                          currentTime = 0,
                          duration = 0,
                          lastplay,
                        } = _musicinfo;
                        if (!lastplay || (_d.remoteState && playtimer)) return;
                        musicobjInit(lastplay);
                        csfz();
                        $myAudio[0].currentTime = currentTime;
                        upprog();
                        $lrcProgressBar.find('.total_time').text(tin(duration));
                      }
                    }
                  ).catch(err => { });
                }
              }
            }
          } else if (type === 'yc') {
            _d.remoteState = false;
            $lrcHead.find('.remote_play').removeClass('red');
            if (hd.type === 'play') {
              if (hd.data.play) {
                if (!_d.music) $rightBox.find('.show_music_player').click();
                if (randomplay === false) {
                  musicarr = myShuffle(deepClone(_d.playingList));
                }
                musicPlay(hd.data.obj);
              } else {
                $lrcListWrap.find('.lrc_items').html(``);
                audioPause();
              }
            } else if (hd.type === 'vol') {
              curPlayVol = hd.data;
              vobellm();
              _success(`${parseInt(curPlayVol * 100)}%`);
            } else if (hd.type === 'progress') {
              $myAudio[0].currentTime = musicobj.duration * hd.data;
            } else if (hd.type === 'playmode') {
              randomplay = hd.data;
              $lrcFootBtnWrap.find('.random_play_btn').click();
            }
          }
          return;
        } else if (resu.code == 3) {
          fg = resu.data.flag;
        }
        realtime();
      })
      .catch((err) => {
        //网络错误10秒重新请求一次
        _setTimeout(realtime, 10000);
      });
  }
  realtime();
  window.sendCommand = function (data) {
    //发送指令
    _postAjax('/user/realtime', { data, id }, true).then(res => { }).catch(err => { });
  };
})();
~(function () {
  window.openIframe = openIframe;
  function openIframe(url, name) {
    let box = document.createElement('div');
    box.className = 'iframe_warp';
    let str = `
      <div class="i_head_btns">
          <div cursor class="i_close_btn iconfont icon-guanbi"></div>
          <div cursor class="i_back_btn iconfont icon-prev"></div>
          <div cursor class="i_to_max_btn iconfont icon-xuanzeweixuanze"></div>
          <div cursor class="i_hide_btn iconfont icon-jianhao"></div>
          <div class="i_title_text"></div>
          <div cursor title="刷新" class="i_refresh_btn iconfont icon-suijibofang"></div>
          <div cursor title="新标签打开" class="i_new_page_open_btn iconfont icon-link"></div>
        </div>
        <iframe src="${url}" frameborder="0"></iframe>
      `;
    box.innerHTML = str;
    box._framename = name || url;
    box._url = url;
    $mainid.append(box);
    box.style.display = 'flex';
    let $box = $(box);
    setZindex($box);
    $box.on(
      'click',
      debounce(
        function (e) {
          setZindex($box);
          if (
            _getTarget(e, '.i_close_btn') ||
            _getTarget(e, '.i_back_btn')
          ) {
            $box.css('height', 0);
            _setTimeout(() => {
              $box.find('.i_title_text')[0].onmousedown = null;
              $box.remove();
            }, 500);
          } else if (_getTarget(e, '.i_to_max_btn')) {
            if (box._flag) {
              box._flag = false;
              $box.removeClass('open');
            } else {
              box._flag = true;
              $box
                .css({
                  top: '50%',
                  left: '50%',
                })
                .addClass('open');
            }
          } else if (_getTarget(e, '.i_refresh_btn')) {
            try {
              $box.find('iframe')[0].contentWindow.location.reload();
              return;
            } catch (error) { }
            $box.find('iframe').attr('src', box._url);
          } else if (_getTarget(e, '.i_new_page_open_btn')) {
            try {
              let url = $box.find('iframe')[0].contentWindow.location.href;
              box._url = url;
            } catch (error) { }
            myOpen(box._url, '_blank');
          } else if (_getTarget(e, '.i_hide_btn')) {
            $box.stop().fadeOut(_speed);
            addHideBox(box);
          }
        },
        500,
        true
      )
    );
    drag($box.find('.i_title_text')[0], $box[0]);
  }
  function addHideBox(el) {
    let box = document.createElement('div');
    box._boxflag = el;
    box.innerText = el._framename;
    box.setAttribute('title', el._url);
    box.setAttribute('cursor', '');
    $minimizeBox[0].appendChild(box);
  }
  $minimizeBox
    .on('click', 'div', function () {
      let htarget = $(this._boxflag);
      htarget.stop().fadeIn(_speed);
      setZindex(htarget);
      this.remove();
    })
    .on('contextmenu', 'div', function (e) {
      e.preventDefault();
      let _this = this;
      handleHideBox(e, _this);
    });
  if (isios()) {
    $minimizeBox[0]._longPress('div', function (e) {
      let _this = this,
        ev = e.changedTouches[0];
      handleHideBox(ev, _this);
    });
  }
  function handleHideBox(e, _this) {
    let $this = $(_this),
      htarget = _this._boxflag,
      url = htarget._url;
    let str = `<div cursor class="mtcitem"><i class="iconfont icon-link"></i><span>新标签打开</span></div>
                <div cursor class="mtcitem1"><i class="iconfont icon-guanbi"></i><span>关闭</span></div>
                <div cursor class="mtcitem2"><i class="iconfont icon-guanbi1"></i><span>关闭所有</span></div>`;
    rightMenu(
      e,
      str,
      debounce(
        function ({ close, e }) {
          close();
          if (_getTarget(e, '.mtcitem')) {
            myOpen(url, '_blank');
          } else if (_getTarget(e, '.mtcitem1')) {
            let ht = $(htarget);
            ht.find('.i_title_text')[0].onmousedown = null;
            ht.remove();
            $this.remove();
          } else if (_getTarget(e, '.mtcitem2')) {
            $minimizeBox[0].querySelectorAll('div').forEach((item) => {
              let ht = $(item._boxflag);
              ht.find('.i_title_text')[0].onmousedown = null;
              ht.remove();
              item.remove();
            });
          }
        },
        1000,
        true
      )
    );
  }
})();
