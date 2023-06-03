import $ from "jquery";
import '../../css/reset.css'
import '../../css/iconfont.css'
import './sharemusic.css'
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
  encodeHtml
} from '../../utils/utils'
import { _speed, mediaURL } from "../../config";
import '../../js/common'
import { _err } from "../../plugins/message";
~(async function () {
  let dmwidth = $(document).width(),
    $box = $('.box'),
    $musicbg = $box.find('.musicbg'),
    $musiclrcwrap = $box.find('.musiclrcwrap'),
    $musiclrc = $musiclrcwrap.find('.musiclrc'),
    $home = $musiclrcwrap.find('.home'),
    $userLogo = $musiclrcwrap.find('.userLogo'),
    $mname = $musiclrcwrap.find('.mname'),
    $martist = $musiclrcwrap.find('.martist'),
    $lrc = $musiclrcwrap.find('.lrc'),
    $from = $musiclrcwrap.find('.from'),
    $lrcfyon = $musiclrcwrap.find('.lrcfyon'),
    $mvon = $musiclrcwrap.find('.mvon'),
    $play = $musiclrcwrap.find('#play'),
    $currenttime = $musiclrcwrap.find('.current_time'),
    $totaltime = $musiclrcwrap.find('.total_time'),
    $pro1 = $musiclrcwrap.find('.pro1'),
    $pro2 = $musiclrcwrap.find('.pro2'),
    $dolt = $musiclrcwrap.find('.dolt'),
    $musicmv = $('.musicmv'),
    $myVideo = $musicmv.find('#myVideo'),
    $mvoff = $musicmv.find('.mvoff'),
    $mvoffxs = $musicmv.find('.mvoffxs'),
    $title = $('#title'),
    $myAudio = $('#myAudio'),
    $mbg = $('.mbg'),
    actionLrcIndex = null,
    urlparmes = queryURLParams(myOpen()),
    HASH = urlparmes.HASH,
    musicobj = {};
  _setTimeout(() => {
    $mbg.css({
      opacity: '1',
    });
  }, 600)
  let mobj = await _getAjax('/player/musicshare', { id: HASH });
  if (mobj.code == 0) {
    musicobj = mobj.data;
    let url = `${mediaURL}/logo/${musicobj.account}/${musicobj.account}.png?v=${Math.random()}`
    $userLogo.css('background-image', `url(${url})`)
    if (musicobj.mv == 'y') {
      $mvon.stop().show(100);
    } else {
      $mvon.stop().hide(100);
    }
  } else {
    document.body.innerHTML = `<p style="font-size: 20px;color: #303030;text-align:center;padding:50px 0;">${mobj.codeText}</p>`;
    return;
  }
  musicobj.pic = encodeURI(
    `${mediaURL}/music/${musicobj.artist}-${musicobj.name}.jpg`
  );
  musicobj.url = encodeURI(
    `${mediaURL}/music/${musicobj.artist}-${musicobj.name}.mp3`
  );
  musicobj.murl = encodeURI(
    `${mediaURL}/music/${musicobj.artist}-${musicobj.name}.mp4`
  );
  $mvon.click(function (e) {
    e.stopPropagation();
    $myAudio[0].pause();
    $title.text('ShareMusic');
    $play.attr('class', 'iconfont icon-65zanting');
    $play.css('animation', 'none');
    $musicmv.stop().fadeIn(_speed, () => {
      $myVideo[0].src = musicobj.murl;
      $myVideo[0].play();
    });
  });
  $userLogo.click(() => {
    let { account, username } = musicobj;
    _setData('toUser', {
      account,
      username,
    });
    myOpen(`/?c=open`, '_blank');
  })
  $myVideo[0].onerror = function (e) {
    _err(`${musicobj.artist}-${musicobj.name} 加载失败`);
  };
  $mvoff.click(function () {
    $myVideo[0].pause();
    $musicmv.stop().fadeOut(_speed);
  });
  $mvoffxs.click(function () {
    $mvoff.click();
  });
  $myAudio[0].src = musicobj.url;
  imgjz(musicobj.pic, () => {
    $musicbg.css('background-image', `url("${musicobj.pic}")`);
    $musicbg.addClass('open');
  });
  $mname.text(musicobj.name);
  $martist.text(musicobj.artist);
  $from.find('span').text(`from @${musicobj.username}`);
  $from.find('span').click(() => {
    $userLogo.click()
  });
  let showlrcfy = false,
    lrcstatu = _getData('lrcstatu') || {
      size: dmwidth > 768 ? 14 : 18,
      statu: 'center',
    };
  //歌词解析函数
  function musiclrc() {
    $lrc.html(
      `<div style="width:100%;font-size:18px;position: fixed;text-align: center;top: 45%;left:50%;transform: translateX(-50%);">正在获取歌词...</div>`
    );
    $totaltime.text('00:00');
    _getAjax('/player/lrc', {
      artist: musicobj.artist,
      name: musicobj.name,
    }).then((result) => {
      if (parseInt(result.code) === 0) {
        $lrc._flag = true;
        let rod = result.data;
        rod = rod.map((item, idx) => {
          item.idx = idx;
          return item;
        });
        $myAudio._rod = rod;
        if (rod.every((item) => item.fy === '')) {
          $lrcfyon.stop().hide(100);
        } else {
          $lrcfyon.stop().show(100);
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
        $lrc.html(str);
        actionLrcIndex = 0;
        handleLrc(true);
      }
    }).catch(err => { })
  }
  $musiclrc.click(function () {
    if (this._isop) {
      $musiclrc.css('opacity', 1);
      $musicbg.removeClass('fopen');
      this._isop = false;
    } else {
      $musiclrc.css('opacity', 0);
      $musicbg.addClass('fopen');
      this._isop = true;
    }
  });
  function handleLrc(y) {
    if (actionLrcIndex === null) return;
    let $lrcdiv = $lrc.children('div'),
      $activediv = $lrcdiv.eq(actionLrcIndex),
      wH = $musiclrc.outerHeight(),
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
  $lrcfyon.click((e) => {
    e.stopPropagation();
    if (showlrcfy) {
      $('.lrcfy').css('display', 'none');
    } else {
      $('.lrcfy').css('display', 'block');
    }
    handleLrc(true);
    showlrcfy = !showlrcfy;
  });
  function proTime(pes, y) {
    pes <= 0 ? (pes = 0) : pes >= 1 ? (pes = 1) : null;
    let val =
      (pro1.offsetWidth - dolt.offsetWidth) * pes + dolt.offsetWidth / 2;
    pro2.style.width = val + 'px';
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
  //进度条
  var probox = $('.probox')[0],
    pro1 = $pro1[0],
    dolt = $dolt[0],
    pro2 = $pro2[0];

  probox.addEventListener('touchstart', function (e) {
    let pes;
    mmove(e);
    function mmove(e) {
      e.preventDefault();
      let ev = e.targetTouches[0];
      let a = pro1.offsetLeft + $musiclrcwrap[0].offsetLeft + 60;
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
      let a = pro1.offsetLeft + $musiclrcwrap[0].offsetLeft + 60;
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
  $myAudio[0]._totalTime = 0;
  let upprog = throttle(function () {
    $currenttime.text(tin($myAudio[0].currentTime));
    proTime($myAudio[0].currentTime / $myAudio[0]._totalTime, true);
  }, 500);
  let lrcCount = -1; //歌词计数
  $myAudio
    .on('error', function () {
      _err('Failed to load songs');
      $myAudio[0].pause();
      $play.attr('class', 'iconfont icon-65zanting');
      $title.text('ShareMusic');
    })
    .on('ended', function () {
      $myAudio[0].pause();
      $play.attr('class', 'iconfont icon-65zanting');
      $title.text('ShareMusic');
    })
    .on('loadedmetadata', function () {
      $myAudio[0]._totalTime =
        isNaN($myAudio[0].duration) || $myAudio[0].duration === Infinity
          ? 0
          : $myAudio[0].duration;
      $totaltime.text(tin($myAudio[0]._totalTime));
    })
    .on('waiting', function () {
      //缺少数据加载效果
      if ($myAudio[0].paused) return;
      $play.attr('class', 'iconfont icon-65zanting');
      $play.css('animation', 'fontcolor .5s infinite linear alternate');
    })
    .on(
      'playing',
      debounce(function () {
        //准备开始播放
        if ($myAudio[0].paused) return;
        $play.attr('class', 'iconfont icon-zanting');
        $play.css('animation', 'none');
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
  $play.click(function () {
    if ($myAudio[0].paused) {
      $myVideo[0].pause();
      $musicmv.stop().fadeOut(_speed);
      $myAudio[0].play();
      $title.text(
        `\xa0\xa0\xa0♪Playing：${musicobj.artist} - ${musicobj.name}`
      );
      if (!$lrc._flag) {
        musiclrc();
      }
    } else {
      $myAudio[0].pause();
      $title.text('ShareMusic');
      $play.attr('class', 'iconfont icon-65zanting');
      $play.css('animation', 'none');
    }
  });
  $home.click(
    debounce(function () {
      myOpen(`/?p=open`, '_blank');
    }, 500)
  );

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
      $play.click();
    }
  };
})();
