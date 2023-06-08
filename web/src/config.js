import { getPreUrl } from "./utils/utils";
export const _speed = 500
export const LevelObj = {
  upProgressbox: 100, // 上传进度（静）
  rightBox: 101, // 右键菜单（静）
  copyEdit: 102, // 复制编辑（静）
  imgPreview: 102, // 图片预览（动）
  mstc: 103, // 通知框（静）
  _progressBar: 104, // 调节器（动）
  alertBox: 104, // 确认框（动）
  hechang: 105, // 何畅（静）
  hua: 106, // 樱花（静）
  loading: 107, // 加载动画（静）
  dianji: 107, // 点击（动）
};
let preUrl = getPreUrl()
preUrl = getPreUrl() + '/api'
export const serverURL = preUrl

// export const mediaURL = 'https://data.hellochang.eu.org';
export const mediaURL = preUrl + '/getfile';
