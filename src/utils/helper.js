// 通过配置中的method配置项，判断数据是放入params中还是data中。
// 供axios使用
export function axiosOptions(method, data) {
  const options = {
    method: method || 'get'
  };
  options[options.method === 'get' ? 'params' : 'data'] = data;

  return options;
}

/**
 * 判断元素element是否滚动到可视区域
 *
 * 该方法不用指定滚动容器
 *
 * @param {*} element
 * @param {*} parentElm 没值则在浏览器滚动范围内，有值则在容器如div滚动范围内
 * @param {*} percentX
 * @param {*} percentY
 */
export function isScrolledIntoView(element, parentElm, percentX, percentY) {
  if (parentElm) {
    let tolerance = 0.01; //needed because the rects returned by getBoundingClientRect provide the position up to 10 decimals
    if (percentX == null) {
      percentX = 100;
    }
    if (percentY == null) {
      percentY = 100;
    }
    let elementRect = element.getBoundingClientRect();
    let parentRect = parentElm.getBoundingClientRect();

    let visiblePixelX = Math.min(elementRect.right, parentRect.right) - Math.max(elementRect.left, parentRect.left);
    let visiblePixelY = Math.min(elementRect.bottom, parentRect.bottom) - Math.max(elementRect.top, parentRect.top);
    let visiblePercentageX = (visiblePixelX / elementRect.width) * 100;
    let visiblePercentageY = (visiblePixelY / elementRect.height) * 100;
    return visiblePercentageX + tolerance > percentX && visiblePercentageY + tolerance > percentY;
  } else {
    let rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
}

/**
 * 找到最近的滚动容器
 * @param {*} element
 * @param {*} direction v-垂直 h-水平 vh-两个方向 空值-任意一个方向
 */
export function findClosetScrollParent(element, direction) {
  let parentElm = element.parentElement;
  while (parentElm != null) {
    // 这里判断的值并不严谨，暂且满足一般场景即可
    let isOverflow = ['auto', 'scroll'].indexOf(getComputedStyles(parentElm, 'overflow')) >= 0;
    let isOverflowX = ['auto', 'scroll'].indexOf(getComputedStyles(parentElm, 'overflow-x')) >= 0;
    let isOverflowY = ['auto', 'scroll'].indexOf(getComputedStyles(parentElm, 'overflow-y')) >= 0;
    let hasHeight = getComputedStyles(parentElm, 'height') || getComputedStyles(parentElm, 'maxHeight');
    let hasWidth = getComputedStyles(parentElm, 'width') || getComputedStyles(parentElm, 'maxWidth');

    switch (direction) {
      case 'v':
        if ((isOverflow || isOverflowY) && hasHeight) return parentElm;
        break;
      case 'h':
        if ((isOverflow || isOverflowX) && hasWidth) return parentElm;
        break;
      case 'vh':
        if ((isOverflow || (isOverflowY && isOverflowY)) && (hasHeight && hasWidth)) return parentElm;
        break;
      default:
        if ((isOverflow || isOverflowY || isOverflowY) && (hasHeight || hasWidth)) return parentElm;
        break;
    }

    parentElm = parentElm.parentElement;
  }

  return null;
}

function getComputedStyles(elem, prop) {
  let cs = window.getComputedStyle(elem, null);
  return cs.getPropertyValue(prop);
}

export default {
  axiosOptions,
  isScrolledIntoView,
  findClosetScrollParent,
};
