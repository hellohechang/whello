import $ from "jquery";
import '../../css/reset.css';
import '../../css/iconfont.css';
import './index.less';
import {
  queryURLParams,
  myOpen,
  _setTimeout,
  debounce,
  imgjz,
  getHost,
  _getAjax,
  encodeHtml,
} from '../../utils/utils';
import { mediaURL } from "../../config";
import '../../js/common';
import { _success } from "../../plugins/message";

let urlparmes = queryURLParams(myOpen()),
  HASH = urlparmes.HASH;
const $saveToList = $('.save_to_list'),
  $pageBg = $('.page_bg'),
  $box = $('.box');
_setTimeout(() => {
  $pageBg.css({
    opacity: '1',
  });
}, 600);
_getAjax('/nav/share', { id: HASH }).then((res) => {
  if (res.code == 0) {
    let str = '';
    res.data.forEach((item) => {
      let { name, link, logo, des } = item;
      des = des ? encodeHtml(des) : '';
      name = encodeHtml(name);
      str += `<li data-name="${name}" data-src="${logo}" data-des="${des}" cursor class="bm_item jzxz" data-link="${link}">
        <div class="logo"></div>
        <div title="${name}(${link})" class="bm_title">${name}</div>
        <p title="${des}">${des || '描述'}</p>
        </li>`;
    });
    $box.html(str);
    $box.find('.bm_item').each((index, item) => {
      let $item = $(item),
        url = $item.attr('data-src'),
        link = $item.attr('data-link');
      if (!url.includes('favicon.ico')) {
        url = mediaURL + url;
      }
      let $img = $item.find('.logo');
      imgjz(
        url,
        () => {
          $img.css({
            'background-image': `url(${url})`,
            opacity: '1',
          });
        },
        () => {
          let u = `https://api.iowen.cn/favicon/${getHost(link)}.png`;
          imgjz(
            u,
            () => {
              $img.css({
                'background-image': `url('${u}')`,
                opacity: '1',
              });
            },
            () => {
              $img.css({
                'background-image': `url('/img/mrlogo.png')`,
                opacity: '1',
              });
            }
          );
        }
      );
    });
  } else {
    document.body.innerHTML = `<p style="font-size: 20px;color: #303030;text-align:center;padding:50px 0;">${res.codeText}</p>`;
  }
}).catch(err => { });
$saveToList.on('click',
  debounce(
    function () {
      _getAjax('/nav/saveshare', { id: HASH }).then((res) => {
        if (res.code == 0) {
          _success();
        }
      }).catch(err => { });
    },
    5000,
    true
  )
);
$box.on(
  'click',
  '.bm_item',
  debounce(function () {
    let $this = $(this),
      link = $this.attr('data-link');
    myOpen(link, '_blank');
  }, 500)
);
