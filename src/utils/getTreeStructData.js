export const transListDataToTreeData = (list, root) => {
  const arr = [];
  // 1.遍历
  list.forEach((item, index) => {
    // 2.首次传入空字符串  判断list的pid是否为空 如果为空就是一级节点
    if (item.subId == root) {
      // 找到之后就要去找item下面有没有子节点  以 item.id 作为 父 id, 接着往下找
      const children = transListDataToTreeData(list, item._id);
      if (children.length > 0) {
        // 如果children的长度大于0,说明找到了子节点
        item.children = children;
      }
      // 将item项, 追加到arr数组中
      arr.push(item);
    }
  });
  return arr;
};
export const getTreeAddId = (unique = "_id", data = [], arr = []) => {
  for (let item of data) {
    arr.push(item[unique]);
    if (item.children && item.children.length) {
      getTreeAddId(unique, item.children, arr);
    }
  }
  return arr;
};
