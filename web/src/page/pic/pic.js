import $ from "jquery";
import '../../css/reset.css'
import '../../css/iconfont.css'
import './pic.css'
import {
  _setData,
  _getData,
  _delData,
  _setTimeout,
  debounce,
  _getTarget,
  fileSlice,
  imgjz,
  isios,
  _mySlide,
  _postAjax,
  _getAjax,
  _upFile,
  copyText,
  _each,
  _imgSize,
  compressionImg,
  _position,
  _offset,
  _myOpen,
  _progressBar,
  isImgFile,
  imgPreview,
} from '../../utils/utils'
import { _speed, mediaURL } from "../../config";
import '../../js/common'
import { _err, _success } from "../../plugins/message";
import { alert } from '../../plugins/alert'
import { _loadingBar } from '../../plugins/loadingBar'
import { pagination } from '../../plugins/pagination'
import { rightMenu } from '../../plugins/rightMenu'
import { UpProgress } from '../../plugins/UpProgress'
~(function () {
  let $toupbg = $('.toupbg'),
    $mbg = $('.mbg'),
    $bgshowpage = $('.bgshowpage'),
    $allbg = $('.allbg');
  // 背景
  _setTimeout(() => {
    $mbg.css({
      opacity: '1',
    });
  }, 600)
  // 上传壁纸
  function hdUpFile(files) {
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
        //文件切片
        let { chunks, count, suffix, HASH } = await fileSlice(
          files[num],
          (pes) => {
            pro.loading(pes);
          }
        );
        // 压缩图片
        chunks.push({
          file: await compressionImg(files[num], 500, 500),
          filename: `_hello`,
        });
        ++count;
        let breakpointarr = (await _postAjax('/pic/breakpoint', { HASH })).data; //断点续传
        let isrepeat = await _postAjax('/pic/repeatfile', {
          name: `${HASH}.${suffix}`,
        }); //是否已经存在文件
        function compale(index) {
          pro.update(index / count);
        }

        if (parseInt(isrepeat.code) === 0) {
          pro.close('文件已存在');
          //文件已经存在操作
          num++;
          fn(++num); //多文件递归上传
          return;
        }

        let index = breakpointarr.length;
        compale(index);

        ~(async function fnn(numm) {
          if (numm >= chunks.length) {
            let aa = await _postAjax('/pic/mergefile', {
              HASH,
              count,
              name: `${HASH}.${suffix}`,
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
          _upFile(`/pic/up?name=${filename}&HASH=${HASH}`, file).finally(() => {
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
      hdUpFile(files);
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
      hdUpFile(files);
    });
  })();
  // 获取壁纸
  var bgpage = 1;
  $bgshowpage.val(_getData('bgshowpage') || 40);
  bgxuanran(true);
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
    if (y) {
      bgxuanrandefault();
    }
    let str = '',
      showpage = _getData('bgshowpage') || 40;
    _getAjax('/pic/getlist', { page: bgpage, showpage }).then((result) => {
      if (parseInt(result.code) === 0) {
        let { total, totalPage, data, pageNo } = result.data;
        bgpage = pageNo;
        data.forEach((v) => {
          str += `<div class="bgitem" x="${v}">
            <div class="bgitemimg" data-src="${mediaURL}/picys/${v}"></div>
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
      document.body.innerHTML = `<p style="font-size: 20px;color: #303030;text-align:center;padding:50px 0;">${result.codeText}</p>`;
    }).catch(err => { })
  }
  if (isios()) {
    $allbg[0]._longPress('.bgitem', function (e) {
      let url = $(this).attr('x'),
        ev = e.changedTouches[0];
      bgitemmenu(ev, url);
    });
  }
  function bgitemmenu(e, url) {
    let str = `<div cursor class="mtcitem">复制网址</div>
    <div cursor class="mtcitem1">删除</div>`;
    rightMenu(
      e,
      str,
      debounce(
        function ({ close, e }) {
          if (_getTarget(e, '.mtcitem')) {
            close();
            copyText(`${mediaURL}/pic/${url}`);
          } else if (_getTarget(e, '.mtcitem1')) {
            alert('确认删除？', {
              confirm: true,
              handled: (m) => {
                if (m !== 'confirm') return;
                _postAjax('/pic/delpic', { url }).then((result) => {
                  if (parseInt(result.code) === 0) {
                    close();
                    bgxuanran();
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
  $allbg
    .on('click', '.bgitem', function () {
      let $this = $(this);
      let idx = $this.index();
      let arr = []
      $('.bgitem').each((idx, item) => {
        let $item = $(item)
        let u2 = $item.children('.bgitemimg').attr('data-src')
        arr.push({
          u2,
          u1: u2.replace('picys', 'pic')
        })
      })
      imgPreview(arr, idx);
    })
    .on('contextmenu', '.bgitem', function (e) {
      e.preventDefault();
      let url = $(this).attr('x');
      bgitemmenu(e, url);
    })
    .on(
      'scroll',
      debounce(function () {
        bglazyImg($allbg, '.bgitem', '.bgitemimg');
      }, 100)
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
    );
  $bgshowpage.on('change', function () {
    let val = $(this).val();
    _setData('bgshowpage', val);
    if (bgpage == 1) {
      bgxuanran();
    } else {
      bgxuanran(true);
    }
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
})();
