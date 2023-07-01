import { getPreUrl } from "./utils/utils";
export const _speed = 500;
export const LevelObj = {
  upProgressbox: 100, // 上传进度（静）
  rightBox: 101, // 右键菜单（静）
  copyEdit: 102, // 复制编辑（静）
  imgPreview: 102, // 图片预览（动）
  msg: 103, // 通知框（静）
  _progressBar: 104, // 调节器（动）
  alertBox: 104, // 确认框（动）
  hechang: 105, // 何畅（静）
  loading: 107, // 加载动画（静）
  dianji: 107, // 点击（动）
};
let url = getPreUrl() + '/api';
export const serverURL = url;
export const mediaURL = url + '/getfile';

export const _d = {
  searchEngineData: [
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
  remoteState: false,
  checkColor: 'rgb(118 254 89 / 58%)',
  myTitle: 'Hello',
  localStorageDefaultData: {
    md: [],
    dian: 'y',
    pagecolor: 0,
    lastvol: 0.7,
    fonttype: 'consolas.ttf',
    nodeshowpage: 20,
    newNote: '',
    historyshowpage: 80,
    searchengine: {
      name: 'Bing',
      icon: 'img/bing-xs.png',
      logo: 'img/bing.png',
      searchlink: 'https://cn.bing.com/search?q=',
    },
    toUser: {},
    callword: 'y',
    filterbg: 0,
    lastpx: 'default',
    loading: 16,
    logshowpage: 100,
    bgshowpage: 40,
    recycleshowpage: 40,
    lastplaysd: ['x1', 1],
    showfy: false,
    lastweizi: {},
    lrcstatu: { size: 16, statu: 'center' },
    musicpagenum: 50,
    account: '',
    originurl: '/',
    themeObj: {
      fontsz: 20,
      fontwe: 0,
      theme: 2,
    }
  }
};
