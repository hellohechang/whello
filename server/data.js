const fs = require('fs');
const _d = deepProxy(JSON.parse(fs.readFileSync('./config.json')), save);
function save() {
  fs.writeFileSync('./config.json', JSON.stringify(_d));
}
function deepProxy(target, callback) {
  let handler = {
    get(target, key) {
      let res = Reflect.get(target, key);
      return res !== null && typeof res === 'object' ? new Proxy(res, handler) : res;
    },
    set(target, key, value) {
      let res = Reflect.set(target, key, value);
      callback && callback();
      return res;
    }
  }
  return new Proxy(target, handler)
}
module.exports = _d;