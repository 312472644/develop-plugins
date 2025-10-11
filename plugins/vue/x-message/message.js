import { createVNode, render } from 'vue';
import XMessage from './index.vue';

// 消息类型
const MESSAGE_TYPE = ['success', 'warning', 'error', 'info', 'loading'];
const messageQueue = [];
// 垂直偏移量
const VERTICAL_OFFSET = 12;
// 初始偏移量
const initOffset = 20;
// 消息内容高度
const CONTENT_HEIGHT = 50;
let messageOffset = 0;

const createMessage = (options) => {
  const container = document.createElement('div');

  const vnode = createVNode(XMessage, {
    ...options,
    visible: true,
    onClose: () => {
      const index = messageQueue.indexOf(vnode);
      if (index > -1) {
        messageQueue.splice(index, 1);
        recalculateMessagePositions();
      }
      if (container.parentNode && container.parentNode.nodeType === Node.ELEMENT_NODE) {
        document.body.removeChild(container);
      }
      // 关闭回调
      options.onClose?.();
    },
    onTransitionEnd: () => {
      recalculateMessagePositions();
    }
  });

  // 重新计算消息位置
  function recalculateMessagePositions() {
    let currentOffset = initOffset;
    messageQueue.forEach((msg) => {
      const messageHeight = msg.el?.offsetHeight || CONTENT_HEIGHT;
      msg.component.props.offset = currentOffset;
      currentOffset += VERTICAL_OFFSET + messageHeight;
    });
    if (messageQueue.length === 0) {
      messageOffset = initOffset;
    }
    messageOffset = currentOffset;
  }
  container.dataset['role'] = 'x-message';
  container.dataset['index'] = messageQueue.length;

  // 将偏移量传递给组件
  vnode.props.offset = messageOffset;
  // 虚拟节点渲染到容器中
  render(vnode, container);
  document.body.appendChild(container);
  messageQueue.push(vnode);
  // 等待DOM更新后重新计算位置
  requestAnimationFrame(() => {
    recalculateMessagePositions();
  });
  return {
    close: () => close(vnode)
  };
};

/**
 * 消息提示
 * @param {Object} config
 * @param {String} config.type 消息类型
 * @param {String} config.message 消息内容
 * @param {Number} config.duration 消息显示时间
 * @param {Function} config.onClose 消息关闭回调
 * @param {small|medium|large} [config.size=small] 消息大小
 * @returns
 */
const Message = (config = {}) => {
  const { type = 'info' } = config;
  if (typeof type !== 'string' || !MESSAGE_TYPE.includes(type)) {
    console.warn(`Invalid message type: ${type}`);
    return;
  }
  if (type === 'loading') {
    config.duration = 0;
  }
  return createMessage(config);
};

Message.closeAll = () => {
  messageQueue.forEach((msg) => close(msg));
};

function close(msg) {
  msg.component.props.visible = false;
  setTimeout(() => {
    msg.component.emit('close');
  }, 100);
}

export default Message;
