
import './index.less'
/*
 *pageNo:当前页
 *pageSize:每页展示多少条
 *total:一共多少条
 *continuous:连续页码条数
 */
export function pagination(opations) {
  let { pageNo, pageSize, total, continuous = 3 } = opations;
  pageNo = +pageNo;
  pageSize = +pageSize;
  total = +total;
  continuous = +continuous;

  let totalPage = Math.ceil(total / pageSize);
  pageNo <= 0 ? (pageNo = 1) : pageNo >= totalPage ? (pageNo = totalPage) : null;
  let startPage = pageNo - parseInt(continuous / 2),
    endPage = pageNo + parseInt(continuous / 2);
  if (totalPage > continuous) {
    startPage < 1 ? ((startPage = 1), (endPage = continuous)) : null;
    endPage > totalPage ? ((endPage = totalPage), (startPage = totalPage - continuous + 1)) : null;
  } else {
    startPage = 1;
    endPage = totalPage;
  }
  let str = `<div class="paginationBox">`;
  str += `${pageNo > 1 ? '<button cursor data-flag="pre">上一页</button>' : ''}`;
  if (totalPage > continuous) {
    str += `${startPage > 1 ? '<button cursor data-flag="1">1</button>' : ''}
            ${startPage == 3 ? '<button cursor data-flag="2">2</button>' : ''}
            ${startPage > 3 ? `<button cursor data-flag="${startPage - 1}">...</button>` : ''}`;
  }
  for (let i = startPage; i <= endPage; i++) {
    str += `<button cursor data-flag="${i}" class="${i == pageNo ? 'active' : ''}">${i}</button>`;
  }
  if (totalPage > continuous) {
    str += `${endPage < totalPage - 2 ? `<button cursor data-flag="${endPage + 1}">...</button>` : ''}
            ${endPage == totalPage - 2 ? `<button cursor data-flag="${totalPage - 1}">${totalPage - 1}</button>` : ''}
            ${endPage < totalPage ? `<button cursor data-flag="${totalPage}">${totalPage}</button>` : ''}`;
  }
  str += `${pageNo < totalPage ? '<button cursor data-flag="next">下一页</button>' : ''}`;
  str += `<span>共 ${total} 条,</span>
      <input autocomplete="off" value="${pageNo}" type="number">
      <button cursor data-flag="go">Go</button>
      <button cursor data-flag="gotop">Top</button>`;
  str += `</div>`;
  return str;
}