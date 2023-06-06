import $ from "jquery";
import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import '../../css/iconfont.css'
import './note.css'
import {
  queryURLParams,
  myOpen,
  _setData,
  _getData,
  _setTimeout,
  throttle,
  debounce,
  _getTarget,
  _mySlide,
  _getAjax,
  copyText,
  encodeHtml,
  _position,
  _myOpen,
  imgPreview,
  getPageScrollTop,
  // setPageScrollTop,
} from '../../utils/utils'
import { _speed, mediaURL } from "../../config";
import '../../js/common'
import { rightMenu } from '../../plugins/rightMenu'
import icon1logo from '../../img/icon1.png'
import iconlogo from '../../img/icon.png'
~(function () {
  let $totop = $('.totop'),
    $icon = $("link[rel*='icon']"),
    $html = $(document.documentElement),
    urlparmes = queryURLParams(myOpen()),
    $body = $('body'),
    $mbg = $('.mbg'),
    HASH = urlparmes.HASH;
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
  _setTimeout(() => {
    $mbg.css({
      opacity: '0.6',
    });
  }, 600)
  $totop.click(function () {
    // setPageScrollTop(0);
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  });
  let $fsbg = $('.fsbg'),
    $notebotlist = $('.notebotlist'),
    $hicodeid = $('#hicode'),
    $markdown = $('.markdown'),
    $notetitle = $('.notetitle'),
    $pageSearch = $('.pageSearch'),
    $pageSearchOn = $('.pageSearchOn'),
    $pageSearchNum = $('.pageSearchNum'),
    $editnote = $('.editnote'),
    $from = $('.from'),
    editlistmdobj = {
      fontsz: 20,
      fontwe: 0,
      theme: 2,
    },
    highlightnum = 0,
    $highlight = null,
    titleName = '';
  $editnote.click(
    debounce(function () {
      _myOpen(`/page/edit/#${urlparmes.v}`, titleName);
    }, 500)
  );
  function notexuanrandefault() {
    let str = '';
    new Array(20).fill(null).forEach((v, i) => {
      let w = Math.round(Math.random() * (90 - 20) + 20);
      str += `<p style="pointer-events: none;background-color:#83818173;height:25px;width:100%;margin:15px 0;"></p>
            ${w % 2 === 0
          ? '<p style="background-color:#83818173;height:25px;width:100%;margin:15px 0;"></p>'
          : ''
        }
            <p style="background-color:#83818173;height:25px;width:${w}%;margin:15px 0;"></p>
      `;
    });
    $markdown.html(str);
  }
  notexuanrandefault();
  if (urlparmes.v) {
    _getAjax('/note/getnote', { v: urlparmes.v }).then((result) => {
      if (parseInt(result.code) === 0) {
        let { name, data, account, username, own } = result.data;
        titleName = name
        $from._uobj = {
          account,
          username,
          own,
        };
        let logoUrl = `${mediaURL}/logo/${account}/${account}.png?v=${Math.random()}`;
        $from
          .find('.logo')
          .attr('title', username)
          .css('background-image', `url(${logoUrl})`);
        data = `# ${name}\n` + data;
        let str = MarkdownIt({ linkify: true }).render(data);
        $markdown.html(str);
        hljs.highlightAll();
        $markdown.find('pre')
          .append(
            `<div title="复制" cursor class="codeCopy iconfont icon-fuzhi"><div>`
          )
          .prepend(
            `<div data-flag="y" cursor class="shrink iconfont icon-Down"><div>`
          );
        $markdown.find('a').attr({
          'target': '_blank',
          cursor: ''
        })
        $markdown.find('img').attr({
          cursor: ''
        })
        // hljs.initHighlightingOnLoad();
        BlogDirectory();
        $notetitle.text(name);
        $notebotlist.addClass('open');
        // setPageScrollTop(0);
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        })
        if (HASH) {
          HASH = decodeURIComponent(HASH);
          $markdown.highlight(HASH);
          $highlight = $markdown.find('span.highlight')
          let _length = $highlight.length;
          highlightnum = 0;
          if (_length > 0) {
            $pageSearchOn.click();
            $pageSearch.find('.hinp').val(HASH);
            $pageSearchNum.html(`${highlightnum + 1}/${_length}`);
            highlightPosition(highlightnum);
          }
        }
        return;
      }
      $markdown.html(result.codeText);
      $notebotlist.remove();
      $from.remove();
    }).catch(err => { })
  } else {
    $markdown.html('输入地址错误');
    $notebotlist.remove();
  }
  $from.find('.logo').click(
    debounce(
      function (e) {
        let { account, username, own } = $from._uobj;
        let uname = encodeHtml(username);
        let str = `<div cursor class="mtcitem" style="justify-content: center;">${uname}</div>
    <div cursor class="mtcitem1">查看更多</div>
    ${own === 'y' ? '' : `<div cursor class="mtcitem2">@${uname}</div>`}`;
        rightMenu(
          e,
          str,
          debounce(
            function ({ close, e }) {
              if (_getTarget(e, '.mtcitem1')) {
                let url = `/page/allnote/#${account}`;
                if (own === 'y') {
                  url = `/page/notes/`;
                }
                _myOpen(url, username);
                close();
              } else if (_getTarget(e, '.mtcitem')) {
                imgPreview([{ u1: `${mediaURL}/logo/${account}/${account}.png?v=${Math.random()}` }]);
              } else if (_getTarget(e, '.mtcitem2')) {
                _setData('toUser', {
                  account,
                  username,
                });
                myOpen(`/?c=open`, '_blank');
              }
            },
            1000,
            true
          )
        );
      },
      500,
      true
    )
  );
  $markdown
    .on(
      'click',
      '.codeCopy',
      debounce(
        function () {
          let str = $(this).parent().find('code').text();
          copyText(str);
        },
        500,
        true
      )
    )
    .on(
      'click',
      '.shrink',
      debounce(
        function () {
          let $this = $(this);
          let flag = $this.attr('data-flag');
          if (flag === 'y') {
            $this.attr({
              'data-flag': 'n',
              class: 'shrink iconfont icon-page-next',
            });
            $this.parent().find('code').stop().hide();
          } else {
            $this.attr({
              'data-flag': 'y',
              class: 'shrink iconfont icon-Down',
            });
            $this.parent().find('code').stop().show();
          }
        },
        500,
        true
      )
    );
  $pageSearch.click((e) => {
    $highlight = $markdown.find('span.highlight')
    let target = e.target,
      _length = $highlight.length;
    if (target.tagName === 'DIV') {
      if ($(target).attr('flag') === 'x') {
        $pageSearch.css('display', 'none');
        $markdown.removeHighlight();
        highlightnum = 0;
        $pageSearch.find('.hinp').val('');
        $pageSearchNum.text('');
      } else {
        if (_length === 0) return;
        if ($(target).attr('flag') === 'next') {
          highlightnum++;
        } else if ($(target).attr('flag') === 'pre') {
          highlightnum--;
        }
        highlightnum >= _length
          ? (highlightnum = 0)
          : highlightnum < 0
            ? (highlightnum = _length - 1)
            : null;
        $pageSearchNum.text(`${highlightnum + 1}/${_length}`);
        highlightPosition(highlightnum);
      }
    }
  });
  $pageSearchOn.click(() => {
    $pageSearch.css('display', 'flex').find('.hinp').focus();
  });
  $pageSearch
    .find('.hinp')
    .on('input', function () {
      let $this = $(this),
        val = $this.val().trim();
      $markdown.removeHighlight();
      $pageSearchNum.text(``);
      if (val === '') return;
      $markdown.highlight(val);
      $highlight = $markdown.find('span.highlight')
      let _length = $highlight.length;
      $pageSearch.css('display', 'flex');
      highlightnum = 0;
      if (_length > 0) {
        $pageSearchNum.text(`${highlightnum + 1}/${_length}`);
        highlightPosition(highlightnum);
      }
    })
    .on('mouseenter', function () {
      $(this).focus();
    })
    .on('keydown', function (e) {
      let key = e.key;
      if (key === 'Enter') {
        $highlight = $markdown.find('span.highlight')
        let _length = $highlight.length;
        if (_length === 0) return;
        highlightnum++;
        highlightnum >= _length
          ? (highlightnum = 0)
          : highlightnum < 0
            ? (highlightnum = _length - 1)
            : null;
        highlightPosition(highlightnum);
        $pageSearchNum.text(`${highlightnum + 1}/${_length}`);
        e.preventDefault();
      }
    });

  //高亮定位
  function highlightPosition(num) {
    let pageTop = getPageScrollTop();
    let DH = window.innerHeight,
      _top = _position($highlight.eq(num)[0], true).top + pageTop;
    $highlight.removeClass('active').eq(num).addClass('active');
    if (_top > pageTop && _top < pageTop + DH) {
    } else {
      // setPageScrollTop(_top - 60);
      window.scrollTo({
        top: _top - 60,
        behavior: "smooth"
      })
    }
  }
  if (_getData('editlistmdobj')) {
    editlistmdobj = _getData('editlistmdobj');
  }

  $markdown.css({
    'font-size': editlistmdobj.fontsz,
  });

  let fsbgnum = editlistmdobj.theme;
  function changebg() {
    switch (fsbgnum) {
      case 1:
        {
          editlistmdobj.theme = fsbgnum;
          _setData('editlistmdobj', editlistmdobj);
          $body.attr('class', 'heibaibg');
          $markdown.attr('class', 'markdown heibaibg');
          $hicodeid.attr('href', '/css/notecode1.css');
          fsbgnum++;
        }
        break;
      case 2:
        {
          editlistmdobj.theme = fsbgnum;
          _setData('editlistmdobj', editlistmdobj);
          $body.attr('class', 'baiheibg');
          $markdown.attr('class', 'markdown baiheibg');
          $hicodeid.attr('href', '/css/notecode.css');
          fsbgnum++;
        }
        break;
      case 3:
        {
          editlistmdobj.theme = fsbgnum;
          _setData('editlistmdobj', editlistmdobj);
          $body.attr('class', 'moren');
          $markdown.attr('class', ' markdown moren');
          $hicodeid.attr('href', '/css/notecode2.css');
          fsbgnum = 1;
        }
        break;
    }
  }
  changebg();
  $fsbg.click((e) => {
    changebg();
  });
  $('.fszd').click((e) => {
    let fsztnum = editlistmdobj.fontsz;
    fsztnum += 2;
    fsztnum >= 30 ? (fsztnum = 30) : null;
    $markdown.css({
      'font-size': fsztnum,
    });
    editlistmdobj.fontsz = fsztnum;
    _setData('editlistmdobj', editlistmdobj);
  });
  $('.fsjx').click((e) => {
    let fsztnum = editlistmdobj.fontsz;
    fsztnum -= 2;
    fsztnum <= 12 ? (fsztnum = 12) : null;
    $markdown.css({
      'font-size': fsztnum,
    });
    editlistmdobj.fontsz = fsztnum;
    _setData('editlistmdobj', editlistmdobj);
  });
  window.addEventListener(
    'scroll',
    throttle(function () {
      let p = getPageScrollTop();
      if (p <= 100) {
        $totop.stop().slideUp(_speed);
      } else {
        $totop.stop().slideDown(_speed);
      }
      let H = window.innerHeight,
        CH = document.documentElement.scrollHeight - H;
      pagepro(p / CH);
    }, 500)
  );

  $markdown.on('click', 'img', function () {
    imgPreview([{ u1: $(this).attr('src') }]);
  });
  function toTree(box) {
    // 祖先
    const root = { node: 'root', children: [] };
    let cur = root;
    // 遍历所有子孙
    box.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach((item, idx) => {
      // 生成子孙对象
      const obj = { node: item, children: [] };
      // 找父亲
      while (cur !== root && obj.node.tagName[1] <= cur.node.tagName[1]) {
        cur = cur.parent;
      };
      // 儿子认父亲
      obj.parent = cur;
      // 父亲认儿子
      obj.parent.children.push(obj);
      cur = obj;
    })
    return root.children;
  }
  let BlogDirectory = function () {
    let $mdBox = $('.markdownbox'),
      $navwrap = $('.navwrap'),
      $dirBox = $('.dirBox'),
      $showDir = $('.showDir'),
      $allH = $mdBox.find('h1,h2,h3,h4,h5,h6'),
      str = '';

    let treeData = toTree($mdBox[0]);
    let num = 1;
    (function next(data, level) {
      data.forEach((item) => {
        let text = encodeHtml(item.node.innerText);
        let flag = `hello_${num++}`;
        item.node.id = flag;
        str += `<li title="${text}" cursor h="${level}" data-id="${flag}">${text}</li>`
        if (item.children.length > 0) {
          str += `<ul>`
          next(item.children, level + 1)
          str += '</ul>'
        }
      })
    })(treeData, 1);
    $dirBox.html(str);

    let $allLi = $navwrap.find('li');
    document.addEventListener('click', function (e) {
      if (!_getTarget(e, '.navwrap')) {
        $navwrap.removeClass('open');
      }
    });
    $navwrap.on('click', 'li', function (e) {
      let $this = $(this);
      $allLi.removeClass('open');
      $this.addClass('open');
      let id = $this.attr('data-id'),
        el = $html.find(`#${id}`),
        _top = _position(el[0], true).top + getPageScrollTop();
      // setPageScrollTop(_top - 60);
      window.scrollTo({
        top: _top - 60,
        behavior: "smooth"
      })
      $this.next('ul').stop().slideToggle(_speed);
    });
    _mySlide({
      el: '.navwrap',
      right() {
        $navwrap.removeClass('open');
      },
    });
    $showDir.on('click', (e) => {
      e.stopPropagation();
      $navwrap.addClass('open');
      hdNavActive();
    });
    function hdNavActive() {
      if (!$navwrap.hasClass('open')) return;
      $allLi.removeClass('open');
      let $smalltopH = $allH
        .filter((_, item) => _position(item, true).top >= 0)
        .eq(0);
      $smalltopH.length > 0 ? null : ($smalltopH = $allH.last());
      if ($smalltopH.length > 0) {
        let $cuLi = $allLi
          .filter((_, item) => $(item).attr('data-id') === $smalltopH[0].id)
          .eq(0);
        if ($cuLi.length > 0) {
          $cuLi.addClass('open');
          let c = $cuLi;
          while (c[0] != $dirBox[0]) {
            c = c.parent();
            c.slideDown(_speed)
          }
          _setTimeout(() => {
            $dirBox.stop().animate(
              {
                scrollTop:
                  $dirBox.scrollTop() +
                  _position($cuLi[0], true).top -
                  $navwrap.height() / 4,
              },
              _speed
            );
          }, _speed)
        }
      }
    }
    window.addEventListener('scroll', debounce(hdNavActive, 100));
  };
})();

~(function () {
  let div = document.createElement('div');
  div.style.cssText = `
    width: 0;
    height: 4px;
    position: fixed;
    top: 0;
    left: 0;
    border-radio:20px;
    pointer-events: none;
    transition: 1s;
    background-image: linear-gradient(to right, green, orange);
    z-index: 9999999999;
  `;
  document.body.appendChild(div);
  window.pagepro = function (pes) {
    div.style.width = pes * 100 + '%';
  };
})();
$.fn.highlight = function (pat) {
  function innerHighlight(node, pat) {
    var skip = 0;
    if (node.nodeType == 3) {
      var pos = node.data.toUpperCase().indexOf(pat);
      if (pos >= 0) {
        var spannode = document.createElement('span');
        spannode.className = 'highlight';
        var middlebit = node.splitText(pos);
        var endbit = middlebit.splitText(pat.length);
        var middleclone = middlebit.cloneNode(true);
        spannode.appendChild(middleclone);
        middlebit.parentNode.replaceChild(spannode, middlebit);
        skip = 1;
      }
    } else if (
      node.nodeType == 1 &&
      node.childNodes &&
      !/(script|style)/i.test(node.tagName)
    ) {
      for (var i = 0; i < node.childNodes.length; ++i) {
        i += innerHighlight(node.childNodes[i], pat);
      }
    }
    return skip;
  }
  return this.each(function () {
    innerHighlight(this, pat.toUpperCase());
  });
};

$.fn.removeHighlight = function () {
  function newNormalize(node) {
    for (
      var i = 0, children = node.childNodes, nodeCount = children.length;
      i < nodeCount;
      i++
    ) {
      var child = children[i];
      if (child.nodeType == 1) {
        newNormalize(child);
        continue;
      }
      if (child.nodeType != 3) {
        continue;
      }
      var next = child.nextSibling;
      if (next == null || next.nodeType != 3) {
        continue;
      }
      var combined_text = child.nodeValue + next.nodeValue;
      let new_node = node.ownerDocument.createTextNode(combined_text);
      node.insertBefore(new_node, child);
      node.removeChild(child);
      node.removeChild(next);
      i--;
      nodeCount--;
    }
  }

  return this.find('span.highlight')
    .each(function () {
      var thisParent = this.parentNode;
      thisParent.replaceChild(this.firstChild, this);
      newNormalize(thisParent);
    })
    .end();
};