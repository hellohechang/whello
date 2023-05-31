import $ from "jquery";
import SparkMD5 from "spark-md5";
import md5 from 'md5'
import './recorder.mp3.min'
import '../css/reset.css'
import '../css/iconfont.css'
import '../css/index.css'
import icon1logo from '../img/icon1.png'
import iconlogo from '../img/icon.png'
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
} from '../utils/utils.js'
import { _speed, serverURL, mediaURL } from "../config";
import '../js/common'
import { _err, _success } from "../plugins/message";
import { alert } from '../plugins/alert'
import { _loadingBar } from '../plugins/loadingBar'
import { pagination } from '../plugins/pagination'
import { rightMenu } from '../plugins/rightMenu'
import { UpProgress } from '../plugins/UpProgress'
~(async function () {
  // 时钟
  ~(function () {
    // 动画
    let _head = document.querySelectorAll('head')[0],
      _style = document.createElement('style');
    _style.type = 'text/css';
    _head.appendChild(_style);
    const domHour = document.querySelector('.hour');
    const domMin = document.querySelector('.min');
    const domSec = document.querySelector('.sec');
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
    window.clockMove = clockMove;
  })();
  clockMove();
  ~(function () {
    let $icon = $("link[rel*='icon']");
    document.addEventListener('visibilitychange', async function () {
      // 页面变为不可见时触发
      if (document.visibilityState == 'hidden') {
        $icon.attr('href', iconlogo);
      }
      // 页面变为可见时触发
      if (document.visibilityState == 'visible') {
        $icon.attr('href', icon1logo);
        // clockMove();
      }
    });
  })();
  var $document = $(document),
    dmwidth = $document.width(), //屏幕宽
    isddplay = false, //是否远程状态
    _music = null,
    _bookmark = null,
    _userinfo = null,
    _playinglist = null,
    defaultvolume = _getData('lastvol'),
    searchengine = [
      {
        name: 'Bing',
        icon: 'img/bing-xs.png',
        logo: 'img/bing.png',
        searchlink: 'https://cn.bing.com/search?q=',
      },
      {
        name: 'Google',
        icon: 'img/google-xs.png',
        logo: 'img/google.png',
        searchlink: 'https://www.google.com/search?q=',
      },
      {
        name: 'Baidu',
        icon: 'img/baidu-xs.png',
        logo: 'img/baidu.png',
        searchlink: 'https://www.baidu.com/s?wd=',
      },
      {
        name: 'Youtube',
        icon: 'img/youtube-xs.png',
        logo: 'img/youtube.png',
        searchlink: 'https://www.youtube.com/results?search_query=',
      },
      {
        name: 'Bilibili',
        icon: 'img/bilibili-xs.png',
        logo: 'img/bilibili.png',
        searchlink: 'https://search.bilibili.com/all?keyword=',
      },
      {
        name: 'Yahoo',
        icon: 'img/yahoo-xs.png',
        logo: 'img/yahoo.png',
        searchlink: 'https://search.yahoo.com/search?p=',
      },
      {
        name: 'Sogou',
        icon: 'img/sougou-xs.png',
        logo: 'img/sougou.png',
        searchlink: 'https://www.sogou.com/web?query=',
      },
      {
        name: 'Github',
        icon: 'img/github-xs.png',
        logo: 'img/github.png',
        searchlink: 'https://github.com/search?q=',
      },
      {
        name: 'Toutiao',
        icon: 'img/toutiao-xs.png',
        logo: 'img/toutiao.png',
        searchlink: 'https://m.toutiao.com/search?keyword=',
      },
      {
        name: 'Weibo',
        icon: 'img/weibo-xs.png',
        logo: 'img/weibo.png',
        searchlink: 'https://s.weibo.com/weibo?q=',
      },
      {
        name: 'Zhihu',
        icon: 'img/zhihu-xs.png',
        logo: 'img/zhihu.png',
        searchlink: 'https://www.zhihu.com/search?q=',
      },
      {
        name: 'Kuaidi',
        icon: 'img/kuaidi-xs.png',
        logo: 'img/kuaidi.png',
        searchlink: 'https://m.kuaidi100.com/result.jsp?nu=',
      },
    ],
    $dltx = $('.dltx'), //头像
    $dcout = $('.dcout'),
    $bgmain = $('.bgmain'),
    $footmenu = $('.footmenu'),
    $yuanchengbfid = $('#yuanchengbf'),
    $state = $('#state'),
    $usermin = $('.usermin'),
    $imgid = $('#img'),
    $searchboxon = $('.search-boxon'),
    $inputTextid = $('#inputText'),
    $menuid = $('#menu'),
    $mainid = $('#main'),
    $navwrap = $('.navwrap'),
    $hideBox = $('.hideBox'),
    $onloading = $('.onloading'),
    $menuitem = $('.menu-item'),
    $folderulid = $('#folder ul'),
    $mmlistid = $('#mmlist'),
    $musicbox = $('.musicbox'),
    $shoucang = $('.shoucang'),
    $ydfy = $('.ydfy'),
    $allbgwrap = $('.allbgwrap'),
    $xzbg = $('.xzbg'),
    $allbg = $('.allbg'),
    $allbgoff = $('.allbgoff'),
    $submitButtonid = $('#submitButton'),
    $searchlistid = $('#searchlist'),
    $listid = $('#list'),
    $menubtnid = $('#menubtn'),
    $boxtop = $('.boxtop'),
    $boxdow = $('.boxdow'),
    $boxcon = $('.boxcon'),
    $randomid = $('#random'),
    $previd = $('#prev'),
    $nextid = $('#next'),
    $playid = $('#play'),
    $hplayid = $('#hplay'),
    $hhplayid = $('#hhplay'),
    $titleid = $('#title'),
    $ksbfxsid = $('#ksbfxs'),
    $musictextid = $('#musictext'),
    $mmlistsxid = $('#mmlistsx'),
    $musicimgid = $('#musicimg'),
    $nextm = $('.nextm'),
    $nextmm = $('.nextmm'),
    $homefootmenu = $('.homefootmenu'),
    $prevm = $('.prevm'),
    $musichide = $('.musichide'),
    $dolt = $('.dolt'),
    $musiclrcbg = $('.musiclrcbg'),
    $mmlistbg = $('.mmlistbg'),
    $playsd = $('.playsd'),
    $bgshowpage = $('.bgshowpage'),
    $dqplarying = $('.dqplarying'),
    $playingwrap = $('.playingwrap'),
    $playtingtopleft = $('.playtingtopleft'),
    $playingbot = $('.playingbot'),
    $playtingtopright = $('.playtingtopright'),
    $searchlistwrap = $('.searchlistwrap'),
    $musiclrc = $('.musiclrc'),
    $mmmlist = $('.mmmlist'),
    $mmlist = $('.mmlist'),
    $mmlistoff = $('.mmlistoff'),
    $musicmv = $('.musicmv'),
    $lrcbotwrap = $('.lrcbotwrap'),
    $mmlisthide = $('.mmlisthide'),
    $playbox = $('.playbox'),
    $youtopwrap = $('.youtopwrap'),
    $youtop = $('.youtop'),
    $vobellid = $('#vobell'),
    $lrcdownid = $('#lrcdown'),
    $musicnameid = $('#musicname'),
    $myVideo = $('#myVideo'),
    $mvpid = $('#mvp'),
    $myAudio = $('#myAudio'),
    $searchbox = $('.search-box'),
    $msearchlistid = $('#msearchlist'),
    $onlinenote = $('.onlinenote'),
    $openplayer = $('.openplayer'),
    $btname = $('.btname'),
    $btartist = $('.btartist'),
    $lrc = $('.lrc'),
    $pro1 = $('.pro1'),
    $pro2 = $('.pro2'),
    $mvoff = $('.mvoff'),
    $mvoffxs = $('.mvoffxs'),
    $setUp = $('.setUp'),
    $gcm = $('.gcm'),
    $lrcbotoff = $('.lrcbotoff'),
    $logdata = $('.logdata'),
    $logshowpage = $('.logshowpage'),
    $guestbooklistcon = $('.guestbooklistcon'),
    $toMsgBottom = $('.toMsgBottom'),
    $guestclear = $('.guestclear'),
    $guestbooklistconwrap = $('.guestbooklistconwrap'),
    $guestbooklist = $('.guestbooklist'),
    $guestbookoff = $('.guestbookoff'),
    $about = $('.about'),
    $logon = $('.logon'),
    $recycle = $('.recycle'),
    $shareList = $('.shareList'),
    $logoff = $('.logoff'),
    $clearlog = $('.clearlog'),
    $uploadlog = $('.uploadlog'),
    $searchlog = $('.searchlog'),
    $logbot = $('.logbot'),
    $newly = $('.newly'),
    $guestbookoffxs = $('.guestbookoffxs'),
    $yuyplay = $('.yuyplay'),
    $guestbook = $('.guestbook'),
    $yyfs = $('.yyfs'),
    $guestbookclear = $('.guestbookclear'),
    $chengyuan = $('.chengyuan'),
    $chengyuanwrap = $('.chengyuanwrap'),
    $searchMsg = $('.searchMsg'),
    $lytitle = $('.lytitle'),
    $msgtx = $('.msgtx'),
    $qmsgtx = $('.qmsgtx'),
    $gedantname = $('.gedantname'),
    $lrcfyon = $('.lrcfyon'),
    $lrccwrap = $('.lrccwrap'),
    $lrcbot = $('.lrcbot'),
    $totaltime = $('.total_time'),
    $currenttime = $('.current_time'),
    $looklrc = $('.looklrc'),
    $editlrc = $('.editlrc'),
    $musicshare = $('.musicshare'),
    $clock = $('.clock'),
    $toupbg = $('.toupbg'),
    $userinfobox = $('.userinfobox'),
    $userlogoBox = $userinfobox.find('.userlogoBox'),
    $userinfologo = $userlogoBox.find('div'),
    $usermsgBox = $userinfobox.find('.usermsgBox'),
    $userinfoclose = $userinfobox.find('.userinfoclose');
  let mytitle = 'Hello';
  let urlparmes = queryURLParams(myOpen());
  function loadingdh() {
    $onloading
      .html('')
      .stop()
      .fadeOut(_speed, () => {
        $onloading.remove();
      });
  }
  if (dmwidth <= 800) $clock.css('display', 'none');

  var actionLrcIndex = 0,
    randomplay = true, //播放模式变量
    musicarr, //正在播放的列表
    musicarrjl, //当前打开的列表
    musicobj, //正在播放的歌曲
    zindexnum = 100; //初始层级
  function setZindex($el) {
    zindexnum++;
    $el.css('z-index', zindexnum);
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
  // 限制用户名长度
  function userlenght(str) {
    let arr = str.split(''),
      num = 0;
    arr.forEach((v) => {
      num +=
        /[\u2E80-\u2FDF\u3040-\u318F\u31A0-\u31BF\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FFF\uA960-\uA97F\uAC00-\uD7FF]/.test(
          v
        )
          ? 2
          : 0.8;
    });
    if (num > 12) {
      return true;
    } else {
      return false;
    }
  }
  _getAjax('/chat/getnews', { a: 3 }).then((result) => {
    if (parseInt(result.code) === 0) {
      $newly.stop().fadeOut(_speed);
    } else {
      $newly.stop().fadeIn(_speed);
    }
  }).catch(err => { })
  _getAjax('/user/renewal').then(res => { }).catch(err => { })
  _getAjax('/user/getuserinfo').then((result) => {
    if (parseInt(result.code) === 0) {
      _userinfo = result.data;
      mytitle = `Hello ${_userinfo.username}`;
      if ($myAudio[0].paused) {
        $titleid.text(mytitle);
      }
      if (_userinfo.account !== 'root') {
        $logon.remove();
      }
      $usermin
        .text(_userinfo.username)
        .attr('title', _userinfo.username)
        .stop()
        .fadeIn(_speed);
      _success(`Welcome ${_userinfo.username}`);
      $dltx.css(
        'background-image',
        `url(${mediaURL}/logo/${_userinfo.account}/${_userinfo.account
        }.png?v=${Math.random()})`
      );

      if (urlparmes.c) {
        let { account, username } = _getData('toUser') || {};
        if (account && username) {
          if (account === _userinfo.account) {
            myOpen('/');
            return;
          }
          chatobj.account = account;
          $lytitle.text(username);
          $guestbook.click();
        }
      }
      if (urlparmes.p) {
        $openplayer.click();
      }

      if (dmwidth > 800) {
        if (_userinfo.bg != '') {
          $bgmain.css(
            'background-image',
            `url(${mediaURL}/bgys/bg/${_userinfo.bg})`
          );
          imgjz(
            `${mediaURL}/bgys/bg/${_userinfo.bg}`,
            () => {
              loadingdh();
              imgjz(`${mediaURL}/bg/bg/${_userinfo.bg}`, () => {
                $bgmain.css(
                  'background-image',
                  `url(${mediaURL}/bg/bg/${_userinfo.bg})`
                );
              });
            },
            () => {
              loadingdh();
              imgjz(`${mediaURL}/bg/bg/${_userinfo.bg}`, () => {
                $bgmain.css(
                  'background-image',
                  `url(${mediaURL}/bg/bg/${_userinfo.bg})`
                );
              });
            }
          );
        } else {
          $bgmain.css('background-image', `url(/img/bg.jpg)`);
          imgjz(
            `/img/bg.jpg`,
            () => {
              loadingdh();
            },
            () => {
              loadingdh();
            }
          );
        }
      } else {
        if (_userinfo.bgxs != '') {
          $bgmain.css(
            'background-image',
            `url(${mediaURL}/bgys/bgxs/${_userinfo.bgxs})`
          );
          imgjz(
            `${mediaURL}/bgys/bgxs/${_userinfo.bgxs}`,
            () => {
              loadingdh();
              imgjz(`${mediaURL}/bg/bgxs/${_userinfo.bgxs}`, () => {
                $bgmain.css(
                  'background-image',
                  `url(${mediaURL}/bg/bgxs/${_userinfo.bgxs})`
                );
              });
            },
            () => {
              loadingdh();
              imgjz(`${mediaURL}/bg/bgxs/${_userinfo.bgxs}`, () => {
                $bgmain.css(
                  'background-image',
                  `url(${mediaURL}/bg/bgxs/${_userinfo.bgxs})`
                );
              });
            }
          );
        } else {
          $bgmain.css('background-image', `url(/img/bg.jpg)`);
          imgjz(
            `/img/bg.jpg`,
            () => {
              loadingdh();
            },
            () => {
              loadingdh();
            }
          );
        }
      }
    }
  }).catch(err => { })

  // 左导航书签
  $menubtnid.activeId = 'hide'; //默认全列表关闭
  ~(function () {
    let fromDom = null;
    $menuitem
      .on('dragstart', '.sidenav-btn', function (e) {
        fromDom = this;
      })
      .on('drop', '.sidenav-btn', function (e) {
        let $this = $(this),
          $fromDom = $(fromDom),
          pid = $this.parent().prev().attr('data-id'),
          fromId = $fromDom.attr('data-id'),
          toId = $this.attr('data-id');
        if (fromDom) {
          _postAjax('/nav/bmkmove', { pid, fromId, toId }).then((result) => {
            if (parseInt(result.code) === 0) {
              sendCommand({ type: 'updatedata', flag: 'bookmark' });
              renderNav();
              return;
            }
          }).catch(err => { })
        }
        fromDom = null;
      })
      .on('dragover', '.sidenav-btn', function (e) {
        e.preventDefault();
      });
  })();
  ~(function () {
    let fromDom = null;
    $menuitem
      .on('dragstart', '.blockquote', function (e) {
        fromDom = this;
      })
      .on('drop', '.blockquote', function (e) {
        let $this = $(this),
          fromId = $(fromDom).attr('data-id'),
          toId = $this.attr('data-id');
        if (fromDom) {
          if (fromId !== toId) {
            _postAjax('/nav/listmove', { fromId, toId }).then((result) => {
              if (parseInt(result.code) === 0) {
                sendCommand({ type: 'updatedata', flag: 'bookmark' });
                renderNav();
                return;
              }
            }).catch(err => { })
          }
          fromDom = null;
        }
      })
      .on('dragover', '.blockquote', function (e) {
        e.preventDefault();
      });
  })();
  // 渲染左导航
  function renderNav() {
    if ($navwrap.is(':hidden')) return;
    let id = $menubtnid.activeId;
    _getAjax('/nav/getlist', { id }).then((result) => {
      if (result.code === 0) {
        _bookmark = result.data;
        if (!$menubtnid.activeId) {
          if (_bookmark.side.length > 0) {
            $menubtnid.activeId = _bookmark.side[0].id;
          }
        }
        rendernav();
        return;
      }
    }).catch(err => { })
  }
  function rendernavdefault() {
    let str = '';
    let color = 'rgb(255 255 255 / 10%)';
    new Array(50).fill(null).forEach((item) => {
      str += `<div style="pointer-events: none;background-image:none;background-color:${color};margin:4px" class="blockquote jzxz"></div>`;
    });
    $menuitem.html(str);
  }
  function rendernav() {
    if ($navwrap.is(':hidden')) return;
    $footmenu.stop().slideUp(_speed).find('div').attr({
      class: 'iconfont icon-xuanzeweixuanze',
      check: 'n',
    });
    let id = $menubtnid.activeId,
      _nav = _bookmark.side,
      str = '';
    _nav.forEach((item) => {
      let name = encodeHtml(item.name);
      if (item.id === id) {
        str += `<div data-id="${item.id}" data-name="${name}" cursor title="${name}" flag="on" draggable="true" class="blockquote jzxz">
        <i class="iconfont icon-shoucang"></i>
        <em>${name}</em></div>
        <ul style="display:'block'">`;
        item.item.forEach((y) => {
          let name = encodeHtml(y.name);
          let des = y.des ? encodeHtml(y.des) : '';
          str += `<li data-pid="${item.id}" data-name="${name}" data-des="${des}" data-id="${y.id}" cursor class="sidenav-btn jzxz" data-link="${y.link}" data-src="${y.logo}" draggable="true">
          <div cursor check="n" class="seleckbook"></div>
          <div class="suqlogo"></div>
          <div title="${name}(${y.link})" class="suqname">${name}</div>
          <p title="${des}">${des || '描述'}</p>
          </li>`;
        });
        str += '</ul>';
      } else {
        str += `<div data-id="${item.id}" data-name="${name}" cursor title="${name}" flag="off" draggable="true" class="blockquote jzxz">
      <i class="iconfont icon-shoucang"></i>
      <em>${name}</em></div>
      <ul style="display:'none'" ></ul>`;
      }
    });
    str += `<div cursor title="新增列表" class="addsqcd iconfont icon-icon-test"></div>`;
    $menuitem.html(str);
    handleNavLogo();
  }
  //处理侧边书签logo
  function handleNavLogo() {
    if ($menubtnid.activeId === 'hide') return;
    $('.sidenav-btn').each((index, item) => {
      let $item = $(item),
        url = $item.attr('data-src'),
        link = $item.attr('data-link');
      if (!url.includes('favicon.ico')) {
        url = mediaURL + url;
      }
      let $suqlogo = $item.find('.suqlogo');
      imgjz(
        url,
        () => {
          $suqlogo.css('background-image', `url(${url})`);
        },
        () => {
          let u = `https://api.iowen.cn/favicon/${getHost(link)}.png`;
          imgjz(
            u,
            () => {
              $suqlogo.css('background-image', `url('${u}')`);
            },
            () => {
              $suqlogo.css('background-image', `url('/img/mrlogo.png')`);
            }
          );
        }
      );
    });
  }
  //侧边导航缩放
  let checkColor = 'rgb(118 254 89 / 58%)';
  $menuid
    .on(
      'click',
      '.blockquote',
      debounce(
        function () {
          $footmenu.stop().slideUp(_speed).find('div').attr({
            class: 'iconfont icon-xuanzeweixuanze',
            check: 'n',
          });
          let $this = $(this),
            id = $this.attr('data-id');
          $menubtnid.activeId = id;
          if ($this.attr('flag') === 'on') {
            $this.next().stop().slideUp(_speed).html('');
            $menubtnid.activeId = 'hide';
            $this.attr('flag', 'off');
            return;
          }
          function fun() {
            let bmk = _bookmark.side.find((item) => item.id === id),
              str = '';
            if (!bmk) return;
            bmk.item.forEach((y) => {
              let name = encodeHtml(y.name);
              let des = y.des ? encodeHtml(y.des) : '';
              str += `<li data-pid="${id}" data-name="${name}" data-des="${des}" data-id="${y.id}" data-link="${y.link}" data-src="${y.logo}" cursor class="sidenav-btn jzxz" draggable="true">
        <div cursor check="n" class="seleckbook"></div>
        <div class="suqlogo"></div>
          <div title="${name}(${y.link})" class="suqname">${name}</div>
          <p title="${des}">${des || '描述'}</p>
          </li>`;
            });
            $('.blockquote')
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
                $menuitem.stop().animate(
                  {
                    scrollTop:
                      _position($this[0]).top + $menuitem[0].scrollTop - 5,
                  },
                  _speed
                );
              });
            handleNavLogo();
          }
          _getAjax('/nav/getlist', { id }).then((result) => {
            if (result.code === 0) {
              _bookmark = result.data;
              fun();
              return;
            }
          }).catch(err => { })
        },
        500,
        true
      )
    )
    .on('click', '.sidenav-btn', function (e) {
      let link = $(this).attr('data-link');
      myOpen(link, "_blank");
    })
    .on('click', '.addsqcd', (e) => {
      // 新建列表
      let str = `<div class="mtcinp">
              <input autocomplete="off" placeholder="列表名" type="text">
            </div>
          <button cursor class="mtcbtn">新增列表</button>`;
      rightMenu(
        e,
        str,
        debounce(
          function ({ close, e, inp }) {
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
                  renderNav();
                  return;
                }
              }).catch(err => { })
            }
          },
          1000,
          true
        )
      );
    })
    .on('contextmenu', '.blockquote', function (e) {
      //操作列表
      e.preventDefault();
      let $this = $(this);
      blockquotemenu(e, {
        id: $this.attr('data-id'),
        name: $this.attr('data-name'),
        index: $this.index('.blockquote'),
      });
    })
    .on('contextmenu', '.sidenav-btn', function (e) {
      //操作书签
      e.preventDefault();
      let $this = $(this);
      sidenavbtnmenu(e, {
        pid: $this.attr('data-pid'),
        cid: $this.attr('data-id'),
        des: $this.attr('data-des'),
        index: $this.index(),
        name: $this.attr('data-name'),
        link: $this.attr('data-link'),
        logo: $this.attr('data-src'),
      });
    })
    .on('click', '.footmenu div', function () {
      let che = $(this).attr('check');
      che === 'y' ? (che = 'n') : (che = 'y');
      $footmenu.find('div').attr({
        class:
          che === 'y'
            ? 'iconfont icon-xuanzeyixuanze'
            : 'iconfont icon-xuanzeweixuanze',
        check: che,
      });
      let $sidenav = $('.sidenav-btn');
      $sidenav
        .find('.seleckbook')
        .attr('check', che)
        .css('background-color', che === 'y' ? checkColor : 'transparent');
      _success(`选中：${che === 'y' ? $sidenav.length : 0}`, true);
    })
    .on('click', '.seleckbook', function (e) {
      e.stopPropagation();
      let $this = $(this),
        check = $this.attr('check');
      if (check === 'n') {
        $this.attr('check', 'y').css('background-color', checkColor);
      } else {
        $this.attr('check', 'n').css('background-color', 'transparent');
      }
      let $sidenav = $('.sidenav-btn'),
        $checkArr = $sidenav.filter(
          (_, item) => $(item).find('.seleckbook').attr('check') === 'y'
        );
      _success(`选中：${$checkArr.length}`, true);
      if ($checkArr.length === $sidenav.length) {
        $footmenu.find('div').attr({
          class: 'iconfont icon-xuanzeyixuanze',
          check: 'y',
        });
      } else {
        $footmenu.find('div').attr({
          class: 'iconfont icon-xuanzeweixuanze',
          check: 'n',
        });
      }
    })
    .on('click', '.deleallsq', function (e) {
      let $sidenav = $('.sidenav-btn'),
        $checkArr = $sidenav.filter(
          (_, item) => $(item).find('.seleckbook').attr('check') === 'y'
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
                renderNav();
                return;
              }
            }).catch(err => { })
            return;
          }
        },
      });
    })
    .on('click', '.moveallsq', function (e) {
      let $sidenav = $('.sidenav-btn'),
        $checkArr = $sidenav.filter(
          (_, item) => $(item).find('.seleckbook').attr('check') === 'y'
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
      _bookmark.side.forEach((item) => {
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
                        renderNav();
                        if (!$searchbox.is(':hidden') && toid === 'home') {
                          renderHomebook();
                        }
                        return;
                      }
                    }
                  ).catch(err => { })
                },
              });
            }
          },
          1000,
          true
        )
      );
    })
    .on('click', '.closesq', function (e) {
      let $sidenav = $('.sidenav-btn');
      $sidenav
        .find('.seleckbook')
        .stop()
        .fadeOut(_speed)
        .attr('check', 'n')
        .css('background-color', 'transparent');
      $footmenu.stop().slideUp(_speed);
    });
  if (isios()) {
    $menuid[0]
      ._longPress('.blockquote', function (e) {
        let $this = $(this),
          ev = e.changedTouches[0];
        blockquotemenu(ev, {
          id: $this.attr('data-id'),
          name: $this.attr('data-name'),
          index: $this.index('.blockquote'),
        });
      })
      ._longPress('.sidenav-btn', function (e) {
        let $this = $(this),
          ev = e.changedTouches[0];
        sidenavbtnmenu(ev, {
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
  function blockquotemenu(e, obj) {
    let str = `<div cursor class="mtcitem">重命名</div>
              <div cursor class="mtcitem1">新增书签</div>
              <div cursor class="mtcitem2">分享列表</div>
              <div cursor class="mtcitem3">删除列表</div>`;
    rightMenu(
      e,
      str,
      debounce(
        function ({ close, e }) {
          // 编辑列表
          if (_getTarget(e, '.mtcitem')) {
            let str = `<div class="mtcinp">
          <input autocomplete="off" value="${encodeHtml(obj.name)}" type="text">
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
                          renderNav();
                          return;
                        }
                      }
                    ).catch(err => { })
                  }
                },
                1000,
                true
              )
            );
          } else if (_getTarget(e, '.mtcitem1')) {
            // 新增书签
            let str = `<div class="mtcinp1">
              <input autocomplete="off" placeholder="标题" type="text">
            </div>
            <div class="mtcinp2">
              <input autocomplete="off" placeholder="https://" type="text">
            </div>
            <div class="mtcinp3">
              <textarea autocomplete="off" placeholder="描述"></textarea>
            </div>
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
                        $menubtnid.activeId = obj.id;
                        renderNav();
                        return;
                      }
                    }).catch(err => { })
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
                openIframe(`/page/sharelist`, '分享列表')
              }
            }).catch(err => { })
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
                    renderNav();
                    return;
                  }
                }).catch(err => { })
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
  function sidenavbtnmenu(e, obj) {
    let str = `<div cursor class="mtcitem">弹窗打开</div>
                  <div cursor class="mtcitem1">更换图标</div>
                  ${$footmenu.is(':hidden')
        ? '<div cursor class="mtcitem2">批量操作</div>'
        : ''
      }
                  <div cursor class="mtcitem3">编辑书签</div>
                  <div cursor class="mtcitem4">移动到</div>
                  <div cursor class="mtcitem5">删除</div>`;
    rightMenu(
      e,
      str,
      debounce(
        function ({ close, e }) {
          if (_getTarget(e, '.mtcitem')) {
            close();
            menuoff();
            openIframe(obj.link, obj.name)
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
                          renderNav();
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
            $footmenu.stop().slideDown(_speed).find('div').attr({
              class: 'iconfont icon-xuanzeweixuanze',
              check: 'n',
            });
            let $sidenav = $('.sidenav-btn');
            $sidenav.find('.seleckbook').stop().fadeIn(_speed);
            close();
          } else if (_getTarget(e, '.mtcitem3')) {
            // 修改书签
            let str = `<div class="mtcinp">
            <input autocomplete="off" value="${encodeHtml(
              obj.name
            )}" type="text">
          </div>
          <div class="mtcinp1">
            <input autocomplete="off" value="${obj.link}" type="text">
          </div>
          <div class="mtcinp1">
            <textarea autocomplete="off">${encodeHtml(obj.des)}</textarea>
          </div>
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
                        renderNav();
                        return;
                      }
                    }).catch(err => { })
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
            _bookmark.side.forEach((item) => {
              let name = encodeHtml(item.name);
              if (item.id !== obj.pid) {
                str += `<div data-name="${name}" class="mtcitem" data-id="${item.id}"><i class='iconfont icon-shoucang'></i><span style="margin-left:10px;">${name}</span></div>`;
              }
            });
            let flagClose = close
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
                            flagClose()
                            close();
                            sendCommand({
                              type: 'updatedata',
                              flag: 'bookmark',
                            });
                            renderNav();
                            if (!$searchbox.is(':hidden') && toid === 'home') {
                              renderHomebook();
                            }
                            return;
                          }
                        }).catch(err => { })
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
                      renderNav();
                      return;
                    }
                  }
                ).catch(err => { })
              },
            });
          }
        },
        1000,
        true
      )
    );
  }
  $menubtnid.on('click', function (e) {
    if ($mainid.css('transform') == 'none') {
      menuon();
    } else {
      menuoff();
    }
  });
  // 打开关闭侧栏
  function menuon() {
    $navwrap.css('display', 'block');
    let menuw = $menuid.outerWidth();
    rendernavdefault();
    $mainid.css({
      transform: `translateX(${menuw}px)`,
    });
    $menuid.css({
      transform: 'translateX(0px)',
    });
    $boxtop.addClass('boxtopp');
    $boxdow.addClass('boxdoww');
    $boxcon.css('opacity', '0');
    _setTimeout(() => {
      renderNav();
    }, 500);
  }
  function menuoff() {
    let menuw = $menuid.outerWidth();
    $mainid.css({
      transform: 'none',
    });
    $menuid.css({
      transform: `translateX(-${menuw}px)`,
    });
    $boxtop.removeClass('boxtopp');
    $boxdow.removeClass('boxdoww');
    $boxcon.css('opacity', '1');
    $navwrap.stop().fadeOut(_speed, () => {
      $menuitem.html('');
    });
  }
  $navwrap.click(function (e) {
    if (_getTarget(e, '.navwrap', 1)) {
      menuoff();
    }
  });
  $searchbox.click(function (e) {
    if (_getTarget(e, '.search-box', 1)) {
      $folderulid.html('');
      $searchbox.stop().hide(_speed);
      $searchboxon.stop().show(_speed);
      $bgmain.removeClass('sce');
    }
  });

  // 主页书签
  ~(function () {
    let fromDom = null;
    $folderulid
      .on('dragstart', '.folder-item', function (e) {
        fromDom = this;
      })
      .on('drop', '.folder-item', function (e) {
        let fromId = $(fromDom).attr('data-id'),
          toId = $(this).attr('data-id');
        if (fromDom) {
          if (fromId && toId && fromId !== toId) {
            _postAjax('/home/move', { fromId, toId }).then((result) => {
              if (parseInt(result.code) === 0) {
                sendCommand({ type: 'updatedata', flag: 'bookmark' });
                _bookmark = result.data;
                renderHomebook();
                return;
              }
            }).catch(err => { })
          }
          fromDom = null;
        }
      })
      .on('dragover', '.folder-item', function (e) {
        e.preventDefault();
      });
  })();
  //主要书签渲染
  function renderHomebook() {
    if ($searchbox.is(':hidden')) return;
    let a = $folderulid.children();
    if (a.length === 0) {
      renderhomebookdefault();
    }
    _getAjax('/home/getlist').then((result) => {
      if (result.code === 0) {
        _bookmark = result.data;
        renderhomebook();
        return;
      }
    }).catch(err => { })
  }
  function renderhomebookdefault() {
    let str = '';
    let color = '#ffffff54';
    new Array(21).fill(null).forEach((v, i) => {
      str += `<li style="pointer-events: none;" class="folder-item">
              <div style="background-color:${color}" class="folder-item-box"></div>
              <p></p>
              </li>`;
    });
    $folderulid.html(str);
  }
  function renderhomebook() {
    if ($searchbox.is(':hidden')) return;
    $homefootmenu.stop().slideUp(_speed).find('div').attr({
      class: 'iconfont icon-xuanzeweixuanze',
      check: 'n',
    });
    let homearr = _bookmark.home,
      str = '';
    homearr.forEach((v, i) => {
      let name = encodeHtml(v.name);
      let des = v.des ? encodeHtml(v.des) : '';
      str += `<li data-link="${v.link}" data-des="${des}" data-src="${v.logo}" data-id="${v.id}" data-name="${name}" class="folder-item" draggable="true">
              <div cursor check="n" class="celeckhomesq"></div>
              <div cursor title="${name}(${v.link})" class="folder-item-box"></div>
              <p title="${des}">${name}</p>
              </li>`;
    });
    str += `<li class="folder-item" data-src="/img/tianjia.png">
                <div cursor x="add" class="folder-item-box">
                </div>
                <p></p>
              </li>`;
    $folderulid.html(str);
    $('.folder-item').each((index, item) => {
      let $item = $(item),
        url = $item.attr('data-src'),
        $fib = $item.find('.folder-item-box');
      if (
        !url.includes('favicon.ico') &&
        $item.find('.folder-item-box').attr('x') !== 'add'
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

  $searchbox
    .on(
      'click',
      '.folder-item-box',
      debounce(
        function (e) {
          let $this = $(this);
          if ($this.attr('x') === 'add') {
            let str = `<div class="mtcinp">
              <input autocomplete="off" placeholder="标题" type="text">
            </div>
            <div class="mtcinp1">
              <input autocomplete="off" placeholder="https://" type="text">
            </div>
            <div class="mtcinp2">
              <textarea autocomplete="off" placeholder="描述"></textarea>
            </div>
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
                    }).catch(err => { })
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
    )
    .on('contextmenu', '.folder-item-box', function (e) {
      e.preventDefault();
      let $this = $(this);
      folderitemmenu(e, {
        id: $this.parent().attr('data-id'),
        name: $this.parent().attr('data-name'),
        link: $this.parent().attr('data-link'),
        des: $this.parent().attr('data-des'),
        logo: $this.parent().attr('data-src'),
        index: $this.parent().index(),
      });
    })
    .on('click', '.homefootmenu div', function () {
      let che = $(this).attr('check');
      che === 'y' ? (che = 'n') : (che = 'y');
      $homefootmenu.find('div').attr({
        class:
          che === 'y'
            ? 'iconfont icon-xuanzeyixuanze'
            : 'iconfont icon-xuanzeweixuanze',
        check: che,
      });
      let $folder = $('.folder-item').find('.celeckhomesq');
      $folder
        .attr('check', che)
        .css('background-color', che === 'y' ? checkColor : 'transparent');
      _success(`选中：${che === 'y' ? $folder.length : 0}`, true);
    })
    .on('click', '.celeckhomesq', function (e) {
      e.stopPropagation();
      let $this = $(this),
        check = $this.attr('check');
      if (check === 'n') {
        $this.attr('check', 'y').css('background-color', checkColor);
      } else {
        $this.attr('check', 'n').css('background-color', 'transparent');
      }
      let $sidenav = $('.folder-item'),
        $checkArr = $sidenav.filter(
          (_, item) =>
            $(item).attr('data-id') &&
            $(item).find('.celeckhomesq').attr('check') === 'y'
        );
      _success(`选中：${$checkArr.length}`, true);
      if ($checkArr.length === $sidenav.length - 1) {
        $homefootmenu.find('div').attr({
          class: 'iconfont icon-xuanzeyixuanze',
          check: 'y',
        });
      } else {
        $homefootmenu.find('div').attr({
          class: 'iconfont icon-xuanzeweixuanze',
          check: 'n',
        });
      }
    })
    .on('click', '.deleallsq', function (e) {
      let $sidenav = $('.folder-item'),
        $checkArr = $sidenav.filter(
          (_, item) =>
            $(item).attr('data-id') &&
            $(item).find('.celeckhomesq').attr('check') === 'y'
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
            }).catch(err => { })
            return;
          }
        },
      });
    })
    .on('click', '.moveallsq', function (e) {
      let $sidenav = $('.folder-item'),
        $checkArr = $sidenav.filter(
          (_, item) =>
            $(item).attr('data-id') &&
            $(item).find('.celeckhomesq').attr('check') === 'y'
        );
      if ($checkArr.length === 0) return;
      let arr = [];
      $checkArr.each((i, v) => {
        let $v = $(v);
        arr.push($v.attr('data-id'));
      });
      let str = '';
      if (_bookmark.side.length === 0) {
        _err('未找到列表');
        return;
      }
      str += ``;
      _bookmark.side.forEach((v, i) => {
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
                        renderNav();
                      }
                      return;
                    }
                  }).catch(err => { })
                },
              });
            }
          },
          1000,
          true
        )
      );
    })
    .on('click', '.closesq', function (e) {
      let $sidenav = $('.folder-item');
      $sidenav
        .find('.celeckhomesq')
        .stop()
        .fadeOut(_speed)
        .attr('check', 'n')
        .css('background-color', 'transparent');
      $homefootmenu.stop().slideUp(_speed);
    });
  if (isios()) {
    $searchbox[0]._longPress('.folder-item-box', function (e) {
      let $this = $(this),
        ev = e.changedTouches[0];
      folderitemmenu(ev, {
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
  function folderitemmenu(e, obj) {
    if (!obj.id) return;
    let str = `<div cursor class="mtcitem">弹窗打开</div>
                <div cursor class="mtcitem1">更换图标</div>
                  ${$homefootmenu.is(':hidden')
        ? '<div cursor class="mtcitem2">批量操作</div>'
        : ''
      }
            <div cursor class="mtcitem3">编辑书签</div>
            <div cursor class="mtcitem4">移动到</div>
            <div cursor class="mtcitem5">删除</div>
            `;
    rightMenu(
      e,
      str,
      debounce(
        function ({ close, e }) {
          if (_getTarget(e, '.mtcitem')) {
            close();
            openIframe(obj.link, obj.name)
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
                      ).catch(err => { })
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
            $homefootmenu.stop().slideDown(_speed).find('div').attr({
              class: 'iconfont icon-xuanzeweixuanze',
              check: 'n',
            });
            let $sidenav = $('.folder-item');
            $sidenav.find('.celeckhomesq').stop().fadeIn(_speed);
            close();
          } else if (_getTarget(e, '.mtcitem3')) {
            //编辑书签
            let str = `<div class="mtcinp">
              <input autocomplete="off" value="${encodeHtml(
              obj.name
            )}" type="text">
            </div>
            <div class="mtcinp1">
              <input autocomplete="off" value="${obj.link}" type="text">
            </div>
            <div class="mtcinp1">
            <textarea autocomplete="off">${encodeHtml(obj.des)}</textarea>
          </div>
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
                    }).catch(err => { })
                  }
                },
                1000,
                true
              )
            );
          } else if (_getTarget(e, '.mtcitem4')) {
            // 移动书签
            let str = '';
            if (_bookmark.side.length === 0) {
              _err('未找到列表');
              return;
            }
            _bookmark.side.forEach((v, i) => {
              let name = encodeHtml(v.name);
              str += `<div data-name="${name}" cursor class="mtcitem" data-id="${v.id}"><i class='iconfont icon-shoucang'></i><span style="margin-left:10px;">${name}</span></div>`;
            });
            let flagClose = close
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
                            flagClose()
                            close();
                            sendCommand({
                              type: 'updatedata',
                              flag: 'bookmark',
                            });
                            renderHomebook();
                            if ($mainid.css('transform') == 'none') {
                            } else {
                              renderNav();
                            }
                            return;
                          }
                        }).catch(err => { })
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
                }).catch(err => { })
              },
            });
          }
        },
        1000,
        true
      )
    );
  }

  $searchboxon.click(function (e) {
    $searchbox.stop().show(_speed, () => {
      renderHomebook();
    });
    setZindex($searchbox);
    $(this).stop().hide(_speed);
    $bgmain.addClass('sce');
    $state.addClass('statem');
  });

  //搜索相关
  //切换搜索引擎
  ~(function () {
    let ss = _getData('searchengine') || searchengine[0]; //默认搜索引擎
    let { icon, logo, searchlink } = ss;
    $imgid.attr({ src: logo });
    $searchboxon.attr('src', icon);
    $inputTextid.attr({
      placeholder: '输入搜索内容或网址',
      action: searchlink,
    });
  })();

  // 翻译
  $ydfy.click(
    debounce(function () {
      let a = $inputTextid.val().trim();
      $inputTextid.val('');
      if (a === '') return;
      savesearcharr(a);
      // _myOpen(`https://translate.google.cn/?text=${a}`, "_blank");
      // _myOpen(`https://www.deepl.com/translator#zh/en/${a}`, "_blank");
      myOpen(`https://dict.youdao.com/w/${a}`, '_blank');
    }, 500)
  );
  // 搜索提示词
  function tosearch() {
    let action = $inputTextid.attr('action'),
      val = $inputTextid.val().trim();
    $inputTextid.val('');
    if (val === '') return;
    savesearcharr(val);
    if (isurl(val)) {
      myOpen(val, '_blank');
      return;
    }
    myOpen(`${action}${val}`, '_blank');
  }
  $submitButtonid.click(tosearch);
  // 保存搜索历史
  function savesearcharr(str) {
    str = str.trim();
    if (str === '') return;
    _postAjax('/search/add', { a: str }).then(res => { }).catch(err => { })
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
              searchstr += `<li title="${name}" x="${type}" cursor xx='${name}' ssid="${id}" class="tscitem">${name}<div class="miaoxu iconfont icon-lishijilu"></div><div class="dellss iconfont icon-cangpeitubiao_shanchu"></div></li>`;
            } else if (type === 'note') {
              searchstr += `<li title="${name}" x="${type}" cursor xx="${name}" noteid="${id}" class="tscitem">${name}<div class="miaoxu iconfont icon-bijiben"></div></li>`;
            } else if (type === 'bmk') {
              searchstr += `<li title="${name}(${link})" x="${type}" xxx="${link}" cursor xx="${name}" class="tscitem">${name}<div class="miaoxu iconfont icon-shuqian1"></div></li>`;
            }
          });
        }
        $listid.html(searchstr);
      }
      let callWord = _getData('callword') || 'y';
      if (callWord === 'y') {
        const script = document.createElement('script');
        script.src = `https://www.baidu.com/su?wd=${val}&cb=showMsg`;
        document.body.appendChild(script);
        document.body.removeChild(script);
      };
    }).catch(err => { })
  }

  window.showMsg = function (msg) {
    var str = '';
    for (var i = 0; i < msg.s.length; i++) {
      let name = encodeHtml(msg.s[i]);
      str += `<li title="${name}" x="ss" cursor xx='${name}' class="tscitem">${name}<div class="miaoxu iconfont icon-tishi"></div></li>`;
    }
    str = searchstr += str;
    $listid.html(str);
  };
  $inputTextid.on(
    'input',
    debounce(function () {
      let val = this.value.trim();
      if (val === '') {
        _getAjax('/search/getsearchdata').then((result) => {
          if (parseInt(result.code) === 0) {
            if (result.data.length > 0) {
              sxtsc(result.data);
            }
            return;
          }
        }).catch(err => { })
      } else {
        textinput(val);
      }
    }, 1000)
  );
  $inputTextid.focus(function () {
    $searchlistid.stop().fadeIn(_speed);
    let val = this.value.trim();
    if (val === '') {
      _getAjax('/search/getsearchdata').then((result) => {
        if (parseInt(result.code) === 0) {
          if (result.data.length > 0) {
            sxtsc(result.data);
          }
          return;
        }
      }).catch(err => { })
    } else {
      textinput(val);
    }
  });
  $inputTextid[0].onkeyup = function (e) {
    e.stopPropagation();
    e.preventDefault();
    let key = e.key;
    if (key == 'Enter') {
      tosearch();
    }
    // 清空
    if (key === 'Delete') {
      $inputTextid.val('');
    }
  };

  $searchlistid
    .on(
      'click',
      'li',
      debounce(function (e) {
        $inputTextid.val('');
        let $this = $(this),
          href = $inputTextid.attr('action'),
          xx = $this.attr('xx'),
          x = $this.attr('x'),
          xxx = $this.attr('xxx'),
          noteid = $this.attr('noteid');
        if (x === 'ss') {
          savesearcharr(xx);
          if (isurl(xx)) {
            myOpen(xx, '_blank');
          } else {
            myOpen(`${href}${xx}`, '_blank');
          }
        } else if (x === 'note') {
          openIframe(`/page/note/?v=${noteid}`, xx);
        } else if (x === 'bmk') {
          myOpen(xxx, '_blank');
        }
      }, 500)
    )
    .on('click', '.dellss', function (e) {
      e.stopPropagation();
      let x = $(this).parent().attr('ssid');
      _postAjax('/search/del', { arr: [x] }).then((result) => {
        if (parseInt(result.code) === 0) {
          $(this).parent().stop().slideUp(_speed);
          return;
        }
      }).catch(err => { })
    })
    .on('contextmenu', 'li', function (e) {
      let xx = $(this).attr('xx');
      e.preventDefault();
      $inputTextid.val(xx);
    });
  if (isios()) {
    $searchlistid[0]._longPress('li', function () {
      let xx = $(this).attr('xx');
      $inputTextid.val(xx);
    });
  }

  function sxtsc(arr) {
    let str = '';
    arr.forEach((v) => {
      let data = encodeHtml(v.data);
      str += `<li title="${data}" x="ss" cursor xx='${data}' ssid="${v.id}" class="tscitem">${data}<div class="miaoxu iconfont icon-lishijilu"></div><div class="dellss iconfont icon-cangpeitubiao_shanchu"></div></li>`;
    });
    $listid.html(str);
  }

  $searchbox.on('click', '.search-box-setting', debounce(function (e) {
    e.stopPropagation();
    let callWord = _getData('callword') || 'y';
    let str = `
    <div cursor data-callword="${callWord}" class="mtcitem">百度提示词 [${callWord === 'y' ? '开' : '关'}]</div>
    <div cursor class="mtcitem1">历史记录管理</div>
    <div cursor class="mtcitem2">切换搜索引擎</div>
    `;
    rightMenu(e, str, debounce(function ({ e, close }) {
      let item = _getTarget(e, '.mtcitem');
      if (item) {
        let _this = $(item);
        let flag = _this.attr('data-callword');
        if (flag === 'y') {
          _this.attr('data-callword', 'n');
          _this.text('百度提示词 [关]');
          _setData('callword', 'n');
        } else {
          _this.attr('data-callword', 'y');
          _this.text('百度提示词 [开]');
          _setData('callword', 'y');
        }
      } else if (_getTarget(e, '.mtcitem1')) {
        close();
        openIframe('/page/history/', '历史记录管理');
      } else if (_getTarget(e, '.mtcitem2')) {
        let _close = close;
        let str = ``;
        searchengine.forEach((v, i) => {
          str += `<div title="${v.name}" cursor class="mtcitem" xi=${i}><img style="width: 40px;height: 40px;" src="${v.icon}"><span style="margin-left:10px;">${v.name}</span></div>`;
        });
        rightMenu(
          e,
          str,
          debounce(
            function ({ close, e }) {
              let _this = _getTarget(e, '.mtcitem');
              if (_this) {
                $state.removeClass('statem');
                let xi = $(_this).attr('xi'),
                  { icon, logo, searchlink } = searchengine[xi];
                _loadingBar.start();
                close();
                _close();
                imgjz(
                  logo,
                  () => {
                    _loadingBar.end();
                    $imgid.attr({ src: logo });
                    $state.addClass('statem');
                    $searchboxon.attr({ src: icon });
                    $inputTextid.attr({
                      placeholder: '输入搜索内容或网址',
                      action: searchlink,
                    });
                    _setData('searchengine', searchengine[xi]);
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
    }, 1000, true))
  }, 1000, true))

  //壁纸相关
  //壁纸模糊处理
  let _filterbg = _getData('filterbg') === null ? 0 : _getData('filterbg');
  $bgmain.css({
    filter: `blur(${_filterbg}px)`,
  });
  //随机背景
  function bgInterval() {
    let _flag = dmwidth > 800 ? 'bg' : 'bgxs';
    $xzbg.find('img').addClass('open');
    $xzbg.addClass('open');
    _getAjax('/bg/randombg', { p: _flag }, true).then((result) => {
      if (parseInt(result.code) === 0) {
        let url = `${mediaURL}/bg/${_flag}/${result.data.link}`;
        imgjz(
          url,
          () => {
            $xzbg.find('img').removeClass('open');
            $xzbg.removeClass('open');
            $bgmain.css('background-image', `url(${url})`);
            _userinfo[_flag] = result.data.link;
            _postAjax(
              '/bg/updatabg',
              { flag: _flag, bg: result.data.link },
              true
            ).then((result) => {
              if (parseInt(result.code) === 0) {
                sendCommand({ type: 'updatedata', flag: 'userinfo' });
                return;
              }
            }).catch(err => { })
          },
          () => {
            _err('加载失败');
            $xzbg.find('img').removeClass('open');
            $xzbg.removeClass('open');
          }
        );
        return;
      }
      $xzbg.find('img').removeClass('open');
      $xzbg.removeClass('open');
    }).catch(err => { })
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
  $toupbg.click(function () {
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
  });
  ~(function () {
    let allbg = $allbg[0];
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
    str += `<div cursor class="mtcitem">设为壁纸</div>`;
    if (_userinfo.account === 'root') {
      str += `<div cursor class="mtcitem1">删除</div>`;
    }
    rightMenu(
      e,
      str,
      debounce(
        function ({ close, e }) {
          if (_getTarget(e, '.mtcitem')) {
            let bgflag = dmwidth > 800 ? 'bg' : 'bgxs',
              xx = `${mediaURL}/bg/${bgflag}/${url}`;
            $allbgwrap.stop().fadeOut(_speed, () => {
              $allbg.html('');
            });
            $xzbg.find('img').addClass('open');
            $xzbg.addClass('open');
            close();
            imgjz(
              xx,
              () => {
                $xzbg.find('img').removeClass('open');
                $xzbg.removeClass('open');
                $bgmain.css('background-image', `url(${xx})`);
              },
              () => {
                _err('加载失败');
                $xzbg.find('img').removeClass('open');
                $xzbg.removeClass('open');
              }
            );
            _userinfo[bgflag] = url;
            _postAjax('/bg/updatabg', { flag: bgflag, bg: url }, true).then(
              (result) => {
                if (parseInt(result.code) === 0) {
                  sendCommand({ type: 'updatedata', flag: 'userinfo' });
                  return;
                }
              }
            ).catch(err => { })
          } else if (_getTarget(e, '.mtcitem1')) {
            if (_userinfo.account === 'root') {
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
                  }).catch(err => { })
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
      str += `<div style="pointer-events: none;" class="bgitem">
            <div class="bgitemimg"></div>
            </div>`;
    });
    $allbg.html(str).scrollTop(0);
  }
  function bgxuanran(y) {
    if ($allbgwrap.is(':hidden')) return;
    if (y) {
      bgxuanrandefault();
    }
    let str = '',
      _flag = dmwidth > 800 ? 'bg' : 'bgxs',
      showpage = _getData('bgshowpage') || 40;
    _getAjax('/bg/getbg', { flag: _flag, page: bgpage, showpage }).then(
      (result) => {
        if (parseInt(result.code) === 0) {
          if ($allbgwrap.is(':hidden')) return;
          let { total, totalPage, data, pageNo } = result.data;
          bgpage = pageNo;
          data.forEach((v) => {
            str += `<div class="bgitem" x="${v}">
                <div class="bgitemimg" data-src="${mediaURL}/bgys/${_flag}/${v}"></div>
                    </div>`;
          });
          if (totalPage > 1) {
            str += `<div class="pagingbox">`;
            str += pagination({ pageNo, pageSize: showpage, total });
            str += `</div > `;
          }
          $allbg.html(str);
          if (y) {
            $allbg.scrollTop(0);
          }
          bglazyImg($allbg, '.bgitem', '.bgitemimg');
          return;
        }
      }
    ).catch(err => { })
  }
  $allbg
    .on('contextmenu', '.bgitem', function (e) {
      e.preventDefault();
      let url = $(this).attr('x');
      bgitemmenu(e, url);
    })
    .on('click', '.bgitem', function () {
      let $this = $(this);
      let idx = $this.index();
      let arr = []
      $('.bgitem').each((idx, item) => {
        let $item = $(item)
        let u2 = $item.children('.bgitemimg').attr('data-src')
        arr.push({
          u2,
          u1: u2.replace('bgys', 'bg')
        })
      })
      imgPreview(arr, idx);
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
              bgpage--;
              bgxuanran(true);
            } else if (flag === 'next') {
              bgpage++;
              bgxuanran(true);
            } else if (flag === 'go') {
              let val = document
                .querySelector('.pagingbox #paginationBox input')
                .value.trim();
              val = parseInt(val);
              if (isNaN(val)) return;
              bgpage = val;
              bgxuanran(true);
            } else if (flag === 'gotop') {
              $allbg.stop().animate(
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
        bglazyImg($allbg, '.bgitem', '.bgitemimg');
      }, 100)
    );
  if (isios()) {
    $allbg[0]._longPress('.bgitem', function (e) {
      let url = $(this).attr('x'),
        ev = e.changedTouches[0];
      bgitemmenu(ev, url);
    });
  }
  $bgshowpage.on('change', function () {
    let val = $(this).val();
    _setData('bgshowpage', val);
    bgpage = 1;
    bgxuanran(true);
  });
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
    $youtop.removeClass('open');
    $youtopwrap.stop().fadeOut(_speed);
    $allbgwrap.stop().slideDown(_speed, () => {
      bgxuanran(true);
    });
    setZindex($allbgwrap);
    $bgshowpage.val(_getData('bgshowpage') || 40);
  }
  //设置
  $setUp.click(
    debounce(
      function (e) {
        let str = `<div cursor class="mtcitem">账号管理</div>
                <div cursor class="mtcitem1">个性化</div>`;
        rightMenu(
          e,
          str,
          debounce(
            function ({ e, close }) {
              if (_getTarget(e, '.mtcitem')) {
                let str = `<div cursor class="mtcitem">个人信息</div>
              <div cursor class="mtcitem1">修改密码</div>
              <div cursor class="mtcitem2">删除账号</div>`;
                let flagClose = close;
                rightMenu(
                  e,
                  str,
                  debounce(
                    function ({ close, e }) {
                      if (_getTarget(e, '.mtcitem')) {
                        $youtop.removeClass('open');
                        $youtopwrap.stop().fadeOut(_speed);
                        flagClose()
                        close();
                        handleUserinfo();
                        $userinfobox.stop().fadeIn(_speed);
                        setZindex($userinfobox);
                      } else if (_getTarget(e, '.mtcitem1')) {
                        let str = `<div class="mtcinp">
                        <input autocomplete="off" placeholder="原密码" type="password">
                      </div>
                      <div class="mtcinp1">
                        <input autocomplete="off" placeholder="新密码" type="password">
                      </div>
                      <div class="mtcinp2">
                        <input autocomplete="off" placeholder="确认密码" type="password">
                      </div>
                    <button cursor class="mtcbtn">提交</button>`
                        rightMenu(e, str, debounce(function ({ close, e, inp }) {
                          if (_getTarget(e, '.mtcbtn')) {
                            let oldpassword = inp[0],
                              newpassword = inp[1],
                              newpassword1 = inp[2];
                            if (newpassword !== newpassword1) {
                              _err('密码不一致')
                              return
                            };
                            _postAjax('/user/changepass', {
                              oldpassword: md5(oldpassword),
                              newpassword: md5(newpassword),
                            }).then((result) => {
                              if (parseInt(result.code) === 0) {
                                close()
                                _success(result.codeText);
                                return;
                              }
                            }).catch((_) => { });
                          }
                        }, 500, true))
                      } else if (_getTarget(e, '.mtcitem2')) {
                        alert('确认删除账号？', {
                          confirm: true,
                          handled: (m) => {
                            if (m === 'confirm') {
                              _postAjax('/user/delaccount', {}).then(
                                (result) => {
                                  if (parseInt(result.code) === 0) {
                                    alert(result.codeText, {
                                      handled: (_) => {
                                        _delData();
                                        myOpen('/page/login/');
                                      },
                                    });
                                    return;
                                  }
                                }
                              ).catch(err => { })
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
                let mymouse = _getData('mymouse') || 'y';
                let hua = _getData('hua') || 'y';
                let dian = _getData('dian') || 'y';
                let str = `<div cursor class="mtcitem">壁纸库</div>
                <div cursor class="mtcitem1">背景模糊度</div>
              <div cursor class="mtcitem2">背景灰度</div>
              <div cursor class="mtcitem3">选择字体</div>
              <div cursor data-mouse="${mymouse}" class="mtcitem4">鼠标跟随 [${mymouse === 'y' ? '开' : '关'
                  }]</div>
              <div cursor data-dian="${dian}" class="mtcitem6">点击爱心 [${dian === 'y' ? '开' : '关'
                  }]</div>
              <div cursor data-hua="${hua}" class="mtcitem5">樱花飘落 [${hua === 'y' ? '开' : '关'
                  }]</div>
              <div cursor class="mtcitem7">加载动画</div>`;
                let flagClose = close;
                rightMenu(
                  e,
                  str,
                  debounce(
                    function ({ close, e }) {
                      let item4 = _getTarget(e, '.mtcitem4');
                      let item5 = _getTarget(e, '.mtcitem5');
                      let item6 = _getTarget(e, '.mtcitem6');
                      if (_getTarget(e, '.mtcitem')) {
                        flagClose()
                        close();
                        openbgku();
                      } else if (_getTarget(e, '.mtcitem1')) {
                        _progressBar(
                          _filterbg / 100,
                          throttle(function (per) {
                            _filterbg = parseInt(per * 100);
                            if (_filterbg <= 0) {
                              $bgmain.removeClass('mh');
                            } else {
                              $bgmain.addClass('mh');
                            }
                            $bgmain.css({
                              filter: `blur(${_filterbg}px)`,
                            });
                            _setData('filterbg', _filterbg);
                          }, 500)
                        );
                      } else if (_getTarget(e, '.mtcitem2')) {
                        _progressBar(
                          _pagecolor,
                          throttle(function (per) {
                            _pagecolor = per;
                            document.documentElement.style.filter = `grayscale(${_pagecolor})`;
                            _setData('pagecolor', _pagecolor);
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
                              str += `<div cursor data-font="${item}" class="mtcitem"><span style="font-size:16px">${(
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
                                function ({ e }) {
                                  let _this = _getTarget(e, '.mtcitem');
                                  if (_this) {
                                    let $this = $(_this);
                                    let font = $this.attr('data-font');
                                    _setData('fonttype', font);
                                    handleFontType();
                                  }
                                },
                                1000,
                                true
                              )
                            );
                          }
                        }).catch(err => { })
                      } else if (item4) {
                        let _this = $(item4);
                        let flag = _this.attr('data-mouse');
                        if (flag === 'y') {
                          _this.attr('data-mouse', 'n');
                          _this.text(`鼠标跟随 [关]`);
                          _setData('mymouse', 'n');
                          $('#mouseCanvas').remove();
                        } else {
                          _this.attr('data-mouse', 'y');
                          _this.text(`鼠标跟随 [开]`);
                          _setData('mymouse', 'y');
                          $.myMouse({ type: 11 });
                        }
                      } else if (item5) {
                        let _this = $(item5);
                        let flag = _this.attr('data-hua');
                        if (flag === 'y') {
                          _this.attr('data-hua', 'n');
                          _this.text(`樱花飘落 [关]`);
                          _setData('hua', 'n');
                        } else {
                          _this.attr('data-hua', 'y');
                          _this.text(`樱花飘落 [开]`);
                          _setData('hua', 'y');
                        }
                      } else if (item6) {
                        let _this = $(item6);
                        let flag = _this.attr('data-dian');
                        if (flag === 'y') {
                          _this.attr('data-dian', 'n');
                          _this.text(`点击爱心 [关]`);
                          _setData('dian', 'n');
                        } else {
                          _this.attr('data-dian', 'y');
                          _this.text(`点击爱心 [开]`);
                          _setData('dian', 'y');
                        }
                      } else if (_getTarget(e, '.mtcitem7')) {
                        let str = `<div cursor data-flag="n" style="justify-content: center;" class="mtcitem"><span style="line-height:40px;">关闭</span></div>
                      <div cursor data-flag="y" style="justify-content: center;" class="mtcitem"><span style="line-height:40px;">随机</span></div>`;
                        let [x, y] = loadingNum;
                        for (let i = x; i <= y; i++) {
                          str += `<div cursor data-flag="${i}" style="justify-content: center;" class="mtcitem"><img style="width:40px;height:40px" src="/img/loading${i}.gif"></div>`;
                        }
                        rightMenu(e, str, function ({ e }) {
                          let _this = _getTarget(e, '.mtcitem');
                          if (_this) {
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
    )
  );
  $xzbg.click(
    throttle(function () {
      bgInterval();
    }, 500)
  );

  $allbgoff.click(function () {
    $allbgwrap.stop().fadeOut(_speed, () => {
      $allbg.html('');
    });
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
        let obj = deepClone(musicobj);
        delete obj.pic;
        delete obj.url;
        delete obj.murl;
        _postAjax(
          '/player/updatemusicinfo',
          {
            history: 'n',
            lastplay: obj,
            currentTime: $myAudio[0].currentTime,
            duration: $myAudio[0]._totalTime,
          },
          true
        ).then((result) => {
          if (result.code == 0) {
            sendCommand({ type: 'updatedata', flag: 'musicinfo' });
            return;
          }
        }).catch(err => { })
      }
    }
    _setTimeout(showTime, 1000);
  }
  showTime();

  //音乐播放器
  //播放模式切换
  $randomid.click(function () {
    if (!_music) return;
    if (isddplay) {
      _postAjax('/user/controlsave', {
        type: 'playmode',
        data: randomplay,
      }).then((result) => {
        if (parseInt(result.code) === 0) {
          sendCommand({ type: 'yc' });
          return;
        }
      }).catch(err => { })
    }
    var a;
    switch (randomplay) {
      case true:
        {
          randomplay = false;
          $myAudio.attr('loop', null);
          $randomid.attr('class', 'iconfont icon-suiji');
          a = '随机播放';
          musicarr = myShuffle(deepClone(_playinglist));
        }
        break;
      case false:
        {
          randomplay = 1;
          $myAudio.attr('loop', 'loop');
          $randomid.attr('class', 'iconfont icon-ttpodicon');
          a = '单曲播放';
        }
        break;
      case 1:
        {
          randomplay = true;
          $myAudio.attr('loop', null);
          $randomid.attr('class', 'iconfont icon-shunxubofang');
          a = '顺序播放';
          musicarr = deepClone(_playinglist);
        }
        break;
    }
    _success(a);
  });

  //上一曲
  $previd.click(function (e) {
    let index;
    if (!_music) return;
    if (musicarr.length == 0) {
      playallmusic();
      return;
    }
    index = musicarr.findIndex(
      (x) => x.artist + x.name === musicobj.artist + musicobj.name
    );
    index--;
    index < 0 ? (index = musicarr.length - 1) : null;
    musicPlay(musicarr[index]);
  });
  //下一曲
  $nextid.click(function (e) {
    $mmjdt.css({
      width: 0,
    });
    $pro2.width('0');
    let index;
    if (!_music) return;
    if (musicarr.length == 0) {
      playallmusic();
      return;
    }
    index = musicarr.findIndex(
      (x) => x.artist + x.name === musicobj.artist + musicobj.name
    );
    index++;
    index > musicarr.length - 1 ? (index = 0) : null;
    musicPlay(musicarr[index]);
  });
  //播放所有歌曲
  function playallmusic() {
    _getAjax('/player/getall').then((result) => {
      if (parseInt(result.code) === 0) {
        let musics = result.data;
        if (musics.length === 0) return;
        musicarr =
          randomplay === false
            ? myShuffle(deepClone(musics))
            : deepClone(musics);
        _playinglist = deepClone(musics);
        _postAjax('/player/updateplaying', { data: _playinglist }).then(
          (result) => {
            if (parseInt(result.code) === 0) {
              sendCommand({ type: 'updatedata', flag: 'playinglist' });
              return;
            }
          }
        ).catch(err => { })
        musicPlay(musicarr[0]);
        return;
      }
    }).catch(err => { })
  }
  // 最小化控制菜单
  $nextm.click(function () {
    $nextid.click();
  });
  $nextmm.click(function () {
    $nextid.click();
  });
  $prevm.click(function () {
    $previd.click();
  });
  $musichide.on('mouseenter', function () {
    if (!musicobj) return;
    $(this).attr('title', `${musicobj.artist} - ${musicobj.name}`);
  });
  //播放暂停
  $playid.click(function () {
    if ($myAudio[0].paused) {
      audioPlay();
    } else {
      audioPause();
    }
  });
  $hplayid.click(function () {
    $playid.click();
  });
  $hhplayid.click(function () {
    $playid.click();
  });
  // 暂停
  function audioPause() {
    $myAudio[0].pause();
    $titleid.text(mytitle);
    $dolt.css('animation-play-state', 'paused');
    $musicimgid.css('animation-play-state', 'paused');
    $playid.attr('class', 'iconfont icon-65zanting');
    $hplayid.attr('class', 'iconfont icon-65zanting');
    $hhplayid.attr('class', 'iconfont icon-65zanting');
    $playid.css('animation', 'none');
    $hplayid.css('animation', 'none');
    $hhplayid.css('animation', 'none');
  }
  //播放音乐
  function audioPlay() {
    videoPause();
    if (!musicobj) return;
    if (isddplay) {
      //远程播放
      _postAjax('/user/controlsave', {
        type: 'play',
        data: {
          play: true,
          obj: musicobj,
        },
      }).then((result) => {
        if (parseInt(result.code) === 0) {
          sendCommand({ type: 'yc' });
          return;
        }
      }).catch(err => { })
    } else {
      $titleid.text(
        `\xa0\xa0\xa0♪Playing：${musicobj.artist} - ${musicobj.name}`
      );
      $myAudio[0].play();
      if ($myAudio[0].buffered.length === 0) {
        //音乐没有缓冲
        musicInitial();
      }
      if ($lrc.children().length === 0 || $myAudio[0]._rod.length === 0) {
        musiclrc();
      }
    }
    //保持播放速度
    if (_getData('lastplaysd')) {
      $myAudio[0].playbackRate = _getData('lastplaysd')[1];
    }
  }

  function videoPause() {
    $myVideo[0].pause();
  }
  function videoPlay() {
    audioPause();
    $myVideo[0].play();
  }
  //歌词处理
  let showlrcfy = _getData('showfy') || false;
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
          $lrcfyon.stop().show(_speed);
        } else {
          $lrcfyon.stop().hide(_speed);
        }
        let str = '';
        rod.forEach((item) => {
          str += `<div>
          <p style="text-align:${lrcstatu.statu};font-size:${lrcstatu.size + 'px'
            };line-height:${lrcstatu.size + 6 + 'px'}" class="elrc">${item.p}</p>
          <p style="display: ${showlrcfy && hasfy ? 'block' : 'none'
            };text-align:${lrcstatu.statu};font-size:${lrcstatu.size - 2 + 'px'
            };line-height:${lrcstatu.size + 4 + 'px'}" class="lrcfy">${item.fy
            }</p></div>`;
        });
        $lrc.html(str);
        handleLrc(true);
      }
    }).catch(err => { })
  }
  function handleLrc(y) {
    if ($lrc.children().length === 0 || $myAudio[0]._rod.length === 0) return;
    let $lrcdiv = $lrc.children('div'),
      $activediv = $lrcdiv.eq(actionLrcIndex),
      wH = $lrccwrap.outerHeight(),
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
  $lrcfyon.click((e) => {
    if (showlrcfy) {
      $('.lrcfy').css('display', 'none');
    } else {
      $('.lrcfy').css('display', 'block');
    }
    handleLrc(true);
    showlrcfy = !showlrcfy;
    _setData('showfy', showlrcfy);
  });
  $lrccwrap.click(function () {
    if ($musicbox._flag !== 'y') return;
    if (this._isop) {
      $lrccwrap.css('opacity', 1);
      $musiclrcbg.removeClass('open');
      this._isop = false;
    } else {
      $lrccwrap.css('opacity', 0);
      $musiclrcbg.addClass('open');
      this._isop = true;
    }
  });
  // 音乐事件
  let upprog = throttle(function () {
    $currenttime.text(tin($myAudio[0].currentTime));
    proTime($myAudio[0].currentTime / $myAudio[0]._totalTime, true);
  }, 500);
  $myAudio[0]._totalTime = 0;
  let lrcCount = -1; //歌词计数
  $myAudio
    .on('loadedmetadata', function () {
      //元数据加载完
      $myAudio[0]._totalTime =
        isNaN($myAudio[0].duration) || $myAudio[0].duration === Infinity
          ? 0
          : $myAudio[0].duration;
      $totaltime.text(tin($myAudio[0]._totalTime));
    })
    .on('waiting', function () {
      //缺少数据加载效果
      if ($myAudio[0].paused) return;
      $dolt.css('animation', 'bgcolor .3s infinite linear alternate');
      $playid.attr('class', 'iconfont icon-65zanting');
      $hplayid.attr('class', 'iconfont icon-65zanting');
      $hhplayid.attr('class', 'iconfont icon-65zanting');
      $playid.css('animation', 'fontcolor .5s infinite linear alternate');
      $hplayid.css('animation', 'fontcolor .5s infinite linear alternate');
      $hhplayid.css('animation', 'fontcolor .5s infinite linear alternate');
      document.body.classList.add('cursorloading');
    })
    .on(
      'playing',
      debounce(function () {
        //准备开始播放
        if ($myAudio[0].paused) return;
        $dolt.css('animation', 'bgcolor 2s infinite linear alternate');
        $playid.attr('class', 'iconfont icon-zanting');
        $hplayid.attr('class', 'iconfont icon-zanting');
        $hhplayid.attr('class', 'iconfont icon-zanting');
        $playid.css('animation', 'none');
        $hplayid.css('animation', 'none');
        $hhplayid.css('animation', 'none');
        $musicimgid.css({
          animation: 'turn 8s infinite linear',
        });
        document.body.classList.remove('cursorloading');
      }, 500)
    )
    .on('error', function () {
      //播放失败提示
      if (!musicobj) return;
      alert(`${musicobj.artist}-${musicobj.name} 加载失败，播放下一曲？`, {
        confirm: true,
        handled: (msg) => {
          if (msg === 'confirm') {
            $nextid.click();
            return;
          }
          audioPause();
        },
      });
    })
    .on('ended', function () {
      if (randomplay === 1) return;
      $nextid.click();
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
            if ($musiclrc.css('transform') === 'none') {
              if (lrcCount > 1) {
                handleLrc(true);
              } else {
                handleLrc();
              }
            }
            let activep = '',
              activep1 = '';
            activep = showlrcfy
              ? `${rod[actionLrcIndex].p} ${rod[actionLrcIndex].fy}`
              : rod[actionLrcIndex].p;
            if (actionLrcIndex + 1 === rod.length) {
              activep1 = '';
            } else {
              activep1 = showlrcfy
                ? `${rod[actionLrcIndex + 1].p} ${rod[actionLrcIndex + 1].fy}`
                : rod[actionLrcIndex + 1].p;
            }
            if ($lrcbot.attr('x') === '0') {
              $lrcbot.find('.one').text(activep).addClass('open');
              $lrcbot.find('.tow').text(activep1).removeClass('open');
              $lrcbot.attr('x', '1');
            } else {
              $lrcbot.find('.one').text(activep1).removeClass('open');
              $lrcbot.find('.tow').text(activep).addClass('open');
              $lrcbot.attr('x', '0');
            }
          }, lrcCount * 100);
        });
    });
  // 音乐分享
  $musicshare.click(
    debounce(
      function (e) {
        if (!musicobj) return;
        let obj = {
          name: musicobj.name,
          artist: musicobj.artist,
          mv: musicobj.mv,
        };
        _postAjax('/player/musicshare', obj).then((result) => {
          if (parseInt(result.code) === 0) {
            openIframe(`/page/sharelist`, '分享列表')
          }
        }).catch(err => { })
      },
      500,
      true
    )
  );
  // 歌词设置样式和编辑
  let lrcstatu = _getData('lrcstatu') || {
    size: dmwidth > 800 ? 14 : 18,
    statu: 'center',
  };
  $looklrc.click(
    debounce(
      function (e) {
        let str = `<div cursor class="mtcitem">放大字体</div>
            <div cursor class="mtcitem1">缩小字体</div>
            <div cursor class="mtcitem2">靠左</div>
            <div cursor class="mtcitem3">居中</div>
            <div cursor class="mtcitem4">靠右</div>
            <div cursor class="mtcitem5">编辑歌词</div>
            <div cursor class="mtcitem6">封面</div>
            <div cursor class="mtcitem7">复制信息</div>`;
        rightMenu(e, str, function ({ close, e }) {
          if (_getTarget(e, '.mtcitem')) {
            let { size } = lrcstatu;
            size += 2;
            size >= 24 ? (size = 24) : null;
            let $lrcdiv = $lrc.children('div');
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
            let $lrcdiv = $lrc.children('div');
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
            let $lrcdiv = $lrc.children('div');
            $lrcdiv.find('.elrc').css({
              'text-align': 'left',
            });
            $lrcdiv.find('.lrcfy').css({
              'text-align': 'left',
            });
            _setData('lrcstatu', lrcstatu);
          } else if (_getTarget(e, '.mtcitem3')) {
            lrcstatu.statu = 'center';
            let $lrcdiv = $lrc.children('div');
            $lrcdiv.find('.elrc').css({
              'text-align': 'center',
            });
            $lrcdiv.find('.lrcfy').css({
              'text-align': 'center',
            });
            _setData('lrcstatu', lrcstatu);
          } else if (_getTarget(e, '.mtcitem4')) {
            lrcstatu.statu = 'right';
            let $lrcdiv = $lrc.children('div');
            $lrcdiv.find('.elrc').css({
              'text-align': 'right',
            });
            $lrcdiv.find('.lrcfy').css({
              'text-align': 'right',
            });
            _setData('lrcstatu', lrcstatu);
          } else if (_getTarget(e, '.mtcitem5')) {
            if (!musicobj) return;
            if (_userinfo.account !== 'root') {
              $editlrc.find('.save').remove();
            }
            setZindex($editlrc);
            $editlrc.stop().fadeIn(_speed, () => {
              $editlrc.css('display', 'flex').find('textarea').val('');
              $editlrc._mobj = deepClone(musicobj);
              _getAjax('/player/getlrc', {
                name: musicobj.name,
                artist: musicobj.artist,
              }).then((result) => {
                if (parseInt(result.code) === 0) {
                  close();
                  $editlrc._val = result.data;
                  $editlrc.find('textarea').val(result.data);
                  return;
                }
              }).catch(err => { })
            });
          } else if (_getTarget(e, '.mtcitem6')) {
            close()
            imgPreview([{
              u1: `${mediaURL}/music/${musicobj.artist}-${musicobj.name}.jpg`,
              u2: `${mediaURL}/musicys/${musicobj.artist}-${musicobj.name}.jpg`
            }])
          } else if (_getTarget(e, '.mtcitem7')) {
            close()
            copyText(`${musicobj.artist}-${musicobj.name}`)
          }
        });
      },
      500,
      true
    )
  );
  $editlrc.find('textarea').on('keydown', function (e) {
    let key = e.key,
      ctrl = e.ctrlKey || e.metaKey;
    if (ctrl && key === 's') {
      $editlrc.find('.save').click();
      e.preventDefault();
    }
  });
  $editlrc
    .on('click', '.close', function () {
      $editlrc.stop().fadeOut(_speed);
    })
    .on('click', '.lrcClose', function () {
      $editlrc.stop().fadeOut(_speed);
    })
    .on('click', '.save', function () {
      let val = $editlrc.find('textarea').val();
      if ($editlrc._val === val) return;
      $editlrc._val = val;
      _postAjax('/player/editlrc', {
        name: $editlrc._mobj.name,
        artist: $editlrc._mobj.artist,
        val,
      }).then((result) => {
        if (parseInt(result.code) === 0) {
          $editlrc._val = val;
          _success(result.codeText);
          return;
        }
      }).catch(err => { })
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
    $mmjdt.css({
      width: per,
    });
    if (!y) {
      $myAudio[0].currentTime = pes * $myAudio[0]._totalTime;
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
  // 隐藏歌词
  $lrcdownid.click(function () {
    $musiclrc.removeClass('musiclrchh');
  });

  // 播放速度
  if (_getData('lastplaysd')) {
    $playsd.text(_getData('lastplaysd')[0]);
  }
  $playsd.click(function (e) {
    let str = `<div cursor class="mtcitem">x2</div>
            <div cursor class="mtcitem">x1.75</div>
            <div cursor class="mtcitem">x1.5</div>
            <div cursor class="mtcitem">x1.25</div>
            <div cursor class="mtcitem">x1</div>
            <div cursor class="mtcitem">x0.75</div>
            <div cursor class="mtcitem">x0.25</div>`;
    rightMenu(e, str, function ({ e }) {
      let _this = _getTarget(e, '.mtcitem');
      if (_this) {
        let a = $(_this).text(),
          b = +a.slice(1);
        $playsd.text(a);
        $myAudio[0].playbackRate = b;
        let c = [$playsd.text(), b];
        _setData('lastplaysd', c);
        _success(b + 'X');
      }
    });
  });
  //远程播放
  $yuanchengbfid.click(function (e) {
    if (isddplay) {
      isddplay = !isddplay;
      _success('远程播放已关闭');
      $lrc.html(``);
      $yuanchengbfid.removeClass('red');
      _postAjax('/user/controlsave', {
        type: 'play',
        data: {
          play: false,
        },
      }).then((result) => {
        if (parseInt(result.code) === 0) {
          sendCommand({ type: 'yc' });
          return;
        }
      }).catch(err => { })
    } else {
      if (!musicobj) return;
      isddplay = !isddplay;
      _success('远程播放已开启');
      $myAudio[0]._rod = [];
      $lrc.html(
        `<div style="width:100%;font-size:18px;position: fixed;text-align: center;top: 45%;left:50%;transform: translateX(-50%);">远程播放中...</div>`
      );
      audioPause();
      $yuanchengbfid.addClass('red');
      _postAjax('/user/controlsave', {
        type: 'play',
        data: {
          play: true,
          obj: musicobj,
        },
      }).then((result) => {
        if (parseInt(result.code) === 0) {
          sendCommand({ type: 'yc' });
          return;
        }
      }).catch(err => { })
    }
  });
  let $mmjdt = $('.mmjdt');
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
    $totaltime.text('00:00');
    $lrcbot.find('.one').text('');
    $lrcbot.find('.tow').text('');
    $myAudio[0]._rod = [];
    $lrc.html(
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
    _success(a);
    gaoliang(false); //列表定位
    gaolianging(false);
    $mmjdt.css({
      width: 0,
    });
    $musiclrcbg.addClass('lrcbgss'); //背景透明
    $mmlistbg.addClass('lrcbgss');
    $musicimgid.css('animation', 'none');
    csfz();
    musicInitial();
    //处理收藏按钮
    if (_music && _music[1].item.some((v) => v.name + v.artist === musicobj.name + musicobj.artist)) {
      $shoucang.addClass('sccolor');
    } else {
      $shoucang.removeClass('sccolor');
    }
    // mv图标
    if (musicobj.mv == 'y') {
      $mvpid.stop().show(_speed);
    } else {
      $mvpid.stop().hide(_speed);
    }
    playtimer = setTimeout(() => {
      playtimer = null;
      audioPlay();
      if (!$musicmv.is(':hidden')) {
        videoPause();
        $musicmv.stop().fadeOut(_speed);
      }
      delete obj.pic;
      delete obj.url;
      delete obj.murl;
      if (!isddplay) {
        //未开启远程
        musicflagnum = 0; //初始化倒计时
        _postAjax(
          '/player/updatemusicinfo',
          {
            //更新当前播放音乐
            history: 'y',
            lastplay: obj,
            currentTime: $myAudio[0].currentTime,
            duration: $myAudio[0]._totalTime,
          },
          true
        ).then((result) => {
          if (result.code == 0) {
            sendCommand({ type: 'updatedata', flag: 'music' });
            if (!$mmlistid.is(':hidden')) {
              if (
                _music &&
                _music.findIndex((item) => item.id === $mmlist._flagId) === 0 &&
                $mmmlist.css('transform') === 'none'
              ) {
                renderMusicItem();
              }
            }
          }
        }).catch(err => { })
      }
    }, 2000);
  }

  // 播放列表相关
  $dqplarying.click(function (e) {
    $ksbfxsid.click();
  });
  function defaultdqplaying() {
    let str = ``;
    new Array(50).fill(null).forEach(() => {
      str += `<li style="background-color:#e9e9e9;pointer-events: none;margin: 2px 0;" class = "liimusic"></li>`;
    });
    $playingbot.html(str);
  }
  $ksbfxsid.click(function (e) {
    defaultdqplaying();
    $playingwrap.stop().fadeIn(100, () => {
      $playingwrap
        .find('.playinglist')
        .stop()
        .slideDown(_speed, () => {
          dqplaying();
          gaolianging(true);
        });
    });
  });
  //处理播放列表
  function dqplaying() {
    let str = '';
    if (!_playinglist) {
      $playtingtopleft.text(`正在播放(0)`);
      return;
    }
    $playtingtopleft.text(`正在播放(${_playinglist.length})`);
    _playinglist.forEach((v, i) => {
      let { name, artist, mv } = v;
      str += `<li cursor data-name="${name}" data-artist="${artist}" data-mv="${mv}" class = "liimusic">
          <div class="liimusicnum">${i + 1}</div>
          <div class="liimusiccen">
          <span class = "liimusicname">${name}</span>
          <span class="liimusicartist">${artist}</span>
          </div>
          <div cursor class="dleplaying iconfont icon-guanbi"></div>
        </li>`;
    });
    $playingbot.html(str);
  }
  //清空播放列表
  $playtingtopright.click(function () {
    _playinglist = [];
    musicarr = [];
    dqplaying();
    _postAjax('/player/updateplaying', { data: _playinglist }).then(
      (result) => {
        if (parseInt(result.code) === 0) {
          sendCommand({ type: 'updatedata', flag: 'playinglist' });
          return;
        }
      }
    ).catch(err => { })
  });
  //选择播放列表歌曲播放
  $playingbot.on('click', '.liimusic', function () {
    let $this = $(this);
    let obj = {
      name: $this.attr('data-name'),
      artist: $this.attr('data-artist'),
      mv: $this.attr('data-mv'),
    };
    if (musicobj.name == obj.name && musicobj.artist == obj.artist) {
      $playid.click();
      return;
    }
    musicPlay(obj);
  });

  function gaolianging(a) {
    if (!musicobj) return;
    if (!_playinglist) return;
    $('.liimusicnum').removeClass('pling');
    $('.liimusic').removeClass('songlisttwo');
    let y = _playinglist.findIndex(
      (v) => musicobj.artist + musicobj.name === v.artist + v.name
    );
    if (y < 0) return;
    var n = y / _playinglist.length;
    if (a) {
      $playingbot.scrollTop(n * ($playingbot[0].scrollHeight - 40));
    }
    $('.liimusicnum').eq(y).addClass('pling');
    $('.liimusic').eq(y).addClass('songlisttwo');
  }
  $playingbot.on('click', '.dleplaying', function (e) {
    e.stopPropagation();
    let $this = $(this),
      mobj = {
        name: $this.parent().attr('data-name'),
        artist: $this.parent().attr('data-artist'),
        mv: $this.parent().attr('data-mv'),
      };
    _playinglist = _playinglist.filter(
      (v) => v.artist + v.name !== mobj.artist + mobj.name
    );
    musicarr = musicarr.filter(
      (v) => v.artist + v.name !== mobj.artist + mobj.name
    );
    dqplaying();
    gaolianging(false);
    _postAjax('/player/updateplaying', { data: _playinglist }).then(
      (result) => {
        if (parseInt(result.code) === 0) {
          sendCommand({ type: 'updatedata', flag: 'playinglist' });
          return;
        }
      }
    ).catch(err => { })
  });

  //隐藏播放列表
  $playingwrap.click(function (e) {
    if (_getTarget(e, '.playingwrap', 1)) {
      $playingbot.html('');
      $playingwrap
        .find('.playinglist')
        .stop()
        .slideUp(_speed, () => {
          $playingwrap.stop().fadeOut(100);
        });
    }
  });
  // 音乐返回按钮
  $mmlistsxid.click(function (e) {
    if (!$searchlistwrap.is(':hidden')) {
      $searchlistwrap.stop().fadeOut(_speed);
      $musictextid.val('');
    } else if ($musiclrc.css('transform') === 'none') {
      $lrcdownid.click();
    } else if ($mmmlist.css('transform') === 'none') {
      $mmlist.removeClass('open');
      $mmmlist.removeClass('open');
      _setTimeout(() => {
        $mmmlist.children('.mmmitemwrap').html('');
      }, 800);
      $gedantname.css('opacity', 0);
    } else if (!$mmlistid.is(':hidden')) {
      if (dmwidth < 800) {
        $mmlistid.stop().fadeOut(_speed, () => {
          $mmmlist.children('.mmmitemwrap').html('');
          $mmlist.children('.mmitemwrap').html('');
        });
      } else {
        $mmlisthide.click();
      }
    }
  });
  $mmlistoff.click(function (e) {
    if (dmwidth > 800) {
      $mmlistid.stop().fadeOut(_speed, () => {
        $mmmlist.children('.mmmitemwrap').html('');
        $mmlist.children('.mmitemwrap').html('');
      });
    }
    $musicmv.stop().fadeOut(_speed);
    $musichide.stop().hide(_speed);
    $lrcbotwrap.stop().fadeOut(_speed);
    audioPause();
    videoPause();
  });

  $mmlisthide.click(function () {
    if (dmwidth > 800) {
      $musichide.stop().show(_speed);
      setZindex($musichide);
      $mmlistid.stop().fadeOut(_speed, () => {
        $mmmlist.children('.mmmitemwrap').html('');
        $mmlist.children('.mmitemwrap').html('');
      });
      if (!$lrcbotwrap._isone) {
        $lrcbotwrap.stop().fadeIn(_speed);
        setZindex($lrcbotwrap);
      }
    }
  });
  $playbox.click(function () {
    $openplayer.click();
  });
  //层级处理
  $document.on('click', function (e) {
    if (_getTarget(e, '.search-box')) {
      setZindex($searchbox);
    } else if (_getTarget(e, '#mmlist')) {
      setZindex($mmlistid);
    } else if (_getTarget(e, '.musichide')) {
      setZindex($musichide);
    } else if (_getTarget(e, '.lrcbotwrap')) {
      setZindex($lrcbotwrap);
    } else if (_getTarget(e, '.musicmv')) {
      setZindex($musicmv);
    } else if (_getTarget(e, '.logdata')) {
      setZindex($logdata);
    } else if (_getTarget(e, '.guestbooklist')) {
      setZindex($guestbooklist);
    } else if (_getTarget(e, '.editlrc')) {
      setZindex($editlrc);
    } else if (_getTarget(e, '.allbgwrap')) {
      setZindex($allbgwrap);
    } else if (_getTarget(e, '.userinfobox')) {
      setZindex($userinfobox);
    }
    if (!_getTarget(e, '.inputDiv')) {
      let val = $inputTextid.val().trim();
      if (val !== '') {
        savesearcharr(val);
      }
      $inputTextid.val('');
      $searchlistid.stop().fadeOut(_speed);
    }
  });
  //本地音乐搜索
  $musictextid.on('input', function () {
    let a = $musictextid.val().trim();
    if (a === '') {
      $searchlistwrap.stop().fadeOut(_speed);
      $msearchlistid.html('');
    } else {
      _musicsea();
    }
  });
  $msearchlistid.on('click', '.limusic', function (e) {
    let $this = $(this);
    let obj = {
      name: $this.attr('data-name'),
      artist: $this.attr('data-artist'),
      mv: $this.attr('data-mv'),
    };
    musicarr =
      randomplay === false
        ? myShuffle(deepClone(musicarrjl))
        : deepClone(musicarrjl);
    _playinglist = deepClone(musicarrjl);
    _postAjax('/player/updateplaying', { data: _playinglist }).then(
      (result) => {
        if (parseInt(result.code) === 0) {
          sendCommand({ type: 'updatedata', flag: 'playinglist' });
          return;
        }
      }
    ).catch(err => { })
    if (musicobj.name == obj.name && musicobj.artist == obj.artist) {
      $playid.click();
      return;
    }
    musicPlay(obj);
  });
  let _musicsea = debounce(musicsea, 1000);
  function musicsea() {
    let a = $musictextid.val().trim();
    if (a !== '') {
      $searchlistwrap.stop().fadeIn(_speed);
      _getAjax('/player/search', { a }).then((result) => {
        if (parseInt(result.code) === 0) {
          if ($mmlistid.is(':hidden')) return;
          let str = '';
          let arr = result.data;
          let num = 1;
          musicarrjl = arr;
          if (arr.length > 0) {
            arr.forEach((v) => {
              str += `<li title="${v.artist}-${v.name}" data-name="${v.name}" data-artist="${v.artist}" data-mv="${v.mv}" cursor class = "limusic">
                    <div class="limusicnum">${num}</div>
                    <div class="limusiccen">
                      <span class="limusicname">${v.name}</span>
                      <span class="limusicartist">${v.artist}</span>
                    </div>
                  </li>`;
              num++;
            });
            $msearchlistid.html(str);
          } else {
            $msearchlistid.html(
              '<p style="padding: 20px 0;text-align: center;pointer-events: none;">没有找到歌曲</p>'
            );
          }
          return;
        }
      }).catch(err => { })
    }
  }
  $searchlistwrap.click(function (e) {
    if (_getTarget(e, '.searchlistwrap', 1)) {
      $searchlistwrap.stop().fadeOut(_speed);
      $msearchlistid.html('');
      $musictextid.val('');
    }
  });

  $musicnameid
    .click(function () {
      $musicimgid.click();
    })
    .on('mouseover', function () {
      var a = $(this).text();
      $(this).attr('title', a);
    });
  $btname.on('mouseover', function () {
    var a = $(this).text();
    $(this).attr('title', a);
  });
  $btartist.on('mouseover', function () {
    var a = $(this).text();
    $(this).attr('title', a);
  });

  //进度条
  var probox = $('.probox')[0],
    pro1 = $pro1[0],
    pro2 = $pro2[0],
    dolt = $dolt[0],
    mmlist = $mmlistid[0];
  probox.addEventListener('touchstart', function (e) {
    $dolt.addClass('open');
    $pro1.addClass('open');
    let pes;
    mmove(e);
    function mmove(e) {
      e.preventDefault();
      let ev = e.targetTouches[0];
      let a = pro1.offsetLeft + mmlist.offsetLeft - $mmlistid.width() / 2;
      pes =
        (ev.clientX - a - dolt.offsetWidth / 2) /
        (pro1.offsetWidth - dolt.offsetWidth);
      proTime(pes);
    }
    function mend(e) {
      if (isddplay) {
        _postAjax('/user/controlsave', {
          type: 'progress',
          data: pes,
        }).then((result) => {
          if (parseInt(result.code) === 0) {
            sendCommand({ type: 'yc' });
            return;
          }
        }).catch(err => { })
      }
      $dolt.removeClass('open');
      $pro1.removeClass('open');
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
      let a = pro1.offsetLeft + mmlist.offsetLeft - $mmlistid.width() / 2;
      pes =
        (e.clientX - a - dolt.offsetWidth / 2) /
        (pro1.offsetWidth - dolt.offsetWidth);
      proTime(pes);
    }
    function mup() {
      if (isddplay) {
        _postAjax('/user/controlsave', {
          type: 'progress',
          data: pes,
        }).then((result) => {
          if (parseInt(result.code) === 0) {
            sendCommand({ type: 'yc' });
            return;
          }
        }).catch(err => { })
      }
      document.removeEventListener('mousemove', mmove);
      document.removeEventListener('mouseup', mup);
    }
    document.addEventListener('mousemove', mmove);
    document.addEventListener('mouseup', mup);
  });

  // 搜索词上下选择
  let numff = -1;
  $inputTextid[0].onkeydown = function (e) {
    let key = e.key,
      listlength = $listid.children('li').length - 1;
    if (key !== 'ArrowDown' && key !== 'ArrowUp') {
      numff = -1;
    }
    if (key === 'ArrowDown') {
      numff++;
      if (numff > listlength) {
        numff = 0;
      }
      $('.tscitem').removeClass('ssbg').eq(numff).addClass('ssbg');
      let aa = $('.tscitem').eq(numff).attr('xx');
      $inputTextid.val(aa);
      let dw = parseInt(numff * 30);
      $searchlistid.scrollTop(dw);
    }
    if (key === 'ArrowUp') {
      numff--;
      if (numff < 0) {
        numff = listlength;
      }
      $('.tscitem').removeClass('ssbg').eq(numff).addClass('ssbg');
      let aa = $('.tscitem').eq(numff).attr('xx');
      $inputTextid.val(aa);
      let dw = parseInt(numff * 30);
      $searchlistid.scrollTop(dw);
    }
  };
  // 主页全局键盘事件
  document.onkeydown = function (e) {
    let key = e.key,
      ctrl = e.ctrlKey || e.metaKey;
    let isFocus = $('input').is(':focus') || $('textarea').is(':focus');
    if (!isFocus && document.activeElement.id !== 'ycdiv') {
      if (ctrl && key === 'ArrowLeft') $previd.click(); // 上一曲
      if (ctrl && key === 'ArrowRight') $nextid.click(); // 下一曲
      //音量+
      if (ctrl && key === 'ArrowUp') {
        e.preventDefault();
        defaultvolume += 0.1;
        if (defaultvolume >= 1) {
          defaultvolume = 1;
        }
        if (isddplay) {
          _postAjax('/user/controlsave', {
            type: 'vol',
            data: defaultvolume,
          }).then((result) => {
            if (parseInt(result.code) === 0) {
              sendCommand({ type: 'yc' });
              return;
            }
          }).catch(err => { })
        }
        vobellm();
        _success(parseInt(defaultvolume * 100) + '%', true);
      }
      //音量-
      if (ctrl && key === 'ArrowDown') {
        e.preventDefault(); // 或者 return false;
        defaultvolume -= 0.1;
        if (defaultvolume <= 0) {
          defaultvolume = 0;
        }
        if (isddplay) {
          _postAjax('/user/controlsave', {
            type: 'vol',
            data: defaultvolume,
          }).then((result) => {
            if (parseInt(result.code) === 0) {
              sendCommand({ type: 'yc' });
              return;
            }
          }).catch(err => { })
        }
        vobellm();
        _success(parseInt(defaultvolume * 100) + '%', true);
      }
      //暂停/播放
      if (key === ' ') {
        if (!_music) return;
        if ($musicmv.is(':hidden')) {
          $playid.click();
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
        if ($mmlistid.is(':hidden')) {
          $openplayer.click();
        } else {
          $mmlisthide.click();
        }
      }
      // 歌词
      if (key === 'l') {
        $gcm.click();
      }
      // 书签
      if (key === 's' && !ctrl) {
        if ($searchbox.is(':hidden')) {
          $searchboxon.click();
        }
      }
      //搜索聚焦
      if (key === 'f') {
        if (!$searchbox.is(':hidden')) {
          if (!$inputTextid.is(':focus')) {
            e.preventDefault();
          }
          $inputTextid.focus();
        }
      }
      // 跳到历史记录
      if (key === 'h') {
        openIframe('/page/history', '历史记录管理')
      }
      // 跳到笔记
      if (key === 'n') {
        $onlinenote.click();
      }
      // 侧边栏
      if (key === 'a' && !ctrl) {
        $menubtnid.click();
      }
      // 播放模式
      if (key === 'r') {
        $randomid.click();
      }
      // 停止歌曲并关闭所有音乐窗口
      if (key === 'c' && !ctrl) {
        $mmlistoff.click();
      }
    }
  };

  $vobellid.on('click', function (e) {
    _progressBar(
      defaultvolume,
      throttle(function (per, type) {
        defaultvolume = per;
        vobellm();
        if (type === 'up') {
          if (isddplay) {
            _postAjax('/user/controlsave', {
              type: 'vol',
              data: defaultvolume,
            }).then((result) => {
              if (parseInt(result.code) === 0) {
                sendCommand({ type: 'yc' });
                return;
              }
            }).catch(err => { })
          }
        }
      }, 500)
    );
  });
  if (defaultvolume === null) {
    defaultvolume = 0.7;
  } else if (defaultvolume <= 0) {
    $vobellid.attr('class', 'iconfont icon-24gl-volumeCross');
  }
  //音量
  $myAudio[0].volume = defaultvolume;
  $myVideo[0].volume = defaultvolume;
  function vobellm() {
    $myAudio[0].volume = defaultvolume;
    $myVideo[0].volume = defaultvolume;
    _setData('lastvol', defaultvolume);
    if (defaultvolume <= 0) {
      $vobellid.attr('class', 'iconfont icon-24gl-volumeCross');
    } else {
      $vobellid.attr('class', 'iconfont icon-24gl-volumeHigh');
    }
  }

  //歌曲封面
  $musicimgid.click(function () {
    $musiclrc.addClass('musiclrchh');
    handleLrc();
    $lrcdownid.stop().fadeIn(_speed);
    if (musicobj && musicobj.mv == 'y') {
      $mvpid.stop().show(_speed);
    } else {
      $mvpid.stop().hide(_speed);
    }
    if (_music && musicobj && _music[1].item.some((v) => v.name + v.artist === musicobj.name + musicobj.artist)) {
      $shoucang.addClass('sccolor');
    } else {
      $shoucang.removeClass('sccolor');
    }
  });

  //歌单列表
  (function () {
    let fromDom = null;
    $mmlist
      .on('dragstart', '.gedanlist', function (e) {
        if (_userinfo.account !== 'root') return;
        fromDom = this;
      })
      .on('drop', '.gedanlist', function (e) {
        if (_userinfo.account !== 'root') return;
        let a = $(fromDom).index(),
          b = $(this).index(),
          fromId = $(fromDom).attr('data-id'),
          toId = $(this).attr('data-id');
        if (fromDom) {
          if (a > 1 && b > 1 && a !== b) {
            _postAjax('/player/listmove', { fromId, toId }).then((result) => {
              if (parseInt(result.code) === 0) {
                sendCommand({ type: 'updatedata', flag: 'music' });
                renderMusicList();
                return;
              }
            }).catch(err => { })
          }
          fromDom = null;
        }
      })
      .on('dragover', '.gedanlist', function (e) {
        e.preventDefault();
      });
  })();
  //处理歌曲列表
  function renderMusicList() {
    if ($mmlistid.is(':hidden')) return;
    let a = $mmlist.children('.mmitemwrap').children();
    if (a.length === 0) {
      rendermusiclistdefault();
    }
    let id = $mmlist._flagId;
    _getAjax('/player/getmusicinfo').then((result) => {
      if (parseInt(result.code) === 0) {
        if ($mmlistid.is(':hidden')) return;
        if ($myAudio[0].paused) {
          let _musicinfo = result.data;
          let { currentTime = 0, duration = 0, lastplay } = _musicinfo;
          if (lastplay) {
            musicobjInit(lastplay);
            csfz();
          } else {
            _getAjax('/player/getall').then((result) => {
              if (parseInt(result.code) === 0) {
                let musics = result.data;
                if (musics.length > 0) {
                  musicobjInit(musics[0]);
                  csfz();
                }
                return;
              }
            }).catch(err => { })
          }
          $myAudio[0].currentTime = currentTime;
          $myAudio[0]._totalTime = duration;
          upprog();
          $totaltime.text(tin(duration));
        }
        _getAjax('/player/getlist', { id }).then((result) => {
          if (parseInt(result.code) === 0) {
            _music = result.data;
            rendermusiclist();
            return;
          }
        }).catch(err => { })
      }
    }).catch(err => { })
    if (!_playinglist) {
      _getAjax('/player/getplaying').then((result) => {
        if (parseInt(result.code) === 0) {
          _playinglist = result.data;
          musicarr = deepClone(_playinglist);
          return;
        }
      }).catch(err => { })
    }
  }
  function rendermusiclistdefault() {
    let str = '';
    let color = 'rgb(0 0 0 / 10%)';
    new Array(50).fill(null).forEach((item) => {
      str += `<li style="pointer-events: none;" class="gedanlist">
      <div class="gdiwrap" style="background-color:${color};background-image:none;box-shadow: none;"></div>
      </li>`;
    });
    $mmlist.children('.mmitemwrap').html(str);
  }
  function rendermusiclist() {
    if ($mmlistid.is(':hidden')) return;
    let arr = _music,
      str = '';
    arr.forEach((item) => {
      let name = encodeHtml(item.name);
      let pic = !/^\/img/.test(item.pic) ? `${mediaURL}${item.pic}` : item.pic
      str += `<li title="${name}" data-id="${item.id}" data-name="${name}" cursor draggable="true" class="gedanlist">
      <div class="gdiwrap">
        <img class="gedimg" data-src="${pic}"></div>
        <span>${name}</sapn>
        </li>`;
    });
    str += `${_userinfo.account === 'root'
      ? '<li cursor class="addslist"><img src="/img/tianjia.png"></li>'
      : ''
      }`;
    $mmlist.children('.mmitemwrap').html(str);
    lazyImg($mmlist, '.gedanlist', 'img', true);
    if (!$mmlist._flagId) {
      $mmlist._flagId = arr[0].id;
    }
    if ($mmmlist.css('transform') === 'none') {
      rendermusicitem();
    }
  }
  function renderMusicItem() {
    if ($mmlistid.is(':hidden') || $mmmlist.css('transform') !== 'none') return;
    let id = $mmlist._flagId;
    return _getAjax('/player/getlist', { id }).then((result) => {
      if (parseInt(result.code) === 0) {
        if ($mmlistid.is(':hidden') || $mmmlist.css('transform') !== 'none')
          return;
        _music = result.data;
        rendermusicitem();
        return;
      }
    }).catch(err => { })
  }
  function rendermusicitemdefault() {
    let str = '';
    let color = 'rgb(0 0 0 / 10%)';
    str += `<div style="pointer-events: none;" class="lbxianshi">
       <div style="background-color:${color};background-image:none" class="gdfmtop"></div>
       <div style="background-color:${color}; height: 40px;width: 100px;margin: 30px;" class="gdlbname"></div>
     </div>
     <div style="pointer-events: none; height: 40px;width: 100%;box-sizing: border-box;padding: 0 5px;overflow:hidden;">
         <div style="background-color:${color};height: 40px;width:50%;float:left;"></div>
         <div style="background-color:${color};height: 40px;width:30%;float:right;"></div>
     </div>`;
    new Array(50).fill(null).forEach((item) => {
      str += `<div style="pointer-events: none;" data-flag="default" class="songlist">
        <div style="background-color:${color};background-image:none" class="songlistnum"></div>
        <div class="songms">
          <span style="background-color:${color};margin: 8px 0 0 0;width: 110px;height:15px" class="divmusicname"></span>
          <span style="background-color:${color};margin: 5px 0 0 0;width: 110px;height:15px" class="musicartist"></span>
        </div>
        <div style="background-color:${color};width:100px;height: 40px;margin: 10px 0 0 10px;" class="sxx"></div>
      </div>`;
    });
    $mmmlist.children('.mmmitemwrap').html(str);
  }
  function rendermusicitem() {
    if ($mmlistid.is(':hidden') || $mmmlist.css('transform') !== 'none') return;
    let id = $mmlist._flagId,
      listpx = _getData('lastpx') || 'default';
    let ind = _music.findIndex((item) => item.id === id);
    ind < 0 ? (ind = 0) : null;
    let marr = deepClone(_music[ind]);
    if (ind > 0) {
      if (listpx === 'artist') {
        marr.item = arrSortMinToMax(marr.item, 'artist');
      } else if (listpx === 'name') {
        marr.item = arrSortMinToMax(marr.item, 'name');
      }
    }

    let str = '';
    let name = encodeHtml(marr.name);
    let pic = !/^\/img/.test(marr.pic) ? `${mediaURL}${marr.pic}` : marr.pic
    str += `<div class="lbxianshi">
       <div class="gdfmtop">
         <img onload="this.style.display='block';this.parentNode.style.background='none'" onerror="this.onerror=''; src='/img/music.jpg';this.parentNode.style.background='none'" src="${pic
      }">
       </div>
       <div class="gdlbname">
         <div class="lbming" title="${name}">${name}</div>
         ${_userinfo.account === 'root' && ind > 1
        ? `<i cursor class="editlb iconfont icon-bianji"></i>`
        : ''
      }
       </div>
       <div class="gedxh">${ind + 1}</div>
     </div>
     <div class="songlisttop">
          <div cursor class="bfdq iconfont icon-65zanting"></div>
          <div class="asnum">播放全部<span>(${marr.item.length})</span></div>
          ${_userinfo.account === 'root' && ind > 1
        ? `<div cursor title="Upload songs" class="addmusic"><i class="iconfont icon-shangchuan1"></i></div>`
        : ''
      }
          <div cursor title="Check" id="mmlistqx"><i class="iconfont icon-quanxuan1"></i></div>
          ${ind > 0
        ? `<div data-type="${listpx}" cursor class="listps"><i class="iconfont icon-paixu"></i></div>`
        : ''
      }
     </div>`;
    marr.item.forEach((item) => {
      str += `<div title="${item.artist}-${item.name}" draggable="true" m="${item.mv
        }" xn="${item.name}" xa="${item.artist}" cursor class="songlist">
        <div cursor check="n" class="duoxuan"></div>
        <div class="songlistnum">
          <img class="songlistlogo" data-src=${encodeURI(
          `${mediaURL}/musicys/${item.artist}-${item.name}.jpg`
        )}>
          <img class="songlistdq" src="/img/wave.gif">
        </div>
        <div class="songms">
          <span class="divmusicname">${item.name}</span>
          <span class="musicartist"><i class="viptu iconfont icon-vip1"></i>${item.artist
        }</span>
        </div>
        ${item.mv === 'y'
          ? ` <div class="mvplay iconfont icon-shipin"></div>`
          : ''
        }
        <div title="添加到播放列表" class="addtop iconfont icon-icon-test"></div>
        <div class="sxx iconfont icon-icon"></div>
      </div>`;
    });
    str += `<div class="topbottomwrap">
        <div cursor id="mmtop" class="iconfont icon-up"></div>
        <div cursor id="mmcon" class="iconfont icon-dingwei"></div>
      <div cursor id="mmbot" class="iconfont icon-Down"></div>
      </div>
      <div class="qxcz">
        <div cursor x='1' class="qxbtn">全选</div>
        ${_userinfo.account === 'root' && ind > 1
        ? '<div cursor title="Move to" class="qxydbtn">移动到</div>'
        : ''
      }
        <div cursor title="添加到播放列表" class="alladdtop">添加</div>
        ${ind == 1 ? '' : '<div cursor class="schxbtn">收藏</div>'}
        ${_userinfo.account === 'root' || ind < 2
        ? '<div cursor class="qxycbtn">删除</div>'
        : ''
      }
      </div>`;
    $mmmlist.children('.mmmitemwrap').html(str);
    $mmmlist._duoxuan = false;
    musicarrjl = marr.item;
    gaoliang(false);
    if ($mmmlist[0].scrollTop > 115) {
      $('.songlisttop').addClass('sct');
    } else {
      $('.songlisttop').removeClass('sct');
    }
    _setTimeout(() => {
    });
    lazyImg($mmmlist, '.songlist', '.songlistlogo', 1);
  }

  //打开列表
  $mmlist
    .on(
      'click',
      '.gedanlist',
      debounce(function (e) {
        $mmlist._flagId = $(this).attr('data-id');
        rendermusicitemdefault();
        $mmlist.addClass('open');
        $mmmlist.addClass('open');
        $mmmlist.scrollTop(0);
        _setTimeout(renderMusicItem, 800);
      }, 1000, true)
    )
    .on(
      'scroll',
      debounce(function () {
        lazyImg($mmlist, '.gedanlist', 'img');
      }, 100)
    )
    .on('click', '.addslist', function (e) {
      // 添加歌单
      if (_userinfo.account !== 'root') return;
      let str = `<div class="mtcinp">
            <input autocomplete="off" type="text">
          </div>
        <button cursor class="mtcbtn">新增歌单</button>`;
      rightMenu(
        e,
        str,
        debounce(
          function ({ close, e, inp }) {
            if (_getTarget(e, '.mtcbtn')) {
              let val = inp[0];
              if (val === '') {
                _err('请输入歌单名');
                return;
              }
              _postAjax('/player/addlist', { name: val }).then((result) => {
                if (parseInt(result.code) === 0) {
                  close();
                  sendCommand({ type: 'updatedata', flag: 'music' });
                  renderMusicList();
                  return;
                }
              }).catch(err => { })
            }
          },
          1000,
          true
        )
      );
    })
    .on('contextmenu', '.gedanlist', function (e) {
      if (_userinfo.account !== 'root') return;
      e.preventDefault();
      const xi = $(this).index();
      const _id = $(this).attr('data-id');
      const name = $(this).attr('data-name');
      if (xi < 2) return;
      gedanmenu(e, { id: _id, name });
    });
  if (isios()) {
    $mmlist[0]._longPress('.gedanlist', function (e) {
      if (_userinfo.account !== 'root') return;
      const xi = $(this).index();
      const _id = $(this).attr('data-id');
      const name = $(this).attr('data-name');
      let ev = e.changedTouches[0];
      if (xi < 2) return;
      gedanmenu(ev, { id: _id, name });
    });
  }

  // 删除歌单
  function gedanmenu(e, obj) {
    let str = `<div cursor class="mtcitem">删除歌单</div>`;
    rightMenu(
      e,
      str,
      debounce(
        function ({ close, e }) {
          if (_getTarget(e, '.mtcitem')) {
            alert(`确认删除歌单：${obj.name}？`, {
              confirm: true,
              handled: (m) => {
                if (m !== 'confirm') return;
                _postAjax('/player/dellist', { id: obj.id }).then((result) => {
                  if (parseInt(result.code) === 0) {
                    close();
                    sendCommand({ type: 'updatedata', flag: 'music' });
                    renderMusicList();
                    return;
                  }
                }).catch(err => { })
              },
            });
          }
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
    musicarr =
      randomplay === false
        ? myShuffle(deepClone(musicarrjl))
        : deepClone(musicarrjl);
    _playinglist = deepClone(musicarrjl);
    _postAjax('/player/updateplaying', { data: _playinglist }).then(
      (result) => {
        if (parseInt(result.code) === 0) {
          sendCommand({ type: 'updatedata', flag: 'playinglist' });
          return;
        }
      }
    ).catch(err => { })
    musicPlay(musicarr[0]);
  }
  let topbottomwraphide = debounce(function () {
    $mmmlist.find('.topbottomwrap').stop().fadeOut(_speed);
  }, 10000);
  // 歌单列表编辑
  $mmmlist
    .on('click', '.editlb', function (e) {
      if (_userinfo.account !== 'root') return;
      let index = _music.findIndex((item) => item.id === $mmlist._flagId);
      let { id, name } = _music[index];
      let str = `<div class="mtcinp">
            <input autocomplete="off" placeholder='num: ${+index + 1
        }' type="text">
          </div>
          <div class="mtcinp1">
            <input autocomplete="off" value="${encodeHtml(name)}" type="text">
          </div>
        <button cursor class="mtcbtn">提交</button>`;
      rightMenu(
        e,
        str,
        debounce(
          function ({ close, e, inp }) {
            if (_getTarget(e, '.mtcbtn')) {
              let wz = inp[0];
              let nn = inp[1];
              if (nn === '') {
                _err('请输入歌单名');
                return;
              }
              if ((wz === '' || wz === index) && nn === name) return;
              if (wz == '') {
                wz = index;
              } else {
                wz = parseInt(wz) - 1;
              }
              if (isNaN(wz)) return;
              _postAjax('/player/editlist', { id, name: nn, index: wz }).then(
                (result) => {
                  if (parseInt(result.code) === 0) {
                    close();
                    sendCommand({ type: 'updatedata', flag: 'music' });
                    renderMusicList();
                    return;
                  }
                }
              ).catch(err => { })
            }
          },
          1000,
          true
        )
      );
    })
    .on('click', '.addmusic', async function (e) {
      // 上传歌曲
      let listid = $mmlist._flagId;
      if (_userinfo.account !== 'root') return;
      let arr = [],
        input = document.createElement('input');
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
            _postAjax('/player/addsong', { id: listid, arr }).then((result) => {
              if (parseInt(result.code) === 0) {
                sendCommand({ type: 'updatedata', flag: 'music' });
                renderMusicList();
                return;
              }
            }).catch(err => { })
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
              let d = a.split('-');
              if (b === 'mp3') {
                let obj = {
                  name: d[1],
                  artist: d[0],
                  mv: '',
                };
                arr.push(obj);
              }
              pro.close('文件已存在');
              num++;
              fn(num);
              return;
            }

            let index = breakpointarr.length;
            compale(index);

            ~(async function fnn(numm) {
              if (numm >= chunks.length) {
                let aa = await _postAjax('/player/mergefile', {
                  HASH,
                  count,
                  name,
                }); //合并切片
                if (parseInt(aa.code) === 0) {
                  pro.close();
                  let d = a.split('-');
                  if (b === 'mp3') {
                    let obj = {
                      name: d[1],
                      artist: d[0],
                      mv: '',
                    };
                    arr.push(obj);
                  }
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
    })
    .on('scroll', function () {
      //列表滚动
      $mmmlist.find('.topbottomwrap').stop().fadeIn(_speed);
      topbottomwraphide();
      if (this.scrollTop > 115) {
        $('.songlisttop').addClass('sct');
        $('.lbxianshi').addClass('lbxma');
        $gedantname.text($('.lbming').text()).css('opacity', 1);
      } else {
        $('.songlisttop').removeClass('sct');
        $('.lbxianshi').removeClass('lbxma');
        $gedantname.css('opacity', 0);
      }
    })
    .on('click', '.bfdq', playList)
    .on(
      'scroll',
      debounce(function () {
        lazyImg($mmmlist, '.songlist', '.songlistlogo');
      }, 100)
    )
    .on('click', '.addtop', function (e) {
      //添加到播放列表
      let mobj = {
        name: $(this).parent().attr('xn'),
        artist: $(this).parent().attr('xa'),
        mv: $(this).parent().attr('m'),
      };
      _playinglist.push(mobj);
      musicarr.push(mobj);
      _postAjax('/player/updateplaying', { data: _playinglist }).then(
        (result) => {
          if (parseInt(result.code) === 0) {
            sendCommand({ type: 'updatedata', flag: 'playinglist' });
            _success('已添加到播放列表');
            return;
          }
        }
      ).catch(err => { })
    })
    .on('click', '#mmlistqx', () => {
      //多选操作
      let $qxcz = $('.qxcz'),
        $duoxuan = $('.duoxuan');
      if ($mmmlist._duoxuan) {
        $qxcz.stop().fadeOut(_speed);
        $duoxuan.stop().fadeOut(_speed);
        $mmmlist._duoxuan = false;
      } else {
        $qxcz.stop().fadeIn(_speed);
        $duoxuan.stop().fadeIn(_speed);
        $mmmlist._duoxuan = true;
      }
      $duoxuan.attr('check', 'n').css('background-color', 'transparent');
      $('.qxbtn').attr('x', '1');
    })
    .on('click', '.qxbtn', function () {
      //全选/全不选
      let $this = $(this),
        $duoxuan = $('.duoxuan');
      let num = 0;
      if ($this.attr('x') === '1') {
        $duoxuan.attr('check', 'y').css('background-color', checkColor);
        $this.attr('x', '2');
        num = $duoxuan.length;
      } else {
        $duoxuan.attr('check', 'n').css('background-color', 'transparent');
        $this.attr('x', '1');
        num = 0;
      }
      _success(`选中：${num}`, true);
    })
    .on('click', '.schxbtn', function (e) {
      //收藏选中
      let $songlist = $('.songlist'),
        $selectarr = $songlist.filter(
          (index, item) => $(item).find('.duoxuan').attr('check') === 'y'
        );
      if ($selectarr.length === 0) return;
      let arr = [];
      $selectarr.each((i, v) => {
        let $v = $(v);
        arr.push({
          name: $v.attr('xn'),
          artist: $v.attr('xa'),
          mv: $v.attr('m'),
        });
      });
      _postAjax('/player/collectsong', { ar: arr }).then((result) => {
        if (parseInt(result.code) === 0) {
          sendCommand({ type: 'updatedata', flag: 'music' });
          renderMusicList();
          _success();
          return;
        }
      }).catch(err => { })
    })
    .on('click', '.qxycbtn', function (e) {
      // 移除全选
      let $songlist = $('.songlist'),
        id = $mmlist._flagId,
        $selectarr = $songlist.filter(
          (index, item) => $(item).find('.duoxuan').attr('check') === 'y'
        );
      if ($selectarr.length === 0) return;
      alert(`确认删除？`, {
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
            });
          });
          _postAjax('/player/delsong', { id, ar: arr }).then((result) => {
            if (parseInt(result.code) === 0) {
              sendCommand({ type: 'updatedata', flag: 'music' });
              renderMusicList();
              return;
            }
          }).catch(err => { })
        },
      });
    })
    .on('click', '.qxydbtn', function (e) {
      // 全选移动
      if (_userinfo.account !== 'root') return;
      let $songlist = $('.songlist'),
        id = $mmlist._flagId,
        $selectarr = $songlist.filter(
          (index, item) => $(item).find('.duoxuan').attr('check') === 'y'
        );
      if ($selectarr.length === 0) return;
      let str = ``;
      _music.forEach((item, i) => {
        if (item.id !== id && i > 1) {
          let name = encodeHtml(item.name),
            pic = !/^\/img/.test(item.pic) ? `${mediaURL}${item.pic}` : item.pic;
          str += `<div data-name="${name}" cursor class="mtcitem" data-id="${item.id}"><img style="width: 40px;height: 40px;" src="${pic}"><span style="margin-left:10px;">${name}</span></div>`;
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
                tid = $this.attr('data-id'),
                listname = $this.attr('data-name'),
                arr = [];
              $selectarr.each((i, v) => {
                let $v = $(v);
                arr.push({
                  name: $v.attr('xn'),
                  artist: $v.attr('xa'),
                  mv: $v.attr('m'),
                });
              });
              alert(`确认移动到 ${listname}?`, {
                confirm: true,
                handled: (m) => {
                  if (m !== 'confirm') return;
                  _postAjax('/player/songtolist', { id, tid, ar: arr }).then(
                    (result) => {
                      if (parseInt(result.code) === 0) {
                        close();
                        sendCommand({ type: 'updatedata', flag: 'music' });
                        renderMusicList();
                        return;
                      }
                    }
                  ).catch(err => { })
                },
              });
            }
          },
          1000,
          true
        )
      );
    })
    .on('click', '.alladdtop', function (e) {
      // 选中添加到播放列表
      let $songlist = $('.songlist');
      let $selectarr = $songlist.filter(
        (index, item) => $(item).find('.duoxuan').attr('check') === 'y'
      );
      if ($selectarr.length === 0) return;
      let arr = [];
      $selectarr.each((i, v) => {
        let $v = $(v);
        arr.push({
          name: $v.attr('xn'),
          artist: $v.attr('xa'),
          mv: $v.attr('m'),
        });
      });
      _playinglist = [..._playinglist, ...arr];
      musicarr = [...musicarr, ...arr];
      _postAjax('/player/updateplaying', { data: _playinglist }).then(
        (result) => {
          if (parseInt(result.code) === 0) {
            sendCommand({ type: 'updatedata', flag: 'playinglist' });
            _success('已添加到播放列表');
            $('#mmlistqx').click();
            return;
          }
        }
      ).catch(err => { })
    })
    .on('click', '.songlist', function (e) {
      //播放列表
      if (!$('.duoxuan').is(':hidden')) {
        return;
      }
      var sobj = {
        name: $(this).attr('xn'),
        artist: $(this).attr('xa'),
        mv: $(this).attr('m'),
      };
      if (_getTarget(e, '.songms') || _getTarget(e, '.songlistnum')) {
        musicarr =
          randomplay === false
            ? myShuffle(deepClone(musicarrjl))
            : deepClone(musicarrjl);
        _playinglist = deepClone(musicarrjl);
        _postAjax('/player/updateplaying', { data: _playinglist }).then(
          (result) => {
            if (parseInt(result.code) === 0) {
              sendCommand({ type: 'updatedata', flag: 'playinglist' });
              return;
            }
          }
        ).catch(err => { })
        if (musicobj.name == sobj.name && musicobj.artist == sobj.artist) {
          $playid.click();
        } else {
          musicPlay(sobj);
        }
        if (_getTarget(e, '.songlistnum')) {
          $musicimgid.click();
        }
      } else if (_getTarget(e, '.mvplay')) {
        e.stopPropagation();
        setZindex($musicmv);
        musicMv(sobj);
      } else if (_getTarget(e, '.sxx')) {
        let ii = _music.findIndex((item) => item.id === $mmlist._flagId);
        if (ii < 0) return;
        let str = '';
        if (ii < 2) {
          str = `<div cursor class="mtcitem"><i class="iconfont icon-fenxiang_2"></i><span style="margin-left: 10px;">分享歌曲</span></div>
                <div cursor class="mtcitem5"><i class="iconfont icon-fuzhi"></i><span style="margin-left: 10px;">复制信息</span></div>
                <div cursor class="mtcitem1"><i class="iconfont icon-cangpeitubiao_shanchu"></i><span style="margin-left: 10px;">删除</span></div>
                `;
        } else {
          str = `<div cursor class="mtcitem"><i class="iconfont icon-fenxiang_2"></i><span style="margin-left: 10px;">分享歌曲</span></div>
                ${_music && _music[1].item.some((v) => v.name + v.artist === sobj.name + sobj.artist) ? '' : '<div cursor class="mtcitem2"><i class="iconfont icon-icon-"></i><span style="margin-left: 10px;">收藏</span></div>'}
                <div cursor class="mtcitem5"><i class="iconfont icon-fuzhi"></i><span style="margin-left: 10px;">复制信息</span></div>
            ${_userinfo.account === 'root'
              ? `<div cursor class="mtcitem3"><i class="iconfont icon-icon-test"></i><span style="margin-left: 10px;">移动到</span></div>
            ${sobj.mv === 'y'
                ? '<div cursor  class="mtcitem4"><i class="iconfont icon-cangpeitubiao_shanchu"></i><span style="margin-left: 10px;">删除 MV</span></div>'
                : ''
              }
            <div cursor class="mtcitem1"><i class="iconfont icon-cangpeitubiao_shanchu"></i><span style="margin-left: 10px;">删除</span></div>`
              : ''
            }
          `;
        }
        rightMenu(
          e,
          str,
          debounce(
            function ({ close, e }) {
              if (_getTarget(e, '.mtcitem')) {
                let obj = {
                  name: sobj.name,
                  artist: sobj.artist,
                  mv: sobj.mv,
                };
                _postAjax('/player/musicshare', obj).then((result) => {
                  if (parseInt(result.code) === 0) {
                    close();
                    openIframe(`/page/sharelist`, '分享列表')
                  }
                }).catch(err => { })
              } else if (_getTarget(e, '.mtcitem1')) {
                alert(`确认删除：${sobj.artist}-${sobj.name}？`, {
                  confirm: true,
                  handled: (m) => {
                    if (m !== 'confirm') return;
                    let ssobj = deepClone(sobj);
                    let ar = [];
                    let id = $mmlist._flagId;
                    ar.push(ssobj);
                    _postAjax('/player/delsong', { id, ar }).then((result) => {
                      if (parseInt(result.code) === 0) {
                        close();
                        sendCommand({ type: 'updatedata', flag: 'music' });
                        renderMusicList();
                        return;
                      }
                    }).catch(err => { })
                  },
                });
              } else if (_getTarget(e, '.mtcitem2')) {
                let ssobj = deepClone(sobj);
                let ar = [];
                ar.push(ssobj);
                _postAjax('/player/collectsong', { ar }).then((result) => {
                  if (parseInt(result.code) === 0) {
                    close();
                    sendCommand({ type: 'updatedata', flag: 'music' });
                    renderMusicList();
                    _success();
                    return;
                  }
                }).catch(err => { })
              } else if (_getTarget(e, '.mtcitem3')) {
                if (_userinfo.account !== 'root') return;
                let str = '',
                  id = $mmlist._flagId;
                _music.forEach((v, i) => {
                  if (i > 1 && v.id !== id) {
                    let name = encodeHtml(v.name),
                      pic = !/^\/img/.test(v.pic) ? `${mediaURL}${v.pic}` : v.pic;
                    str += `<div data-name="${name}" cursor class="mtcitem" data-id="${v.id}"><img style="width: 40px;height: 40px;" src="${pic}"><span style="margin-left:10px;">${name}</span></div>`;
                  }
                });
                let flagClose = close
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
                          ssobj = deepClone(sobj),
                          ar = [];
                        ar.push(ssobj);
                        alert(`确认移动到 ${listname}?`, {
                          confirm: true,
                          handled: (m) => {
                            if (m !== 'confirm') return;
                            _postAjax('/player/songtolist', {
                              id,
                              tid,
                              ar,
                            }).then((result) => {
                              if (parseInt(result.code) === 0) {
                                flagClose()
                                close();
                                sendCommand({
                                  type: 'updatedata',
                                  flag: 'music',
                                });
                                renderMusicList();
                                return;
                              }
                            }).catch(err => { })
                          },
                        });
                      }
                    },
                    1000,
                    true
                  )
                );
              } else if (_getTarget(e, '.mtcitem4')) {
                if (_userinfo.account !== 'root') return;
                alert(`确认删除MV？`, {
                  confirm: true,
                  handled: (m) => {
                    if (m !== 'confirm') return;
                    let id = $mmlist._flagId;
                    _postAjax('/player/delmv', { id, sobj }).then((result) => {
                      if (parseInt(result.code) === 0) {
                        close();
                        sendCommand({ type: 'updatedata', flag: 'music' });
                        renderMusicItem();
                        return;
                      }
                    }).catch(err => { })
                  },
                });
              } else if (_getTarget(e, '.mtcitem5')) {
                close()
                copyText(`${sobj.artist}-${sobj.name}`)
              }
            },
            1000,
            true
          )
        );
      }
    })
    .on('contextmenu', '.songlist', function (e) {
      e.preventDefault();
      $('#mmlistqx').click();
    })
    .on('click', '.listps', function () {
      //歌曲排序
      let $this = $(this),
        px,
        tz;
      if ($this.attr('data-type') == 'default') {
        px = 'artist';
        tz = '按歌手名排序';
      } else if ($this.attr('data-type') == 'artist') {
        px = 'name';
        tz = '按歌曲名排序';
      } else if ($this.attr('data-type') == 'name') {
        px = 'default';
        tz = '默认排序';
      }
      _setData('lastpx', px);
      _success(tz);
      rendermusicitem();
    })
    .on('click', '#mmtop', function () {
      //列表回到顶部底部和定位到当前播放歌曲
      $mmmlist.stop().animate(
        {
          scrollTop: 0,
        },
        _speed
      );
    })
    .on('click', '#mmbot', function () {
      $mmmlist.stop().animate(
        {
          scrollTop: $mmmlist.prop('scrollHeight'),
        },
        _speed
      );
    })
    .on('click', '#mmcon', function () {
      gaoliang(true);
    })
    .on('click', '.duoxuan', function (e) {
      let $this = $(this),
        check = $this.attr('check');
      if (check === 'n') {
        $this.attr('check', 'y').css('background-color', checkColor);
      } else {
        $this.attr('check', 'n').css('background-color', 'transparent');
      }
      let $duoxuan = $('.duoxuan'),
        $checkArr = $duoxuan.filter((_, item) => $(item).attr('check') === 'y');
      _success(`选中：${$checkArr.length}`, true);
    });
  if (isios()) {
    $mmmlist[0]._longPress('.songlist', function (e) {
      $('#mmlistqx').click();
    });
  }
  // 移动歌曲
  (function () {
    let fromDom = null;
    $mmmlist
      .on('dragstart', '.songlist', function (e) {
        if (_userinfo.account !== 'root') return;
        fromDom = this;
      })
      .on('drop', '.songlist', function (e) {
        if (_userinfo.account !== 'root') return;
        let a = $(fromDom).index('.songlist'),
          b = $(this).index('.songlist'),
          id = $mmlist._flagId,
          index = _music.findIndex((item) => item.id === id);
        if (fromDom) {
          if ($('.listps').attr('data-type') === 'default' && index > 0) {
            _postAjax('/player/songmove', { id, a, b }).then((result) => {
              if (parseInt(result.code) === 0) {
                sendCommand({ type: 'updatedata', flag: 'music' });
                if (a === 0 || b === 0) {
                  renderMusicList();
                } else {
                  renderMusicItem();
                }
                return;
              }
            }).catch(err => { })
          }
          fromDom = null;
        }
      })
      .on('dragover', '.songlist', function (e) {
        e.preventDefault();
      });
  })();

  $shoucang.click(function (e) {
    if (!musicobj) return;
    let obj = deepClone(musicobj);
    delete obj.pic;
    delete obj.url;
    delete obj.murl;
    let ar = [];
    ar.push(obj);
    if (!$(this).hasClass('sccolor')) {
      _postAjax('/player/collectsong', { ar }).then((result) => {
        if (parseInt(result.code) === 0) {
          sendCommand({ type: 'updatedata', flag: 'music' });
          renderMusicList();
          $(this).addClass('sccolor');
          return;
        }
      }).catch(err => { })
    } else {
      _postAjax('/player/closecollectsong', obj).then((result) => {
        if (parseInt(result.code) === 0) {
          sendCommand({ type: 'updatedata', flag: 'music' });
          renderMusicList();
          $(this).removeClass('sccolor');
          return;
        }
      }).catch(err => { })
    }
  });
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
    $('.songlist').removeClass('songlisttwo');
    $('.songlistdq').removeClass('songlistdqshow');
    if (musicarrjl != undefined && musicobj) {
      let $songlist = $('.songlist');
      let ii = [].findIndex.call($songlist, (item) => {
        let $item = $(item);
        return (
          $item.attr('xa') + $item.attr('xn') ===
          musicobj.artist + musicobj.name
        );
      });
      if (ii < 0) {
        $('#mmcon').stop().slideUp(_speed);
      } else {
        $('#mmcon').stop().slideDown(_speed);
        if (a) {
          let sp = $mmmlist.scrollTop() + $songlist.eq(ii).position().top - 100;
          $mmmlist.stop().animate(
            {
              scrollTop: sp,
            },
            _speed
          );
        }
        $('.songlist')
          .eq(ii)
          .addClass('songlisttwo')
          .find('.songlistdq')
          .addClass('songlistdqshow');
      }
    }
  }

  //MV
  $mvoff.click(function (e) {
    videoPause();
    $musicmv.stop().fadeOut(_speed);
  });
  $mvoffxs.click(function (e) {
    $mvoff.click();
  });

  $gcm.click(function () {
    $lrcbotwrap.fadeToggle(_speed)._isone = true;
    setZindex($lrcbotwrap);
  });

  $lrcbotoff.click(function () {
    $lrcbotwrap.stop().fadeOut(_speed)._isone = true;
  });

  //MV播放函数
  function musicMv(obj) {
    musicobjInit(obj);
    csfz();
    audioPause();
    $myVideo.attr('src', `${musicobj.murl}`);
    videoPlay();
    $musicmv.stop().fadeIn(_speed);
    setZindex($musicmv);
    gaoliang(false);
    delete obj.pic;
    delete obj.url;
    delete obj.murl;
    _postAjax(
      '/player/updatemusicinfo',
      {
        history: 'y',
        lastplay: obj,
        currentTime: $myAudio[0].currentTime,
        duration: $myAudio[0]._totalTime,
      },
      true
    ).then((result) => {
      if (result.code == 0) {
        sendCommand({ type: 'updatedata', flag: 'music' });
        if (!$mmlistid.is(':hidden')) {
          if (
            _music &&
            _music.findIndex((item) => item.id === $mmlist._flagId) === 0 &&
            $mmmlist.css('transform') === 'none'
          ) {
            renderMusicItem();
          }
        }
      }
    }).catch(err => { })
  }
  $myVideo[0].onerror = function (e) {
    if (!musicobj) return;
    _err(`${musicobj.artist}-${musicobj.name} 加载失败`);
  };
  let boxpositon = {};
  if (_getData('lastweizi')) {
    boxpositon = _getData('lastweizi');
  }
  //拖动
  var mmlist = $mmlistid[0],
    musichide = $musichide[0],
    lrcbotwrap = $lrcbotwrap[0];
  let $logspace = $('.logspace');
  drag($('.clock')[0], $('.clock')[0], 'lastmyclock');
  drag($lytitle[0], $guestbooklist[0]);
  drag($userinfobox[0], $userinfobox[0]);
  drag($logspace[0], $logdata[0]);
  drag($musichide[0], $musichide[0], 'lastmusichide');
  drag($lrcbotwrap[0], $lrcbotwrap[0], 'lastwingc');
  drag($musicmv.find('.mvtopspace')[0], $musicmv[0]);
  drag($gedantname[0], $mmlistid[0]);
  drag($editlrc.find('.lrceditspace')[0], $editlrc[0]);

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

  $onlinenote.click(
    debounce(
      function () {
        $youtop.removeClass('open');
        $youtopwrap.stop().fadeOut(_speed);
        openIframe(`/page/notes/`, 'Notes');
      },
      1000,
      true
    )
  );
  $shareList.click(
    debounce(
      function () {
        $youtop.removeClass('open');
        $youtopwrap.stop().fadeOut(_speed);
        openIframe(`/page/sharelist/`, 'Sharelist');
      },
      1000,
      true
    )
  );
  $openplayer.click(
    debounce(
      function () {
        $youtop.removeClass('open');
        $youtopwrap.stop().fadeOut(_speed);
        if (!$openplayer._mflag) {
          zidonghide(
            10,
            '.musiclrc',
            '.musicbox',
            debounce(
              function () {
                $musicbox.stop().slideDown(_speed, () => {
                  $musicbox._flag = 'y';
                  handleLrc();
                });
              },
              500,
              true
            ),
            debounce(
              function () {
                $musicbox.stop().slideUp(_speed, () => {
                  $musicbox._flag = 'n';
                  handleLrc();
                });
              },
              500,
              true
            ),
            '.tianc'
          );
          $openplayer._mflag = true;
        }
        $musichide.stop().fadeOut(_speed);
        $mmlistid.stop().fadeIn(_speed, () => {
          renderMusicList();
        });
        setZindex($mmlistid);
      },
      1000,
      true
    )
  );
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
      $openplayer.click();
    },
    down(e) {
      if (!_getTarget(e, '#main', 1)) return;
      openbgku();
    },
    right(e) {
      if (!_getTarget(e, '#main', 1)) return;
      menuon();
    },
    left(e) {
      if (!_getTarget(e, '#main', 1)) return;
      $dltx.click();
    },
  });
  //左导航
  _mySlide({
    el: '.navwrap',
    left() {
      menuoff();
    },
  });
  // 右边选项
  _mySlide({
    el: '.youtopwrap',
    right() {
      $youtop.removeClass('open');
      $youtopwrap.stop().fadeOut(_speed);
    },
  });
  // 歌词
  _mySlide({
    el: '.musiclrc',
    right(e) {
      if (_getTarget(e, '.musicbox')) return;
      $lrcdownid.click();
    },
    down(e) {
      if (_getTarget(e, '.musicbox')) return;
      $lrcdownid.click();
    },
    left(e) {
      if (_getTarget(e, '.musicbox')) return;
      $nextid.click();
    },
  });
  // 歌单
  _mySlide({
    el: '.mmlist',
    right() {
      $mmlistsxid.click();
    },
  });
  // 歌单列表
  _mySlide({
    el: '.mmmlist',
    right() {
      $mmlistsxid.click();
    },
  });
  // 播放器底部控制
  _mySlide({
    el: '#musicname',
    right() {
      $previd.click();
    },
    left() {
      $nextid.click();
    },
  });
  // 壁纸
  _mySlide({
    el: '.allbgwrap',
    right(e) {
      $allbgoff.click();
    },
  });
  _mySlide({
    el: '.videowrap',
    right(e) {
      if (_getTarget(e, '.videowrap', 1)) {
        $mvoff.click();
      }
    },
  });
  // 日志
  _mySlide({
    el: '.logbot',
    right() {
      if (getSelectText() !== '') return;
      $logoff.click();
    },
  });
  // 聊天
  _mySlide({
    el: '.guestbooklistcon',
    right() {
      if (getSelectText() !== '') return;
      $guestbookoff.click();
    },
  });
  // 播放列表
  _mySlide({
    el: '.playingwrap',
    right() {
      $playingbot.html('');
      $playingwrap
        .find('.playinglist')
        .stop()
        .slideUp(_speed, () => {
          $playingwrap.stop().fadeOut(_speed);
        });
    },
  });
  // 搜索列表
  _mySlide({
    el: '.searchlistwrap',
    right() {
      $searchlistwrap.stop().fadeOut(_speed);
      $musictextid.val('');
    },
  });

  $mvpid.click(function (e) {
    e.stopPropagation();
    if (!musicobj) return;
    $myVideo.attr('src', `${musicobj.murl}`);
    $musicmv.stop().fadeIn(_speed);
    videoPlay();
    setZindex($musicmv);
  });

  function csfz() {
    if (!musicobj) return;
    $musicnameid.text(`${musicobj.artist} - ${musicobj.name}`);
    $btname.text(musicobj.name);
    $btartist.text(musicobj.artist);
    $myAudio.attr('src', `${musicobj.url}`);
    $musicimgid.css('background-image', `url("/img/musicbg.png")`)
    imgjz(
      musicobj.pic,
      () => {
        $musicimgid.css('background-image', `none`)
        $musicimgid.find('img').attr('src', musicobj.pic).stop().fadeIn(_speed);
        $musiclrcbg.css('background-image', `url("${musicobj.pic}")`);
        $musichide.css('background-image', `url("${musicobj.pic}")`);
        $mmlistbg.css('background-image', `url("${musicobj.pic}")`);
        $musiclrcbg.removeClass('lrcbgss');
        $mmlistbg.removeClass('lrcbgss');
      },
      () => {
        $musicimgid.css('background-image', `none`)
        $musicimgid
          .find('img')
          .attr('src', '/img/music.jpg')
          .stop()
          .fadeIn(_speed);
        $musiclrcbg.css('background-image', `url("/img/music.jpg")`);
        $musichide.css('background-image', `url("/img/music.jpg")`);
        $mmlistbg.css('background-image', `url("/img/music.jpg")`);
        $musiclrcbg.removeClass('lrcbgss');
        $mmlistbg.removeClass('lrcbgss');
      }
    );
  }

  $youtopwrap.click(function (e) {
    if (_getTarget(e, '.youtopwrap', 1)) {
      $youtop.removeClass('open');
      $youtopwrap.stop().fadeOut(_speed);
    }
  });
  $dltx.click(
    debounce(
      function (e) {
        $youtopwrap.css('display', 'block');
        $youtop.scrollTop(0);
        setZindex($youtopwrap);
        _setTimeout(() => {
          $youtop.addClass('open');
        }, 100);
      },
      500,
      true
    )
  );

  $dcout.click(() => {
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
            myOpen('/page/login/');
            return;
          }
        }).catch(err => { })
      },
    });
  });

  $userinfobox
    .on('click', '.edituname', function (e) {
      let str = `<div class="mtcinp">
              <input autocomplete="off" value="${encodeHtml(
        _userinfo.username
      )}" type="text">
            </div>
            <button cursor class="mtcbtn">提交</button>`;
      rightMenu(
        e,
        str,
        debounce(
          function ({ close, e, inp }) {
            if (_getTarget(e, '.mtcbtn')) {
              let uname = inp[0];
              if (uname === _userinfo.username) return;
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
              }).catch(err => { })
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
          }).catch(err => { })
        },
        500,
        true
      )
    );
  $userinfoclose.click(() => {
    $userinfobox.stop().fadeOut(_speed);
  });
  $userinfologo.click((e) => {
    let str = `<div cursor class="mtcitem">上传头像</div>
    <div cursor class="mtcitem1">查看</div>`;
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
                blob = await compressionImg(file); //压缩图片
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
              [{ u1: `${mediaURL}/logo/${_userinfo.account}/${_userinfo.account}.png?v=${Math.random()}` }]
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
      _userinfo.username
    )}</li><li cursor class="edituname">修改</li></ul>
    <ul><li>账号</li><li>${_userinfo.account}</li></ul>
    <ul><li>壁纸</li><li>每日自动更换壁纸</li><li class="dailybg" cursor>${_userinfo.dailybg && _userinfo.dailybg === 'y' ? '开' : '关'
      }</li></ul>`;
    $usermsgBox.html(str);
    $userinfologo.css(
      'background-image',
      `url(${mediaURL}/logo/${_userinfo.account}/${_userinfo.account
      }.png?v=${Math.random()})`
    );
  }

  //关于
  $about.click(
    debounce(
      function () {
        $youtop.removeClass('open');
        $youtopwrap.stop().fadeOut(_speed);
        openIframe('/page/note/?v=about', 'About');
      },
      1000,
      true
    )
  );
  $recycle.click(
    debounce(
      function () {
        $youtop.removeClass('open');
        $youtopwrap.stop().fadeOut(_speed);
        openIframe('/page/recycle', 'Recycle');
      },
      1000,
      true
    )
  );

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
    $logbot.html(str).scrollTop(0);
  }
  function logxuanran(y) {
    if (y) {
      logxuanrandefault();
    }
    let context = $searchlog.val().trim(),
      showpage = _getData('logshowpage') || 100;
    _getAjax('/root/logsearch', { page: logpage, context, showpage }).then(
      (result) => {
        if (parseInt(result.code) === 0) {
          if ($logdata.is(':hidden')) return;
          let { total, totalPage, data, pageNo } = result.data;
          logpage = pageNo;
          let str = '';
          data.forEach((v) => {
            str += `<p>=>${encodeHtml(v)}</p>`;
          });
          if (totalPage > 1) {
            str += `<div class="logpagingbox">`;
            str += pagination({ pageNo, pageSize: showpage, total });
            str += `</div > `;
          }
          $logbot.html(str);
          if (y) {
            $logbot.scrollTop(0);
          }
          return;
        }
      }
    ).catch(err => { })
  }
  $logbot.on(
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
              .querySelector('.logbot #paginationBox input')
              .value.trim();
            val = parseInt(val);
            if (isNaN(val)) return;
            logpage = val;
            logxuanran(true);
          } else if (flag === 'gotop') {
            $logbot.stop().animate(
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
  $logon.click(() => {
    $youtop.removeClass('open');
    $youtopwrap.stop().fadeOut(_speed);
    setZindex($logdata);
    $logdata.stop().fadeIn(_speed, () => {
      $logdata.css('display', 'flex');
      $logshowpage.val(_getData('logshowpage') || 100);
      logpage = 1;
      logxuanran(true);
    });
  });
  $logshowpage.on('change', function () {
    let val = $(this).val();
    _setData('logshowpage', val);
    logpage = 1;
    logxuanran(true);
  });
  $logoff.click(() => {
    $logdata.stop().fadeOut(_speed, () => {
      $logdata.css('display', 'none');
      $logbot.html('');
    });
  });
  $('.logoffxs').click(() => {
    $logoff.click();
  });
  $uploadlog.click(
    throttle(function () {
      logpage = 1;
      logxuanran(true);
    }, 500)
  );
  $searchlog.on(
    'input',
    debounce(function () {
      logpage = 1;
      logxuanran(true);
    }, 1000)
  );
  // 清空日志
  $clearlog.click((e) => {
    alert(`确认清空日志？`, {
      confirm: true,
      handled: (m) => {
        if (m === 'confirm') {
          _postAjax('/root/logclear', {}).then((result) => {
            if (parseInt(result.code) === 0) {
              $logbot.html('');
              $searchlog.val('');
              logpage = 1;
              return;
            }
          }).catch(err => { })
          return;
        }
      },
    });
  });

  // 留言板
  let chatobj = {
    account: 'chang',
  };
  var $guestbooklistcon = $('.guestbooklistcon'),
    $sctupic = $('.sctupic'),
    $ycdiv = $('.ycdiv'),
    $guestgo = $('.guestgo');
  // 关闭聊天框
  $guestbookoff.click(function () {
    $guestbooklist.stop().fadeOut(_speed, () => {
      $guestbooklistconwrap.html('');
      $searchMsg.val('');
    });
  });
  $guestbookoffxs.click(function () {
    $guestbookoff.click();
  });
  $guestclear.click(function () {
    let ac = chatobj.account;
    if (ac === 'chang' && _userinfo.account !== 'root') {
      _err('没有权限操作');
      return;
    }
    alert(`确认清空当前聊天记录？`, {
      confirm: true,
      handled: (msg) => {
        if (msg === 'confirm') {
          _postAjax('/chat/clearmsg', { ac }).then((result) => {
            if (parseInt(result.code) === 0) {
              $guestbooklistconwrap.html('');
              sendCommand({
                type: 'chat',
                flag: 'clear',
                to: ac,
              });
            }
          }).catch(err => { })
          return;
        }
      },
    });
  });
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
      let isright = _from === _userinfo.account ? true : false,
        textcolor = isright ? '#95EC69' : '#ffffff';
      if (showTime === 'y') {
        str += `<div style="text-align: center;color: #1389a7;font-size: 14px;padding-top: 10px;">${date[0]}</div>`;
      }
      str += `<ul id="${id}" data-id="${id}" data-data="${data}" data-size="${size}" data-isrc="${isrc}" data-from="${_from}" data-name="${name}" class="guestbookitemwrap">`;
      if (!isright) {
        str += `<li class="guestbookitemleft">`;
        str += `<div class="usermsg" style="background-image: url(${mediaURL}/logo/${_from}/${_from}.png?v=${rnum});float: left;"></div>`;
        str += `</li>`;
      }
      str += `<li class="guestbookitemcon">`;
      str += `<span class="lyusername" style="text-align: ${!isright ? 'left' : 'right'
        };">${showname ? `${name}` : ''} <span style="color: #aaa;">${date[1]
        }</span></span>`;
      if (isrc) {
        if (isImgFile(isrc)) {
          str += `<div class="xfileimgwrap" style="float: ${!isright ? 'left' : 'right'
            };">
                    <div class="xfileimg"><span>${size}</span></div>`;
          if (isright) {
            str += `<span class="wjright" style="border-left-color:#ccc"><span>`;
          } else {
            str += `<span class="wjleft" style="border-right-color:#ccc"><span>`;
          }
          str += `</div>`;
        } else if (extname(isrc)[1] == 'mp3' && size.slice(-1) == 's') {
          str += `<div class="yuykuang " style="float: ${!isright ? 'left' : 'right'
            };background-color: ${textcolor};">
            <i class="iconfont icon-yuyin1"></i><span style="font-size:12px;">${size}</span>`;
          if (isright) {
            str += `<span class="wjright" style="border-left-color:${textcolor}"><span>`;
          } else {
            str += `<span class="wjleft" style="border-right-color:${textcolor}"><span>`;
          }
          str += `</div>`;
        } else {
          str += `<div title="${data}" class="itemconwrap" style="float: ${!isright ? 'left' : 'right'
            };">
            <div class="itemconleft">
              <span class="xfilename">${data}</span>
              <span class="xfilesize">${size}</span>
            </div>
            <div class="itemconright iconfont ${fileLogoType(data)}">
            </div>`;
          if (isright) {
            str += `<span class="wjright"><span>`;
          } else {
            str += `<span class="wjleft"><span>`;
          }
          str += `</div>`;
        }
      } else {
        str += `<p class="textkuang" style="float: ${!isright ? 'left' : 'right'
          };background-color: ${textcolor};">${data}`;
        if (isright) {
          str += `<span class="wjright" style="border-left-color:${textcolor}"><span>`;
        } else {
          str += `<span class="wjleft" style="border-right-color:${textcolor}"><span>`;
        }
        str += `</p>`;
      }
      str += `</li>`;
      if (isright) {
        str += `<li class="guestbookitemright">`;
        str += `<div class="usermsg" style="background-image: url(${mediaURL}/logo/${_from}/${_from}.png?v=${rnum});float: right;"></div>`;
        str += `</li>`;
      }
      str += `</ul>`;
    });
    return str;
  }
  //处理聊天图片
  function chatimgLoad() {
    $('.xfileimg').each((i, v) => {
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

  //查看群消息
  $guestbookclear.click(
    throttle(function () {
      if (_userinfo.account === 'root') {
        $guestclear.stop().fadeIn(_speed);
      } else {
        $guestclear.stop().fadeOut(_speed);
      }
      $searchMsg.val('');
      chatobj.account = 'chang';
      $lytitle.text('聊天室');
      $searchMsg.val('');
      _getAjax('/chat/getmsg', { acc: 'chang', stu: 0 }).then((result) => {
        if (parseInt(result.code) === 0) {
          if ($guestbooklist.is(':hidden')) return;
          let str = sxliuyan(result.data);
          $guestbooklistconwrap.html(str);
          $guestbooklistcon[0].scrollTop = $guestbooklistcon[0].scrollHeight;
          chatimgLoad();
        }
      }).catch(err => { })
      $qmsgtx.stop().fadeOut(_speed);
    }, 500)
  );
  //打开聊天窗
  $guestbook.click(
    debounce(
      function () {
        let obj = deepClone(chatobj);
        setZindex($guestbooklist);
        if (obj.account === 'chang') {
          if (_userinfo.account === 'root') {
            $guestclear.stop().fadeIn(_speed);
          } else {
            $guestclear.stop().fadeOut(_speed);
          }
        } else {
          $guestclear.stop().fadeIn(_speed);
        }
        //隐藏主页消息提示
        $newly.stop().fadeOut(_speed);
        $guestbooklist.stop().fadeIn(_speed, () => {
          //获取消息
          $searchMsg.val('');
          _getAjax('/chat/getmsg', { acc: obj.account, stu: 0 }).then(
            (result) => {
              if (parseInt(result.code) === 0) {
                if ($guestbooklist.is(':hidden')) return;
                let str = sxliuyan(result.data);
                $guestbooklistconwrap.html(str);
                $guestbooklistcon[0].scrollTop =
                  $guestbooklistcon[0].scrollHeight;
                chatimgLoad();
                //获取是否有未读私聊消息
                _getAjax('/chat/getnews', { a: 2 }).then((result) => {
                  if (parseInt(result.code) === 0) {
                    $msgtx.stop().fadeOut(_speed);
                  } else {
                    $msgtx.stop().fadeIn(_speed);
                  }
                }).catch(err => { })
                //获取是否有群消息未读
                _getAjax('/chat/getnews', { a: 1 }).then((result) => {
                  if (parseInt(result.code) === 0) {
                    $qmsgtx.stop().fadeOut(_speed);
                  } else {
                    $qmsgtx.stop().fadeIn(_speed);
                  }
                }).catch(err => { })
              }
            }
          ).catch(err => { })
        });
      },
      500,
      true
    )
  );
  //语言和输入切换
  $yyfs.click(function () {
    if ($(this).attr('x') == 1) {
      $guestgo.css('display', 'block');
      $ycdiv.css('display', 'none');
      $(this)
        .attr('x', 2)
        .children('i')
        .attr('class', 'iconfont icon-w_jianpan');
      $sctupic.attr('x', 1).children('i').attr('class', 'iconfont icon-jiahao');
    } else {
      $guestgo.css('display', 'none');
      $ycdiv.css('display', 'block');
      $(this).attr('x', 1).children('i').attr('class', 'iconfont icon-yuyin');
      if ($ycdiv[0].innerText.length !== 0) {
        $sctupic
          .attr('x', 2)
          .children('i')
          .attr('class', 'iconfont icon-huaban');
      }
    }
  });
  let msgtimer = null;
  $guestbooklistcon
    .on('click', '.usermsg', function (e) {
      //点击用户头像私聊
      let a = $(this).parent().parent().attr('data-from'),
        b = $(this).parent().parent().attr('data-name'),
        obj = deepClone(chatobj);
      //忽略自己点自己头像或在私聊
      if (a === _userinfo.account) {
        imgPreview([{ u1: `${mediaURL}/logo/${a}/${a}.png?v=${Math.random()}` }]);
        return;
      }
      let str = `
    <div cursor class="mtcitem2" style="justify-content: center;">${b}</div>
    ${obj.account == 'chang' ? '<div cursor class="mtcitem">发送消息</div>' : ''
        }
    <div cursor class="mtcitem1">查看笔记</div>
    `;
      rightMenu(
        e,
        str,
        debounce(
          function ({ close, e }) {
            if (_getTarget(e, '.mtcitem')) {
              $lytitle.text(b);
              chatobj.account = a;
              $guestclear.stop().fadeIn(_speed);
              $searchMsg.val('');
              _getAjax('/chat/getmsg', { acc: a, stu: 0 }).then((result) => {
                if (parseInt(result.code) === 0) {
                  if ($guestbooklist.is(':hidden')) return;
                  close();
                  let str = sxliuyan(result.data);
                  $guestbooklistconwrap.html(str);
                  $guestbooklistcon[0].scrollTop =
                    $guestbooklistcon[0].scrollHeight;
                  chatimgLoad();
                }
              }).catch(err => { })
            } else if (_getTarget(e, '.mtcitem1')) {
              let url = `/page/allnote/#${a}`;
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
    .on('click', '.itemconwrap', function (e) {
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
      }).catch(err => { })
    })
    .on('contextmenu', '.guestbookitemcon', function (e) {
      //操作消息
      e.preventDefault();
      let $this = $(this),
        x = $this.parent().attr('data-id'),
        n = $this.parent().attr('data-data'),
        s = $this.parent().attr('data-size'),
        y = $this.parent().attr('data-isrc'),
        z = null,
        f = $this.parent().attr('data-from');
      let $z = $this.parent().find('.textkuang');
      if ($z.length > 0) {
        z = $z[0].innerText;
      }
      backmsg(e, x, y, z, f, n, s);
    })
    .on('click', '.yuykuang', function (e) {
      //播放语音
      let a = $(this).parent().parent().attr('data-isrc');
      //检查语音是否过期
      openyuy(mediaURL + a, this);
    })
    .on('click', '.xfileimg', function (e) {
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
      }).catch(err => { })
    })
    .on(
      'scroll',
      debounce(function () {
        //向上滚动获取前面聊天内容
        if (
          $guestbooklistcon[0].scrollHeight -
          $guestbooklistcon.outerHeight() -
          $guestbooklistcon[0].scrollTop >
          100
        ) {
          $toMsgBottom.stop().fadeIn(_speed);
          if (msgtimer) {
            clearTimeout(msgtimer);
            msgtimer = null;
          }
          msgtimer = setTimeout(() => {
            $toMsgBottom.stop().fadeOut(_speed);
          }, 3000);
        }
        let nomore = $guestbooklistcon.find('.nomore');
        if (
          $guestbooklistconwrap.outerHeight() <
          $guestbooklistcon.outerHeight() ||
          nomore.length > 0
        )
          return;
        if (this.scrollTop <= 30) {
          let fristel = $guestbooklistcon.find('.guestbookitemwrap').eq(0);
          let flag = fristel.attr('data-id');
          let val = $searchMsg.val().trim();
          _getAjax('/chat/getmsg', {
            flag,
            acc: chatobj.account,
            stu: 1,
            val,
          }).then((result) => {
            if (parseInt(result.code) === 0) {
              if ($guestbooklist.is(':hidden')) return;
              let str = sxliuyan(result.data);
              if (str === '') {
                str += `<div class="nomore" style="text-align: center;font-size: 14px;color: #cdb;">没有更多了<div>`;
              }
              $guestbooklistconwrap.prepend(str);
              $guestbooklistcon.scrollTop(fristel.position().top - 50);
              chatimgLoad();
            }
          }).catch(err => { })
        }
      }, 200)
    );
  $toMsgBottom.click(function () {
    $guestbooklistcon.animate(
      {
        scrollTop: $guestbooklistcon[0].scrollHeight,
      },
      _speed
    );
  });

  if (isios()) {
    $guestbooklistcon[0]._longPress('.guestbookitemcon', function (e) {
      let $this = $(this),
        x = $this.parent().attr('data-id'),
        y = $this.parent().attr('data-isrc'),
        n = $this.parent().attr('data-data'),
        s = $this.parent().attr('data-size'),
        z = null,
        f = $this.parent().attr('data-from'),
        ev = e.changedTouches[0];
      let $z = $this.parent().find('.textkuang');
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
        ? '<div cursor class="mtcitem1">复制</div><div cursor class="mtcitem2">编辑</div>'
        : '<div cursor class="mtcitem3">下载</div>'
        }
            ${f === _userinfo.account
          ? '<div cursor class="mtcitem">删除</div>'
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
                let $msg = $guestbooklistcon.find(`#${tt}`);
                $msg.stop().slideUp(_speed, () => {
                  $msg.remove();
                });
                return;
              }
            }).catch(err => { })
          } else if (_getTarget(e, '.mtcitem1')) {
            copyText(z);
            close();
          } else if (_getTarget(e, '.mtcitem2')) {
            let local = _getData('md') || [],
              obj = {
                name: `hello_${Date.now()}`,
                data: z,
              };
            local.push(obj);
            _setData('md', local);
            openIframe(`/page/edit/#${obj.name}`, 'Edit');
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
            }).catch(err => { })
          }
        },
        1000,
        true
      )
    );
  }

  // 播放语音
  function openyuy(a, _this) {
    let pflag = $yuyplay.playflag,
      reg = /\/upload\/([a-zA-Z0-9]+)\.mp3$/,
      _flag = reg.exec(a)[1];
    $yuyplay[0].pause();
    $('.yuykuang').children('i').css('animation', 'none');
    if (pflag === _flag) {
      $yuyplay.playflag = '';
      return;
    }
    $yuyplay.playflag = _flag;
    $yuyplay[0].src = a;
    $yuyplay[0].play();
    $(_this)
      .children('i')
      .css('animation', 'fontcolor .5s infinite linear alternate');
  }
  $yuyplay
    .on('ended', function () {
      $yuyplay.playflag = '';
      $('.yuykuang').children('i').css('animation', 'none');
    })
    .on('error', function () {
      _err('语音已过期');
      $yuyplay.playflag = '';
      $('.yuykuang').children('i').css('animation', 'none');
    });

  $ycdiv.on('input', function () {
    if ($(this).text() === '') {
      $sctupic.attr('x', 1).children('i').attr('class', 'iconfont icon-jiahao');
    } else {
      $sctupic.attr('x', 2).children('i').attr('class', 'iconfont icon-huaban');
    }
  });
  // 发送文字信息
  $ycdiv[0].onkeydown = function (e) {
    var key = e.keyCode || e.which || e.charCode;
    if (key == 13) {
      e.preventDefault();
      sendText();
    }
  };
  function sendText() {
    let pchatId = deepClone(chatobj),
      pdata = $ycdiv[0].innerText.trim();
    $sctupic.attr('x', 1).children('i').attr('class', 'iconfont icon-jiahao');
    if (pdata === '') {
      $ycdiv[0].innerText = '';
      return;
    }
    $ycdiv[0].innerText = '';
    let obj = {
      data: pdata,
      _from: _userinfo.account,
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
    }).catch(err => { })
  }
  let debounceGetNewMsg = debounce(getNewMsg, 1000);
  function getNewMsg(y) {
    let pchatId = deepClone(chatobj);
    let $guestbookitemwrap = $guestbooklistcon
      .find('.guestbookitemwrap')
      .last();
    let flag = $guestbookitemwrap.attr('data-id');
    $searchMsg.val('');
    _getAjax('/chat/getmsg', { stu: 2, acc: pchatId.account, flag }).then(
      (result) => {
        if (parseInt(result.code) === 0) {
          if ($guestbooklist.is(':hidden')) return;
          playSound(`/img/blop.mp3`);
          let str = sxliuyan(result.data);
          $guestbooklistconwrap.append(str);
          if (y) {
            $guestbooklistcon.stop().animate(
              {
                scrollTop: $guestbooklistcon[0].scrollHeight,
              },
              1000
            );
          }
          chatimgLoad();
        }
      }
    ).catch(err => { })
  }
  $searchMsg.on(
    'input',
    debounce(function () {
      let val = $searchMsg.val().trim();
      let pchatId = deepClone(chatobj);
      _getAjax('/chat/getmsg', { stu: 0, acc: pchatId.account, val }).then(
        (result) => {
          if (parseInt(result.code) === 0) {
            if ($guestbooklist.is(':hidden')) return;
            let str = sxliuyan(result.data);
            $guestbooklistconwrap.html(str);
            $guestbooklistcon[0].scrollTop = $guestbooklistcon[0].scrollHeight;
            chatimgLoad();
          }
        }
      ).catch(err => { })
    }, 1000)
  );
  // 文件消息对象
  function msginfo(HASH, suffix, yname, fsize) {
    let obj = {
      isrc: `/upload/${HASH}.${suffix}`,
      data: yname,
      size: computeSize(fsize),
      _from: _userinfo.account,
    };
    return obj;
  }
  // 发送文件
  $sctupic.click(function () {
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
  });
  // 拖拽发送文件
  ~(function () {
    let guestb = $guestbooklist[0];
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
            _from: _userinfo.account,
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
    $guestgo
      .on('touchstart', function (e) {
        e.preventDefault();
        $guestgo.addClass('gren');
        x = e.changedTouches[0].clientX;
        y = e.changedTouches[0].clientY;
        _rec.start();
      })
      .on('touchend', function (e) {
        e.preventDefault();
        $guestgo.removeClass('gren');
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
        $guestgo.addClass('gren');
        _rec.start();
      });
    $document.on('mouseup', function (e) {
      $guestgo.removeClass('gren');
      if (_getTarget(e, '.guestgo')) {
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
  $guestbooklist.click(function (e) {
    if (!_getTarget(e, '.chengyuanwrap') && !_getTarget(e, '.chengyuan')) {
      $chengyuanwrap.stop().slideUp(_speed, () => {
        $chengyuanwrap.html('');
      });
    }
  });
  function chengyuandefault() {
    let str = '';
    new Array(50).fill(null).forEach(() => {
      str += `<ul style="pointer-events: none;" class="cyitem">
              <li class="cylogo"></li>
              <li class="cyname"></li>
              <li></li>
              </ul>`;
    });
    $chengyuanwrap.html(str);
  }
  $chengyuan.click(
    debounce(
      function (e) {
        $chengyuanwrap.stop().slideDown(_speed, () => {
          let a = $chengyuanwrap.children();
          if (a.length === 0) {
            chengyuandefault();
          }
          _getAjax('/chat/getmember').then((result) => {
            if (parseInt(result.code) === 0) {
              if ($guestbooklist.is(':hidden') || $chengyuanwrap.is(':hidden'))
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
                str += `<ul cursor xx="${username}" xxx="${account}" class="cyitem">
              <i x=${v.islook} class="tzmsg"></i>
              <li class="cylogo" style="${online === 'y' ? '' : 'filter: grayscale(1);'
                  }background-image:url('${mediaURL}${logo}?v=${rnum}');"></li>
              <li class="cyname">${username}</li>
              <li style="font-size:14px;line-height:40px;flex:none;color:${online === 'y' ? 'green' : '#aaa'
                  };">${online === 'y' ? '在线' : '离线'}</li>
              </ul>`;
              });
              $chengyuanwrap.html(str);
              $msgtx.stop().fadeOut(_speed);
              return;
            }
          }).catch(err => { })
        });
      },
      500,
      true
    )
  );
  // 显示好友消息
  $chengyuanwrap.on('click', '.cyitem', function (e) {
    let b = $(this).attr('xx'),
      a = $(this).attr('xxx');
    if (!b || !a) return;
    if (_getTarget(e, '.cylogo')) {
      imgPreview([{ u1: `${mediaURL}/logo/${a}/${a}.png?v=${Math.random()}` }]);
      return;
    }
    if (_userinfo.account == a) return;
    let str = `
    <div cursor class="mtcitem2" style="justify-content: center;">${b}</div>
    <div cursor class="mtcitem">发送消息</div>
    <div cursor class="mtcitem1">查看笔记</div>
    `;
    rightMenu(
      e,
      str,
      debounce(
        function ({ close, e }) {
          if (_getTarget(e, '.mtcitem')) {
            $lytitle.text(b);
            chatobj.account = a;
            $guestclear.stop().fadeIn(_speed);
            $searchMsg.val('');
            _getAjax('/chat/getmsg', { acc: a, stu: 0 }).then((result) => {
              if (parseInt(result.code) === 0) {
                if ($guestbooklist.is(':hidden')) return;
                close();
                $chengyuanwrap.stop().slideUp(_speed, () => {
                  $chengyuanwrap.html('');
                });
                let str = sxliuyan(result.data);
                $guestbooklistconwrap.html(str);
                $guestbooklistcon[0].scrollTop =
                  $guestbooklistcon[0].scrollHeight;
                chatimgLoad();
              }
            }).catch(err => { })
          } else if (_getTarget(e, '.mtcitem1')) {
            let url = `/page/allnote/#${a}`;
            openIframe(url, b);
            close();
            $chengyuanwrap.stop().slideUp(_speed, () => {
              $chengyuanwrap.html('');
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
        $('.weatherbox').html(str);
      } catch (error) {
        $('.weatherbox').stop().fadeOut(_speed);
      }
    },
    error: (err) => {
      $('.weatherbox').stop().fadeOut(_speed);
    },
  });

  //桌面大小改变自适应
  window.addEventListener(
    'resize',
    throttle(function () {
      let w = window.innerWidth;
      if (w === dmwidth || !_userinfo) return;
      if (dmwidth > 800 && w <= 800) {
        //大屏变小屏幕
        $clock.stop().fadeOut(_speed); //隐藏时钟
        //更改背景
        if (_userinfo.bgxs != '') {
          $bgmain.css(
            'background-image',
            `url(${mediaURL}/bg/bgxs/${_userinfo.bgxs})`
          );
        } else {
          $bgmain.css('background-image', `url(/img/bg.jpg)`);
        }
        $('.iframeBox').css({
          top: '50%',
          left: '50%',
        });
        $mmlistid.css({
          top: '50%',
          left: '50%',
        });
        $userinfobox.css({
          top: '50%',
          left: '50%',
        });
        $editlrc.css({
          top: '50%',
          left: '50%',
        });
        $guestbooklist.css({
          top: '50%',
          left: '50%',
        });
        $logdata.css({
          top: '50%',
          left: '50%',
        });
        $musicmv.css({
          top: '50%',
          left: '50%',
        });
        if (!$lrcbotwrap.is(':hidden')) {
          lrcbotwrap.style.display = 'none';
          lrcbotwrap.isshow = true;
        } else {
          lrcbotwrap.isshow = false;
        }
        if (!$musichide.is(':hidden')) {
          musichide.style.display = 'none';
          musichide.isshow = true;
        } else {
          musichide.isshow = false;
        }
      } else if (dmwidth <= 800 && w > 800) {
        //小屏变大屏
        $clock.stop().fadeIn(_speed);
        if (_userinfo.bg != '') {
          $bgmain.css(
            'background-image',
            `url(${mediaURL}/bg/bg/${_userinfo.bg})`
          );
        } else {
          $bgmain.css('background-image', `url(/img/bg.jpg)`);
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
        _userinfo = result.data;
        mytitle = `Hello ${_userinfo.username}`;
        _setData('account', _userinfo.username)
        if ($myAudio[0].paused) {
          $titleid.text(mytitle);
        }
        $usermin
          .text(_userinfo.username)
          .attr('title', _userinfo.username)
          .stop()
          .fadeIn(_speed);
        $dltx.css(
          'background-image',
          `url(${mediaURL}/logo/${_userinfo.account}/${_userinfo.account
          }.png?v=${Math.random()})`
        );
        if (dmwidth > 800) {
          $bgmain.css(
            'background-image',
            _userinfo.bg ? `url(${mediaURL}/bg/bg/${_userinfo.bg})` : '/img/bg.jpg'
          );
        } else {
          $bgmain.css(
            'background-image',
            _userinfo.bgxs ? `url(${mediaURL}/bg/bgxs/${_userinfo.bgxs})` : '/img/bg.jpg'
          );
        }
        handleUserinfo();
        return;
      }
    }).catch(err => { })
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
            let { type, flag, from, to, tt } = resu.data.data;
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
                    if (from.account !== _userinfo.account) {
                      tongzhi(data[0].name, data[0].data);
                    }
                    if ($guestbooklist.is(':hidden')) {
                      //聊天框是隐藏
                      if (from.account !== _userinfo.account) {
                        $newly.stop().fadeIn(_speed);
                      }
                    } else {
                      if (
                        (pid.account === from.account && to !== 'chang') ||
                        (pid.account === 'chang' && to === 'chang') ||
                        (from.account === _userinfo.account &&
                          pid.account === to)
                      ) {
                        //新消息是当前聊天框
                        let acc =
                          to === 'chang'
                            ? 'chang'
                            : from.account === _userinfo.account &&
                              pid.account === to
                              ? to
                              : from.account;
                        let flag = $('.guestbookitemwrap')
                          .last()
                          .attr('data-id');
                        let val = $searchMsg.val().trim();
                        _getAjax('/chat/getmsg', {
                          stu: 2,
                          acc,
                          flag,
                          val,
                        }).then((result) => {
                          if (parseInt(result.code) === 0) {
                            if ($guestbooklist.is(':hidden')) return;
                            let data = result.data;
                            let str = sxliuyan(data);

                            //新增内容
                            $guestbooklistconwrap.append(str);
                            if (
                              $guestbooklistcon[0].scrollHeight -
                              $guestbooklistcon[0].scrollTop -
                              $guestbooklistcon[0].clientHeight <
                              500
                            ) {
                              $guestbooklistcon.stop().animate(
                                {
                                  scrollTop: $guestbooklistcon[0].scrollHeight,
                                },
                                1000
                              );
                            }
                            chatimgLoad();
                          }
                        }).catch(err => { })
                      } else {
                        //新消息不是是当前聊天框
                        if (from.account !== _userinfo.account) {
                          if (pid.account === 'chang') {
                            $msgtx.stop().fadeIn(_speed);
                          } else {
                            if (to === 'chang') {
                              $qmsgtx.stop().fadeIn(_speed);
                            } else {
                              $msgtx.stop().fadeIn(_speed);
                            }
                          }
                        }
                      }
                    }
                  }
                }).catch(err => { })
              } else if (flag === 'del') {
                //撤回消息
                if (from.account !== _userinfo.account) {
                  tongzhi(from.username, '撤回消息');
                }
                if (!$guestbooklist.is(':hidden')) {
                  if (
                    (pid.account === from.account && to !== 'chang') ||
                    (pid.account === 'chang' && to === 'chang') ||
                    (from.account === _userinfo.account && pid.account === to)
                  ) {
                    let $msg = $guestbooklistcon.find(`#${tt}`);
                    $msg.stop().slideUp(_speed, () => {
                      $msg.remove();
                    });
                  }
                }
              } else if (flag === 'clear') {
                //清空聊天框
                if (from.account !== _userinfo.account) {
                  tongzhi(from.username, '清空聊天记录');
                }
                if (!$guestbooklist.is(':hidden')) {
                  if (
                    (pid.account === from.account && to !== 'chang') ||
                    (pid.account === 'chang' && to === 'chang') ||
                    (from.account === _userinfo.account && pid.account === to)
                  ) {
                    $guestbooklistconwrap.html('');
                  }
                }
              }
            } else if (type === 'updatedata') {
              //数据同步更新
              if (flag === 'music') {
                renderMusicList();
              } else if (flag === 'bookmark') {
                renderNav();
                renderHomebook();
              } else if (flag === 'userinfo') {
                handleuser();
              } else if (flag === 'playinglist') {
                _getAjax('/player/getplaying').then((result) => {
                  if (parseInt(result.code) === 0) {
                    _playinglist = result.data;
                    musicarr =
                      randomplay === false
                        ? myShuffle(deepClone(_playinglist))
                        : deepClone(_playinglist);
                    return;
                  }
                }, true).catch(err => { })
              } else if (flag === 'musicinfo') {
                if (!$mmlistid.is(':hidden')) {
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
                          if (!lastplay || (isddplay && playtimer)) return;
                          musicobjInit(lastplay);
                          csfz();
                          $myAudio[0].currentTime = currentTime;
                          $myAudio[0]._totalTime = duration;
                          upprog();
                          $totaltime.text(tin(duration));
                        }
                      }
                    ).catch(err => { })
                  }
                }
              }
            } else if (type === 'yc') {
              _getAjax('/user/controlread').then((result) => {
                if (parseInt(result.code) === 0) {
                  let vo = result.data;
                  isddplay = false;
                  $yuanchengbfid.removeClass('red');
                  if (vo.type === 'play') {
                    if (vo.data.play) {
                      if (!_music) $openplayer.click();
                      if (randomplay === false) {
                        musicarr = myShuffle(deepClone(_playinglist));
                      }
                      musicPlay(vo.data.obj);
                    } else {
                      $lrc.html(``);
                      audioPause();
                    }
                  } else if (vo.type === 'vol') {
                    defaultvolume = vo.data;
                    vobellm();
                    _success(`${parseInt(defaultvolume * 100)}%`);
                  } else if (vo.type === 'progress') {
                    $myAudio[0].currentTime = $myAudio[0]._totalTime * vo.data;
                  } else if (vo.type === 'playmode') {
                    randomplay = vo.data;
                    $randomid.click();
                  }
                  return;
                }
              }).catch(err => { })
            }
            return;
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
      _postAjax('/user/realtime', { data, id }, true).then(res => { }).catch(err => { })
    };
  })();
  ~(function () {
    window.openIframe = openIframe;
    function openIframe(url, name) {
      let box = document.createElement('div');
      box.className = 'iframeBox';
      let str = `
      <div class="iframeTop">
          <div cursor class="iframeClose iconfont icon-guanbi"></div>
          <div cursor class="iframeClosexs iconfont icon-prev"></div>
          <div cursor class="iframeFull iconfont icon-xuanzeweixuanze"></div>
          <div cursor class="iframehide iconfont icon-jianhao"></div>
          <div class="iframeTitle"></div>
          <div cursor title="刷新" class="iframeUpload iconfont icon-suijibofang"></div>
          <div cursor title="新标签打开" class="newPage iconfont icon-iconzhengli_tiaozhuan"></div>
        </div>
        <iframe src="${url}" frameborder="0"></iframe>
      `;
      box.innerHTML = str;
      box._framename = name || url;
      box._url = url;
      $mainid.append(box);
      let $box = $(box);
      $box.stop().fadeIn(_speed, () => {
        box.style.display = 'flex';
        setZindex($box);
      });
      $box.on(
        'click',
        debounce(
          function (e) {
            setZindex($box);
            if (
              _getTarget(e, '.iframeClose') ||
              _getTarget(e, '.iframeClosexs')
            ) {
              $box.css('height', 0);
              _setTimeout(() => {
                $box.find('.iframeTitle')[0].onmousedown = null;
                $box.remove();
              }, 500);
            } else if (_getTarget(e, '.iframeFull')) {
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
            } else if (_getTarget(e, '.iframeUpload')) {
              try {
                $box.find('iframe')[0].contentWindow.location.reload();
                return;
              } catch (error) { }
              $box.find('iframe').attr('src', box._url);
            } else if (_getTarget(e, '.newPage')) {
              try {
                let url = $box.find('iframe')[0].contentWindow.location.href;
                box._url = url;
              } catch (error) { }
              myOpen(box._url, '_blank');
            } else if (_getTarget(e, '.iframehide')) {
              $box.stop().fadeOut(_speed);
              addHideBox(box);
            }
          },
          500,
          true
        )
      );
      drag($box.find('.iframeTitle')[0], $box[0]);
    }
    function addHideBox(el) {
      let box = document.createElement('div');
      box._boxflag = el;
      box.innerText = el._framename;
      box.setAttribute('title', el._url);
      box.setAttribute('cursor', '');
      $hideBox[0].appendChild(box);
    }
    $hideBox
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
      $hideBox[0]._longPress('div', function (e) {
        let _this = this,
          ev = e.changedTouches[0];
        handleHideBox(ev, _this);
      });
    }
    function handleHideBox(e, _this) {
      let $this = $(_this),
        htarget = _this._boxflag,
        url = htarget._url;
      let str = `<div cursor class="mtcitem">在新标签页打开</div>
                <div cursor class="mtcitem1">关闭</div>
                <div cursor class="mtcitem2">关闭所有</div>`;
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
              ht.find('.iframeTitle')[0].onmousedown = null;
              ht.remove();
              $this.remove();
            } else if (_getTarget(e, '.mtcitem2')) {
              $hideBox[0].querySelectorAll('div').forEach((item) => {
                let ht = $(item._boxflag);
                ht.find('.iframeTitle')[0].onmousedown = null;
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
})();
