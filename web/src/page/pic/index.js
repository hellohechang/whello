import $ from "jquery";
import '../../css/reset.css';
import '../../css/iconfont.css';
import './index.less';
import {
  _setData,
  _getData,
  _setTimeout,
  debounce,
  _getTarget,
  fileSlice,
  imgjz,
  isios,
  _postAjax,
  _getAjax,
  _upFile,
  copyText,
  compressionImg,
  isImgFile,
  imgPreview,
  encodeHtml,
  toLogin,
} from '../../utils/utils';
import { _speed, mediaURL } from "../../config";
import '../../js/common';
import { pagination } from '../../plugins/pagination';
import { rightMenu } from '../../plugins/rightMenu';
import { UpProgress } from '../../plugins/UpProgress';
import _msg from "../../plugins/message";
import _pop from "../../plugins/popConfirm";
if (!_getData('account')) {
  toLogin();
}
const $contentWrap = $('.content_wrap'),
  $imgList = $contentWrap.find('.img_list'),
  $pageBg = $('.page_bg'),
  $pageSize = $contentWrap.find('.page_size');
// 背景
_setTimeout(() => {
  $pageBg.css({
    opacity: '1',
  });
}, 600);
// 上传壁纸
let fData = [];
function hdUpFile(files) {
  fData = [];
  ~(async function fn(num) {
    if (num >= files.length) {
      bgpage = 1;
      renderImgList(true);
      showLink(fData);
      return;
    }
    let { name, size } = files[num];
    let pro = new UpProgress(name);
    if (!isImgFile(name)) {
      pro.fail();
      _msg.error(`${name} 格式错误`);
      num++;
      fn(num);
      return;
    }
    if (size == 0) {
      pro.fail();
      _msg.error(`${name} 为空文件`);
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
        fData.push({
          filename: name,
          url: `${mediaURL}/pic/${HASH}.${suffix}`
        })
        //文件已经存在操作
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
            fData.push({
              filename: name,
              url: `${mediaURL}/pic/${HASH}.${suffix}`
            })
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
$contentWrap.on('click', '.uoload_img_btn', function () {
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
  document.addEventListener('dragenter', function (e) {
    e.preventDefault();
  });
  document.addEventListener('dragover', function (e) {
    e.preventDefault();
  });
  document.addEventListener('drop', function (e) {
    e.preventDefault();
    var files = [...e.dataTransfer.files];
    if (files.length == 0) return;
    hdUpFile(files);
  });
})();
// 获取壁纸
var bgpage = 1;
let curPageSize = _getData('bgshowpage');
$pageSize.val(curPageSize);
renderImgList(true);
function imgListLoading() {
  let str = '';
  new Array(50).fill(null).forEach((v) => {
    str += `<div style="pointer-events: none;" class="img_item">
        <div class="img"></div>
            </div>`;
  });
  $imgList.html(str).scrollTop(0);
}
if (_getData('account') !== 'root') {
  $imgList.remove();
  $pageSize.remove();
}
function renderImgList(y) {
  if (_getData('account') !== 'root') return;
  if (y) {
    imgListLoading();
  }
  let str = '',
    showpage = curPageSize;
  _getAjax('/pic/getlist', { page: bgpage, showpage }).then((result) => {
    if (parseInt(result.code) === 0) {
      let { total, totalPage, data, pageNo } = result.data;
      bgpage = pageNo;
      data.forEach((v) => {
        str += `<div class="img_item" x="${v}">
            <div class="img" data-src="${mediaURL}/picys/${v}"></div>
                </div>`;
      });
      if (totalPage > 1) {
        str += `<div class="pagingbox">`;
        str += pagination({ pageNo, pageSize: showpage, total });
        str += `</div > `;
      }
      $imgList.html(str);
      if (y) {
        $imgList.scrollTop(0);
      }
      bglazyImg($imgList, '.img_item', '.img');
      return;
    }
    isRoot = false;
  }).catch(err => { });
}
if (isios()) {
  $imgList[0]._longPress('.img_item', function (e) {
    let url = $(this).attr('x'),
      ev = e.changedTouches[0];
    bgitemmenu(ev, url);
  });
}
function bgitemmenu(e, url) {
  let str = `<div cursor class="mtcitem"><i class="iconfont icon-fuzhi"></i><span>复制网址</span></div>
    <div cursor class="mtcitem1"><i class="iconfont icon-cangpeitubiao_shanchu"></i><span>删除</span></div>`;
  rightMenu(
    e,
    str,
    debounce(
      function ({ close, e }) {
        if (_getTarget(e, '.mtcitem')) {
          close();
          copyText(`${mediaURL}/pic/${url}`);
        } else if (_getTarget(e, '.mtcitem1')) {
          _pop({ e, text: '确认删除？', confirm: { type: 'danger', text: '删除' } }, (type) => {
            if (type == 'confirm') {
              _postAjax('/pic/delpic', { url }).then((result) => {
                if (parseInt(result.code) === 0) {
                  close();
                  _msg.success(result.codeText);
                  renderImgList();
                  return;
                }
              }).catch(err => { });
            }
          })
        }
      },
      1000,
      true
    )
  );
}
$imgList
  .on('click', '.img_item', function () {
    let $this = $(this);
    let idx = $this.index();
    let arr = [];
    $imgList.find('.img_item').each((idx, item) => {
      let $item = $(item);
      let u2 = $item.children('.img').attr('data-src');
      arr.push({
        u2,
        u1: u2.replace('picys', 'pic')
      });
    });
    imgPreview(arr, idx);
  })
  .on('contextmenu', '.img_item', function (e) {
    e.preventDefault();
    let url = $(this).attr('x');
    bgitemmenu(e, url);
  })
  .on(
    'scroll',
    debounce(function () {
      bglazyImg($imgList, '.img_item', '.img');
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
            renderImgList(true);
          } else if (flag === 'next') {
            bgpage++;
            renderImgList(true);
          } else if (flag === 'go') {
            let val = document
              .querySelector('.pagingbox .paginationBox input')
              .value.trim();
            val = parseInt(val);
            if (isNaN(val)) return;
            bgpage = val;
            renderImgList(true);
          } else if (flag === 'gotop') {
            $imgList.stop().animate(
              {
                scrollTop: 0,
              },
              _speed
            );
          } else {
            bgpage = +flag;
            renderImgList(true);
          }
        }
      },
      500,
      true
    )
  );
$pageSize.on('change', function () {
  curPageSize = $(this).val();
  _setData('bgshowpage', curPageSize);
  if (bgpage == 1) {
    renderImgList();
  } else {
    renderImgList(true);
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


let showLink = function () {
  const $tabMask = $('.tab_mask'),
    $head = $tabMask.find('.head'),
    $content = $tabMask.find('.content');
  let arr = [{
    type: 'url',
    template: '{{url}}'
  }, {
    type: 'markdown',
    template: '![{{filename}}]({{url}})'
  }, {
    type: 'html',
    template: '<img src="{{url}}" alt="{{filename}}" title="{{filename}}" />'
  }, {
    type: 'bbcode',
    template: '[img]{{url}}[/img]'
  }, {
    type: 'markdown with link',
    template: '[![{{filename}}]({{url}})]({{url}})'
  }];
  function render(data) {
    let hstr = '';
    let cstr = '';
    arr.forEach((item, idx) => {
      let { type, template } = item;
      hstr += `<span data-idx="${idx}" cursor class="${idx == 0 ? 'active' : ''}">${type}</span>`;
      cstr += `<ul class="${idx == 0 ? 'active' : ''}">`
      data.forEach((obj) => {
        let text = template.replace(/\{\{(.*?)\}\}/g, function () {
          let key = arguments[1];
          return obj[key];
        })
        text = encodeHtml(text);
        cstr += `<li data-text="${text}">${text}<i cursor class="iconfont icon-fuzhi"></i></li>`
      })
      cstr += '</ul>'
    })
    $head.html(hstr);
    $content.html(cstr);
    $tabMask.stop().fadeIn(_speed);
  }
  $tabMask.on('click', function (e) {
    if (e.target == this) {
      $tabMask.stop().fadeOut(_speed);
    }
  })
  $content.on('click', 'i', function () {
    let text = $(this).parent().attr('data-text');
    copyText(text);
  })
  $head.on('click', 'span', function () {
    const $this = $(this),
      idx = $this.attr('data-idx'),
      $span = $head.find('span'),
      $ul = $content.find('ul');
    console.log(idx)
    $span.removeClass('active');
    $this.addClass('active');
    $ul.removeClass('active');
    $ul.eq(idx).addClass('active');
  })
  return render;
}();
