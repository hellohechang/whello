//目录同步
let fs = require('fs');
//过滤目录文件配置
let filterObj = { f: [], d: [] };
// 处理过滤
function hdFilterFile(dirPath, filterFile) {
  let d = [], //过滤目录
    f = []; //过滤文件
  filterFile.forEach((item) => {
    let { path, file = [] } = item;
    if (file.length === 0) {
      d.push(`${dirPath}${path}`);
    } else {
      file.forEach((v) => {
        f.push(`${dirPath}${path}/${v}`);
      });
    }
  });
  return { f, d };
}
// 获取所有文件
function getAllFile(path, arr = []) {
  return new Promise((resolve) => {
    fs.stat(path, (err, status) => {
      if (err) {
        wlog(err, 1);
        resolve(arr);
        return;
      }
      if (status.isDirectory()) {
        // 过滤目录
        if (filterObj.d.includes(path)) {
          resolve(arr);
          return;
        }
        fs.readdir(path, (err, file) => {
          if (err) {
            wlog(err, 1);
            resolve(arr);
            return;
          }
          let res = file.map((item) => getAllFile(`${path}/${item}`, arr));
          Promise.all(res).finally(() => {
            resolve(arr);
          });
        });
      } else {
        // 过滤文件
        if (filterObj.f.includes(path)) {
          resolve(arr);
          return;
        }
        let pathArr = path.split('/');
        let name = pathArr.slice(-1)[0];
        pathArr.pop();
        arr.push({
          name,
          path: pathArr.join('/'),
          size: status.size,
          atime: status.atimeMs, //最近一次访问文件的时间戳
          ctime: status.ctimeMs, //最近一次文件状态的修改的时间戳
          birthtime: status.birthtimeMs, //文件创建时间的时间戳
        });
        resolve(arr);
      }
    });
  });
}
// 读取目录文件
function readMenu(path) {
  return new Promise((resolve) => {
    let fileArr = [],
      DirArr = [],
      { f, d } = filterObj;
    fs.readdir(path, (err, result) => {
      if (err) {
        wlog(err, 1);
        resolve({
          fileArr,
          DirArr,
        });
        return;
      }
      let arrp = result.map((item) => {
        return new Promise((resolve) => {
          let fpath = `${path}/${item}`;
          fs.stat(fpath, (err, s) => {
            if (err) {
              wlog(err, 1);
              resolve(s);
              return;
            }
            if (s.isDirectory()) {
              if (!d.includes(fpath)) {
                DirArr.push(item);
              }
            } else {
              if (!f.includes(fpath)) {
                fileArr.push(item);
              }
            }
            resolve(s);
          });
        });
      });
      Promise.all(arrp).finally(() => {
        resolve({
          fileArr,
          DirArr,
        });
      });
    });
  });
}
// 记录执行信息
async function wlog(str, y) {
  str = str + '';
  if (str.trim() === '') return;
  if (y) {
    await _appendFile('./error.log', `${str}\n`);
    return;
  }
  await _appendFile('./success.log', `${str}\n`);
  console.log(str);
}
function _mkdir(path) {
  return new Promise((resolve) => {
    fs.mkdir(path, { recursive: true }, (err, result) => {
      if (err) {
        wlog(err, 1);
      }
      resolve(result);
    });
  });
}
function _appendFile(path, data) {
  return new Promise((resolve) => {
    fs.appendFile(path, data, (_, result) => {
      resolve(result);
    });
  });
}
//复制文件
function _hdCopy(p1, p2) {
  return new Promise((resolve) => {
    fs.copyFile(p1, p2, (err) => {
      if (err) {
        wlog(err, 1);
      }
      resolve();
    });
  });
}
// 移动文件
function _rename(p1, p2) {
  return new Promise((resolve) => {
    fs.rename(p1, p2, (err) => {
      if (err) {
        wlog(err, 1);
      }
      resolve();
    });
  });
}
// 删除文件目录
function _hdDel(path) {
  return new Promise((resolve) => {
    fs.stat(path, (err, status) => {
      if (err) {
        wlog(err, 1);
        resolve();
        return;
      }
      if (status.isDirectory()) {
        //是文件夹
        fs.readdir(path, (err, file) => {
          if (err) {
            wlog(err, 1);
            resolve();
            return;
          }
          let res = file.map((item) => _hdDel(`${path}/${item}`));
          Promise.all(res).finally(() => {
            //当所有的子文件都删除后就删除当前文件夹
            fs.rmdir(path, (err) => {
              if (err) {
                wlog(err, 1);
              }
              resolve();
            });
          });
        });
      } else {
        fs.unlink(path, (err) => {
          if (err) {
            wlog(err, 1);
          }
          resolve();
        });
      }
    });
  });
}
// 清除多出文件和目录
function clear(from, to) {
  return (async function _remove(from, to) {
    // 读取目录中文件和目录
    let aobj = await readMenu(from);
    let bobj = await readMenu(to);
    //删除多出文件
    await Promise.all(
      bobj.fileArr
        .filter((item) => !aobj.fileArr.some((y) => y == item))
        .map((item) => {
          let p = `${to}/${item}`;
          wlog(`删除文件[${p}]`);
          return _hdDel(p);
        })
    );
    //删除多出的目录
    await Promise.all(
      bobj.DirArr.filter((item) => !aobj.DirArr.some((y) => y == item)).map(
        (item) => {
          let p = `${to}/${item}`;
          wlog(`删除目录[${p}]`);
          return _hdDel(p);
        }
      )
    );

    // 继续使用相同方法操作剩下的目录
    return Promise.all(
      aobj.DirArr.map((item) => {
        let p = `${to}/${item}`;
        if (!fs.existsSync(p)) {
          wlog(`新增空目录[${p}]`);
          _mkdir(p); //空目录处理
        }
        return _remove(`${from}/${item}`, p);
      })
    );
  })(from, to);
}
// 文件对比同步
async function sync(obj) {
  try {
    let { from, to, filter = [] } = obj;
    // 禁止同步到被同步的目录或目录下
    if (from === to.slice(0, from.length)) {
      wlog('SB');
      return;
    }
    // 生成过滤配置
    filterObj = hdFilterFile(from, filter);
    // 创建to目录
    if (!fs.existsSync(to)) {
      await _mkdir(to);
      wlog(`创建目录[${to}]`);
    }
    // 获取from和to目录所有文件信息
    wlog(`扫描文件...`);
    let fromAllFile = (await getAllFile(from)).map((item) => {
      return { ...item, path: item.path.replace(from, '') };
    });
    let toAllFile = (await getAllFile(to)).map((item) => {
      return { ...item, path: item.path.replace(to, '') };
    });

    wlog(`开始同步[${from} => ${to}]`);

    //删除to目录中多余文件
    let delFile = toAllFile.filter(
      (item) =>
        !fromAllFile.some((y) => y.name === item.name && y.size === item.size)
    );
    for (let i = 0; i < delFile.length; i++) {
      let { path, name } = delFile[i];
      let p = `${to}${path}/${name}`;
      await _hdDel(p);
      wlog(`删除文件[${p}]`);
    }
    // 在to目录过滤掉被删除的文件
    toAllFile = toAllFile.filter(
      (item) =>
        !delFile.some(
          (y) =>
            y.name === item.name && y.size === item.size && y.path === item.path
        )
    );

    // 新增新文件
    let newFileArr = fromAllFile.filter(
      (item) =>
        !toAllFile.some((y) => y.name === item.name && y.size === item.size)
    );
    for (let i = 0; i < newFileArr.length; i++) {
      let { path, name } = newFileArr[i];
      let f = `${from}${path}`;
      let t = `${to}${path}`;
      await _mkdir(t);
      await _hdCopy(`${f}/${name}`, `${t}/${name}`);
      wlog(`复制文件[${f} => ${t} - ${name}]`);
    }
    // 在from目录中过滤掉已经同步的文件
    fromAllFile = fromAllFile.filter(
      (item) =>
        !newFileArr.some((y) => y.name === item.name && y.size === item.size)
    );

    //过滤同目录重复的文件
    let dupFileArr = fromAllFile.filter((item) =>
      toAllFile.some(
        (y) =>
          y.name === item.name && y.size === item.size && y.path === item.path
      )
    );
    // 现在from目录和to目录中文件都是重复的在不同目录中
    fromAllFile = fromAllFile.filter(
      (item) =>
        !dupFileArr.some(
          (y) =>
            y.name === item.name && y.size === item.size && y.path === item.path
        )
    );
    toAllFile = toAllFile.filter(
      (item) =>
        !dupFileArr.some(
          (y) =>
            y.name === item.name && y.size === item.size && y.path === item.path
        )
    );

    // 处理重复不同目录的文件
    for (let i = 0; i < fromAllFile.length; i++) {
      let { name, path, size } = fromAllFile[i];
      await _mkdir(`${to}${path}`);
      let idx = toAllFile.findIndex((y) => y.name === name && y.size === size);
      //在to中有同名文件，移动到正确的目录
      if (idx >= 0) {
        let flag = toAllFile[idx];
        // 过滤已经被移动的文件
        toAllFile.splice(idx, 1);
        // 被移动文件记录到过滤的固定目录文件数组中，方便下次还有相同文件可以直接复制使用
        dupFileArr.push({ ...flag, path });
        let f = `${to}${flag.path}`;
        let t = `${to}${path}`;
        //把已有的文件移动到指定目录
        await _rename(`${f}/${name}`, `${t}/${name}`);
        wlog(`移动文件[${f} => ${t} - ${name}]`);
      } else {
        //在to中没有同名文件，则在成功移动的文件中复制
        let flag = dupFileArr.find((y) => y.name === name && y.size === size);
        let f = `${to}${flag.path}`;
        let t = `${to}${path}`;
        if (!flag) {
          f = `${from}${path}`;
        }
        await _hdCopy(`${f}/${name}`, `${t}/${name}`);
        wlog(`复制文件[${f} => ${t} - ${name}]`);
      }
    }
    // 最后处理多余重复文件和目录
    await clear(from, to);
    wlog(`同步完毕`);
  } catch (error) {
    wlog(error, 1);
  }
}
// sync({
//   from: 'xxx',
//   to: 'xxx',
//   filter: [
//     {
//       path: '/xxx/xxx',
//       file: ['xxx', 'xxx']
//     }
//   ]
// })
module.exports = sync;
