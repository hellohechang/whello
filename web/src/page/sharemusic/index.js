import $ from "jquery";
import '../../css/reset.css';
import '../../css/iconfont.css';
import './index.less';
import {
  queryURLParams,
  myOpen,
  _setData,
  _getData,
  _setTimeout,
  throttle,
  debounce,
  imgjz,
  _getAjax,
  encodeHtml,
  _getTarget,
  imgPreview,
  copyText,
  pageErr
} from '../../utils/utils';
import { _speed, mediaURL } from "../../config";
import '../../js/common';
import { _err, _success } from "../../plugins/message";
import { rightMenu } from "../../plugins/rightMenu";
~async function () {
  const $myAudio = $('.my_audio'),
    $musicPlayerWrap = $('.music_player_wrap'),
    $pageBg = $musicPlayerWrap.find('.page_bg'),
    $contentBox = $musicPlayerWrap.find('.content_box'),
    $songCover = $contentBox.find('.song_cover'),
    $lrcBox = $contentBox.find('.lrc_box'),
    $headSongInfo = $lrcBox.find('.head_song_info'),
    $lrcContent = $lrcBox.find('.lrc_content'),
    $songSetBtns = $lrcBox.find('.song_set_btns'),
    $musicFootWrap = $lrcBox.find('.music_foot_wrap'),
    $proWrap = $musicFootWrap.find('.pro_wrap'),
    $musicMvMask = $('.music_mv_mask'),
    $myVideo = $musicMvMask.find('.my_vedio');

  let actionLrcIndex = null,
    urlparmes = queryURLParams(myOpen()),
    HASH = urlparmes.HASH,
    musicobj = {},
    curPlaySpeed = _getData('lastplaysd');
  _setTimeout(() => {
    $pageBg.css({
      opacity: '1',
    });
  }, 600);
  let mobj = await _getAjax('/player/musicshare', { id: HASH });
  if (mobj.code == 0) {
    musicobj = mobj.data;
    let url = `${mediaURL}/logo/${musicobj.account}/${musicobj.account}.png?v=${Math.random()}`;
    $headSongInfo.find('.user_logo').css('background-image', `url(${url})`);
    if (musicobj.mv == 'y') {
      $songSetBtns.find('.play_mv_btn').stop().show(100);
    } else {
      $songSetBtns.find('.play_mv_btn').stop().hide(100);
    }
    $proWrap.find('.total_time').text(tin(musicobj.duration));
  } else {
    pageErr(mobj.codeText);
    return;
  }
  musicobj.pic = encodeURI(`${mediaURL}/?v=${HASH}&t=pic`);
  musicobj.url = encodeURI(`${mediaURL}/?v=${HASH}&t=url`);
  musicobj.murl = encodeURI(`${mediaURL}/?v=${HASH}&t=murl`);
  // 播放速度
  $songSetBtns.find('.play_speed_btn').text(curPlaySpeed[0]);
  $songSetBtns.on('click', '.play_mv_btn', function (e) {
    e.stopPropagation();
    $myAudio[0].pause();
    document.title = 'ShareMusic';
    $musicFootWrap.find('.play_btn').attr('class', 'play_btn iconfont icon-65zanting').css('animation', 'none');
    $musicMvMask.stop().fadeIn(_speed, () => {
      $myVideo[0].src = musicobj.murl;
      $myVideo[0].play();
    });
  }).on('click', '.translate_btn', (e) => {
    e.stopPropagation();
    if (showlrcfy) {
      $('.lrcfy').css('display', 'none');
    } else {
      $('.lrcfy').css('display', 'block');
    }
    handleLrc(true);
    showlrcfy = !showlrcfy;
  }).on('click', '.play_speed_btn', function (e) {
    e.stopPropagation();
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
        $songSetBtns.find('.play_speed_btn').text(a);
        $myAudio[0].playbackRate = b;
        curPlaySpeed = [a, b];
        _setData('lastplaysd', curPlaySpeed);
        _success(b + 'X');
      }
    });
  }).on('click', '.set_lrc_btn', debounce(
    function (e) {
      e.stopPropagation();
      let str = `<div cursor class="mtcitem">放大字体</div>
            <div cursor class="mtcitem1">缩小字体</div>
            <div cursor class="mtcitem2">靠左</div>
            <div cursor class="mtcitem3">居中</div>
            <div cursor class="mtcitem4">靠右</div>
            <div cursor class="mtcitem6">封面</div>
            <div cursor class="mtcitem7">复制信息</div>`;
      rightMenu(e, str, function ({ close, e }) {
        if (_getTarget(e, '.mtcitem')) {
          let { size } = lrcstatu;
          size += 2;
          size >= 24 ? (size = 24) : null;
          let $lrcdiv = $lrcContent.find('.lrc_list div');
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
          let $lrcdiv = $lrcContent.find('.lrc_list div');
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
          let $lrcdiv = $lrcdiv = $lrcContent.find('.lrc_list div');
          $lrcdiv.find('.elrc').css({
            'text-align': 'left',
          });
          $lrcdiv.find('.lrcfy').css({
            'text-align': 'left',
          });
          _setData('lrcstatu', lrcstatu);
        } else if (_getTarget(e, '.mtcitem3')) {
          lrcstatu.statu = 'center';
          let $lrcdiv = $lrcdiv = $lrcContent.find('.lrc_list div');
          $lrcdiv.find('.elrc').css({
            'text-align': 'center',
          });
          $lrcdiv.find('.lrcfy').css({
            'text-align': 'center',
          });
          _setData('lrcstatu', lrcstatu);
        } else if (_getTarget(e, '.mtcitem4')) {
          lrcstatu.statu = 'right';
          let $lrcdiv = $lrcdiv = $lrcContent.find('.lrc_list div');
          $lrcdiv.find('.elrc').css({
            'text-align': 'right',
          });
          $lrcdiv.find('.lrcfy').css({
            'text-align': 'right',
          });
          _setData('lrcstatu', lrcstatu);
        } else if (_getTarget(e, '.mtcitem6')) {
          close();
          imgPreview([{
            u1: `${mediaURL}/music/${musicobj.artist}-${musicobj.name}.jpg`,
            u2: `${mediaURL}/musicys/${musicobj.artist}-${musicobj.name}.jpg`
          }]);
        } else if (_getTarget(e, '.mtcitem7')) {
          close();
          copyText(`${musicobj.artist}-${musicobj.name}`);
        }
      });
    },
    500,
    true
  ));
  $headSongInfo.on('click', '.user_logo', () => {
    let { account, username } = musicobj;
    _setData('toUser', {
      account,
      username,
    });
    myOpen(`/?c=open`, '_blank');
  }).on('click', '.to_home', debounce(function () {
    myOpen(`/?p=open`, '_blank');
  }, 500));
  $myVideo[0].onerror = function (e) {
    _err(`${musicobj.artist}-${musicobj.name} 加载失败`);
  };
  $musicMvMask.on('click', '.head_btns .close_btn', function () {
    $myVideo[0].pause();
    $musicMvMask.stop().fadeOut(_speed);
  }).on('click', '.head_btns .back_btn', function () {
    $musicMvMask.find('.head_btns .close_btn').click();
  });
  $myAudio[0].src = musicobj.url;
  imgjz(musicobj.pic, () => {
    $songCover.css('background-image', `url("${musicobj.pic}")`).addClass('open');
  });
  $headSongInfo.find('.info .song_name').text(musicobj.name);
  $headSongInfo.find('.info .artist_name').text(musicobj.artist);
  $contentBox.find('.user_info span').text(`from @${musicobj.username}`).click(() => {
    $headSongInfo.find('.user_logo').click();
  });
  let showlrcfy = false,
    lrcstatu = _getData('lrcstatu');
  //歌词解析函数
  function musiclrc() {
    $lrcContent.find('.lrc_list').html(
      `<div style="width:100%;font-size:18px;position: fixed;text-align: center;top: 45%;left:50%;transform: translateX(-50%);">正在获取歌词...</div>`
    );
    _getAjax('/player/lrc', {
      artist: musicobj.artist,
      name: musicobj.name,
    }).then((result) => {
      if (parseInt(result.code) === 0) {
        $lrcContent._flag = true;
        let rod = result.data;
        rod = rod.map((item, idx) => {
          item.idx = idx;
          return item;
        });
        $myAudio._rod = rod;
        if (rod.every((item) => item.fy === '')) {
          $songSetBtns.find('.translate_btn').stop().hide(100);
        } else {
          $songSetBtns.find('.translate_btn').stop().show(100);
        }
        let str = '';
        rod.forEach((item) => {
          let { p, fy } = item;
          p = encodeHtml(p);
          fy = encodeHtml(fy);
          str += `<div>
            <p style="text-align:${lrcstatu.statu};font-size:${lrcstatu.size + 'px'
            };line-height:${lrcstatu.size + 6 + 'px'}" class="elrc">${p}</p>
            <p style="display: ${showlrcfy && hasfy ? 'block' : 'none'
            };text-align:${lrcstatu.statu};font-size:${lrcstatu.size - 2 + 'px'
            };line-height:${lrcstatu.size + 4 + 'px'}" class="lrcfy">${fy
            }</p></div>`;
        });
        $lrcContent.find('.lrc_list').html(str);
        actionLrcIndex = 0;
        handleLrc(true);
      }
    }).catch(err => { });
  }
  $lrcContent.on('click', function () {
    if (this._isop) {
      $lrcContent.css('opacity', 1);
      $songCover.removeClass('fopen');
      this._isop = false;
    } else {
      $lrcContent.css('opacity', 0);
      $songCover.addClass('fopen');
      this._isop = true;
    }
  });
  function handleLrc(y) {
    if (actionLrcIndex === null) return;
    const $lrcList = $lrcContent.find('.lrc_list');
    let $lrcdiv = $lrcList.children('div'),
      $activediv = $lrcdiv.eq(actionLrcIndex),
      wH = $lrcContent.outerHeight(),
      lrcmtop = parseInt($lrcList.css('marginTop')),
      mtop = lrcmtop - $activediv.position().top + wH * 0.4,
      move = mtop - lrcmtop;
    $activediv.addClass('active').siblings().removeClass('active');
    if (y) {
      $lrcList.css({
        transition: '0s',
        'margin-top': mtop,
      });
    } else {
      $lrcList.css({
        transition: '0.5s ease-out',
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

  function proTime(pes, y) {
    pes <= 0 ? (pes = 0) : pes >= 1 ? (pes = 1) : null;
    let val =
      (pro1.offsetWidth - dolt.offsetWidth) * pes + dolt.offsetWidth / 2;
    pro2.style.width = val + 'px';
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
  //进度条
  var probox = $proWrap.find('.probox')[0],
    pro1 = $proWrap.find('.pro1')[0],
    dolt = $proWrap.find('.dolt')[0],
    pro2 = $proWrap.find('.pro2')[0];

  probox.addEventListener('touchstart', function (e) {
    let pes;
    mmove(e);
    function mmove(e) {
      e.preventDefault();
      let ev = e.targetTouches[0];
      let a = pro1.offsetLeft + $contentBox[0].offsetLeft + 60;
      pes =
        (ev.clientX - a - dolt.offsetWidth / 2) /
        (pro1.offsetWidth - dolt.offsetWidth);
      proTime(pes);
    }
    function mend(e) {
      probox.removeEventListener('touchmove', mmove);
      probox.removeEventListener('touchend', mend);
    }
    probox.addEventListener('touchmove', mmove);
    probox.addEventListener('touchend', mend);
  });

  probox.onmousedown = function (e) {
    let pes;
    mmove(e);
    function mmove(e) {
      e.preventDefault();
      let a = pro1.offsetLeft + $contentBox[0].offsetLeft + 60;
      pes =
        (e.clientX - a - dolt.offsetWidth / 2) /
        (pro1.offsetWidth - dolt.offsetWidth);
      proTime(pes);
    }
    function mup() {
      document.removeEventListener('mousemove', mmove);
      document.removeEventListener('mouseup', mup);
    }
    document.addEventListener('mousemove', mmove);
    document.addEventListener('mouseup', mup);
  };
  let upprog = throttle(function () {
    $proWrap.find('.current_time').text(tin($myAudio[0].currentTime));
    proTime($myAudio[0].currentTime / musicobj.duration, true);
  }, 500);
  let lrcCount = -1; //歌词计数
  $myAudio
    .on('error', function () {
      _err('Failed to load songs');
      $myAudio[0].pause();
      $musicFootWrap.find('.play_btn').attr('class', 'play_btn iconfont icon-65zanting');
      document.title = 'ShareMusic';
    })
    .on('ended', function () {
      $myAudio[0].pause();
      $musicFootWrap.find('.play_btn').attr('class', 'play_btn iconfont icon-65zanting');
      document.title = 'ShareMusic';
    })
    .on('loadedmetadata', function () {

    })
    .on('waiting', function () {
      //缺少数据加载效果
      if ($myAudio[0].paused) return;
      $musicFootWrap.find('.play_btn').attr('class', 'play_btn iconfont icon-65zanting').css('animation', 'fontcolor .5s infinite linear alternate');
    })
    .on(
      'playing',
      debounce(function () {
        //准备开始播放
        if ($myAudio[0].paused) return;
        $musicFootWrap.find('.play_btn').attr('class', 'play_btn iconfont icon-zanting').css('animation', 'none');
      }, 500)
    )
    .on('timeupdate', function () {
      let times = this.currentTime,
        timm = Math.round(times);
      upprog();
      if ($myAudio._flag == timm) return;
      let rod = $myAudio._rod || [];
      rod
        .filter((item) => item.t == timm)
        .forEach((item) => {
          lrcCount++;
          $myAudio._flag = timm;
          _setTimeout(() => {
            lrcCount--;
            actionLrcIndex = item.idx;
            if (lrcCount > 1) {
              handleLrc(true);
            } else {
              handleLrc();
            }
          }, lrcCount * 100);
        });
    });
  musiclrc();
  $musicFootWrap.on('click', '.play_btn', function () {
    if ($myAudio[0].paused) {
      $myVideo[0].pause();
      $musicMvMask.stop().fadeOut(_speed);
      $myAudio[0].play();
      $myAudio[0].playbackRate = curPlaySpeed[1];
      document.title = `\xa0\xa0\xa0♪正在播放：${musicobj.artist} - ${musicobj.name}`;
      if (!$lrcContent._flag) {
        musiclrc();
      }
    } else {
      $myAudio[0].pause();
      document.title = 'ShareMusic';
      $musicFootWrap.find('.play_btn').attr('class', 'play_btn iconfont icon-65zanting').css('animation', 'none');
    }
  });


  function showTitle() {
    let title = document.title;
    if (title !== 'ShareMusic') {
      let first = title.charAt(0),
        other = title.substring(1);
      document.title = other + first;
    }
    _setTimeout(showTitle, 1000);
  }
  showTitle();
  document.onkeydown = function (e) {
    var key = e.key;
    //暂停/播放
    if (key === ' ') {
      $musicFootWrap.find('.play_btn').click();
    }
  };
}();
