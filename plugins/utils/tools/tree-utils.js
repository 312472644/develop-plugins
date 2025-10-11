const treeData = [
  {
    id: 1,
    label: "一级节点 1",
    parentId: null,
    children: [
      {
        id: 11,
        label: "二级节点 1-1",
        parentId: 1,
        children: [
          {
            id: 111,
            label: "三级节点 1-1-1",
            parentId: 11,
            children: [
              {
                id: 1111,
                label: "四级节点 1-1-1-1",
                parentId: 111,
              },
              {
                id: 1112,
                label: "四级节点 1-1-1-2",
                parentId: 111,
              },
            ],
          },
          {
            id: 112,
            label: "三级节点 1-1-2",
            parentId: 11,
            children: [
              {
                id: 1121,
                label: "四级节点 1-1-2-1",
                parentId: 112,
              },
            ],
          },
        ],
      },
      {
        id: 12,
        label: "二级节点 1-2",
        parentId: 1,
        children: [
          {
            id: 121,
            label: "三级节点 1-2-1",
            parentId: 12,
            children: [
              {
                id: 1211,
                label: "四级节点 1-2-1-1",
                parentId: 121,
              },
              {
                id: 1212,
                label: "四级节点 1-2-1-2",
                parentId: 121,
              },
            ],
          },
          {
            id: 122,
            label: "三级节点 1-2-2",
            parentId: 12,
          },
        ],
      },
    ],
  },
  {
    id: 2,
    label: "一级节点 2",
    parentId: null,
    children: [
      {
        id: 21,
        label: "二级节点 2-1",
        parentId: 2,
        children: [
          {
            id: 211,
            label: "三级节点 2-1-1",
            parentId: 21,
          },
          {
            id: 212,
            label: "三级节点 2-1-2",
            parentId: 21,
          },
        ],
      },
      {
        id: 22,
        label: "二级节点 2-2",
        parentId: 2,
        children: [
          {
            id: 221,
            label: "三级节点 2-2-1",
            parentId: 22,
          },
        ],
      },
    ],
  },
  {
    id: 3,
    label: "一级节点 3",
    parentId: null,
    children: [
      {
        id: 31,
        label: "二级节点 3-1",
        parentId: 3,
        children: [
          {
            id: 311,
            label: "三级节点 3-1-1",
            parentId: 31,
          },
        ],
      },
      {
        id: 32,
        label: "二级节点 3-2",
        parentId: 3,
      },
    ],
  },
  {
    id: 4,
    label: "一级节点 4",
    parentId: null,
    children: [
      {
        id: 41,
        label: "二级节点 4-1",
        parentId: 4,
      },
    ],
  },
];

/**
 * 树形结构属性配置
 * @typedef {Object} TreeNodeProperty
 * @property {String | Number} nodeKey 节点唯一标识名称
 * @property {String} label 节点显示属性名称
 * @property {String} children 子节点属性显示名称
 */

/**
 * 获取配置
 * @param {TreeNodeProperty} config 配置
 * @returns {TreeNodeProperty}
 */
function getConfig(config = {}) {
  return {
    nodeKey: config.nodeKey || "id",
    label: config.label || "label",
    children: config.children || "children",
  };
}

/**
 * 将树形结构转换为扁平结构
 * @param {Array} tree 树形结构
 * @param {TreeNodeProperty} config
 * @returns {Array<TreeNodeProperty>}
 */
export function flattenTreeData(tree, config = {}) {
  const { label, children, nodeKey } = getConfig(config);
  if (!Array.isArray(tree)) return [];
  const result = [];
  const traverse = (node, parentId = null) => {
    // 数据扁平化不需要children属性
    const nodeItem = { ...node };
    delete nodeItem[children];
    result.push({
      id: node[nodeKey],
      label: node[label],
      parentId: parentId,
      ...nodeItem,
    });
    const childNodeList = node[children];
    if (childNodeList) {
      childNodeList.forEach((child) => traverse(child, node[nodeKey]));
    }
  };
  for (const node of tree) {
    traverse(node);
  }
  return result;
}

/**
 * 将扁平结构转换为树形结构
 * @param {Array} tree 树形结构
 * @param {Object} config 属性配置
 * @param {String} config.nodeKey 节点唯一标识
 * @param {String} config.children 子节点名称
 * @param {String} config.parentId 父节点名称
 * @returns {Array}
 */
export function getTreeData(tree, config = {}) {
  const { children, nodeKey, parentId } = {
    children: config.children || "children",
    nodeKey: config.nodeKey || "id",
    parentId: config.parentId || "parentId",
  };
  const result = [];
  const map = {};
  // 将数组转换为对象
  for (const node of tree) {
    map[node[nodeKey]] = node;
  }
  for (const node of tree) {
    // 寻找父节点，如果没有父节点则为根节点
    const parent = map[node[parentId]];
    if (parent) {
      if (!parent[children]) {
        parent[children] = [];
      }
      // 将子节点添加到父节点的children属性中, 因为是引用类型，所以这里给对象添加属性，会影响到原来的数组
      parent[children].push(node);
    } else {
      result.push(node);
    }
  }
  return result;
}

/**
 * 通过节点唯一标识获取节点
 * @param {Array} tree 树形结构
 * @param {String|Number} nodeKeyValue 节点唯一标识的值
 * @param {Object} config
 * @param {String} config.nodeKey 节点唯一标识
 * @param {String} config.children 子节点名称
 * @returns {Object}
 */
export function getTreeDataByNodeKey(tree, nodeKeyValue, config = {}) {
  if (!Array.isArray(tree)) return [];
  const { children, nodeKey: configNodeKey } = getConfig(config);
  let treeData = null;
  const traverse = (node) => {
    if (node[configNodeKey] === nodeKeyValue) {
      treeData = structuredClone(node);
      return true;
    }
    const childNodeList = node[children];
    if (childNodeList) {
      for (const child of childNodeList) {
        if (traverse(child)) return true;
      }
    }
    return false;
  };
  for (const node of tree) {
    if (traverse(node)) break;
  }
  return treeData;
}

/**
 * 通过节点唯一标识获取当前节点下的所有子节点数据
 * @param {Array} tree
 * @param {String | Number} nodeKeyValue
 * @param {Object} config
 * @param {String} config.nodeKey 节点唯一标识
 * @param {String} config.children 子节点名称
 * @returns {Array} 当前节点以及所有子节点数据
 */
export function getChildrenByNodeKey(tree, nodeKeyValue, config = {}) {
  if (!Array.isArray(tree)) return [];
  const node = getTreeDataByNodeKey(tree, nodeKeyValue, config);
  if (!node) return [];
  const { children } = getConfig(config);
  const treeList = [];
  const traverse = (currentNode) => {
    treeList.push(currentNode);
    const childNodeList = currentNode[children];
    if (childNodeList?.length) {
      childNodeList.forEach((child) => traverse(child));
    }
  };

  traverse(node);
  return treeList;
}

/**
 * 通过节点唯一标识获取当前节点所有父节点数据
 * @param {Array} tree
 * @param {String | Number} nodeKeyValue
 * @param {Object} config
 * @param {String} config.nodeKey 节点唯一标识
 * @param {String} config.children 子节点名称
 * @returns {Array} 当前节点以及所有父节点数据
 */
export function getParentListByNode(tree, nodeKeyValue, config = {}) {
  if (!Array.isArray(tree)) return [];
  const { children, nodeKey } = getConfig(config);
  const treeList = [];
  function getParentList(node, parentList = []) {
    if (node[nodeKey] === nodeKeyValue) {
      treeList.push(...parentList);
      return;
    }
    if (node[children]) {
      node[children].forEach((child) => {
        getParentList(child, [...parentList, node]);
      });
    }
  }
  for (const item of tree) {
    getParentList(item);
  }
  return treeList;
}

// console.log("通过节点唯一标识获取节点", getTreeDataByNodeKey(treeData, 11));
// console.log("通过节点唯一标识获取当前节点下的所有子节点数据", getChildrenByNodeKey(treeData, 11));
// console.log("通过节点唯一标识获取当前节点以及所有父节点数据", getParentListByNode(treeData, 11));

export default {};
