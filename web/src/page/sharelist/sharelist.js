import $ from "jquery";
import '../../css/reset.css'
import '../../css/iconfont.css'
import './index.css'
import {
  _setTimeout,
  _postAjax,
  _getAjax,
  _myOpen,
  getPreUrl
} from '../../utils/utils'
import '../../js/common'
import { alert } from '../../plugins/alert'
~function () {
  let $list = $('.list'),
    $mbg = $('.mbg'),
    $clearShare = $('.clearShare');
  _setTimeout(() => {
    $mbg.css({
      opacity: '1',
    });
  }, 600)
  function render() {
    _getAjax('/user/sharelist').then(res => {
      if (res.code == 0) {
        let str = ''
        if (res.data.length === 0) {
          str += `<p>It feels lonely here...</p>`
        }
        res.data.reverse()
        res.data.forEach(item => {
          let { id, type } = item,
            url = `${getPreUrl()}/${type === 'music' ? `page/sharemusic/#${id}` : `page/sharebm/#${id}`}`
          str += `<li data-id="${id}" data-url="${url}">
            <div>${url}</div>
            <button cursor class="go">访问</button>
            <button cursor class="delete">删除</button>
          </li>
          `
        });
        $list.html(str)
      }
    }).catch(err => { })
  }
  render()
  $list.on('click', '.delete', function () {
    let id = $(this).parent().attr('data-id')
    alert(`确认删除？`, {
      confirm: true,
      handled: m => {
        if (m !== 'confirm') return;
        _postAjax('/user/deleteshare', { id }).then(res => {
          if (res.code == 0) {
            render()
          }
        }).catch(err => { })
      }
    });
  }).on('click', '.go', function () {
    let url = $(this).parent().attr('data-url')
    _myOpen(url, url)
  })
  $clearShare.click(function () {
    alert(`确认清空？`, {
      confirm: true,
      handled: m => {
        if (m !== 'confirm') return;
        _postAjax('/user/deleteshare').then(res => {
          if (res.code == 0) {
            render()
          }
        }).catch(err => { })
      }
    });
  })
}()