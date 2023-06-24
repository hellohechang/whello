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
  pageErr,
  deepClone,
  myShuffle,
  _mySlide
} from '../../utils/utils';
import { _speed, mediaURL } from "../../config";
import '../../js/common';
import { _err, _success } from "../../plugins/message";
import { rightMenu } from "../../plugins/rightMenu";
~async function () {
  const urlparmes = queryURLParams(myOpen()),
    HASH = urlparmes.HASH,
    $myAudio = $('.my_audio'),
    $musicPlayerWrap = $('.music_player_wrap'),
    $userInfo = $musicPlayerWrap.find('.user_info'),
    $lrcBg = $musicPlayerWrap.find('.lrc_bg'),
    $lrcHead = $musicPlayerWrap.find('.lrc_head'),
    $lrcListWrap = $musicPlayerWrap.find('.lrc_list_wrap'),
    $lrcMenuWrap = $musicPlayerWrap.find('.lrc_menu_wrap'),
    $lrcFootWrap = $musicPlayerWrap.find('.lrc_foot_wrap'),
    $lrcProgressBar = $lrcFootWrap.find('.progress_bar'),
    $lrcFootBtnWrap = $lrcFootWrap.find('.foot_btn_wrap'),
    $playingListWrap = $musicPlayerWrap.find('.playing_list_mask'),
    $pMusicListBox = $playingListWrap.find('.p_music_list_wrap'),
    $musicMvWrap = $('.music_mv_wrap'),
    $myVideo = $musicMvWrap.find('.my_video');

  let resObj = await _getAjax('/player/musicshare', { id: HASH }),
    playingList = null,
    musicArr = null,
    musicObj = null,
    curPlaySpeed = _getData('lastplaysd'),
    lrcstatu = _getData('lrcstatu'),
    userInfo = null;
  if (resObj.code == 0) {
    let { account, username } = resObj.data;
    userInfo = { account, username };
    $userInfo.find('span').text(`from ${username}`)
    $lrcHead.find('.user_logo').css('background-image', `url(${mediaURL}/logo/${account}/${account}.png?v=${Math.random()})`)
    playingList = resObj.data.list;
    musicArr = deepClone(playingList);
    initSongInfo(playingList[0]);
    toggleMvBtnState();
    renderSongInfo();
    $lrcProgressBar.find('.total_time').text(tin(musicObj.duration));
  } else {
    pageErr(resObj.codeText);
    return;
  }
  $lrcHead.on('click', '.user_logo', () => {
    let { account, username } = userInfo;
    _setData('toUser', {
      account,
      username,
    });
    myOpen(`/?c=open`, '_blank');
  }).on('click', '.to_home', debounce(function () {
    myOpen(`/?p=open`, '_blank');
  }, 500));
  function toggleMvBtnState() {
    if (musicObj && musicObj.mv == 'y') {
      $lrcMenuWrap.find('.play_mv_btn').stop().show(_speed);
    } else {
      $lrcMenuWrap.find('.play_mv_btn').stop().hide(_speed);
    }
  }
  function initSongInfo(obj) {
    musicObj = deepClone(obj);
    let { name, artist } = musicObj;
    musicObj.pic = encodeURI(`${mediaURL}/music/${artist}-${name}.jpg/?h=${HASH}`)
    musicObj.url = encodeURI(`${mediaURL}/music/${artist}-${name}.mp3/?h=${HASH}`)
    musicObj.murl = encodeURI(`${mediaURL}/music/${artist}-${name}.mp4/?h=${HASH}`)
  }
  function renderSongInfo() {
    if (!musicObj) return;
    $lrcHead.find('.song_name').text(musicObj.name);
    $lrcHead.find('.artist_name').text(musicObj.artist);
    $myAudio.attr('src', `${musicObj.url}`);
    imgjz(musicObj.pic, () => {
      $lrcBg.css('background-image', `url("${musicObj.pic}")`).removeClass('lrcbgss');
    }, () => {
      $lrcBg.css('background-image', `url("/img/music.jpg")`).removeClass('lrcbgss');
    })
  }
  function lrcInit() {
    $myAudio._rod = [];
    $myAudio.curLrcIdx = 0;
    $lrcListWrap.find('.lrc_items').html(
      `<div style="width:100%;font-size:18px;position: fixed;text-align: center;top: 45%;left:50%;transform: translateX(-50%);">正在获取歌词...</div>`
    );
  }
  let randomplay = true;
  $lrcFootBtnWrap.on('click', '.random_play_btn', function () {
    var a;
    switch (randomplay) {
      case true:
        {
          randomplay = false;
          $myAudio.attr('loop', null);
          $lrcFootBtnWrap.find('.random_play_btn').attr('class', 'random_play_btn iconfont icon-suiji');
          a = '随机播放';
          musicArr = myShuffle(deepClone(playingList));
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
          musicArr = deepClone(playingList);
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
          let idx = playingList.findIndex((v) => musicObj.id === v.id);
          if (idx >= 0) {
            playingPageNum = Math.ceil(idx / playingSize);
          };
          dqplaying();
          gaolianging(true);
        });
    });
  }).on('click', '.prev_play_btn', function (e) {
    let index;
    if (musicArr.length == 0) {
      _err('播放列表为空')
      audioPause();
      return;
    }
    index = musicArr.findIndex(
      (x) => x.id === musicObj.id
    );
    index--;
    index < 0 ? (index = musicArr.length - 1) : null;
    musicPlay(musicArr[index]);
  }).on('click', '.next_play', function (e) {
    $lrcProgressBar.find('.pro2').width('0');
    let index;
    if (musicArr.length == 0) {
      _err('播放列表为空')
      audioPause();
      return;
    }
    index = musicArr.findIndex(
      (x) => x.id === musicObj.id
    );
    index++;
    index > musicArr.length - 1 ? (index = 0) : null;
    musicPlay(musicArr[index]);
  }).on('click', '.play_btn', function () {
    if ($myAudio[0].paused) {
      audioPlay();
    } else {
      audioPause();
    }
  });
  let playtimer = null;
  function musicPlay(obj) {
    if (playtimer) {
      clearTimeout(playtimer);
      playtimer = null;
    }
    $myAudio[0].currentTime = 0; //时间进度归零
    initSongInfo(obj); //初始化音乐数据
    let a = `♪♪ ${musicObj.artist} - ${musicObj.name}`;
    $lrcProgressBar.find('.total_time').text(tin(musicObj.duration));
    _success(a);
    gaolianging(false);
    $lrcBg.addClass('lrcbgss'); //背景透明
    renderSongInfo();
    lrcInit();
    toggleMvBtnState();
    playtimer = setTimeout(() => {
      playtimer = null;
      audioPlay();
    }, 2000);
  }
  //MV播放函数
  function musicMv(obj) {
    initSongInfo(obj);
    renderSongInfo();
    audioPause();
    $myVideo.attr('src', `${musicObj.murl}`);
    videoPlay();
    $musicMvWrap.stop().fadeIn(_speed);
    gaolianging(false);
  }
  $myVideo[0].onerror = function (e) {
    _err(`MV加载失败`);
  };
  function videoPause() {
    $myVideo[0].pause();
  }
  function videoPlay() {
    audioPause();
    $myVideo[0].play();
  }
  // 暂停
  function audioPause() {
    $myAudio[0].pause();
    document.title = 'ShareMusic';
    $lrcProgressBar.find('.dolt').css('animation-play-state', 'paused');
    $lrcFootBtnWrap.find('.play_btn').attr('class', 'play_btn iconfont icon-65zanting').css('animation', 'none');
  }
  function audioPlay() {
    videoPause();
    if (!$musicMvWrap.is(':hidden')) {
      $musicMvWrap.stop().fadeOut(_speed);
    }
    if (!musicObj) return;
    document.title = `\xa0\xa0\xa0♪正在播放：${musicObj.artist} - ${musicObj.name}`;
    $myAudio[0].play();
    if ($myAudio[0].buffered.length === 0) {
      //音乐没有缓冲
      lrcInit();
    }
    if ($lrcListWrap.find('.lrc_items').children().length === 0 || $myAudio._rod.length === 0) {
      musiclrc();
    }
    //保持播放速度
    $myAudio[0].playbackRate = curPlaySpeed[1];
  }
  //歌词处理
  function musiclrc() {
    if (!musicObj) return;
    _getAjax('/player/lrc', {
      artist: musicObj.artist,
      name: musicObj.name,
    }).then((result) => {
      if (parseInt(result.code) === 0) {
        let rod = result.data;
        rod = rod.map((item, idx) => {
          item.idx = idx;
          return item;
        });
        $myAudio._rod = rod;
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
    if ($lrc.children().length === 0 || $myAudio._rod.length === 0) return;
    let $lrcdiv = $lrc.children('div'),
      $activediv = $lrcdiv.eq($myAudio.curLrcIdx),
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
    proTime($myAudio[0].currentTime / musicObj.duration, true);
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
      $lrcFootBtnWrap.find('.play_btn').attr('class', 'play_btn iconfont icon-65zanting').css('animation', 'fontcolor .5s infinite linear alternate');
    })
    .on(
      'playing',
      debounce(function () {
        //准备开始播放
        if ($myAudio[0].paused) return;
        $lrcProgressBar.find('.dolt').css('animation', 'bgcolor 2s infinite linear alternate');
        $lrcFootBtnWrap.find('.play_btn').attr('class', 'play_btn iconfont icon-zanting').css('animation', 'none');
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
      let rod = $myAudio._rod || [];
      rod
        .filter((item) => item.t == timm)
        .forEach((item, i) => {
          lrcCount++;
          $myAudio[0]._flag = timm;
          _setTimeout(() => {
            $myAudio.curLrcIdx = item.idx;
            lrcCount--;
            if (lrcCount > 1) {
              handleLrc(true);
            } else {
              handleLrc();
            }
          }, lrcCount * 100);
        });
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
    if (!y) {
      $myAudio[0].currentTime = pes * musicObj.duration;
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
  var probox = $lrcProgressBar.find('.probox')[0],
    pro1 = $lrcProgressBar.find('.pro1')[0],
    pro2 = $lrcProgressBar.find('.pro2')[0],
    dolt = $lrcProgressBar.find('.dolt')[0];
  probox.addEventListener('touchstart', function (e) {
    $lrcProgressBar.find('.dolt').addClass('open');
    $lrcProgressBar.find('.pro1').addClass('open');
    let pes;
    mmove(e);
    function mmove(e) {
      e.preventDefault();
      let ev = e.targetTouches[0];
      let a = pro1.offsetLeft + $musicPlayerWrap[0].offsetLeft;
      pes =
        (ev.clientX - a - dolt.offsetWidth / 2) /
        (pro1.offsetWidth - dolt.offsetWidth);
      proTime(pes);
    }
    function mend(e) {
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
      let a = pro1.offsetLeft + $musicPlayerWrap[0].offsetLeft;
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
  });
  document.onkeydown = function (e) {
    let key = e.key,
      ctrl = e.ctrlKey || e.metaKey;
    if (ctrl && key === 'ArrowLeft') $lrcFootBtnWrap.find('.prev_play_btn').click(); // 上一曲
    if (ctrl && key === 'ArrowRight') $lrcFootBtnWrap.find('.next_play').click(); // 下一曲
    //暂停/播放
    if (key === ' ') {
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
  };
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
    let str = '';
    if (!playingList || playingList.length == 0) {
      $pMusicListBox.find('.left').text(`正在播放(0)`);
      $pMusicListBox.find('.p_foot').html('<p style="padding: 20px 0;text-align: center;pointer-events: none;">空空如也</p>');
      return;
    }
    $pMusicListBox.find('.left').text(`正在播放(${playingList.length})`);
    let playarr = playingList.map((item, idx) => {
      item.idx = idx;
      return item;
    });
    let totalPage = Math.ceil(playarr.length / playingSize);
    playingPageNum < 1 ? playingPageNum = 1 : (playingPageNum > totalPage ? playingPageNum = totalPage : null);
    let arr = playarr.slice((playingPageNum - 1) * playingSize, playingPageNum * playingSize);
    arr.forEach((v) => {
      let { name, artist, mv, idx, duration, id } = v;
      name = encodeHtml(name);
      artist = encodeHtml(artist);
      str += `<li class="song_item" cursor data-id="${id}" data-duration="${duration}" data-name="${name}" data-artist="${artist}" data-idx="${idx}" data-mv="${mv}">
          <div class="logo_wrap">
          <img class="logo" data-src=${encodeURI(`${mediaURL}/musicys/${artist}-${name}.jpg/?h=${HASH}`)}>
          <img class="play_gif" src="/img/wave.gif">
          </div>
          <div class="song_info_wrap">
          <span class = "song_name">${name}</span>
          <span class="artist_name"><i class="artist_name_text">${artist}</i></span>
          </div>
          ${mv === 'y' ? `<div class="play_mv iconfont icon-shipin"></div>` : ''}
          <div cursor class="del iconfont icon-guanbi"></div>
        </li>`;
    });
    str += `<div style="padding:20px 0;text-align:center;" class="playing_list_paging">
      ${totalPage > 1 ? `<span style="${playingPageNum == 1 ? 'pointer-events: none;opacity:.4;' : ''}" cursor class="prev_page iconfont icon-prev"></span>
      <span style="padding:0 30px">${playingPageNum}/${totalPage}</span>
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
  $pMusicListBox.on('click', '.save_playing_list', debounce(function () {
    _getAjax('/player/savesharesongs', { id: HASH }).then(res => {
      if (res.code == 0) {
        _success();
      }
    })
  }, 1000, true))
  $pMusicListBox.find('.p_foot').on('click', '.song_info_wrap', function () {
    let $this = $(this).parent();
    let obj = {
      name: $this.attr('data-name'),
      artist: $this.attr('data-artist'),
      mv: $this.attr('data-mv'),
      duration: $this.attr('data-duration'),
      id: $this.attr('data-id')
    };
    if (musicObj.id == obj.id) {
      $lrcFootBtnWrap.find('.play_btn').click();
      return;
    }
    musicPlay(obj);
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
    playingList = playingList.filter(
      (v) => v.id !== mobj.id
    );
    musicArr = musicArr.filter(
      (v) => v.id !== mobj.id
    );
    dqplaying();
    gaolianging();
  }).on('scroll', debounce(function () {
    lazyImg($pMusicListBox.find('.p_foot'), '.song_item', '.logo');
  }, 100)).on('click', '.logo_wrap', function () {
    $(this).parent().find('.song_info_wrap').click();
  });
  function gaolianging(a) {
    if ($pMusicListBox.is(':hidden') || !musicObj || !playingList) return;
    let $song_item = $pMusicListBox.find('.p_foot').find('.song_item');
    $song_item.removeClass('active').find('.play_gif').removeClass('show');
    let y = Array.prototype.findIndex.call($song_item, (item) => item.dataset.id == musicObj.id);
    if (y < 0) return;
    let cur = $song_item.eq(y);
    if (a) {
      let sp = $pMusicListBox.find('.p_foot').scrollTop() + cur.position().top - 42;
      $pMusicListBox.find('.p_foot').scrollTop(sp);
    }
    cur.addClass('active').find('.play_gif').addClass('show');
  }
  drag($musicMvWrap.find('.m_top_space')[0], $musicMvWrap[0]);
  function drag(obj, oobj) {
    obj.onmousedown = function (e) {
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
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', up);
      }
      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', up);
    };
  }
  $lrcMenuWrap.on('click', '.play_mv_btn', function (e) {
    e.stopPropagation();
    if (!musicObj) return;
    $myVideo.attr('src', `${musicObj.murl}`);
    $musicMvWrap.stop().fadeIn(_speed);
    videoPlay();
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
  }).on('click', '.set_lrc_btn', debounce(
    function (e) {
      let str = `<div cursor class="mtcitem">放大字体</div>
            <div cursor class="mtcitem1">缩小字体</div>
            <div cursor class="mtcitem2">靠左</div>
            <div cursor class="mtcitem3">居中</div>
            <div cursor class="mtcitem4">靠右</div>
            <div cursor class="mtcitem6">封面</div>
            <div cursor class="mtcitem7">复制信息</div>`
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
        } else if (_getTarget(e, '.mtcitem6')) {
          close();
          imgPreview([{
            u1: `${mediaURL}/music/${musicObj.artist}-${musicObj.name}.jpg/?h=${HASH}`,
            u2: `${mediaURL}/musicys/${musicObj.artist}-${musicObj.name}.jpg/?h=${HASH}`
          }]);
        } else if (_getTarget(e, '.mtcitem7')) {
          close();
          copyText(`${musicObj.artist}-${musicObj.name}`);
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
  //桌面大小改变自适应
  let dmwidth = window.innerWidth;
  window.addEventListener(
    'resize',
    throttle(function () {
      let w = window.innerWidth;
      if (dmwidth > 800 && w <= 800) {
        //大屏变小屏幕
        $musicMvWrap.css({
          top: '50%',
          left: '50%',
        });
      }
      dmwidth = w;
    }, 1000)
  );
  $musicMvWrap.on('click', '.m_close', function (e) {
    videoPause();
    $musicMvWrap.stop().fadeOut(_speed);
  }).on('click', '.m_back', function (e) {
    $musicMvWrap.find('.m_close').click();
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
  _mySlide({
    el: '.video_box',
    right(e) {
      if (_getTarget(e, '.video_box', 1)) {
        $musicMvWrap.find('.m_close').click();
      }
    },
  });
  // 歌词
  _mySlide({
    el: '.lrc_box',
    right(e) {
      if (_getTarget(e, '.lrc_foot_wrap')) return;
      $lrcFootBtnWrap.find('.prev_play_btn').click();
    },
    left(e) {
      if (_getTarget(e, '.lrc_foot_wrap')) return;
      $lrcFootBtnWrap.find('.next_play').click();
    },
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
  zidonghide(
    10,
    '.lrc_box',
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
}();